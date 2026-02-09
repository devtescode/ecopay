import { useState } from "react";
import { Leaf, Trash2, MoreVertical } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChatHeaderProps {
  onClearChat: () => void;
}

const ChatHeader = ({ onClearChat }: ChatHeaderProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <header className="eco-gradient px-4 py-3 flex items-center gap-3 shadow-md">
        <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
          <Leaf className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h1 className="text-primary-foreground font-display font-bold text-base">
            Ecopay
          </h1>
          <p className="text-primary-foreground/70 text-xs">
            Your recycling assistant • Ilara Mokin
          </p>
        </div>
        <button
          onClick={() => setShowConfirm(true)}
          className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
          title="Clear chat"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </header>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear chat history?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all messages and reset your credits. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onClearChat}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear Chat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ChatHeader;
