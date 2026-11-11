import React, { useState, useRef, useEffect } from 'react';
import { useBankingStore } from '../store/useBankingStore';
import {
  Sparkles,
  X,
  Send,
  MessageSquare,
  ChevronDown,
  ShieldCheck,
  CreditCard,
  Building,
  RotateCcw,
  ExternalLink,
  Bot,
  Copy,
  Check,
} from 'lucide-react';
import { useEscapeKey } from '../hooks/useEscapeKey';

interface ChatMessage {
  id: string;
  sender: 'user' | 'eno';
  text: string;
  timestamp: string;
  quickAction?: {
    label: string;
    actionType: 'navigate' | 'copy' | 'trigger';
    value: string;
  };
}

interface ChatWithEnoProps {
  onNavigate?: (path: string) => void;
  onOpenPreApproval?: () => void;
}

const COMMON_QUERIES = [
  'What is my account balance & credit limit?',
  'Where can I find my Routing and SWIFT numbers?',
  'How do I redeem cash back or miles rewards?',
  'How do I set an international travel notice?',
  'Can I lock or pause my virtual cards?',
  'How does the Refer-a-Friend bonus work?',
  'What are the fees for Capital One 360 Checking?',
];

export const ChatWithEno: React.FC<ChatWithEnoProps> = ({ onNavigate, onOpenPreApproval }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEscapeKey(() => setIsOpen(false), isOpen);

  const { currentUser, isBalanceHidden } = useBankingStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const primaryChecking = currentUser?.accounts.find((a) => a.type === 'checking');
  const primaryCredit = currentUser?.accounts.find((a) => a.type === 'credit');

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'eno',
      text: currentUser
        ? `Hello ${currentUser.firstName}! I'm Eno, your 24/7 Capital One digital assistant. How can I help with your accounts, rewards, or banking services today?`
        : "Hello! I'm Eno, your Capital One assistant. I can answer questions about credit cards, rewards, 360 Checking, Auto Navigator, or help you find what you need.",
      timestamp: 'Just now',
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 3000);
  };

  const generateEnoResponse = (query: string): { text: string; quickAction?: ChatMessage['quickAction'] } => {
    const q = query.toLowerCase();

    if (q.includes('balance') || q.includes('how much') || q.includes('credit limit')) {
      if (currentUser && primaryChecking) {
        const chkBal = isBalanceHidden ? '••••••' : `$${primaryChecking.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        const crdBal = primaryCredit ? (isBalanceHidden ? '••••••' : `$${primaryCredit.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`) : '$0.00';
        const crdLimit = primaryCredit?.creditLimit ? `$${primaryCredit.creditLimit.toLocaleString()}` : '$10,000';

        return {
          text: `Here is your active account snapshot:\n\n• 360 Checking (...${primaryChecking.accountNumber.slice(-4)}): ${chkBal}\n• Capital One Card (...${primaryCredit?.accountNumber.slice(-4) || '8821'}): ${crdBal} current balance of ${crdLimit} line of credit.`,
          quickAction: {
            label: 'View Live Dashboard',
            actionType: 'navigate',
            value: '/dashboard',
          },
        };
      }
      return {
        text: 'To view specific balances, please sign in to your Capital One account. We offer 0 minimum balance fees on all 360 Checking and Performance Savings accounts.',
        quickAction: {
          label: 'Sign In to Account',
          actionType: 'navigate',
          value: '/signin',
        },
      };
    }

    if (q.includes('routing') || q.includes('swift') || q.includes('aba') || q.includes('direct deposit')) {
      const routing = currentUser?.routingNumber || primaryChecking?.routingNumber || '051405515';
      const swift = currentUser?.swiftCode || 'CAPOUS33';

      return {
        text: `Capital One Routing and Electronic Transfer credentials:\n\n• ABA Routing Transit: ${routing}\n• SWIFT / BIC Code: ${swift}\n• Direct Deposit: Use your 9-digit routing and full checking account number.`,
        quickAction: {
          label: `Copy Routing (${routing})`,
          actionType: 'copy',
          value: routing,
        },
      };
    }

    if (q.includes('lock') || q.includes('pause') || q.includes('lost card') || q.includes('stolen') || q.includes('freeze')) {
      return {
        text: 'You can instantly freeze or unfreeze your physical and virtual cards anytime in your dashboard or profile with zero impact on scheduled bill payments.',
        quickAction: {
          label: 'Go to Virtual Cards & Locks',
          actionType: 'navigate',
          value: '/dashboard',
        },
      };
    }

    if (q.includes('reward') || q.includes('miles') || q.includes('cash back') || q.includes('points') || q.includes('redeem')) {
      return {
        text: 'Your rewards never expire for the life of the account! You can redeem miles for travel purchases, transfer to 15+ airline partners at 1:1, or cash out statement credits with no minimum threshold.',
        quickAction: {
          label: 'View Rewards Portal',
          actionType: 'navigate',
          value: '/dashboard',
        },
      };
    }

    if (q.includes('travel') || q.includes('abroad') || q.includes('foreign') || q.includes('passport') || q.includes('trip')) {
      return {
        text: 'Good news: Capital One credit cards have $0 foreign transaction fees worldwide! You can also register a complimentary travel notice in your profile so your card works uninterrupted overseas.',
        quickAction: {
          label: 'Register Travel Notice',
          actionType: 'navigate',
          value: '/profile',
        },
      };
    }

    if (q.includes('refer') || q.includes('friend') || q.includes('bonus') || q.includes('invite')) {
      return {
        text: 'With the Capital One Refer-a-Friend program, you can earn up to $500 cash back or 100,000 bonus miles per year when your friends use your link to apply and get approved.',
        quickAction: {
          label: 'View Referral Section',
          actionType: 'navigate',
          value: '/#refer-a-friend',
        },
      };
    }

    if (q.includes('fee') || q.includes('checking') || q.includes('overdraft') || q.includes('atm')) {
      return {
        text: 'Capital One 360 Checking has $0 monthly service fees, $0 minimum opening balance, and access to 70,000+ fee-free ATMs at Capital One Cafés, Target, CVS, and Walgreens.',
        quickAction: {
          label: 'Explore 360 Banking',
          actionType: 'navigate',
          value: '/#banking',
        },
      };
    }

    if (q.includes('pre-approval') || q.includes('pre-qual') || q.includes('apply') || q.includes('credit score')) {
      return {
        text: 'Check if you are pre-approved for Capital One credit cards with zero impact on your credit score. You can see personalized rates and offers in less than 60 seconds.',
        quickAction: {
          label: 'Check Pre-Approval Now',
          actionType: 'trigger',
          value: 'pre-approval',
        },
      };
    }

    return {
      text: "Thanks for reaching out! Capital One offers 24/7 fraud protection, instant virtual cards, free credit score monitoring with CreditWise, and fee-free banking. Is there a specific account, transaction, or card product I can look up for you?",
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const enoResponse = generateEnoResponse(text);
      const enoMsg: ChatMessage = {
        id: `eno-${Date.now()}`,
        sender: 'eno',
        text: enoResponse.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickAction: enoResponse.quickAction,
      };

      setMessages((prev) => [...prev, enoMsg]);
      setIsTyping(false);
    }, 650);
  };

  const handleActionClick = (action: NonNullable<ChatMessage['quickAction']>) => {
    if (action.actionType === 'copy') {
      handleCopy(action.value, action.label);
    } else if (action.actionType === 'navigate') {
      if (onNavigate) {
        onNavigate(action.value);
        setIsOpen(false);
      }
    } else if (action.actionType === 'trigger' && action.value === 'pre-approval') {
      onOpenPreApproval?.();
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#003865] via-[#005C9D] to-[#0072B5] text-white rounded-full shadow-2xl hover:shadow-[#005C9D]/40 hover:scale-105 transition-all duration-300 cursor-pointer border border-sky-300/30"
          aria-label="Chat with Eno"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-sky-200">
              <Sparkles className="w-4 h-4 fill-sky-200 animate-pulse" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#003865]" />
          </div>

          <div className="text-left pr-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-200 block leading-none">
              Need Help?
            </span>
            <span className="text-xs font-extrabold text-white block">
              Chat with Eno
            </span>
          </div>
        </button>
      </div>

      {/* Slide-over / Modal Chat Window */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 sm:bottom-6 sm:right-6 sm:top-auto sm:inset-y-auto w-full sm:w-[420px] sm:max-h-[640px] h-full sm:h-[620px] bg-slate-900 border border-slate-700/80 rounded-none sm:rounded-3xl shadow-2xl z-50 flex flex-col text-white animate-in slide-in-from-bottom-5 duration-300 overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#001B3A] via-[#003865] to-[#005C9D] border-b border-sky-800/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-sky-200 shadow-inner">
                <Sparkles className="w-5 h-5 fill-sky-300 text-sky-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-white">Eno</h3>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online 24/7
                  </span>
                </div>
                <span className="text-[11px] text-sky-200 block">
                  Capital One Intelligent Assistant
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMessages([
                  {
                    id: 'welcome-reset',
                    sender: 'eno',
                    text: "Conversation cleared. How can I assist you with your Capital One accounts or cards today?",
                    timestamp: 'Just now',
                  },
                ])}
                className="p-1.5 text-sky-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Reset Chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-sky-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Close Eno"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Category Suggestion Pills */}
          <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 shrink-0 overflow-x-auto scrollbar-none flex gap-1.5">
            {COMMON_QUERIES.slice(0, 4).map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-sky-300 hover:text-white border border-slate-800 rounded-full text-[11px] font-semibold transition-colors shrink-0 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-900/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'eno' && (
                  <div className="w-7 h-7 rounded-xl bg-[#005C9D]/40 border border-[#005C9D] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 text-xs shadow-sm space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-[#005C9D] text-white rounded-br-xs'
                      : 'bg-slate-800 text-slate-100 border border-slate-700/80 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                  {msg.quickAction && (
                    <div className="pt-1.5 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => handleActionClick(msg.quickAction!)}
                        className="w-full py-1.5 px-2.5 bg-white/10 hover:bg-white/20 text-sky-200 hover:text-white rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {msg.quickAction.actionType === 'copy' ? (
                          copiedText ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{msg.quickAction.label}</span>
                            </>
                          )
                        ) : (
                          <>
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>{msg.quickAction.label}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  <span className="text-[10px] text-slate-400 block text-right pt-0.5">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-xl bg-[#005C9D]/40 border border-[#005C9D] flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Common Inquiries Collapsible */}
          <div className="p-2.5 bg-slate-950 border-t border-slate-800 text-[11px] flex items-center justify-between text-slate-400 shrink-0">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-bit Bank Grade Encrypted Simulation</span>
            </span>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Eno about cards, balance, routing..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-[#005C9D] hover:bg-[#00487D] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors cursor-pointer shadow-sm"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
