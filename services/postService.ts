import { supabase, isPreviewMode } from "@/lib/supabase"

interface PostData {
  userId: string
  content: string
  images?: string[]
}

const MOCK_POSTS = [
  {
    id: "preview-post-1",
    user_id: "preview-user-id",
    content: "This is a preview post to demonstrate the UI without Supabase.",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    average_vibe: 85,
    vibe_count: 12,
    comment_count: 5,
    images: ["/images/penguin.png"],
  },
  {
    id: "preview-post-2",
    user_id: "preview-user-id",
    content: "Set up Supabase to see real posts and user data!",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    average_vibe: 92,
    vibe_count: 8,
    comment_count: 3,
    images: [],
  },
]

export const createPost = async (postData: PostData): Promise<{ success: boolean; data?: any; msg?: string }> => {
  if (isPreviewMode()) {
    return {
      success: true,
      data: {
        id: `preview-post-${Date.now()}`,
        user_id: postData.userId,
        content: postData.content,
        images: postData.images || [],
        created_at: new Date().toISOString(),
        average_vibe: 0,
        vibe_count: 0,
        comment_count: 0,
      },
    }
  }

  try {
    const { userId, content, images } = postData

    if (content.length > 500) {
      throw new Error("Post content exceeds 500 character limit")
    }

    if (images && images.length > 5) {
      throw new Error("Maximum of 5 images allowed per post")
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({
        user_id: userId,
        content: content,
        images: images || [],
      })
      .select()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error creating post:", error)
    return { success: false, msg: (error as Error).message }
  }
}

export const fetchUserPosts = async (userId: string): Promise<{ success: boolean; posts?: any[]; msg?: string }> => {
  if (isPreviewMode()) {
    return { success: true, posts: MOCK_POSTS }
  }

  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return { success: true, posts: data }
  } catch (error) {
    console.error("Error fetching user posts:", error)
    return { success: false, msg: (error as Error).message }
  }
}

export const getPostWithAverageVibe = async (postId: string) => {
  if (isPreviewMode()) {
    const mockPost = MOCK_POSTS.find((post) => post.id === postId) || MOCK_POSTS[0]
    return {
      success: true,
      post: {
        ...mockPost,
        user: {
          name: "Preview User",
          profile_picture: "/images/penguin.png",
        },
      },
    }
  }

  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*, user:users(name, profile_picture)")
      .eq("id", postId)
      .single()

    if (error) throw error

    return { success: true, post: data }
  } catch (error) {
    console.error("Error fetching post with average vibe:", error)
    return { success: false, error: (error as Error).message }
  }
}

export const updatePostVibe = async (postId: string, userId: string, vibePercentage: number) => {
  if (isPreviewMode()) {
    return {
      success: true,
      averageVibe: vibePercentage,
      vibeCount: 1,
    }
  }

  try {
    const { error: upsertError } = await supabase
      .from("post_vibes")
      .upsert({ post_id: postId, user_id: userId, vibe_percentage: vibePercentage }, { onConflict: "post_id,user_id" })

    if (upsertError) {
      throw upsertError
    }

    const { data: vibes, error: vibesError } = await supabase
      .from("post_vibes")
      .select("vibe_percentage")
      .eq("post_id", postId)

    if (vibesError) {
      throw vibesError
    }

    const vibeCount = vibes.length
    const averageVibe = vibes.reduce((sum, vibe) => sum + vibe.vibe_percentage, 0) / vibeCount

    const { error: updateError } = await supabase
      .from("posts")
      .update({
        average_vibe: averageVibe,
        vibe_count: vibeCount,
      })
      .eq("id", postId)

    if (updateError) {
      throw updateError
    }

    return { success: true, averageVibe, vibeCount }
  } catch (error) {
    console.error("Error in updatePostVibe:", error)
    return { success: false, error: (error as Error).message }
  }
}

export const uploadPostImage = async (
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

    const { error: uploadError } = await supabase.storage.from("post-images").upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    })

    if (uploadError) {
      throw uploadError
    }

    const { data: urlData } = supabase.storage.from("post-images").getPublicUrl(filePath)

    if (!urlData.publicUrl) {
      throw new Error("Failed to get public URL")
    }

    return { success: true, url: urlData.publicUrl }
  } catch (error) {
    console.error("Error uploading post image:", error)
    return { success: false, msg: (error as Error).message }
  }
}
