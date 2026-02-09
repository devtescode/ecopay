import { Leaf } from "lucide-react";

const TypingIndicator = () => (
  <div className="flex gap-2 justify-start animate-fade-in-up">
    <div className="flex-shrink-0 w-8 h-8 rounded-full eco-gradient flex items-center justify-center">
      <Leaf className="w-4 h-4 text-primary-foreground" />
    </div>
    <div className="eco-bubble-ai px-4 py-3 rounded-2xl rounded-tl-md flex items-center gap-1">
      <div className="w-2 h-2 rounded-full bg-primary/60 typing-dot" />
      <div className="w-2 h-2 rounded-full bg-primary/60 typing-dot" />
      <div className="w-2 h-2 rounded-full bg-primary/60 typing-dot" />
    </div>
  </div>
);

export default TypingIndicator;
