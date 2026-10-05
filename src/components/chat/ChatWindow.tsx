"use client";
import { useState, useEffect, useRef } from "react";
import { useSocket } from "@/lib/use-socket";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import api from "@/lib/api";
import {
  readInquiryRecord,
  inquiryStatusLabel,
  InquiryResponse,
} from "@/lib/inquiry-record";
import { InquiryCard } from "./InquiryCard";

type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
};
export function ChatWindow({
  conversationId,
  recipientName,
  recipientLogo,
  vendorView = false,
  customerId,
}: {
  conversationId: string;
  recipientName: string;
  recipientLogo?: string;
  vendorView?: boolean;
  customerId?: string;
}) {
  const { user } = useAuth();
  const { socket, joinConversation, leaveConversation } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  function append(message: Message) {
    setMessages((previous) =>
      previous.some((item) => item.id === message.id)
        ? previous
        : [...previous, message],
    );
  }
  useEffect(() => {
    let alive = true;
    setLoading(true);
    api
      .get(`/chat/conversations/${conversationId}/messages`)
      .then((res) => {
        if (!alive) return;
        setMessages(
          (previous) =>
            [
              ...new Map(
                [...res.data, ...previous].map((item) => [item.id, item]),
              ).values(),
            ] as Message[],
        );
        setError("");
        void api
          .post(`/chat/conversations/${conversationId}/read`)
          .catch(() => undefined);
      })
      .catch(() => {
        if (alive)
          setError("Messages couldn’t be loaded. Please refresh to try again.");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    const join = () => joinConversation(conversationId);
    socket?.on("connect", join);
    if (socket?.connected) join();
    const receive = (message: Message) => {
      if (message.conversationId !== conversationId) return;
      append(message);
      if (message.senderId !== user?.id)
        void api
          .post(`/chat/conversations/${conversationId}/read`)
          .catch(() => undefined);
    };
    socket?.on("receive_message", receive);
    return () => {
      alive = false;
      leaveConversation(conversationId);
      socket?.off("receive_message", receive);
      socket?.off("connect", join);
    };
  }, [conversationId, socket, joinConversation, leaveConversation, user?.id]);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages.length]);
  async function handleSend(event: React.FormEvent) {
    event.preventDefault();
    if (!newMessage.trim() || sending || loading) return;
    setSending(true);
    setError("");
    try {
      const result = await api.post(
        `/chat/conversations/${conversationId}/messages`,
        { content: newMessage.trim() },
      );
      append(result.data);
      setNewMessage("");
    } catch {
      setError("Your message wasn’t sent. It is still here; please try again.");
    } finally {
      setSending(false);
    }
  }
  const responses = new Map<string, InquiryResponse>();
  const customer = vendorView ? customerId : user?.id;
  for (const message of messages) {
    const record = readInquiryRecord(message.content);
    if (record?.kind === "RESPONSE" && message.senderId !== customer)
      responses.set(record.inquiryId, record);
  }
  return (
    <div className="flex h-[650px] max-h-[85vh] min-h-[450px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 p-4">
        {recipientLogo && (
          <img
            src={recipientLogo}
            alt=""
            className="h-10 w-10 rounded-full object-cover"
          />
        )}
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-900">
            {recipientName}
          </h3>
          <p className="text-xs text-slate-500">
            Enquiries and messages · no date is reserved here
          </p>
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-slate-50/50 p-4">
        {loading && <p className="text-sm text-slate-500">Loading messages…</p>}
        {!loading && !messages.length && !error && (
          <p className="text-sm text-slate-500">No messages yet. Say hello!</p>
        )}
        {messages.map((message) => {
          const record = readInquiryRecord(message.content);
          if (record?.kind === "INQUIRY" && message.senderId === customer)
            return (
              <InquiryCard
                key={message.id}
                inquiry={record}
                id={message.id}
                conversationId={conversationId}
                response={responses.get(message.id)}
                vendorView={vendorView}
                onResponse={append}
              />
            );
          const mine = message.senderId === user?.id;
          return (
            <div
              key={message.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm ${mine ? "bg-[#183e38] text-white" : "border border-slate-200 bg-white text-slate-800"}`}
              >
                {record?.kind === "RESPONSE" ? (
                  <>
                    <p className="mb-1 text-xs font-semibold opacity-80">
                      {inquiryStatusLabel[record.action]}
                    </p>
                    {record.text}
                  </>
                ) : (
                  message.content
                )}
              </div>
            </div>
          );
        })}
        <div ref={end} />
      </div>
      {error && (
        <p role="alert" className="px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <form
        onSubmit={handleSend}
        className="flex gap-2 border-t border-slate-100 bg-white p-4"
      >
        <input
          aria-label="Message"
          type="text"
          maxLength={5000}
          value={newMessage}
          disabled={sending}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message…"
          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm"
        />
        <Button
          aria-label="Send message"
          type="submit"
          disabled={sending || loading || !newMessage.trim()}
          size="icon"
          className="h-10 w-10 shrink-0 rounded-xl"
        >
          <Send size={16} />
        </Button>
      </form>
    </div>
  );
}
