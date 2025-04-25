const { contextBridge, ipcRenderer } = require('electron');

// Expõe funções específicas do Electron para o processo de renderização
contextBridge.exposeInMainWorld('electron', {
  // Notificações nativas
  showNotification: (options) => {
    ipcRenderer.send('show-notification', options);
  },
  
  // Manipulação de arquivos
  saveFile: async (options) => {
    return await ipcRenderer.invoke('save-file', options);
  },
  
  openFile: async (options) => {
    return await ipcRenderer.invoke('open-file', options);
  },
  
  // Informações da plataforma
  platform: process.platform
});
