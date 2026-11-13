import React, { useState } from 'react';
import { useBankingStore } from '../store/useBankingStore';
import { Send, User } from 'lucide-react';

interface SupportChatMessage {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  timestamp: string;
  type?: 'chat' | 'system';
}

export const SupportChat: React.FC = () => {
  const { notifications, globalNotification, addNotification, markNotificationRead, markAllNotificationsRead } = useBankingStore();
  const [activeChat, setActiveChat] = useState<SupportChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  // Get recent support tickets/chat sessions
  const getSupportChats = () => {
    // In a real app, this would fetch from backend
    // For now, we simulate with existing notifications
    return notifications.filter(n => n.unread || n.type === 'info');
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: SupportChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatInput(text);
    setActiveChat(prev => [...prev, userMsg]);

    // Simulate admin response after 1-3 seconds
    setTimeout(() => {
      const adminMsg: SupportChatMessage = {
        id: `admin-${Date.now()}`,
        sender: 'admin',
        text: `✅ Your request has been processed. Here are the details:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'chat',
      };

      setActiveChat(prev => [...prev, adminMsg]);
      setChatInput('');
    }, Math.random() * 2000 + 1000);
  };

  const handleSendToAdmin = () => {
    if (activeChat.length > 0) {
      setActiveChat([]);
      // In a real app, this would open a modal or navigate to admin chat
      alert('Connected to admin support chat. Admin will respond shortly.');
    }
  };

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
  };

  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value);
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-4">
      <h3 className="text-xl font-bold text-white mb-4">Support & Admin Chat</h3>

      {/* Notification Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/20 flex items-center justify-center text-sky-400 font-bold">
            <span className="text-sky-400">A</span>
          </div>
          <div>
            <h4 className="font-semibold text-white">Support Chat</h4>
            <p className="text-slate-500 text-sm">You have 3 unread messages</p>
          </div>
        </div>
        <button
          onClick={handleSendToAdmin}
          disabled={!activeChat}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" /> Connect to Admin
        </button>
      </div>

      {/* Active Chat */}
      {activeChat.length > 0 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 flex items-center justify-center text-sky-400 font-bold flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                <div>
                  <div className="text-sm font-medium text-white">Admin Support</div>
                  <div className="text-xs text-slate-500">Online</div>
                </div>
              </div>
              <div className="text-sm text-white">Online</div>
            </div>
            <div className="mt-2">
              <p className="text-sm text-white">You are connected to an admin for support.</p>
              <p className="text-xs text-slate-500">Your request is being processed...</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {activeChat.map((msg: SupportChatMessage) => (
              <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'admin' ? 'bg-sky-600/20' : 'bg-slate-800/50'}`}>
                {msg.sender === 'admin' ? (
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${msg.sender === 'admin' ? 'text-white' : 'text-slate-400'}`}>
                    {msg.text}
                  </p>
                  <div className="text-xs text-slate-500">{msg.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSendToAdmin}
              disabled={activeChat.length === 0}
              className="flex-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Send Message
            </button>
            <button
              onClick={handleMarkAllRead}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-xs font-medium transition-colors"
            >
              Mark as Read
            </button>
          </div>
        </div>
      )}

      {/* Unread Notifications */}
      {notifications.length > 0 && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-4">
          <h4 className="text-sm font-semibold text-white mb-3">Unread Notifications</h4>
          <div className="space-y-2">
            {notifications
              .filter(n => n.unread)
              .map(n => (
                <div key={n.id} className="flex items-center gap-3 p-2 bg-slate-900/50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{n.title || n.message.substring(0, 30)}...</p>
                    <p className="text-xs text-slate-500">{n.type || n.id}</p>
                  </div>
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Read
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default SupportChat;