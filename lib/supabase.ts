import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://qdqkducinygdrodjojqe.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkcWtkdWNpbnlnZHJvZGpvanFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgyNzIzNDAsImV4cCI6MjA0Mzg0ODM0MH0.dobssfXWyjzsvV9zSMA1WO9XaMbGBMISXbDkAcANzsI"

// validates environment vars
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase environment variables are missing. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
  )
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder-url.supabase.co",
  supabaseAnonKey || "placeholder-key",
)

export const isSupabaseConfigured = (): boolean => {
  return !!supabaseUrl && !!supabaseAnonKey
}

export const isPreviewMode = (): boolean => {
  if (typeof window !== "undefined") {
    return (
      window.location.hostname.includes("vercel.app") ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    )
  }

  return process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" || process.env.NODE_ENV === "development"
}
