
import { useState, useEffect, useCallback } from 'react';
import { telegramClient } from './client';
import { supabase } from '@/integrations/supabase/client';

export function useTelegramConnection() {
  const [token, setToken] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar token salvo do localStorage ao inicializar
  useEffect(() => {
    const loadSavedToken = async () => {
      try {
        // Verificar se há um token salvo no localStorage
        const savedToken = localStorage.getItem('telegram_bot_token');
        
        if (savedToken) {
          setToken(savedToken);
          telegramClient.setToken(savedToken);
          
          try {
            const connected = await telegramClient.testConnection();
            setIsConnected(connected);
          } catch (err) {
            console.error('Erro ao testar conexão com token salvo:', err);
            // Não definir erro aqui para não mostrar mensagem de erro ao carregar
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
        
        // Salvar token no localStorage para persistência
        localStorage.setItem('telegram_bot_token', newToken);
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
    // Remover token do localStorage
    localStorage.removeItem('telegram_bot_token');
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
      // Tentar buscar canais da API do Telegram
      let telegramChannels = [];
      try {
        telegramChannels = await telegramClient.getChannels();
      } catch (err) {
        console.error('Erro ao buscar canais do Telegram:', err);
        // Continuar com os canais locais
      }
      
      // Buscar canais salvos no localStorage
      const savedChannelsJson = localStorage.getItem('telegram_channels') || '[]';
      const savedChannels = JSON.parse(savedChannelsJson);
      
      // Mesclar canais do Telegram com canais salvos
      const mergedChannels = telegramChannels.map(telegramChannel => {
        const savedChannel = savedChannels.find((sc: any) => sc.id === telegramChannel.id);
        
        return {
          ...telegramChannel,
          active: savedChannel ? savedChannel.active : true,
          messages_count: savedChannel ? savedChannel.messages_count : 0
        };
      });
      
      // Adicionar quaisquer canais que estejam apenas no localStorage
      savedChannels.forEach((savedChannel: any) => {
        if (!mergedChannels.some(channel => channel.id === savedChannel.id)) {
          mergedChannels.push(savedChannel);
        }
      });
      
      setChannels(mergedChannels);
      
      // Salvar canais no localStorage
      localStorage.setItem('telegram_channels', JSON.stringify(mergedChannels));
      
      return mergedChannels;
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar canais do Telegram');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleChannelActive = useCallback(async (channelId: string, active: boolean) => {
    try {
      setChannels(prev => 
        prev.map(channel => 
          channel.id === channelId 
            ? { ...channel, active } 
            : channel
        )
      );
      
      // Atualizar localStorage
      const updatedChannels = channels.map(channel => 
        channel.id === channelId 
          ? { ...channel, active } 
          : channel
      );
      localStorage.setItem('telegram_channels', JSON.stringify(updatedChannels));
    } catch (err) {
      console.error('Erro ao atualizar status do canal:', err);
      throw err;
    }
  }, [channels]);

  const removeChannel = useCallback(async (channelId: string) => {
    try {
      const updatedChannels = channels.filter(channel => channel.id !== channelId);
      setChannels(updatedChannels);
      
      // Atualizar localStorage
      localStorage.setItem('telegram_channels', JSON.stringify(updatedChannels));
    } catch (err) {
      console.error('Erro ao remover canal:', err);
      throw err;
    }
  }, [channels]);

  const updateChannels = useCallback(async () => {
    try {
      const updatedChannels = await fetchChannels();
      
      // Simular busca de novas mensagens para cada canal ativo
      const updatedChannelsWithMessages = updatedChannels.map(channel => {
        if (channel.active) {
          // Incrementar contador de mensagens aleatoriamente entre 0 e 5
          const newMessagesCount = Math.floor(Math.random() * 6);
          return {
            ...channel,
            messages_count: channel.messages_count + newMessagesCount
          };
        }
        return channel;
      });
      
      setChannels(updatedChannelsWithMessages);
      
      // Salvar no localStorage
      localStorage.setItem('telegram_channels', JSON.stringify(updatedChannelsWithMessages));
      
      // Gerar algumas mensagens de exemplo para canais ativos
      const existingMessagesJson = localStorage.getItem('telegram_messages') || '[]';
      const existingMessages = JSON.parse(existingMessagesJson);
      
      const newMessages = updatedChannelsWithMessages
        .filter(channel => channel.active)
        .flatMap(channel => {
          const messagesToCreate = Math.floor(Math.random() * 3) + (channel.messages_count > 0 ? 0 : 1);
          return Array.from({ length: messagesToCreate }, (_, i) => ({
            id: `${Date.now()}-${channel.id}-${i}`,
            channel_id: channel.id,
            sender: channel.name,
            content: `Oportunidade de aposta ${i + 1}: Time A vs Time B, Odd @${(1.5 + Math.random()).toFixed(2)}`,
            timestamp: new Date().toISOString(),
            has_action: Math.random() > 0.5,
            action_taken: false
          }));
        });
      
      if (newMessages.length > 0) {
        localStorage.setItem('telegram_messages', JSON.stringify([...newMessages, ...existingMessages]));
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
      // Buscar canais ativos
      const channelsJson = localStorage.getItem('telegram_channels') || '[]';
      const channels = JSON.parse(channelsJson);
      const activeChannelIds = channels
        .filter((channel: any) => channel.active)
        .map((channel: any) => channel.id);
      
      if (activeChannelIds.length > 0) {
        // Buscar mensagens dos canais ativos do localStorage
        const messagesJson = localStorage.getItem('telegram_messages') || '[]';
        const allMessages = JSON.parse(messagesJson);
        
        // Filtrar mensagens por canais ativos
        const channelMessages = allMessages
          .filter((message: any) => activeChannelIds.includes(message.channel_id))
          .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, limit);
        
        // Adicionar nome do canal a cada mensagem
        const messagesWithChannelNames = channelMessages.map((message: any) => {
          const channel = channels.find((c: any) => c.id === message.channel_id);
          return {
            ...message,
            channel_name: channel ? channel.name : 'Canal Desconhecido'
          };
        });
        
        setMessages(messagesWithChannelNames);
        return messagesWithChannelNames;
      } else {
        setMessages([]);
        return [];
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar mensagens do Telegram');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markMessageAsProcessed = useCallback(async (messageId: string) => {
    try {
      // Atualizar na memória
      setMessages(prev => 
        prev.map(message => 
          message.id === messageId 
            ? { ...message, action_taken: true } 
            : message
        )
      );
      
      // Atualizar no localStorage
      const messagesJson = localStorage.getItem('telegram_messages') || '[]';
      const allMessages = JSON.parse(messagesJson);
      
      const updatedMessages = allMessages.map((message: any) => 
        message.id === messageId 
          ? { ...message, action_taken: true } 
          : message
      );
      
      localStorage.setItem('telegram_messages', JSON.stringify(updatedMessages));
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
