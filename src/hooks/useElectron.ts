import { useEffect } from 'react';

// Hook para usar funcionalidades específicas do Electron
export function useElectron() {
  // Verifica se estamos rodando no Electron
  const isElectron = () => {
    return window.electron !== undefined;
  };

  // Mostra uma notificação nativa do sistema
  const showNotification = (title, body) => {
    if (isElectron()) {
      window.electron.showNotification({ title, body });
    } else {
      // Fallback para notificações web quando não estiver no Electron
      if ('Notification' in window) {
        new Notification(title, { body });
      } else {
        console.log(`Notificação: ${title} - ${body}`);
      }
    }
  };

  // Salva um arquivo localmente
  const saveFile = async (content, defaultPath, filters) => {
    if (isElectron()) {
      return await window.electron.saveFile({ content, defaultPath, filters });
    } else {
      // Fallback para download de arquivo quando não estiver no Electron
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = defaultPath.split('/').pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return { success: true };
    }
  };

  // Abre um arquivo localmente
  const openFile = async (defaultPath, filters) => {
    if (isElectron()) {
      return await window.electron.openFile({ defaultPath, filters });
    } else {
      // No ambiente web, não podemos abrir arquivos diretamente
      console.log('Abrir arquivos não está disponível no navegador');
      return { success: false };
    }
  };

  // Obtém a plataforma atual
  const getPlatform = () => {
    if (isElectron()) {
      return window.electron.platform;
    } else {
      // Detectar plataforma baseado no navegador
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.indexOf('win') !== -1) return 'win32';
      if (userAgent.indexOf('mac') !== -1) return 'darwin';
      if (userAgent.indexOf('linux') !== -1) return 'linux';
      return 'unknown';
    }
  };

  return {
    isElectron,
    showNotification,
    saveFile,
    openFile,
    getPlatform
  };
}
