'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Inbox, CheckCircle2, Circle, Clock, Mail, Phone, MessageSquare } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminSupportInbox() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/contact');
      setTickets(res.data);
    } catch (error) {
      toast.error('Failed to load support tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/contact/${id}/status`, { status });
      toast.success(`Ticket marked as ${status.toLowerCase()}`);
      
      // Update local state
      setTickets(tickets.map(t => t.id === id ? { ...t, status } : t));
      if (selectedTicket?.id === id) {
        setSelectedTicket({ ...selectedTicket, status });
      }
    } catch (error) {
      toast.error('Failed to update ticket status');
    }
  };

  const pendingCount = tickets.filter(t => t.status === 'PENDING').length;

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-100px)]">
      <div className="flex justify-between items-end flex-shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            Support Inbox
            {pendingCount > 0 && (
              <Badge variant="destructive" className="rounded-full">
                {pendingCount} new
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground mt-1">Manage incoming inquiries and support requests.</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-white rounded-xl border shadow-sm flex overflow-hidden">
        
        {/* Left Side: Ticket List */}
        <div className="w-1/3 min-w-[320px] border-r border-slate-200 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Inbox className="h-4 w-4" /> All Tickets
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500 text-sm">Loading tickets...</div>
            ) : tickets.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">Inbox is empty.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {tickets.map(ticket => (
                  <button 
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`w-full text-left p-4 hover:bg-white transition-colors block border-l-4 ${
                      selectedTicket?.id === ticket.id 
                        ? 'bg-white border-blue-500 shadow-sm relative z-10' 
                        : ticket.status === 'PENDING' 
                          ? 'border-amber-400' 
                          : 'border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm truncate pr-2 ${ticket.status === 'PENDING' ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {ticket.name}
                      </span>
                      <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">
                        {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-900 truncate mb-1">
                      {ticket.subject}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {ticket.message}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Ticket Details */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {selectedTicket ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-slate-200 flex justify-between items-start shrink-0">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedTicket.subject}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md">
                      <Mail className="h-4 w-4" /> {selectedTicket.email}
                    </span>
                    {selectedTicket.phone && (
                      <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md">
                        <Phone className="h-4 w-4" /> {selectedTicket.phone}
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  {selectedTicket.status === 'PENDING' ? (
                    <Button 
                      onClick={() => updateStatus(selectedTicket.id, 'RESOLVED')}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Mark as Resolved
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      onClick={() => updateStatus(selectedTicket.id, 'PENDING')}
                    >
                      <Circle className="h-4 w-4 mr-2" /> Reopen Ticket
                    </Button>
                  )}
                </div>
              </div>

              {/* Message Body */}
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg">
                    {selectedTicket.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="font-semibold text-slate-900">{selectedTicket.name}</div>
                      <div className="text-xs text-slate-400">
                        {new Date(selectedTicket.createdAt).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {selectedTicket.message}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
              <p>Select a ticket to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
