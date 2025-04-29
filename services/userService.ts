import { supabase, isPreviewMode } from "@/lib/supabase"

interface UserData {
  id: string
  email?: string
  name?: string
  date_of_birth?: string
  gender?: "Woman" | "Man" | "Nonbinary"
  profile_picture?: string
  highlight_bio?: string
  looking_for?: string
  likes?: string
  dislikes?: string
  tags?: string[]
  images?: string[]
  facts?: string[]
}

export const getUserData = async (userId: string): Promise<{ success: boolean; msg?: string; data?: UserData }> => {
  if (isPreviewMode()) {
    return {
      success: true,
      data: {
        id: userId,
        name: "Preview User",
        email: "preview@example.com",
        profile_picture: "/images/penguin.png",
      },
    }
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, email, name, date_of_birth, gender, profile_picture")
      .eq("id", userId)
      .single()

    if (error) {
      return { success: false, msg: error?.message }
    }

    return { success: true, data: data as UserData }
  } catch (error) {
    console.error("Error fetching user data:", error)
    return { success: false, msg: (error as Error).message }
  }
}

export const fetchUserProfile = async (
  userId: string,
): Promise<{ success: boolean; data?: Partial<UserData>; msg?: string }> => {
  if (isPreviewMode()) {
    return {
      success: true,
      data: {
        name: "Preview User",
        profile_picture: "/images/penguin.png",
        highlight_bio: "This is a preview account for testing the UI without Supabase.",
        looking_for: "Friends to test this app with",
        likes: "Clean code, good documentation",
        dislikes: "Bugs, undefined behavior",
      },
    }
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("name, profile_picture, highlight_bio, looking_for, likes, dislikes")
      .eq("id", userId)
      .single()

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return { success: false, msg: (error as Error).message }
  }
}

export const updateUserData = async (userId: string, updateData: Partial<UserData>) => {
  if (isPreviewMode()) {
    return { success: true, data: { id: userId, ...updateData } }
  }

  try {
    const { data, error } = await supabase.from("users").update(updateData).eq("id", userId).select().single()

    if (error) {
      return { success: false, msg: error?.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error updating user data:", error)
    return { success: false, msg: (error as Error).message }
  }
}

export const fetchUserHighlightBio = async (
  userId: string,
): Promise<{ success: boolean; highlightBio?: string; msg?: string }> => {
  if (isPreviewMode()) {
    return { success: true, highlightBio: "This is a preview account for testing the UI without Supabase." }
  }

  try {
    const { data, error } = await supabase.from("users").select("highlight_bio").eq("id", userId).single()

    if (error) {
      throw error
    }

    return { success: true, highlightBio: data?.highlight_bio || "" }
  } catch (error) {
    console.error("Error fetching user highlight bio:", error)
    return { success: false, msg: (error as Error).message }
  }
}

export const fetchUserFacts = async (userId: string): Promise<{ success: boolean; facts?: string[]; msg?: string }> => {
  if (isPreviewMode()) {
    return {
      success: true,
      facts: [
        "This is a mock user for preview mode",
        "No actual authentication is happening",
        "Set up Supabase to use real authentication",
      ],
    }
  }

  try {
    const { data, error } = await supabase.from("users").select("facts").eq("id", userId).single()

    if (error) {
      throw error
    }

    return { success: true, facts: data?.facts || [] }
  } catch (error) {
    console.error("Error fetching user facts:", error)
    return { success: false, msg: (error as Error).message }
  }
}

export const fetchUserImages = async (userId: string): Promise<{ success: boolean; urls?: string[]; msg?: string }> => {
  if (isPreviewMode()) {
    return { success: true, urls: ["/images/penguin.png", "/images/penguin.png", "/images/penguin.png"] }
  }

  try {
    const { data, error } = await supabase.from("users").select("images").eq("id", userId).single()

    if (error) {
      throw error
    }

    return { success: true, urls: data?.images || [] }
  } catch (error) {
    console.error("Error fetching user images:", error)
    return { success: false, msg: (error as Error).message }
  }
}

export const fetchUserTags = async (userId: string): Promise<{ success: boolean; tags?: string[]; msg?: string }> => {
  if (isPreviewMode()) {
    return { success: true, tags: ["Preview", "Testing", "Development"] }
  }

  try {
    const { data, error } = await supabase.from("users").select("tags").eq("id", userId).single()

    if (error) {
      throw error
    }

    return { success: true, tags: data?.tags || [] }
  } catch (error) {
    console.error("Error fetching user tags:", error)
    return { success: false, msg: (error as Error).message }
  }
}

export const updateUserTags = async (
  userId: string,
  tags: string[],
): Promise<{ success: boolean; tags?: string[]; msg?: string }> => {
  if (isPreviewMode()) {
    return { success: true, tags }
  }

  try {
    const { error } = await supabase.from("users").update({ tags }).eq("id", userId)

    if (error) {
      throw error
    }

    return { success: true, tags }
  } catch (error) {
    console.error("Error updating user tags:", error)
    return { success: false, msg: (error as Error).message }
  }
}

export const updateUserImages = async (
  userId: string,
  images: string[],
): Promise<{ success: boolean; urls?: string[]; msg?: string }> => {
  if (isPreviewMode()) {
    return { success: true, urls: images }
  }

  try {
    const { error } = await supabase.from("users").update({ images }).eq("id", userId)

    if (error) {
      throw error
    }

    return { success: true, urls: images }
  } catch (error) {
    console.error("Error updating user images:", error)
    return { success: false, msg: (error as Error).message }
  }
}

export const uploadProfileImage = async (
  userId: string,
  file: File,
): Promise<{ success: boolean; url?: string; msg?: string }> => {
  if (isPreviewMode()) {
    return { success: true, url: "/images/penguin.png" }
  }

  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `${userId}/${fileName}`

    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (uploadError) {
      throw uploadError
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath)

    if (!urlData.publicUrl) {
      throw new Error("Failed to get public URL")
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({ profile_picture: urlData.publicUrl })
      .eq("id", userId)

    if (updateError) {
      throw updateError
    }

    return { success: true, url: urlData.publicUrl }
  } catch (error) {
    console.error("Error uploading profile image:", error)
    return { success: false, msg: (error as Error).message }
  }
}
