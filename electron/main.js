const { app, BrowserWindow, ipcMain, shell, dialog, Notification } = require('electron');
const path = require('path');
const fs = require('fs');

// Mantenha uma referência global do objeto window
let mainWindow;

function createWindow() {
  // Cria a janela do navegador
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    show: false // Não mostrar até que esteja pronto para evitar flash branco
  });

  // Em produção, carrega o arquivo index.html do diretório dist
  const startUrl = process.env.ELECTRON_START_URL || 
    `file://${path.join(__dirname, '../dist/index.html')}`;
  
  mainWindow.loadURL(startUrl);

  // Mostrar janela quando estiver pronta
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Abrir links externos no navegador padrão
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Emitido quando a janela é fechada
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// Este método será chamado quando o Electron terminar a inicialização
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // No macOS é comum recriar uma janela no aplicativo quando o
    // ícone da doca é clicado e não há outras janelas abertas.
    if (mainWindow === null) createWindow();
  });
});

// Sai quando todas as janelas estiverem fechadas
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Manipuladores IPC para comunicação entre renderer e main process

// Mostrar notificação nativa
ipcMain.on('show-notification', (event, { title, body }) => {
  const notification = {
    title,
    body,
    icon: path.join(__dirname, 'assets/icon.png')
  };
  new Notification(notification).show();
});

// Salvar arquivo
ipcMain.handle('save-file', async (event, { content, defaultPath, filters }) => {
  try {
    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath,
      filters: filters || [
        { name: 'Todos os Arquivos', extensions: ['*'] }
      ]
    });

    if (!canceled && filePath) {
      fs.writeFileSync(filePath, content);
      return { success: true, filePath };
    }
    
    return { success: false };
  } catch (error) {
    console.error('Erro ao salvar arquivo:', error);
    return { success: false, error: error.message };
  }
});

// Abrir arquivo
ipcMain.handle('open-file', async (event, { defaultPath, filters }) => {
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      defaultPath,
      filters: filters || [
        { name: 'Todos os Arquivos', extensions: ['*'] }
      ],
      properties: ['openFile']
    });

    if (!canceled && filePaths.length > 0) {
      const content = fs.readFileSync(filePaths[0], 'utf8');
      return { success: true, filePath: filePaths[0], content };
    }
    
    return { success: false };
  } catch (error) {
    console.error('Erro ao abrir arquivo:', error);
    return { success: false, error: error.message };
  }
});
