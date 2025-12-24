'use client';

import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/header';
import { BackButton } from '@/components/back-button';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "👋 Hi! I'm your AI investment assistant. I can help you with:\n\n• Finding the right mutual funds\n• Understanding investment terms\n• Comparing fund performance\n• Answering investment questions\n\nWhat would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const BASE_URL = 'https://mutualfun-backend.vercel.app';
      const API_URL = (
        process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/api`
          : `${BASE_URL}/api`
      ).replace(/\/+$/, '');
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage.content,
          context: {
            conversationHistory: messages.slice(-4).map((m) => ({
              role: m.role,
              content: m.content,
            })),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const apiResponse = await response.json();

      // Extract data from API response (handle both {data: {...}} and direct response)
      const data = apiResponse.data || apiResponse;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.followUpQuestions && data.followUpQuestions.length > 0) {
        const followUpMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: `💡 You might also want to ask:\n${data.followUpQuestions
            .map((q: string, i: number) => `${i + 1}. ${q}`)
            .join('\n')}`,
          timestamp: new Date(),
        };
        setTimeout(() => {
          setMessages((prev) => [...prev, followUpMessage]);
        }, 500);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    'What are the best equity funds?',
    'How does SIP work?',
    'Compare large cap vs mid cap funds',
    'What is expense ratio?',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-red-600">
      <Header />

      <main className="mx-auto max-w-6xl px-2 sm:px-4 py-3 sm:py-6">
        <div className="mb-3 sm:mb-4 px-2">
          <BackButton />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg mb-1 sm:mb-2 mt-2">
            AI Investment Assistant
          </h1>
          <p className="text-white/80 text-xs sm:text-sm">
            Get instant answers about mutual funds, investments, and financial
            planning
          </p>
        </div>

        {/* Full-Page Chat Interface */}
        <div className="rounded-xl sm:rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-2 border-white/30 h-[calc(100vh-180px)] sm:h-[calc(100vh-220px)] flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-t-xl sm:rounded-t-2xl">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base sm:text-lg">
                AI Investment Assistant
              </h2>
              <p className="text-xs text-white/80">
                Powered by GPT-4 • Always online
              </p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-md'
                  }`}
                >
                  <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-2 ${
                      message.role === 'user'
                        ? 'text-white/70'
                        : 'text-gray-500'
                    }`}
                    suppressHydrationWarning
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-md">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Suggested Questions */}
            {messages.length === 1 && !isLoading && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  💡 Try asking:
                </p>
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputValue(question);
                      inputRef.current?.focus();
                    }}
                    className="block w-full text-left text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 hover:shadow-md transition-all min-h-[44px] flex items-center"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-2 sm:p-3 lg:p-4 border-t-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-xl sm:rounded-b-2xl">
            <div className="flex gap-1.5 sm:gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about investments..."
                className="flex-1 rounded-lg sm:rounded-xl border-2 focus:border-purple-400 h-10 sm:h-11 lg:h-12 text-sm sm:text-base"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-10 sm:h-11 lg:h-12 px-3 sm:px-4 lg:px-6 min-w-[44px]"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
