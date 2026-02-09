import { Package, Coins, Gift } from "lucide-react";

interface QuickActionsProps {
  onAction: (message: string) => void;
}

const actions = [
  { label: "Submit Plastics", icon: Package, message: "I want to submit plastics" },
  { label: "Check Credits", icon: Coins, message: "Check my credit balance" },
  { label: "Redeem Points", icon: Gift, message: "I want to redeem my credits" },
];

const QuickActions = ({ onAction }: QuickActionsProps) => (
  <div className="flex gap-2 flex-wrap px-1">
    {actions.map((action) => (
      <button
        key={action.label}
        onClick={() => onAction(action.message)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
      >
        <action.icon className="w-3.5 h-3.5" />
        {action.label}
      </button>
    ))}
  </div>
);

export default QuickActions;
