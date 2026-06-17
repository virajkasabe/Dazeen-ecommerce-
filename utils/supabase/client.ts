import { createBrowserClient } from "@supabase/ssr";

const getEnv = (key: string): string => {
  if (typeof import.meta !== "undefined" && (import.meta as any).env && (import.meta as any).env[key]) {
    return (import.meta as any).env[key];
  }
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return "";
};

const supabaseUrl = getEnv("VITE_SUPABASE_URL") || getEnv("NEXT_PUBLIC_SUPABASE_URL") || "https://yoqyiavhxpqkdjawugjd.supabase.co";
const supabaseKey = getEnv("VITE_SUPABASE_ANON_KEY") || getEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") || "sb_publishable_Yh7JwtRFzyvgeTpYWVBiSg_HnpWfpSr";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey
  );
