import axios from 'axios';

interface TelegramChannel {
  id: string;
  name: string;
  username?: string;
  type: 'channel' | 'group' | 'supergroup';
  active: boolean;
  messages_count: number;
}

interface TelegramMessage {
  id: string;
  chat_id: string;
  sender: string;
  content: string;
  timestamp: string;
  has_action: boolean;
  action_taken: boolean;
}

class TelegramClient {
  private token: string;
  private baseUrl: string;
  private isConnected: boolean = false;

  constructor(token: string = '') {
    this.token = token;
    this.baseUrl = `https://api.telegram.org/bot${token}`;
  }

  setToken(token: string)  {
    this.token = token;
    this.baseUrl = `https://api.telegram.org/bot${token}`;
  }

  async testConnection() : Promise<boolean> {
    try {
      if (!this.token) {
        throw new Error('Token não fornecido');
      }

      const response = await axios.get(`${this.baseUrl}/getMe`);
      
      if (response.data && response.data.ok) {
        this.isConnected = true;
        return true;
      } else {
        this.isConnected = false;
        throw new Error('Falha na conexão com a API do Telegram');
      }
    } catch (error) {
      this.isConnected = false;
      console.error('Erro ao testar conexão com o Telegram:', error);
      throw error;
    }
  }

  async getUpdates(offset = 0, limit = 100): Promise<any> {
    try {
      if (!this.isConnected) {
        await this.testConnection();
      }

      const response = await axios.get(`${this.baseUrl}/getUpdates`, {
        params: {
          offset,
          limit,
          timeout: 30,
          allowed_updates: JSON.stringify(['message', 'channel_post'])
        }
      });

      if (response.data && response.data.ok) {
        return response.data.result;
      } else {
        throw new Error('Falha ao obter atualizações do Telegram');
      }
    } catch (error) {
      console.error('Erro ao obter atualizações do Telegram:', error);
      throw error;
    }
  }

  async getChannels(): Promise<TelegramChannel[]> {
    try {
      if (!this.isConnected) {
        await this.testConnection();
      }

      // Na API oficial do Telegram, não há um método direto para listar todos os canais
      // Precisamos obter atualizações e extrair informações de canais a partir delas
      const updates = await this.getUpdates();
      
      // Mapa para armazenar canais únicos por ID
      const channelsMap = new Map<string, TelegramChannel>();
      
      // Extrair informações de canais das atualizações
      updates.forEach((update: any) => {
        let chat;
        
        if (update.message) {
          chat = update.message.chat;
        } else if (update.channel_post) {
          chat = update.channel_post.chat;
        }
        
        if (chat && (chat.type === 'channel' || chat.type === 'group' || chat.type === 'supergroup')) {
          const channelId = chat.id.toString();
          
          if (!channelsMap.has(channelId)) {
            channelsMap.set(channelId, {
              id: channelId,
              name: chat.title || `Canal ${channelId}`,
              username: chat.username,
              type: chat.type,
              active: true,
              messages_count: 0
            });
          }
        }
      });
      
      return Array.from(channelsMap.values());
    } catch (error) {
      console.error('Erro ao obter canais do Telegram:', error);
      throw error;
    }
  }

  async getMessages(channelId: string, limit = 50): Promise<TelegramMessage[]> {
    try {
      if (!this.isConnected) {
        await this.testConnection();
      }

      // Na API oficial do Telegram, precisamos usar getUpdates e filtrar por chat_id
      const updates = await this.getUpdates(0, 100);
      
      const messages: TelegramMessage[] = [];
      
      updates.forEach((update: any) => {
        let message;
        let chat;
        
        if (update.message) {
          message = update.message;
          chat = message.chat;
        } else if (update.channel_post) {
          message = update.channel_post;
          chat = message.chat;
        }
        
        if (message && chat && chat.id.toString() === channelId) {
          messages.push({
            id: message.message_id.toString(),
            chat_id: chat.id.toString(),
            sender: message.from ? message.from.first_name : chat.title,
            content: message.text || '',
            timestamp: new Date(message.date * 1000).toISOString(),
            has_action: message.text ? this.checkIfHasAction(message.text) : false,
            action_taken: false
          });
        }
      });
      
      return messages.slice(0, limit);
    } catch (error) {
      console.error('Erro ao obter mensagens do Telegram:', error);
      throw error;
    }
  }

  private checkIfHasAction(text: string): boolean {
    // Lógica para verificar se a mensagem contém um padrão que requer ação
    // Isso dependerá dos padrões específicos que você está procurando
    const actionPatterns = [
      'Entrada:', 
      'Aposta:', 
      'Sinal:', 
      'Oportunidade:'
    ];
    
    return actionPatterns.some(pattern => text.includes(pattern));
  }
}

export const telegramClient = new TelegramClient();
