"use client"

import { useState, useEffect } from "react"
import { X, Search, Plus, Loader2 } from "lucide-react"
import { updateUserTags } from "@/services/userService"
import { useAuth } from "@/context/AuthContext"

interface TagSelectionModalProps {
  isVisible: boolean
  onClose: () => void
  initialTags: string[]
  onTagsUpdate: (tags: string[]) => void
}

// Tag categories with emojis
const categories = [
  {
    title: "Hobbies",
    tags: [
      { name: "sleeping", emoji: "😴" },
      { name: "baking", emoji: "🍰" },
      { name: "calligraphy", emoji: "✒️" },
      { name: "dancing", emoji: "💃" },
      { name: "embroidery", emoji: "🧵" },
      { name: "fishing", emoji: "🎣" },
      { name: "gardening", emoji: "🌱" },
      { name: "hiking", emoji: "🥾" },
      { name: "ice skating", emoji: "⛸️" },
      { name: "joking", emoji: "😂" },
      { name: "kiting", emoji: "🪁" },
      { name: "languages", emoji: "🗣️" },
      { name: "painting", emoji: "🎨" },
      { name: "photography", emoji: "📷" },
      { name: "reading", emoji: "📚" },
      { name: "singing", emoji: "🎤" },
      { name: "swimming", emoji: "🏊" },
      { name: "traveling", emoji: "✈️" },
      { name: "writing", emoji: "✍️" },
      { name: "yoga", emoji: "🧘" },
      { name: "cooking", emoji: "👨‍🍳" },
      { name: "drawing", emoji: "✏️" },
      { name: "knitting", emoji: "🧶" },
      { name: "meditation", emoji: "🧘‍♀️" },
    ],
  },
  {
    title: "Music Taste",
    tags: [
      { name: "pop", emoji: "🎵" },
      { name: "rock", emoji: "🎸" },
      { name: "hip-hop", emoji: "🎤" },
      { name: "jazz", emoji: "🎷" },
      { name: "classical", emoji: "🎻" },
      { name: "country", emoji: "🤠" },
      { name: "electronic", emoji: "🎛️" },
      { name: "R&B", emoji: "🎶" },
      { name: "indie", emoji: "🎹" },
      { name: "metal", emoji: "🤘" },
      { name: "folk", emoji: "🪕" },
      { name: "blues", emoji: "🎺" },
      { name: "reggae", emoji: "🇯🇲" },
      { name: "punk", emoji: "🔊" },
      { name: "soul", emoji: "💖" },
      { name: "alternative", emoji: "🎼" },
      { name: "EDM", emoji: "💿" },
      { name: "Latin", emoji: "💃" },
      { name: "K-pop", emoji: "🇰🇷" },
      { name: "J-pop", emoji: "🇯🇵" },
      { name: "gospel", emoji: "🙏" },
      { name: "funk", emoji: "🕺" },
      { name: "disco", emoji: "🪩" },
      { name: "ambient", emoji: "🌙" },
    ],
  },
  {
    title: "Pets",
    tags: [
      { name: "cats", emoji: "🐱" },
      { name: "dogs", emoji: "🐶" },
      { name: "birds", emoji: "🐦" },
      { name: "ponies", emoji: "🐴" },
      { name: "reptiles", emoji: "🦎" },
      { name: "rabbits", emoji: "🐰" },
      { name: "lizards", emoji: "🦎" },
      { name: "snakes", emoji: "🐍" },
      { name: "foxes", emoji: "🦊" },
      { name: "mice", emoji: "🐭" },
      { name: "fish", emoji: "🐠" },
      { name: "penguins", emoji: "🐧" },
      { name: "hamsters", emoji: "🐹" },
      { name: "guinea pigs", emoji: "🐹" },
      { name: "ferrets", emoji: "🐾" },
      { name: "turtles", emoji: "🐢" },
      { name: "hedgehogs", emoji: "🦔" },
      { name: "parrots", emoji: "🦜" },
      { name: "gerbils", emoji: "🐁" },
      { name: "chinchillas", emoji: "🐭" },
    ],
  },
  {
    title: "Values & Traits",
    tags: [
      { name: "kind", emoji: "😊" },
      { name: "honest", emoji: "🤥" },
      { name: "creative", emoji: "🎨" },
      { name: "ambitious", emoji: "🚀" },
      { name: "loyal", emoji: "🤝" },
      { name: "patient", emoji: "⏳" },
      { name: "confident", emoji: "💪" },
      { name: "humble", emoji: "🙏" },
      { name: "optimistic", emoji: "😃" },
      { name: "adventurous", emoji: "🏔️" },
      { name: "compassionate", emoji: "❤️" },
      { name: "determined", emoji: "🎯" },
      { name: "empathetic", emoji: "🤗" },
      { name: "resilient", emoji: "🌱" },
      { name: "curious", emoji: "🧐" },
      { name: "adaptable", emoji: "🦎" },
      { name: "reliable", emoji: "🤞" },
      { name: "open-minded", emoji: "🧠" },
      { name: "passionate", emoji: "🔥" },
      { name: "respectful", emoji: "🙌" },
      { name: "authentic", emoji: "💯" },
      { name: "generous", emoji: "🎁" },
      { name: "courageous", emoji: "🦁" },
      { name: "thoughtful", emoji: "💭" },
    ],
  },
]

const MIN_TAGS = 1
const MAX_TAGS = 12
const INITIAL_VISIBLE_TAGS = 12

export default function TagSelectionModal({ isVisible, onClose, initialTags, onTagsUpdate }: TagSelectionModalProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags || [])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCategories, setFilteredCategories] = useState(categories)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (isVisible) {
      setSelectedTags(initialTags || [])
      setSearchQuery("")
      setError(null)
    }
  }, [isVisible, initialTags])

  useEffect(() => {
    if (searchQuery) {
      const filtered = categories
        .map((category) => ({
          ...category,
          tags: category.tags.filter((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase())),
        }))
        .filter((category) => category.tags.length > 0)
      setFilteredCategories(filtered)
    } else {
      setFilteredCategories(categories)
    }
  }, [searchQuery])

  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagName)) {
        return prev.filter((t) => t !== tagName)
      } else if (prev.length < MAX_TAGS) {
        return [...prev, tagName]
      }
      return prev
    })
  }

  const addCustomTag = () => {
    if (searchQuery && !selectedTags.includes(searchQuery)) {
      if (selectedTags.length < MAX_TAGS) {
        setSelectedTags((prev) => [...prev, searchQuery])
        setSearchQuery("")
      }
    }
  }

  const toggleCategoryExpansion = (categoryTitle: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryTitle) ? prev.filter((title) => title !== categoryTitle) : [...prev, categoryTitle],
    )
  }

  const handleSave = async () => {
    if (!user?.id) {
      setError("User ID is missing. Please try logging in again.")
      return
    }

    if (selectedTags.length < MIN_TAGS) {
      setError(`Please select at least ${MIN_TAGS} tag.`)
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const result = await updateUserTags(user.id, selectedTags)
      if (result.success) {
        onTagsUpdate(selectedTags)
        onClose()
      } else {
        throw new Error(result.msg || "Failed to update tags")
      }
    } catch (error) {
      console.error("Error updating tags:", error)
      setError((error as Error).message)
    } finally {
      setIsSaving(false)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[60] bg-black bg-opacity-80 flex items-center justify-center p-4">
      <div className="bg-black border-2 border-primary rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-fade-in">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-white text-lg font-bold">Edit Your Tags</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 border-b border-gray-800">
          <div className="relative mb-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or add custom tags"
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg pl-10 pr-4 py-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addCustomTag()
                }
              }}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            {searchQuery && (
              <button
                onClick={addCustomTag}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary-dark"
                disabled={selectedTags.length >= MAX_TAGS}
              >
                <Plus size={18} />
              </button>
            )}
          </div>

          <div className="flex justify-between items-center">
            <span className={`text-sm ${selectedTags.length === MAX_TAGS ? "text-red-500" : "text-gray-400"}`}>
              {selectedTags.length}/{MAX_TAGS} tags chosen
            </span>
            {error && <span className="text-sm text-red-500">{error}</span>}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {selectedTags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-2">Selected Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => toggleTag(tag)}
                    className="bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    <span>{tag}</span>
                    <X size={14} className="ml-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredCategories.map((category, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-white font-semibold text-lg mb-3">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.tags
                  .slice(0, expandedCategories.includes(category.title) ? undefined : INITIAL_VISIBLE_TAGS)
                  .map((tag, tagIndex) => (
                    <button
                      key={tagIndex}
                      onClick={() => toggleTag(tag.name)}
                      className={`px-3 py-1 rounded-full text-sm border ${
                        selectedTags.includes(tag.name)
                          ? "bg-primary text-white border-primary"
                          : "bg-transparent text-white border-primary"
                      }`}
                    >
                      {tag.emoji} {tag.name}
                    </button>
                  ))}
              </div>
              {category.tags.length > INITIAL_VISIBLE_TAGS && (
                <button
                  onClick={() => toggleCategoryExpansion(category.title)}
                  className="text-primary hover:underline mt-2 text-sm"
                >
                  {expandedCategories.includes(category.title) ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 p-4 border-t border-gray-800">
          <button onClick={onClose} className="px-4 py-2 border border-primary rounded-lg text-white">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || selectedTags.length < MIN_TAGS}
            className="px-4 py-2 bg-primary rounded-lg text-white flex items-center disabled:opacity-50"
          >
            {isSaving && <Loader2 size={16} className="mr-2 animate-spin" />}
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
