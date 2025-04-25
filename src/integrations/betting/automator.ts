import { PlaywrightBrowser } from './browser';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect, useCallback } from 'react';

export class BettingAutomator {
  private browser: PlaywrightBrowser | null = null;
  private isLoggedIn: boolean = false;
  private betUrl: string = 'https://esportiva.bet.br/games/evolution/futebol-studio-ao-vivo';
  private username: string = '';
  private password: string = '';
  private delayBetweenBets: number = 5; // segundos

  constructor()  {
    this.browser = null;
    this.isLoggedIn = false;
  }

  async initialize(options: {
    betUrl?: string;
    username?: string;
    password?: string;
    delayBetweenBets?: number;
  } = {}) {
    try {
      if (options.betUrl) this.betUrl = options.betUrl;
      if (options.username) this.username = options.username;
      if (options.password) this.password = options.password;
      if (options.delayBetweenBets) this.delayBetweenBets = options.delayBetweenBets;

      // Inicializar o navegador Playwright
      this.browser = new PlaywrightBrowser();
      await this.browser.initialize();
      
      return true;
    } catch (error) {
      console.error('Erro ao inicializar o automatizador de apostas:', error);
      throw error;
    }
  }

  async navigateToBettingSite(): Promise<boolean> {
    try {
      if (!this.browser) {
        throw new Error('Browser não inicializado');
      }

      await this.browser.navigate(this.betUrl);
      
      // Aguardar carregamento da página
      await this.browser.waitForSelector('.game-container', 30000);
      
      return true;
    } catch (error) {
      console.error('Erro ao navegar para o site de apostas:', error);
      throw error;
    }
  }

  async login(): Promise<boolean> {
    try {
      if (!this.browser) {
        throw new Error('Browser não inicializado');
      }

      if (!this.username || !this.password) {
        throw new Error('Credenciais não configuradas');
      }

      // Verificar se já está logado
      const isAlreadyLoggedIn = await this.browser.evaluate(() => {
        return document.querySelector('.user-account') !== null;
      });

      if (isAlreadyLoggedIn) {
        this.isLoggedIn = true;
        return true;
      }

      // Clicar no botão de login
      await this.browser.click('.login-button');
      
      // Aguardar o formulário de login
      await this.browser.waitForSelector('.login-form', 10000);
      
      // Preencher o formulário
      await this.browser.type('.username-input', this.username);
      await this.browser.type('.password-input', this.password);
      
      // Clicar no botão de enviar
      await this.browser.click('.submit-button');
      
      // Aguardar o login ser concluído
      await this.browser.waitForSelector('.user-account', 15000);
      
      this.isLoggedIn = true;
      return true;
    } catch (error) {
      console.error('Erro ao fazer login no site de apostas:', error);
      this.isLoggedIn = false;
      throw error;
    }
  }

  async placeBet(options: {
    betType: string;
    amount: number;
    useMartingale?: boolean;
    martingaleLevel?: number;
    martingaleMultiplier?: number;
  }): Promise<boolean> {
    try {
      if (!this.browser) {
        throw new Error('Browser não inicializado');
      }

      if (!this.isLoggedIn) {
        await this.login();
      }

      // Navegar para a página de apostas se ainda não estiver nela
      const currentUrl = await this.browser.getCurrentUrl();
      if (!currentUrl.includes('futebol-studio-ao-vivo')) {
        await this.navigateToBettingSite();
      }

      // Selecionar o tipo de aposta
      let betSelector = '';
      switch (options.betType.toLowerCase()) {
        case 'casa':
          betSelector = '.home-bet-button';
          break;
        case 'fora':
          betSelector = '.away-bet-button';
          break;
        case 'empate':
          betSelector = '.draw-bet-button';
          break;
        default:
          throw new Error(`Tipo de aposta não reconhecido: ${options.betType}`);
      }

      // Clicar no botão de aposta
      await this.browser.click(betSelector);
      
      // Aguardar o formulário de aposta
      await this.browser.waitForSelector('.bet-form', 5000);
      
      // Limpar o campo de valor e inserir o valor da aposta
      await this.browser.clearAndType('.bet-amount-input', options.amount.toString());
      
      // Clicar no botão de confirmar aposta
      await this.browser.click('.confirm-bet-button');
      
      // Aguardar confirmação da aposta
      await this.browser.waitForSelector('.bet-confirmation', 10000);
      
      return true;
    } catch (error) {
      console.error('Erro ao realizar aposta:', error);
      throw error;
    }
  }

  async checkBetResult(): Promise<'win' | 'loss' | 'pending'> {
    try {
      if (!this.browser) {
        throw new Error('Browser não inicializado');
      }

      // Verificar se há um resultado de aposta na página
      const hasResult = await this.browser.evaluate(() => {
        return document.querySelector('.bet-result') !== null;
      });

      if (!hasResult) {
        return 'pending';
      }

      // Verificar se ganhou ou perdeu
      const isWin = await this.browser.evaluate(() => {
        const resultElement = document.querySelector('.bet-result');
        return resultElement?.classList.contains('win') || false;
      });

      return isWin ? 'win' : 'loss';
    } catch (error) {
      console.error('Erro ao verificar resultado da aposta:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    try {
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
        this.isLoggedIn = false;
      }
    } catch (error) {
      console.error('Erro ao fechar o navegador:', error);
      throw error;
    }
  }
}

// Hook para usar o automatizador de apostas
export function useBettingAutomator() {
  const [automator, setAutomator] = useState<BettingAutomator | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializar o automatizador com as configurações do usuário
  const initialize = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Buscar configurações do usuário no Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      const { data: settings, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (settingsError) throw settingsError;
      
      if (!settings) {
        throw new Error('Configurações do usuário não encontradas');
      }
      
      // Criar e inicializar o automatizador
      const newAutomator = new BettingAutomator();
      await newAutomator.initialize({
        betUrl: settings.bet_url || 'https://esportiva.bet.br/games/evolution/futebol-studio-ao-vivo',
        username: settings.username || '',
        password: settings.password || '',
        delayBetweenBets: settings.delay_between_bets || 5
      }) ;
      
      setAutomator(newAutomator);
      setIsInitialized(true);
      
      return newAutomator;
    } catch (err: any) {
      setError(err.message || 'Erro ao inicializar o automatizador de apostas');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Limpar o automatizador ao desmontar o componente
  useEffect(() => {
    return () => {
      if (automator) {
        automator.close().catch(console.error);
      }
    };
  }, [automator]);

  return {
    automator,
    isInitialized,
    isLoading,
    error,
    initialize
  };
}
