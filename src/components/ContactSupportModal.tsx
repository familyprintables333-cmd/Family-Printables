import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, HelpCircle, CheckCircle2, MapPin, Clock, MessageSquare, Printer, ShieldCheck } from 'lucide-react';

interface ContactSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  logoUrl?: string;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

const KNOWLEDGE_BASE: { keywords: string[]; response: string }[] = [
  {
    keywords: ['print', 'printer', 'scale', 'actual size', 'size', 'paper', 'margins'],
    response:
      '🖨️ **Printing Tips for Best Quality:**\n\n1. Always open your downloaded PDF in free Adobe Acrobat Reader or your tablet browser.\n2. In your print settings, set **Scale to 100% ("Actual Size")** instead of "Fit to Page" so tracing lines and grid activities remain perfectly proportioned.\n3. We recommend standard 24lb–32lb bright white paper for daily tracing, or 65lb cardstock for durable routine boards.\n4. Both Standard A4 (210 × 297 mm) and Universal formats are provided with every order!'
  },
  {
    keywords: ['laminate', 'dry erase', 'marker', 'reusable', 'sleeve'],
    response:
      '✨ **Making Workbooks Reusable with Dry-Erase:**\n\nYes! You can slide printed sheets directly into clear dry-erase pocket sleeves (available on Amazon) or heat-laminate them with 3mil/5mil pouches. Kids can practice tracing letters, mazes, and daily routines endlessly with fine-tip dry-erase markers and wipe clean with a microfiber cloth!'
  },
  {
    keywords: ['vault', 'download', 'downloads', 'find', 'where', 'access', 'file'],
    response:
      '📂 **Accessing Your Download Vault:**\n\nYour purchases unlock instantly in the top navigation under **"My Downloads"**. Each item is available with 1-click downloads for Standard A4 PDF, Universal Format PDF, and MP3 audio files. Your downloads are securely saved to your device session and parent account.'
  },
  {
    keywords: ['90', 'expire', 'expired', '3 month', 'period', 're-lock', 'time limit', 'renew'],
    response:
      '⏱️ **90-Day (3-Month) Download Policy:**\n\nAll purchases include guaranteed unlimited re-downloads for strictly 90 days from purchase date. Once you save the PDF files to your computer or cloud storage (Google Drive / iCloud), they are yours forever! If your 90-day vault window lapses, you can instantly renew access with 1 click.'
  },
  {
    keywords: ['ipad', 'tablet', 'phone', 'mobile', 'iphone', 'android'],
    response:
      '📱 **Using on iPad & Mobile Tablets:**\n\nYes! Tap "Download Standard A4" and choose "Save to Files" or open in apps like GoodNotes, Notability, Apple Books, or Adobe Reader. Kids can even use the Apple Pencil or stylus to complete worksheets directly on screen!'
  },
  {
    keywords: ['classroom', 'school', 'teacher', 'license', 'homeschool', 'commercial'],
    response:
      '🎓 **Licensing & Usage Permissions:**\n\nEvery purchase includes our comprehensive Personal & Homeschool License! You are fully welcome to print as many copies as needed for all children in your immediate family or your single homeschool pod / classroom station.'
  },
  {
    keywords: ['address', 'location', 'company', 'office', 'where are you'],
    response:
      '📍 **Global Publishing Office & Headquarters:**\n\nFamily Printables Global Publishing\n100 Central Business Boulevard, Suite 500\nGlobal Tech District, International Hub\n\nOperating Hours: Monday – Friday, 9:00 AM – 5:00 PM UTC.\nOur AI Customer Care Desk is active 24/7/365 to assist you immediately!'
  }
];

export const ContactSupportModal: React.FC<ContactSupportModalProps> = ({
  isOpen,
  onClose,
  logoUrl = '/logo.png'
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: "Hello! 👋 Welcome to Family Printables AI Customer Care. How can I help you today? You can select a quick topic below or type any question about printing, formats, downloads, or routines!",
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const getAiAnswer = (query: string): string => {
    const lower = query.toLowerCase();
    for (const item of KNOWLEDGE_BASE) {
      if (item.keywords.some((kw) => lower.includes(kw))) {
        return item.response;
      }
    }

    return `Thank you for reaching out! Regarding "${query}":\n\nOur educational digital workbooks are delivered instantly as high-resolution 300 DPI vector PDFs in Standard A4 and Universal formats with 90-day vault download access. \n\nIf you have questions regarding printer scaling, please select "Actual Size (100%)" in your print dialog. You can also view our complete Printing Guide in the How It Works section!`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const responseText = getAiAnswer(text);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const QUICK_QUESTIONS = [
    'How do I print to actual size?',
    'Can I laminate workbooks for dry-erase?',
    'Where are my download files stored?',
    'What is the 90-day download policy?',
    'Can I use these on iPad or GoodNotes?'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[640px] max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Family Printables AI Support
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Instant Replies
                </span>
              </div>
              <p className="text-xs text-slate-300">
                24/7 Smart Automated Support • Zero Email Wait Times
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Business Office Banner */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 shrink-0">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="font-semibold text-slate-800">
              Publishing Office:
            </span>
            <span>123 Learning Way, Suite 400, Dover, DE 19901, USA</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Mon–Fri 9am–5pm EST</span>
          </div>
        </div>

        {/* Chat Message List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/60">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 shadow-2xs whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                }`}
              >
                <div className="text-[11px] sm:text-xs">{msg.text}</div>
                <div
                  className={`mt-1.5 text-[9px] text-right ${
                    msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {msg.time}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200 flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-slate-500 font-medium ml-1">
                  AI Assistant is drafting your answer...
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-xs">
          <span className="text-[11px] text-slate-400 font-bold shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            Quick:
          </span>
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-[11px] whitespace-nowrap transition border border-slate-200/80 active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about workbooks, printing, laminating, orders..."
              className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-xs active:scale-95"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Instant AI auto-response resolution • No emails needed</span>
            </div>
            <span>Family Printables Support Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
