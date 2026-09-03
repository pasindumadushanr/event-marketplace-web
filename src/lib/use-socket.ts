'use client';

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './auth-context';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const token = localStorage.getItem('accessToken');
    const socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const newSocket = io(socketUrl, {
      auth: { token: `Bearer ${token}` },
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated]);

  const joinConversation = useCallback((conversationId: string) => {
    if (socket) socket.emit('join_conversation', { conversationId });
  }, [socket]);

  const leaveConversation = useCallback((conversationId: string) => {
    if (socket) socket.emit('leave_conversation', { conversationId });
  }, [socket]);

  const sendMessage = useCallback((conversationId: string, content: string) => {
    if (socket) socket.emit('send_message', { conversationId, content });
  }, [socket]);

  return { socket, joinConversation, leaveConversation, sendMessage };
}
