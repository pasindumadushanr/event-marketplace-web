'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { User, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function VendorMessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    api.get('/chat/conversations').then(res => {
      setConversations(res.data);
      if (res.data.length > 0 && !activeId) {
        setActiveId(res.data[0].id);
      }
    });
  }, []);

  const activeConversation = conversations.find(c => c.id === activeId);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Customer Messages</h1>
      
      <div className="flex flex-col md:flex-row gap-6 h-[700px]">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h2 className="font-semibold text-slate-700">Inquiries</h2>
            <span className="text-xs bg-primary text-white px-2 py-1 rounded-full font-bold">
              {conversations.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No customer inquiries yet.
              </div>
            ) : (
              conversations.map(conv => (
                <div 
                  key={conv.id}
                  onClick={() => setActiveId(conv.id)}
                  className={`p-4 border-b border-slate-50 cursor-pointer transition-colors flex gap-3 ${
                    activeId === conv.id ? 'bg-slate-50 border-l-4 border-l-primary' : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="h-10 w-10 rounded-full bg-slate-200 shrink-0 overflow-hidden">
                    {conv.customer.profileImage ? (
                      <img src={conv.customer.profileImage} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center"><User className="h-5 w-5 text-slate-500" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-semibold text-sm text-slate-900 truncate">
                        {conv.customer.firstName} {conv.customer.lastName}
                      </h4>
                      <span className="text-xs text-slate-400 shrink-0">
                        {formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {conv.messages[0]?.content || 'Started a conversation'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1">
          {activeConversation ? (
            <ChatWindow 
              key={activeConversation.id} 
              conversationId={activeConversation.id} 
              recipientName={`${activeConversation.customer.firstName} ${activeConversation.customer.lastName}`}
              recipientLogo={activeConversation.customer.profileImage}
            />
          ) : (
            <div className="h-full border border-slate-200 rounded-2xl bg-white flex flex-col items-center justify-center text-slate-400">
              <MessageCircle className="h-12 w-12 mb-4 opacity-20" />
              <p>Select a conversation to reply</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
