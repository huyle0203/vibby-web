import { createClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = "https://qdqkducinygdrodjojqe.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkcWtkdWNpbnlnZHJvZGpvanFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgyNzIzNDAsImV4cCI6MjA0Mzg0ODM0MH0.dobssfXWyjzsvV9zSMA1WO9XaMbGBMISXbDkAcANzsI"

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase environment variables are missing. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
  )
}

// Create a client with fallback values for development/preview
export const supabase = createClient(
  supabaseUrl || "https://placeholder-url.supabase.co",
  supabaseAnonKey || "placeholder-key",
)

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!supabaseUrl && !!supabaseAnonKey
}

// Helper function to check if we're in preview mode
export const isPreviewMode = (): boolean => {
  // Check if we're in a Vercel preview environment
  if (typeof window !== "undefined") {
    // Client-side check
    return (
      window.location.hostname.includes("vercel.app") ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    )
  }

  // Server-side check
  return process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" || process.env.NODE_ENV === "development"
}
