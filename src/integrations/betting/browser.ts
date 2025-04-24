
import { chromium, Browser, Page } from 'playwright';

export class PlaywrightBrowser {
  private browser: Browser | null = null;
  private page: Page | null = null;

  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize(): Promise<boolean> {
    try {
      // Inicializar o navegador Playwright
      this.browser = await chromium.launch({
        headless: false, // Definir como true em produção
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      // Criar uma nova página
      const context = await this.browser.newContext({
        viewport: { width: 1280, height: 800 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
      });
      
      this.page = await context.newPage();
      
      // Configurar timeouts
      this.page.setDefaultTimeout(30000);
      
      return true;
    } catch (error) {
      console.error('Erro ao inicializar o navegador:', error);
      throw error;
    }
  }

  async navigate(url: string): Promise<boolean> {
    try {
      if (!this.page) {
        throw new Error('Página não inicializada');
      }
      
      await this.page.goto(url, { waitUntil: 'networkidle' });
      return true;
    } catch (error) {
      console.error(`Erro ao navegar para ${url}:`, error);
      throw error;
    }
  }

  async getCurrentUrl(): Promise<string> {
    if (!this.page) {
      throw new Error('Página não inicializada');
    }
    
    return this.page.url();
  }

  async waitForSelector(selector: string, timeout?: number): Promise<boolean> {
    try {
      if (!this.page) {
        throw new Error('Página não inicializada');
      }
      
      await this.page.waitForSelector(selector, { timeout });
      return true;
    } catch (error) {
      console.error(`Erro ao aguardar pelo seletor ${selector}:`, error);
      throw error;
    }
  }

  async click(selector: string): Promise<boolean> {
    try {
      if (!this.page) {
        throw new Error('Página não inicializada');
      }
      
      await this.page.click(selector);
      return true;
    } catch (error) {
      console.error(`Erro ao clicar no elemento ${selector}:`, error);
      throw error;
    }
  }

  async type(selector: string, text: string): Promise<boolean> {
    try {
      if (!this.page) {
        throw new Error('Página não inicializada');
      }
      
      await this.page.type(selector, text);
      return true;
    } catch (error) {
      console.error(`Erro ao digitar no elemento ${selector}:`, error);
      throw error;
    }
  }

  async clearAndType(selector: string, text: string): Promise<boolean> {
    try {
      if (!this.page) {
        throw new Error('Página não inicializada');
      }
      
      await this.page.fill(selector, ''); // Limpar o campo
      await this.page.type(selector, text);
      return true;
    } catch (error) {
      console.error(`Erro ao limpar e digitar no elemento ${selector}:`, error);
      throw error;
    }
  }

  async evaluate<T>(pageFunction: () => T): Promise<T> {
    if (!this.page) {
      throw new Error('Página não inicializada');
    }
    
    return this.page.evaluate(pageFunction);
  }

  async screenshot(path: string): Promise<boolean> {
    try {
      if (!this.page) {
        throw new Error('Página não inicializada');
      }
      
      await this.page.screenshot({ path });
      return true;
    } catch (error) {
      console.error(`Erro ao capturar screenshot para ${path}:`, error);
      throw error;
    }
  }

  async close(): Promise<void> {
    try {
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
        this.page = null;
      }
    } catch (error) {
      console.error('Erro ao fechar o navegador:', error);
      throw error;
    }
  }
}

