import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { aiApi } from '../../api/aiApi';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

/**
 * AIChatWidget — floating chatbot bubble.
 *
 * Always visible on patient dashboard pages.
 * Opens/closes on click.
 * Sends messages to AI service and displays responses.
 * If AI detects booking intent → shows "Book Now" button.
 */
export default function AIChatWidget() {
  const { user }    = useAuth();
  const navigate    = useNavigate();

  const [isOpen, setIsOpen]     = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: 'Hi! I\'m MediConnect\'s AI assistant. I can help you check symptoms or book an appointment. How can I help you today?',
    },
  ]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const messagesEndRef           = useRef(null);
  const [showPopup, setShowPopup] = useState(true);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

//   Auto hide popup after 5 sec
useEffect(() => {
    const timer = setTimeout(() => {
        setShowPopup(false);
    }, 5000);

    return () => clearTimeout(timer);
}, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      text: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await aiApi.chat({
        message: input.trim(),
        userId: user?.id,
      });

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        text: res.data.reply,
        requiresBooking:        res.data.requiresBooking,
        suggestedSpecialization: res.data.suggestedSpecialization,
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        text: 'Sorry, I\'m having trouble right now. Please try again.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Only show for patients
  if (user?.role !== 'PATIENT') return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-xl
                        border border-secondary-200 flex flex-col
                        overflow-hidden animate-fadeIn"
             style={{ height: '480px' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3
                          bg-ai-600 text-white">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <div>
                <p className="font-semibold text-sm">MediConnect AI</p>
                <p className="text-xs text-ai-200">Ask me anything</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md hover:bg-ai-500 transition-colors"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={cn(
                  'flex gap-2',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {/* AI avatar */}
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 bg-ai-100 rounded-full
                                  flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={14} className="text-ai-600" />
                  </div>
                )}

                <div className={cn(
                  'max-w-[75%] flex flex-col gap-2'
                )}>
                  {/* Message bubble */}
                  <div className={cn(
                    'px-3 py-2 rounded-2xl text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-ai-600 text-white rounded-tr-sm'
                      : 'bg-secondary-100 text-secondary-800 rounded-tl-sm'
                  )}>
                    {msg.text}
                  </div>

                  {/* Book Now button for booking intent */}
                  {msg.requiresBooking && (
                    <button
                      onClick={() => {
                        const spec = msg.suggestedSpecialization || '';
                        navigate(`/patient/book?specialization=${spec}`);
                        setIsOpen(false);
                        
                      }}
                      className="text-xs bg-primary-600 text-white
                                 px-3 py-1.5 rounded-full font-medium
                                 hover:bg-primary-700 transition-colors
                                 self-start"
                    >
                      Book {msg.suggestedSpecialization || 'Appointment'} →
                    </button>
                  )}
                </div>

                {/* User avatar */}
                {msg.role === 'user' && (
                  <div className="w-7 h-7 bg-primary-100 rounded-full
                                  flex items-center justify-center shrink-0 mt-0.5">
                    <User size={14} className="text-primary-600" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2 items-center">
                <div className="w-7 h-7 bg-ai-100 rounded-full
                                flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-ai-600" />
                </div>
                <div className="bg-secondary-100 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 bg-secondary-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-secondary-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={loading}
                className="input flex-1 text-sm py-2"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center',
                  'transition-all duration-150 shrink-0',
                  input.trim() && !loading
                    ? 'bg-ai-600 text-white hover:bg-ai-700'
                    : 'bg-secondary-100 text-secondary-400 cursor-not-allowed'
                )}
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-xs text-secondary-400 text-center mt-2">
              Press Enter to send
            </p>
          </div>

        </div>
      )}

      {/* Welcome Popup */}
            {showPopup && !isOpen && (
            <div
                onClick={() => {
                setIsOpen(true);
                setShowPopup(false);
                }}
                className="bg-white shadow-xl border border-secondary-200
                        rounded-2xl px-4 py-3 max-w-xs cursor-pointer
                        animate-fadeIn"
            >
                <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-ai-100
                                flex items-center justify-center shrink-0">
                    <Bot size={18} className="text-ai-600" />
                </div>

                <div>
                    <p className="font-semibold text-sm text-secondary-900">
                    MediConnect AI
                    </p>

                    <p className="text-sm text-secondary-600 mt-1">
                    👋 Hey! Can I help you book an appointment or check symptoms?
                    </p>
                </div>
                </div>
            </div>
            )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-14 h-14 rounded-full flex items-center justify-center',
          'shadow-lg transition-all duration-200',
          'hover:scale-110 active:scale-95',
          isOpen
            ? 'bg-secondary-700 text-white'
            : 'bg-ai-600 text-white'
        )}
        aria-label="Open AI chat"
      >
        {isOpen
          ? <X size={22} />
          : <MessageCircle size={22} />
        }
      </button>

    </div>
  );
}
