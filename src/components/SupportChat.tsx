import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useBankingStore } from '../store/useBankingStore';
import { MessageCircle, X, Send, ShieldCheck, Headset, Image as ImageIcon } from 'lucide-react';
import { createMessaging } from '../lib/messaging';
import type { CloudMessage, MessagingHandle } from '../lib/messaging';
import { processImageFile } from '../lib/image';
import { uploadImage } from '../lib/imageUpload';
import { MessageText } from './MessageText';

export const SupportChat: React.FC = () => {
  const { currentUser, users, supportThreads, sendSupportMessage, markSupportThreadRead } = useBankingStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [attachDataUrl, setAttachDataUrl] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [cloudMsgs, setCloudMsgs] = useState<CloudMessage[]>([]);
  const [cloudRead, setCloudRead] = useState<Record<string, number>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const msgRef = useRef<MessagingHandle | null>(null);
  const prevUnread = useRef(0);

  const activeUser = users.find((u) => u.id === currentUser?.id) || currentUser;

  const thread = useMemo(() => {
    if (!activeUser) return undefined;
    const mine = supportThreads.filter((t) => t.userId === activeUser.id);
    return mine.find((t) => t.status === 'open') || mine[0];
  }, [supportThreads, activeUser]);

  const messages = thread?.messages || [];
  const localIds = new Set(messages.map((m) => m.id));
  const cloudOnly = cloudMsgs.filter((m) => !localIds.has(m.id));
  const unreadFromAdmin = messages.filter((m) => m.sender === 'admin' && !m.read).length;
  const unreadCloud = cloudMsgs.filter((m) => !cloudRead[m.id]).length;
  const unreadTotal = unreadFromAdmin + unreadCloud;

  // Cloud polling (cross-device admin messages)
  useEffect(() => {
    if (!activeUser?.username) return;
    const h = createMessaging({
      userId: activeUser.username,
      onMessages: (list, meta) => {
        setCloudMsgs(list);
        if (meta.read) setCloudRead(meta.read);
      },
    });
    msgRef.current = h;
    h.start();
    return () => {
      h.stop();
      msgRef.current = null;
    };
  }, [activeUser?.username]);

  useEffect(() => {
    if (isOpen && thread) {
      markSupportThreadRead(thread.id, 'user');
    }
    if (isOpen) {
      const unreadIds = cloudMsgs.filter((m) => !cloudRead[m.id]).map((m) => m.id);
      if (unreadIds.length && msgRef.current) msgRef.current.markRead(unreadIds);
    }
  }, [isOpen, thread?.id, cloudMsgs.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length, cloudMsgs.length, isOpen]);

  // Auto-open the chat when a new admin/cloud message arrives.
  useEffect(() => {
    if (unreadTotal > prevUnread.current) {
      setIsOpen(true);
    }
    prevUnread.current = unreadTotal;
  }, [unreadTotal]);

  // Allow other parts of the app (e.g. the account-review banner) to open the chat.
  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener('capitalone:open-support', open);
    return () => window.removeEventListener('capitalone:open-support', open);
  }, []);

  if (!activeUser) return null;

  const handleAttach = async (file: File | undefined) => {
    if (!file) return;
    try {
      const p = await processImageFile(file, { maxDim: 1280, quality: 0.82 });
      setAttachDataUrl(p.dataUrl);
    } catch {
      /* ignore */
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !attachDataUrl) return;
    setSending(true);
    let text = input.trim();
    if (attachDataUrl) {
      const up = await uploadImage(attachDataUrl);
      const ref = up.url || up.key;
      if (ref) text = `[[img:${ref}]]${text ? `\n${text}` : ''}`;
      setAttachDataUrl(null);
    }
    if (text) sendSupportMessage(activeUser.id, text, 'App Support');
    setInput('');
    setSending(false);
  };

  const cloudTime = (ts: number) =>
    new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-24 left-4 z-40 w-12 h-12 rounded-full glass-brand text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        aria-label="Open support chat"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        {!isOpen && unreadTotal > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#DA291C] text-white text-[10px] font-bold flex items-center justify-center">
            {unreadTotal}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-40 left-4 z-40 w-[330px] max-w-[calc(100vw-2rem)] h-[440px] glass-strong rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/40 animate-in fade-in slide-in-from-bottom-3">
          {/* Header */}
          <div className="glass-brand px-4 py-3 flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Headset className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#005C9D]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white leading-none">Capital One Support</h3>
              <p className="text-[11px] text-white/80 mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Human agent · Online
              </p>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white cursor-pointer" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-white/40">
            {messages.length === 0 && cloudOnly.length === 0 && (
              <div className="text-center text-xs text-slate-500 mt-8 px-4">
                <Headset className="w-8 h-8 mx-auto mb-2 text-[#005C9D]/60" />
                You're chatting with a real Capital One specialist. Ask about transactions, gift cards, cards, or account security.
                Your conversation is private and syncs across your devices.
              </div>
            )}
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-[#005C9D] text-white rounded-br-sm'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-sm'
                    }`}
                  >
                    {!isUser && <div className="text-[10px] font-bold text-[#005C9D] mb-0.5">{m.senderName}</div>}
                    <div className="whitespace-pre-wrap"><MessageText text={m.text} /></div>
                    <div className={`text-[9px] mt-1 ${isUser ? 'text-white/70' : 'text-slate-400'}`}>{m.timestamp}</div>
                  </div>
                </div>
              );
            })}
            {cloudOnly.map((m) => (
              <div key={m.id} className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl rounded-bl-sm px-3 py-2 text-xs leading-relaxed shadow-sm bg-white text-slate-800 border border-slate-200">
                  <div className="text-[10px] font-bold text-[#005C9D] mb-0.5">{m.from === 'admin' ? 'Capital One Support' : m.from}</div>
                  <div className="whitespace-pre-wrap"><MessageText text={m.text} /></div>
                  <div className="text-[9px] mt-1 text-slate-400">{cloudTime(m.ts)}</div>
                </div>
              </div>
            ))}
            {messages.length > 0 && messages[messages.length - 1].sender === 'user' && cloudOnly.length === 0 && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-3 py-2 text-[11px] text-slate-500 italic">
                  Support is reviewing your message…
                </div>
              </div>
            )}
          </div>

          {attachDataUrl && (
            <div className="px-3 pt-2 flex items-center gap-2">
              <img src={attachDataUrl} className="max-h-24 rounded-lg border border-slate-300" alt="preview" />
              <button
                type="button"
                onClick={() => setAttachDataUrl(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
                aria-label="Remove attachment"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {/* Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-white/50 bg-white/70 flex items-center gap-2">
            <label
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer shrink-0"
              title="Attach image"
            >
              <ImageIcon className="w-4 h-4 text-slate-600" />
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleAttach(e.target.files?.[0])} />
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              className="flex-1 text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#005C9D] bg-white"
            />
            <button
              type="submit"
              disabled={sending || (!input.trim() && !attachDataUrl)}
              className="w-9 h-9 rounded-xl bg-[#005C9D] hover:bg-[#00487D] disabled:opacity-40 text-white flex items-center justify-center cursor-pointer shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default SupportChat;