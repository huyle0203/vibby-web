"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowLeft, Menu, Edit, Share2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import EditProfileModal from "@/components/EditProfileModal"
import OwnProfileModal from "@/components/OwnProfileModal"
import SettingsModal from "@/components/SettingsModal"
import PostItem from "@/components/PostItem"
import { fetchUserProfile, fetchUserFacts, fetchUserImages, fetchUserTags } from "@/services/userService"
import { fetchUserPosts } from "@/services/postService"
import { isSupabaseConfigured, isPreviewMode } from "@/lib/supabase"

// mock data in preview mode
const MOCK_POSTS = [
  {
    id: "preview-post-1",
    content: "This is a preview post to demonstrate the UI without Supabase.",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    average_vibe: 85,
    vibe_count: 12,
    comment_count: 5,
    images: ["/images/penguin.png"],
  },
  {
    id: "preview-post-2",
    content: "Set up Supabase to see real posts and user data!",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    average_vibe: 92,
    vibe_count: 8,
    comment_count: 3,
    images: [],
  },
]

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState(0)
  const [isEditProfileModalVisible, setIsEditProfileModalVisible] = useState(false)
  const [isOwnProfileModalVisible, setIsOwnProfileModalVisible] = useState(false)
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [userImages, setUserImages] = useState<string[]>([])
  const [userTags, setUserTags] = useState<string[]>([])
  const [vibeFacts, setVibeFacts] = useState<string[]>([])
  const [userPosts, setUserPosts] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [highlightBio, setHighlightBio] = useState<string | null>(null)

  const tabs = ["Threads", "Replies", "Repost"]
  const preview = isPreviewMode()

  useEffect(() => {
    if (user && !loading) {
      if (isPreviewMode()) {
        setUserProfile({
          name: user.name,
          profile_picture: user.profile_picture,
          highlight_bio: user.highlight_bio,
          looking_for: user.looking_for,
          likes: user.likes,
          dislikes: user.dislikes,
        })
        setHighlightBio(user.highlight_bio || null)
        setUserImages(user.images || [])
        setUserTags(user.tags || [])
        setVibeFacts(user.facts || [])
        setUserPosts(MOCK_POSTS)
      } else {
        // fetches real (not mock) data
        fetchUserData()
      }
    }
  }, [user, loading])

  const fetchUserData = async () => {
    if (!user || !user.id) return
    if (!isSupabaseConfigured() && !isPreviewMode()) {
      console.error("Supabase is not configured. Cannot fetch user data.")
      return
    }

    setRefreshing(true)
    try {
      const [profileResult, factsResult, imagesResult, tagsResult, postsResult] = await Promise.all([
        fetchUserProfile(user.id),
        fetchUserFacts(user.id),
        fetchUserImages(user.id),
        fetchUserTags(user.id),
        fetchUserPosts(user.id),
      ])

      if (profileResult.success && profileResult.data) {
        setHighlightBio(profileResult.data.highlight_bio || null)
        setUserProfile(profileResult.data)
      }

      if (factsResult.success && factsResult.facts) {
        setVibeFacts(factsResult.facts)
      }

      if (imagesResult.success && imagesResult.urls) {
        setUserImages(imagesResult.urls)
      }

      if (tagsResult.success && tagsResult.tags) {
        setUserTags(tagsResult.tags)
      }

      if (postsResult.success && postsResult.posts) {
        setUserPosts(postsResult.posts)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setRefreshing(false)
    }
  }

  const handleTabPress = (index: number) => {
    setActiveTab(index)
  }

  const handleEditProfilePress = () => {
    setIsEditProfileModalVisible(true)
  }

  const handleProfilePicturePress = () => {
    setIsOwnProfileModalVisible(true)
  }

  const handleOpenSettingsModal = () => {
    setIsSettingsModalVisible(true)
  }

  const handleCloseEditProfileModal = () => {
    setIsEditProfileModalVisible(false)
    fetchUserData()
  }

  // displays when loading
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white items-center justify-center">
        <p className="text-xl">Loading profile...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white items-center justify-center">
        {!isSupabaseConfigured() && !isPreviewMode() ? (
          <div className="text-center p-4">
            <p className="text-xl mb-4 text-yellow-500">Supabase is not configured</p>
            <p className="mb-4">
              Please make sure you've set the following environment variables in your Vercel project:
            </p>
            <ul className="list-disc list-inside mb-4 text-left">
              <li>NEXT_PUBLIC_SUPABASE_URL</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            </ul>
            <p>You can find these values in your Supabase project settings.</p>
          </div>
        ) : (
          <>
            <p className="text-xl mb-4">Please log in to view your profile</p>
            <button onClick={() => router.push("/login")} className="px-6 py-2 bg-primary rounded-lg">
              Log In
            </button>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <button onClick={() => router.back()} className="hover:text-gray-300">
          <ArrowLeft size={24} />
        </button>
        <button onClick={handleOpenSettingsModal} className="hover:text-gray-300">
          <Menu size={24} />
        </button>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col items-center py-6">
            <button onClick={handleProfilePicturePress} className="relative mb-4">
              <Image
                src={user.profile_picture || "/images/penguin.png"}
                alt="Profile"
                width={100}
                height={100}
                className="rounded-full"
              />
            </button>
            <h1 className="text-2xl font-bold mb-1">{user.name || "User"}</h1>
            <p className="text-gray-400 mb-3">{user.email || "@username"}</p>
            <p className="text-center px-6 mb-6">{highlightBio || "No bio available"}</p>

            <div className="flex w-full max-w-md gap-4 px-4 mb-6">
              <button
                onClick={handleEditProfilePress}
                className="flex-1 py-2 border border-primary rounded-lg flex items-center justify-center gap-2"
              >
                <Edit size={16} />
                <span>Edit profile</span>
              </button>
              <button className="flex-1 py-2 border border-primary rounded-lg flex items-center justify-center gap-2">
                <Share2 size={16} />
                <span>Share profile</span>
              </button>
            </div>

            <div className="w-full border-b border-gray-800">
              <div className="flex">
                {tabs.map((tab, index) => (
                  <button
                    key={tab}
                    className={`flex-1 py-3 text-center relative ${
                      activeTab === index ? "text-white" : "text-gray-500"
                    }`}
                    onClick={() => handleTabPress(index)}
                  >
                    {tab}
                    {activeTab === index && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></div>}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full p-4">
              {activeTab === 0 && (
                <div className="space-y-4">
                  {userPosts.length > 0 ? (
                    userPosts.map((post) => (
                      <PostItem
                        key={post.id}
                        id={post.id}
                        username={user.name || "User"}
                        content={post.content}
                        createdAt={post.created_at}
                        averageVibe={post.average_vibe}
                        vibeCount={post.vibe_count}
                        commentCount={post.comment_count || 0}
                        userPhoto={user.profile_picture || "/images/penguin.png"}
                        images={post.images}
                      />
                    ))
                  ) : (
                    <p className="text-center py-8 text-gray-400">No posts yet</p>
                  )}
                </div>
              )}
              {activeTab === 1 && <p className="text-center py-8 text-gray-400">No replies yet</p>}
              {activeTab === 2 && <p className="text-center py-8 text-gray-400">No reposts yet</p>}
            </div>
          </div>
        </div>
      </main>

      {(userProfile || preview) && (
        <>
          <EditProfileModal
            isVisible={isEditProfileModalVisible}
            onClose={handleCloseEditProfileModal}
            userImages={userImages}
            onImagesUpdate={setUserImages}
            user={{
              id: user.id,
              name: user.name,
              highlight_bio: highlightBio || "",
              looking_for: user.looking_for || "",
              likes: user.likes || "",
              dislikes: user.dislikes || "",
              facts: vibeFacts,
              images: userImages,
              tags: userTags,
            }}
          />

          <OwnProfileModal
            isVisible={isOwnProfileModalVisible}
            onClose={() => setIsOwnProfileModalVisible(false)}
            user={{
              name: user.name || "User",
              username: user.email || "@username",
              bio: highlightBio || "No bio available",
              profilePicture: user.profile_picture || "/images/penguin.png",
              lookingFor: user.looking_for || "",
              likes: user.likes || "",
              dislikes: user.dislikes || "",
              tags: userTags,
              images: userImages,
              vibeFacts: vibeFacts,
            }}
          />
        </>
      )}

      <SettingsModal isVisible={isSettingsModalVisible} onClose={() => setIsSettingsModalVisible(false)} />
    </div>
  )
}
