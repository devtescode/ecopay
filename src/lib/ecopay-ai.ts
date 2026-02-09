export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

export interface UserCredits {
  total: number;
  pending: number;
  redeemed: number;
}

const CREDIT_PER_PLASTIC = 1;
const NAIRA_PER_PLASTIC = 0.5;
const MIN_SUBMISSION = 100;
const REDEMPTION_THRESHOLD = 1000;

type Intent =
  | "recycling_question"
  | "credit_inquiry"
  | "plastic_submission"
  | "redemption_request"
  | "human_support"
  | "greeting"
  | "unrelated";

function detectIntent(message: string): Intent {
  const lower = message.toLowerCase();

  if (/^(hi|hello|hey|good\s*(morning|afternoon|evening)|howdy)/i.test(lower)) return "greeting";
  if (/human|agent|support|speak.*person|talk.*someone/i.test(lower)) return "human_support";
  if (/redeem|cash\s*out|withdraw|reward|payout/i.test(lower)) return "redemption_request";
  if (/submit|drop.*off|recycle.*plastic|bring.*plastic|how.*submit|\d+\s*plastic/i.test(lower)) return "plastic_submission";
  if (/credit|balance|point|how\s*much|earned/i.test(lower)) return "credit_inquiry";
  if (/recycle|recycling|plastic|waste|environment|ecopay|location|where|address|drop/i.test(lower)) return "recycling_question";

  return "unrelated";
}

function extractQuantity(message: string): number | null {
  const match = message.match(/(\d+)\s*(plastic|bottle|item|piece)?s?/i);
  return match ? parseInt(match[1], 10) : null;
}

export function generateAIResponse(
  message: string,
  credits: UserCredits
): { response: string; updatedCredits?: Partial<UserCredits> } {
  const intent = detectIntent(message);

  switch (intent) {
    case "greeting":
      return {
        response:
          "Hello! 🌿 Welcome to Ecopay! I'm your recycling assistant. I can help you submit plastics, check your credits, or redeem your rewards. What would you like to do today?",
      };

    case "plastic_submission": {
      const qty = extractQuantity(message);
      if (!qty) {
        return {
          response:
            "I'd love to help you submit plastics! 🌱 How many plastic items do you have? Please provide a number (minimum 100 plastics per submission).",
        };
      }
      if (qty < MIN_SUBMISSION) {
        return {
          response: `You mentioned ${qty} plastics, but the minimum submission is **${MIN_SUBMISSION} plastics**. Keep collecting — you're almost there! 💪♻️`,
        };
      }
      const creditsEarned = qty * CREDIT_PER_PLASTIC;
      const cashValue = qty * NAIRA_PER_PLASTIC;
      return {
        response: `Great! You're submitting **${qty} plastics**.\n\n💰 You'll earn **${creditsEarned} credits** (₦${cashValue.toLocaleString()}).\n\nPlease drop off your plastics at our collection center in **Ilara Mokin, Ondo State**. Credits will be added after verification. ✅`,
        updatedCredits: { pending: credits.pending + creditsEarned },
      };
    }

    case "credit_inquiry":
      return {
        response: `Here's your credit summary 📊:\n\n✅ **Total Credits:** ${credits.total}\n⏳ **Pending:** ${credits.pending}\n🎁 **Redeemed:** ${credits.redeemed}\n💵 **Cash Value:** ₦${(credits.total * NAIRA_PER_PLASTIC).toLocaleString()}\n\n${
          credits.total >= REDEMPTION_THRESHOLD
            ? "🎉 You're eligible for redemption! Type **redeem** to get started."
            : `Keep recycling! You need **${REDEMPTION_THRESHOLD - credits.total} more credits** to redeem.`
        }`,
      };

    case "redemption_request":
      if (credits.total < REDEMPTION_THRESHOLD) {
        return {
          response: `You currently have **${credits.total} credits**. You need at least **${REDEMPTION_THRESHOLD} credits** to redeem. Keep recycling! 🌍♻️`,
        };
      }
      return {
        response:
          "🎉 You're eligible to redeem your credits! Choose an option:\n\n💵 **Cash** — An Ecopay agent will assist you\n🎁 **Rewards** — Browse available rewards\n\nType **cash** or **rewards** to proceed.",
      };

    case "human_support":
      return {
        response:
          "I'll connect you with an Ecopay agent right away. 🙋‍♂️\n\n**An Ecopay agent will assist you shortly.** Please hold on while we route your request.\n\n📍 You can also visit us at our office in **Ilara Mokin, Ondo State**.",
      };

    case "recycling_question":
      return {
        response:
          "Great question about recycling! ♻️ Here's how Ecopay works:\n\n1️⃣ **Collect** at least 100 plastic items\n2️⃣ **Submit** them at our center in Ilara Mokin, Ondo State\n3️⃣ **Earn** 1 credit per plastic (₦0.5 each)\n4️⃣ **Redeem** once you reach 1,000 credits\n\nNeed help with something specific? Just ask!",
      };

    case "unrelated":
    default:
      return {
        response:
          "I appreciate your message, but I'm here to help only with **Ecopay recycling services**. 🌿\n\nI can help you with:\n• Submitting plastics\n• Checking your credits\n• Redeeming rewards\n\nHow can I assist you with recycling today?",
      };
  }
}

export function createMessage(role: "user" | "ai", content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date(),
  };
}
