import { useState, useRef, useEffect, useCallback } from "react";
import { Send } from "lucide-react";
import ChatHeader from "@/components/ChatHeader";
import ChatBubble from "@/components/ChatBubble";
import TypingIndicator from "@/components/TypingIndicator";
import QuickActions from "@/components/QuickActions";
import CreditBar from "@/components/CreditBar";
import {
  ChatMessage,
  UserCredits,
  generateAIResponse,
  createMessage,
} from "@/lib/ecopay-ai";

const STORAGE_KEY_MESSAGES = "ecopay-chat-messages";
const STORAGE_KEY_CREDITS = "ecopay-credits";

const DEFAULT_CREDITS: UserCredits = { total: 250, pending: 0, redeemed: 0 };

const WELCOME_MESSAGE = createMessage(
  "ai",
  "Hello! 🌿 Welcome to Ecopay — turning your plastic waste into real value!\n\nI can help you:\n• Submit plastics for recycling\n• Check your credit balance\n• Redeem your rewards\n\nWhat would you like to do today?"
);

function loadMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MESSAGES);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
    }
  } catch {}
  return [WELCOME_MESSAGE];
}

function loadCredits(): UserCredits {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CREDITS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_CREDITS;
}

const Index = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [credits, setCredits] = useState<UserCredits>(loadCredits);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  }, []);

  useEffect(scrollToBottom, [messages, isTyping, scrollToBottom]);

  // Persist messages & credits to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CREDITS, JSON.stringify(credits));
  }, [credits]);

  const clearChat = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setCredits(DEFAULT_CREDITS);
    localStorage.removeItem(STORAGE_KEY_MESSAGES);
    localStorage.removeItem(STORAGE_KEY_CREDITS);
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      const userMsg = createMessage("user", trimmed);
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      setTimeout(() => {
        const { response, updatedCredits } = generateAIResponse(trimmed, credits);
        if (updatedCredits) {
          setCredits((prev) => ({ ...prev, ...updatedCredits }));
        }
        const aiMsg = createMessage("ai", response);
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
      }, 1200 + Math.random() * 800);
    },
    [credits, isTyping]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-background shadow-2xl">
      <ChatHeader onClearChat={clearChat} />
      <CreditBar credits={credits} />

      {/* Chat Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto eco-chat-surface px-3 py-4 space-y-4"
      >
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Quick Actions */}
      <div className="bg-background border-t border-border py-2 px-2">
        <QuickActions onAction={sendMessage} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="bg-background border-t border-border px-3 py-3 flex gap-2"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-secondary text-foreground placeholder:text-muted-foreground rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring transition-shadow"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="w-10 h-10 rounded-full eco-gradient flex items-center justify-center text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default Index;
