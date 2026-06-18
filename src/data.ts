import { Product, BrewGuide, UserReview } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "dazeen-classic",
    name: "Classic Velvet Premium Blend",
    tagline: "Rich aroma of roasted hazelnuts and sweet caramel, with absolute zero jitters.",
    description: "Our signature blend sourced from our shade-grown estates. Savor the authentic aroma and bold structure of traditional Indian coffee, purified cleanly using the non-chemical Natural Water Extraction Method. Perfect for cozy evenings and post-dinner cravings.",
    price: 449,
    rating: 4.9,
    reviewsCount: 382,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600",
    roastLevel: "Medium",
    aromaProfile: ["Vanilla Pod", "Roasted Hazelnut", "Muted Toffeecorn"],
    benefits: ["Zero Sleep Disruption", "100% Stomach Acid-Safe", "Organic Carbon Safe", "Rich Crema Profile"],
    origin: "Western Ghats, Karnataka",
    process: "Chemical-Free Mountain Spring Extraction, 100% Arabica",
    caffeineCount: "0.0% Caffeine"
  },
  {
    id: "dazeen-dark",
    name: "Midnight Velvet Dark Roast",
    tagline: "Bold, intense blend of smoky dark chocolate and molasses for pure nocturnal comfort.",
    description: "A dark, heavy-bodied roast designed specifically for espresso heads and milk coffee lovers. Crafted from premium high-altitude beans, purified through water filtration to retain smoky tones and a heavy molasses body. Satisfies your late-night dark coffee cravings fully.",
    price: 479,
    rating: 4.8,
    reviewsCount: 247,
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=600",
    roastLevel: "Dark",
    aromaProfile: ["75% Dark Cocoa", "Charred Oak wood", "Dark Molasses"],
    benefits: ["Zero Heart Palpitations", "Heavy Espresso Crema", "Stands Tall with Milk", "Anxiety-Free Afternoons"],
    origin: "Baba Budangiri Highlands, India",
    process: "Carbon Dioxide Mountain-Spring Process, Organic PeaBerry Blend",
    caffeineCount: "0.0% Caffeine"
  },
  {
    id: "dazeen-hazelnut",
    name: "Hazelnut Bliss Gourmet Infusion",
    tagline: "Silky brew infused with premium toasted hazelnut oils and rich brown sugar finish.",
    description: "Enjoy a dreamy dessert-like cup! This medium-dark roast is infused with completely natural extracts of European hazelnuts right after the chemical-free caffeine-free water extraction process. Delightfully sweet, nutty, and completely free of caffeine or artificial sweeteners.",
    price: 499,
    rating: 4.9,
    reviewsCount: 412,
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=600",
    roastLevel: "Medium-Dark",
    aromaProfile: ["Crushed Hazelnut", "Toasted Pine", "Soft Brown Sugar"],
    benefits: ["Guilt-Free Sweetness", "Anxiety Relief Formula", "Perfect Dessert Swap", "Kid-Friendly Aromas"],
    origin: "Nilgiri Mountains range, Tamil Nadu",
    process: "Caffeine-Free Water Extraction + Artisan Natural Hazelnut Oil Infusion",
    caffeineCount: "0.0% Caffeine"
  },
  {
    id: "dazeen-irish",
    name: "Royal Irish Cream Reserve",
    tagline: "Sweet, buttery Irish whiskey and dense cream vibes, designed for deep royal sleep.",
    description: "An incredibly decadent blend reminding you of luxurious Irish cream liqueur. Created using liquid-CO2 extraction to keep the light, fruity, and floral notes of the Nilgiri beans intact, then glazed with premium natural cream flavoring. It feels like drinking a rich dessert without any sugar spikes or sleep loss.",
    price: 529,
    rating: 4.7,
    reviewsCount: 189,
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&q=80&w=600",
    roastLevel: "Medium",
    aromaProfile: ["Irish Liqueur Vibe", "Sweet Butterscotch", "Vanilla Custard"],
    benefits: ["Soothing Sleep Inducer", "Low-Acid Clean Sip", "Zero Artificial Scent", "Ultimate Luxury Aroma"],
    origin: "Biligirirangana Hills (BR Hills), Karnataka",
    process: "Liquid-CO2 Extraction, Micro-Batch Glazing",
    caffeineCount: "0.0% Caffeine"
  }
];

export const BREW_GUIDES: BrewGuide[] = [
  {
    id: "guide-french",
    name: "French Press",
    iconName: "FlameKindling", // Handled inside component
    ratio: "1:15 (15g Coffee / 225ml Water)",
    temp: "93°C (Active Simmer)",
    grind: "Coarse (like sea salt)",
    timeSeconds: 240,
    steps: [
      "Add 15g of coarse Dazeen caffeine-free powder to your press.",
      "Pour hot water (93°C) up to half of the press, soaking all coffee grounds.",
      "Let it bloom for 45 seconds to unlock vanilla vanilla and woody aromas.",
      "Fill the remaining water, stir gently, and place the lid on (do not plunge).",
      "Wait for 3 minutes, then slowly plunge all the way down. Pour immediately & enjoy!"
    ]
  },
  {
    id: "guide-south-filter",
    name: "Indian Filter Coffee",
    iconName: "CupSoda",
    ratio: "1:4 (20g Coffee / 80ml Water)",
    temp: "95°C (Boiling)",
    grind: "Fine-Medium (like sand)",
    timeSeconds: 600,
    steps: [
      "Add 20g of Dazeen powder to the upper compartment of your brass filter brass filter.",
      "Use the plunger disk to press the coffee powder down evenly.",
      "Pour 80ml of boiling water over the base and close the lid tightly.",
      "Allow 10 minutes for the rich, high-density decoction to collect in the lower cup.",
      "Froth the decoction with hot steaming milk and a spoonful of organic country sugar (Dabarah stay!)"
    ]
  },
  {
    id: "guide-pour-over",
    name: "Pour Over (V60)",
    iconName: "GlassWater",
    ratio: "1:12 (15g Coffee / 180ml Water)",
    temp: "91°C (Filtered)",
    grind: "Medium-Fine (like table salt)",
    timeSeconds: 150,
    steps: [
      "Place your filter paper in the V60 cone and rinse with hot water to remove paper taste.",
      "Add 15g of Dazeen powder, distribute flat, and place on weighing scale.",
      "Pour 40ml of water to bloom, waiting 30 seconds to release natural chocolate oils.",
      "Pour in circular motions, adding 70ml in the second pour and remaining 70ml in the final.",
      "Let the water filter completely. Clean, aromatic, jitter-free coffee cup is ready."
    ]
  },
  {
    id: "guide-cold-brew",
    name: "Instant Cold Brew",
    iconName: "Snowflake",
    ratio: "1:8 (50g Coffee / 400ml Water)",
    temp: "Room Temp / Ice Water",
    grind: "Extra Coarse",
    timeSeconds: 720, // 12 hours represented symbolically
    steps: [
      "Add 50g of extra-coarse Dazeen blend to an airtight jar or pitcher.",
      "Pour 400ml of cold filtered water, stirring to ensure thorough wetting.",
      "Seal the jar tightly and place in the refrigerator for 12 hours.",
      "Strain through a fine-mesh sieve or paper filter to remove sediment.",
      "Serve over ice cubes with a splash of almond milk or a slice of orange peel!"
    ]
  }
];

export const REVIEWS: UserReview[] = [
  {
    id: "rev-1",
    name: "Ramesh K.",
    rating: 5,
    city: "Bangalore",
    comment: "I had to quit coffee due to anxiety and sleepless nights. Dazeen saved my life. It tastes EXACTLY like freshly roasted South Indian filter coffee in Mysore. I can literally drink it at 9:30 PM and sleep like a baby by 10:30 PM! Absolute magic.",
    date: "14 June 2026"
  },
  {
    id: "rev-2",
    name: "Priya Sharma",
    rating: 5,
    city: "Mumbai",
    comment: "Being pregnant, my doctor strictly told me to limit coffee. Most alternative beans in Indian supermarkets taste stale, but Dazeen Classic Velvet was a revelation! Super chocolatey, thick body, and makes amazing iced lattes. Sourcing is brilliant.",
    date: "28 May 2026"
  },
  {
    id: "rev-3",
    name: "Anand Verma",
    rating: 5,
    city: "New Delhi",
    comment: "I was extremely skeptical about caffeine-free coffee thinking it's premium hot water. But Dazeen Hazelnut Infusion blew my mind. The toasted hazelnut oil smells divine in the morning. Best of all, my stress and evening jitters are completely gone.",
    date: "05 June 2026"
  },
  {
    id: "rev-4",
    name: "Sneha Patil",
    rating: 5,
    city: "Pune",
    comment: "Midnight Dark roast is rich, bold, and has gorgeous crema in my French Press. Low-acid processing means my stomach doesn't burn. Delivery to Pune was fast, beautiful hardboard tube packaging! 10/10 UX.",
    date: "10 June 2026"
  }
];
