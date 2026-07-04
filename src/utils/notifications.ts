// Zomato-style Chatpate marketing alerts and order updates notifier
export const MARKETING_PROMPTS = [
  {
    title: "Sleepless tonight? ☕💤",
    body: "Don't worry, Dazeen coffee has 0.00% caffeine. Drink late, sleep like a baby!",
  },
  {
    title: "Chai lovers are crying! 😂☕",
    body: "Our Classic Velvet Blend smells so rich even tea enthusiasts are secretly adding it to cart. Try it now!",
  },
  {
    title: "Jitters? No thanks! 🛡️⚡",
    body: "Get 100% stomach acid-safe & 100% chemical-free Arabica. Pure aroma, zero anxiety!",
  },
  {
    title: "Your cart feels lonely... 🛒🥺",
    body: "Your coffee cup is waiting. Complete checkout now to claim active free delivery above ₹499!",
  },
  {
    title: "Dazeen Roastery is hot! 🔥🌰",
    body: "Fresh batch of Hazelnut Classic is freshly packed. Breathe in the aroma & grab yours!",
  },
  {
    title: "Shaam ki Chai? No, Shaam ki Coffee! 🌅☕",
    body: "Purified cleanly via Spring Water Method. Perfect post-dinner cozy vibes await you!"
  }
];

class NotificationSystem {
  private permitted: boolean = false;
  private marketingIntervalId: any = null;

  constructor() {
    if (typeof window !== "undefined" && "Notification" in window) {
      this.permitted = Notification.permission === "granted";
    }
  }

  async requestPermission(): Promise<boolean> {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permitted = permission === "granted";
      return this.permitted;
    } catch {
      return false;
    }
  }

  hasPermission(): boolean {
    return this.permitted;
  }

  send(title: string, body: string, icon = "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=128") {
    // Try Native Browser System Notification ONLY
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        try {
          new Notification(title, {
            body,
            icon,
            tag: "dazeen-" + Math.random(), // Unique tab notification
          });
        } catch (e) {
          console.warn("Browser notification failed:", e);
        }
      } else {
        console.log("No real notification permission granted yet to push:", title);
      }
    }
  }

  // Start the Zomato-style chatpate notifications loop every 1 minute (60,000 ms)
  startMarketingEngine() {
    if (this.marketingIntervalId) return;

    this.marketingIntervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * MARKETING_PROMPTS.length);
      const prompt = MARKETING_PROMPTS[randomIndex];
      this.send(prompt.title, prompt.body);
    }, 60000); // exactly 1 minute
  }

  stopMarketingEngine() {
    if (this.marketingIntervalId) {
      clearInterval(this.marketingIntervalId);
      this.marketingIntervalId = null;
    }
  }
}

export const notificationService = new NotificationSystem();
