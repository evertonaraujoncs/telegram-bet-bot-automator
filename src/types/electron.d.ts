// Adiciona tipos para o Electron no ambiente global
interface ElectronAPI {
  showNotification: (options: { title: string; body: string }) => void;
  saveFile: (options: { content: string; defaultPath: string; filters?: { name: string; extensions: string[] }[] }) => Promise<{ success: boolean; filePath?: string }>;
  openFile: (options: { defaultPath?: string; filters?: { name: string; extensions: string[] }[] }) => Promise<{ success: boolean; filePath?: string; content?: string }>;
  platform: string;
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}

export {};
