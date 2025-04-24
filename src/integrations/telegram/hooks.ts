import { useState, useEffect, useCallback } from 'react';
import { telegramClient } from './client';
import { supabase } from '@/integrations/supabase/client';

export function useTelegramConnection() {
  const [token, setToken] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar token salvo do Supabase ao inicializar
  useEffect(() => {
    const loadSavedToken = async () => {
      try {
        // Verificar se há um usuário autenticado
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Buscar configurações do usuário
          const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (error) throw error;
          
          // Se houver um token salvo, configurar e testar conexão
          if (data && data.telegram_token) {
            setToken(data.telegram_token);
            telegramClient.setToken(data.telegram_token);
            
            try {
              const connected = await telegramClient.testConnection();
              setIsConnected(connected);
            } catch (err) {
              console.error('Erro ao testar conexão com token salvo:', err);
              // Não definir erro aqui para não mostrar mensagem de erro ao carregar
            }
          }
        }
      } catch (err) {
        console.error('Erro ao carregar token salvo:', err);
      }
    };

    loadSavedToken();
  }, []);

  const connect = useCallback(async (newToken: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!newToken) {
        throw new Error('Por favor, informe um Token de Bot do Telegram');
      }
      
      telegramClient.setToken(newToken);
      const connected = await telegramClient.testConnection();
      
      if (connected) {
        setIsConnected(true);
        setToken(newToken);
        
        // Salvar token no Supabase
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Verificar se já existe configuração para o usuário
          const { data } = await supabase
            .from('user_settings')
            .select('id')
            .eq('user_id', user.id)
            .single();
          
          if (data) {
            // Atualizar configuração existente
            await supabase
              .from('user_settings')
              .update({ telegram_token: newToken })
              .eq('id', data.id);
          } else {
            // Criar nova configuração
            await supabase
              .from('user_settings')
              .insert({ 
                user_id: user.id,
                telegram_token: newToken,
                username: '',
                default_bet: 25,
                max_bet_amount: 100,
                daily_limit: 500,
                auto_login: true,
                use_martingale: false,
                reset_on_win: true,
                delay_between_bets: 5,
                bet_url: 'https://esportiva.bet.br/games/evolution/futebol-studio-ao-vivo'
              }) ;
          }
        }
      }
      
      return connected;
    } catch (err: any) {
      setIsConnected(false);
      setError(err.message || 'Erro ao conectar com o Telegram');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    setToken('');
    // Não removemos o token do Supabase para manter o histórico
  }, []);

  return {
    token,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect
  };
}

export function useTelegramChannels() {
  const [channels, setChannels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChannels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Buscar canais da API do Telegram
      const telegramChannels = await telegramClient.getChannels();
      
      // Buscar canais salvos no Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: savedChannels } = await supabase
          .from('telegram_channels')
          .select('*')
          .eq('user_id', user.id);
        
        // Mesclar canais do Telegram com canais salvos
        const mergedChannels = telegramChannels.map(telegramChannel => {
          const savedChannel = savedChannels?.find(sc => sc.id === telegramChannel.id);
          
          return {
            ...telegramChannel,
            active: savedChannel ? savedChannel.active : true,
            messages_count: savedChannel ? savedChannel.messages_count : 0
          };
        });
        
        setChannels(mergedChannels);
        
        // Salvar novos canais encontrados no Supabase
        for (const channel of telegramChannels) {
          const exists = savedChannels?.some(sc => sc.id === channel.id);
          
          if (!exists) {
            await supabase
              .from('telegram_channels')
              .insert({
                id: channel.id,
                user_id: user.id,
                name: channel.name,
                url: channel.username ? `@${channel.username}` : null,
                active: true,
                messages_count: 0
              });
          }
        }
      }
      
      return telegramChannels;
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar canais do Telegram');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleChannelActive = useCallback(async (channelId: string, active: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase
          .from('telegram_channels')
          .update({ active })
          .eq('id', channelId)
          .eq('user_id', user.id);
        
        setChannels(prev => 
          prev.map(channel => 
            channel.id === channelId 
              ? { ...channel, active } 
              : channel
          )
        );
      }
    } catch (err) {
      console.error('Erro ao atualizar status do canal:', err);
      throw err;
    }
  }, []);

  const removeChannel = useCallback(async (channelId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase
          .from('telegram_channels')
          .delete()
          .eq('id', channelId)
          .eq('user_id', user.id);
        
        setChannels(prev => prev.filter(channel => channel.id !== channelId));
      }
    } catch (err) {
      console.error('Erro ao remover canal:', err);
      throw err;
    }
  }, []);

  const updateChannels = useCallback(async () => {
    try {
      const updatedChannels = await fetchChannels();
      
      // Buscar novas mensagens para cada canal ativo
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        for (const channel of updatedChannels) {
          if (channel.active) {
            const messages = await telegramClient.getMessages(channel.id);
            
            // Salvar novas mensagens no Supabase
            for (const message of messages) {
              // Verificar se a mensagem já existe
              const { data: existingMessage } = await supabase
                .from('telegram_messages')
                .select('id')
                .eq('id', message.id)
                .single();
              
              if (!existingMessage) {
                await supabase
                  .from('telegram_messages')
                  .insert({
                    id: message.id,
                    channel_id: channel.id,
                    content: message.content,
                    sender: message.sender,
                    timestamp: message.timestamp,
                    has_action: message.has_action,
                    action_taken: message.action_taken
                  });
              }
            }
            
            // Atualizar contador de mensagens
            await supabase
              .from('telegram_channels')
              .update({ 
                messages_count: channel.messages_count + messages.length,
                updated_at: new Date().toISOString()
              })
              .eq('id', channel.id)
              .eq('user_id', user.id);
          }
        }
        
        // Atualizar a lista de canais com os novos contadores
        await fetchChannels();
      }
    } catch (err) {
      console.error('Erro ao atualizar canais:', err);
      throw err;
    }
  }, [fetchChannels]);

  return {
    channels,
    isLoading,
    error,
    fetchChannels,
    toggleChannelActive,
    removeChannel,
    updateChannels
  };
}

export function useTelegramMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async (limit = 50) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Buscar canais ativos
        const { data: activeChannels } = await supabase
          .from('telegram_channels')
          .select('id')
          .eq('user_id', user.id)
          .eq('active', true);
        
        if (activeChannels && activeChannels.length > 0) {
          // Buscar mensagens dos canais ativos
          const { data: channelMessages, error } = await supabase
            .from('telegram_messages')
            .select('*, telegram_channels(name)')
            .in('channel_id', activeChannels.map(c => c.id))
            .order('timestamp', { ascending: false })
            .limit(limit);
          
          if (error) throw error;
          
          setMessages(channelMessages || []);
          return channelMessages;
        } else {
          setMessages([]);
          return [];
        }
      }
      
      return [];
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar mensagens do Telegram');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markMessageAsProcessed = useCallback(async (messageId: string) => {
    try {
      await supabase
        .from('telegram_messages')
        .update({ action_taken: true })
        .eq('id', messageId);
      
      setMessages(prev => 
        prev.map(message => 
          message.id === messageId 
            ? { ...message, action_taken: true } 
            : message
        )
      );
    } catch (err) {
      console.error('Erro ao marcar mensagem como processada:', err);
      throw err;
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    fetchMessages,
    markMessageAsProcessed
  };
}
