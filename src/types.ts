export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number; // in INR
  rating: number;
  reviewsCount: number;
  image: string;
  roastLevel: "Light" | "Medium" | "Medium-Dark" | "Dark";
  aromaProfile: string[];
  benefits: string[];
  origin: string;
  process: string;
  caffeineCount: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BrewGuide {
  id: string;
  name: string;
  iconName: string; // Dynamic rendering via lucide icons
  ratio: string;
  temp: string;
  grind: string;
  timeSeconds: number;
  steps: string[];
}

export interface UserReview {
  id: string;
  name: string;
  rating: number;
  city: string;
  comment: string;
  date: string;
}
