import { ChatMessage } from "@/lib/ecopay-ai";
import { Leaf, User } from "lucide-react";

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

interface ChatBubbleProps {
  message: ChatMessage;
}

const ChatBubble = ({ message }: ChatBubbleProps) => {
  const isAI = message.role === "ai";

  return (
    <div
      className={`flex gap-2 ${isAI ? "justify-start animate-slide-in-left" : "justify-end animate-slide-in-right"}`}
    >
      {isAI && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full eco-gradient flex items-center justify-center mt-1">
          <Leaf className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      <div className="max-w-[80%] flex flex-col gap-1">
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
            isAI
              ? "eco-bubble-ai rounded-tl-md"
              : "eco-bubble-user rounded-tr-md"
          }`}
        >
          {message.content.split(/(\*\*.*?\*\*)/g).map((part, i) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={i} className="font-semibold">
                {part.slice(2, -2)}
              </strong>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </div>
        <span
          className={`text-[10px] text-muted-foreground px-1 ${
            isAI ? "text-left" : "text-right"
          }`}
        >
          {formatTime(message.timestamp)}
        </span>
      </div>
      {!isAI && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center mt-1">
          <User className="w-4 h-4 text-accent-foreground" />
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
