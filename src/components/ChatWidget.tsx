import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sprout } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateAIResponse } from '../services/geminiService';

interface ChatWidgetProps {
  t: (key: string) => string;
  isChatOpen: boolean;
  setIsChatOpen: (val: boolean) => void;
  chatMessage: string;
  setChatMessage: (val: string) => void;
  messages: { text: string; isUser: boolean }[];
  setMessages: (val: any) => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  t,
  isChatOpen,
  setIsChatOpen,
  chatMessage,
  setChatMessage,
  messages,
  setMessages
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || isLoading) return;
    
    setIsLoading(true);
    const userMessage = { text: chatMessage, isUser: true };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    const currentMessage = chatMessage;
    setChatMessage('');

    try {
      const aiResponse = await generateAIResponse(currentMessage, messages.slice(-5));
      
      setMessages([...newMessages, { 
        text: aiResponse || t("chat.aiResponse"), 
        isUser: false 
      }]);
    } catch (error: any) {
      console.error("Chat Error:", error);
      setMessages([...newMessages, { 
        text: error.message?.includes("API key not valid") 
          ? "I'm having trouble with my connection. Please check back later."
          : "Sorry, I'm having trouble connecting right now. Please try again later.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-40 md:bottom-8"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">1</span>
      </button>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-0 right-0 w-full h-full md:bottom-24 md:right-6 md:w-96 md:h-[500px] bg-white dark:bg-gray-800 md:rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-primary text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">FarmKit AI Assistant</h3>
                  <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> {t('chat.online')}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.isUser ? 'bg-primary text-white rounded-tr-none' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-tl-none'}`}>
                    {msg.isUser ? (
                      msg.text
                    ) : (
                      <div className="markdown-body prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl rounded-tl-none flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex gap-2">
              <input 
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t('chat.askAnything')}
                disabled={isLoading}
                className="flex-1 bg-gray-50 dark:bg-gray-700 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none disabled:opacity-50"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading}
                className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
