'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/lib/use-socket';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Send, User as UserIcon } from 'lucide-react';
import api from '@/lib/api';

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export function ChatWindow({ conversationId, recipientName, recipientLogo }: { conversationId: string, recipientName: string, recipientLogo?: string }) {
  const { user } = useAuth();
  const { socket, joinConversation, leaveConversation, sendMessage } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch initial messages
    api.get(`/chat/conversations/${conversationId}/messages`).then((res) => {
      setMessages(res.data);
      scrollToBottom();
    }).catch(err => console.error("Failed to load messages", err));

    // Join room
    joinConversation(conversationId);

    // Listen for new messages
    if (socket) {
      socket.on('receive_message', (message: Message) => {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
        
        // Mark as read if we received it while window is open
        if (message.senderId !== user?.id) {
           api.post(`/chat/conversations/${conversationId}/read`);
        }
      });
    }

    return () => {
      leaveConversation(conversationId);
      if (socket) {
        socket.off('receive_message');
      }
    };
  }, [conversationId, socket]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessage(conversationId, newMessage);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[600px] border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-slate-100 bg-slate-50">
        <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center mr-3">
          {recipientLogo ? (
            <img src={recipientLogo} alt={recipientName} className="h-full w-full object-cover" />
          ) : (
            <UserIcon className="h-5 w-5 text-slate-500" />
          )}
        </div>
        <h3 className="font-semibold text-slate-900">{recipientName}</h3>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 text-sm">
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                    isMe 
                      ? 'bg-primary text-white rounded-br-none' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-xl border-slate-200 focus:ring-primary focus:border-primary text-sm px-4 py-2 border"
        />
        <Button type="submit" size="icon" className="rounded-xl shrink-0 h-10 w-10">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
