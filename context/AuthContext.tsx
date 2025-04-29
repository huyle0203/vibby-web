"use client"

import { createContext, useState, useContext, useEffect, type ReactNode } from "react"
import { supabase, isSupabaseConfigured, isPreviewMode } from "@/lib/supabase"
import type { Session } from "@supabase/supabase-js"

interface User {
  id: string
  email?: string
  name?: string
  date_of_birth?: string
  gender?: "Woman" | "Man" | "Nonbinary"
  profile_picture?: string
  tags?: string[]
  images?: string[]
  facts?: string[]
  highlight_bio?: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  setUserData: (userData: Partial<User>) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// uses mock data in preview mode
const MOCK_USER: User = {
  id: "preview-user-id",
  email: "preview@example.com",
  name: "Preview User",
  profile_picture: "/images/penguin.png",
  highlight_bio: "This is a preview account for testing the UI without Supabase.",
  tags: ["Preview", "Testing", "Development"],
  images: ["/images/penguin.png", "/images/penguin.png", "/images/penguin.png"],
  facts: [
    "This is a mock user for preview mode",
    "No actual authentication is happening",
    "Set up Supabase to use real authentication",
  ],
  looking_for: "Friends to test this app with",
  likes: "Clean code, good documentation",
  dislikes: "Bugs, undefined behavior",
  gender: "Nonbinary",
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const preview = isPreviewMode()

  useEffect(() => {
    if (preview) {
      setUser(MOCK_USER)
      setLoading(false)
      return
    }

    if (!isSupabaseConfigured()) {
      console.warn("Supabase is not configured. Authentication will not work.")
      setLoading(false)
      return
    }

    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setSession(session)

        if (session?.user) {
          const { data, error } = await supabase.from("users").select("*").eq("id", session.user.id).single()

          if (!error && data) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              ...data,
            })
          } else {
            // if no user
            const { data: newUser, error: createError } = await supabase
              .from("users")
              .insert({
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata.full_name || session.user.email?.split("@")[0],
              })
              .select()
              .single()

            if (!createError && newUser) {
              setUser({
                id: session.user.id,
                email: session.user.email,
                ...newUser,
              })
            }
          }
        }
      } catch (error) {
        console.error("Error getting initial session:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)

      if (session?.user) {
        supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data, error }) => {
            if (!error && data) {
              setUser({
                id: session.user.id,
                email: session.user.email,
                ...data,
              })
            }
          })
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [preview])

  const signIn = async (email: string, password: string) => {
    if (preview) {
      setUser(MOCK_USER)
      return { success: true }
    }

    if (!isSupabaseConfigured()) {
      return { success: false, error: "Supabase is not configured. Authentication will not work." }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error("Error signing in:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  const signOut = async () => {
    if (preview) {
      setUser(null)
      return
    }

    await supabase.auth.signOut()
    setUser(null)
  }

  const setUserData = async (userData: Partial<User>) => {
    if (preview) {
      setUser((prevUser) => (prevUser ? { ...prevUser, ...userData } : null))
      return
    }

    if (!user?.id) return

    try {
      const { error } = await supabase.from("users").update(userData).eq("id", user.id)

      if (!error) {
        setUser((prevUser) => (prevUser ? { ...prevUser, ...userData } : null))
      }
    } catch (error) {
      console.error("Error updating user data:", error)
    }
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signOut,
        setUserData,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
