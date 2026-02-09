import { UserCredits } from "@/lib/ecopay-ai";
import { TrendingUp } from "lucide-react";

interface CreditBarProps {
  credits: UserCredits;
}

const GOAL = 10000;

const CreditBar = ({ credits }: CreditBarProps) => {
  const pct = Math.min((credits.total / GOAL) * 100, 100);

  return (
    <div className="bg-card border border-border rounded-xl p-3 mx-3 mb-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">
            {credits.total}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          ₦{(credits.total * 0.5).toLocaleString()} value
        </span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full eco-gradient rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground mt-1">
        {credits.total >= GOAL
          ? "🎉 You're eligible!"
          : `You need ${GOAL - credits.total} more Keep recycling! ♻️`}
        
      </p>
      {credits.pending > 0 && (
        <p className="text-[10px] text-muted-foreground">
          ⏳ {credits.pending} recycling submited
        </p>
      )}
    </div>
  );
};

export default CreditBar;
