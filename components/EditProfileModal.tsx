"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronRight, Edit } from "lucide-react"
import VibeFactEditModal from "./VibeFactEditModal"
import EditFieldModal from "./EditFieldModal"

interface UserData {
  id: string
  name?: string
  highlight_bio?: string
  looking_for?: string
  likes?: string
  dislikes?: string
  facts?: string[]
  images?: string[]
  tags?: string[]
}

interface EditProfileModalProps {
  isVisible: boolean
  onClose: () => void
  userImages: string[]
  onImagesUpdate: (images: string[]) => void
  user: UserData
}

const MAX_BIO_LENGTH = 50
const MAX_OTHER_LENGTH = 100

export default function EditProfileModal({
  isVisible,
  onClose,
  userImages,
  onImagesUpdate,
  user,
}: EditProfileModalProps) {
  const [activeTab, setActiveTab] = useState("Edit")
  const [name, setName] = useState(user?.name || "")
  const [bio, setBio] = useState(user?.highlight_bio || "")
  const [lookingFor, setLookingFor] = useState(user?.looking_for || "")
  const [likes, setLikes] = useState(user?.likes || "")
  const [dislikes, setDislikes] = useState(user?.dislikes || "")
  const [vibeFacts, setVibeFacts] = useState(user?.facts || ["", "", ""])
  const [editingFactIndex, setEditingFactIndex] = useState<number | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [changedFields, setChangedFields] = useState<Partial<UserData>>({})
  const [userTags, setUserTags] = useState<string[]>(user?.tags || [])

  useEffect(() => {
    if (!isVisible) {
      // Reset state when modal closes
      setActiveTab("Edit")
      setChangedFields({})
    }
  }, [isVisible])

  const handleTabPress = (tab: string) => {
    setActiveTab(tab)
  }

  const handleSave = async () => {
    // In a real app, you would save the changes to your backend
    console.log("Saving changes:", changedFields)
    onClose()
  }

  const handleFieldChange = (fieldName: string, value: string) => {
    setChangedFields((prev) => ({ ...prev, [fieldName]: value }))
  }

  const handleImageChange = (newImages: string[]) => {
    setChangedFields((prev) => ({ ...prev, images: newImages }))
    onImagesUpdate(newImages)
  }

  const renderTextInput = (
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    fieldName: string,
    maxLength: number,
  ) => (
    <div className="relative mb-4">
      <div className="border border-primary rounded-lg p-4 cursor-pointer" onClick={() => setEditingField(fieldName)}>
        <p className={`${!value ? "text-gray-500" : "text-white"}`}>{value || placeholder}</p>
      </div>
      <button
        className="absolute -top-2 -right-2 w-6 h-6 rounded-full border border-primary bg-black flex items-center justify-center"
        onClick={() => setEditingField(fieldName)}
      >
        <Edit size={10} className="text-white" />
      </button>
    </div>
  )

  const handleImagePick = async (index: number) => {
    // In a real app, you would implement image picking functionality
    // For now, we'll just use a placeholder
    const newImages = [...userImages]
    newImages[index] = "/images/penguin.png"
    handleImageChange(newImages)
  }

  const renderPhotoBox = (index: number) => (
    <div
      key={index}
      className="w-[calc(33.333%-8px)] aspect-square border-2 border-primary rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
      onClick={() => handleImagePick(index)}
    >
      {userImages[index] ? (
        <Image
          src={userImages[index] || "/placeholder.svg"}
          alt={`Photo ${index + 1}`}
          width={100}
          height={100}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="text-white opacity-70 text-3xl">+</div>
      )}
    </div>
  )

  const handleEditFact = (index: number) => {
    setEditingFactIndex(index)
  }

  const handleSaveFact = (index: number, newFact: string) => {
    const newFacts = [...vibeFacts]
    newFacts[index] = newFact.slice(0, MAX_OTHER_LENGTH)
    setVibeFacts(newFacts)
    setChangedFields((prev) => ({ ...prev, facts: newFacts }))
    setEditingFactIndex(null)
  }

  const handleSaveField = (fieldName: string, value: string) => {
    switch (fieldName) {
      case "name":
        setName(value)
        break
      case "highlight_bio":
        setBio(value.slice(0, MAX_BIO_LENGTH))
        break
      case "looking_for":
        setLookingFor(value.slice(0, MAX_OTHER_LENGTH))
        break
      case "likes":
        setLikes(value.slice(0, MAX_OTHER_LENGTH))
        break
      case "dislikes":
        setDislikes(value.slice(0, MAX_OTHER_LENGTH))
        break
    }
    handleFieldChange(fieldName, value)
    setEditingField(null)
  }

  const handleTagsPress = () => {
    // In a real app, you would navigate to a tag selection screen
    console.log("Navigate to tag selection")
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-end justify-center">
      <div className="bg-black border-t-2 border-gray-800 rounded-t-3xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col animate-slide-up">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <button className="text-white" onClick={onClose}>
            Cancel
          </button>
          <h2 className="text-primary font-bold text-lg">Edit Profile</h2>
          <button className="text-white" onClick={handleSave}>
            Save
          </button>
        </div>

        <div className="flex border-b border-gray-800">
          <button
            className={`flex-1 py-3 text-center ${activeTab === "Edit" ? "text-white" : "text-gray-500"}`}
            onClick={() => handleTabPress("Edit")}
          >
            Edit
            {activeTab === "Edit" && <div className="h-0.5 bg-primary mt-2 mx-auto w-1/2"></div>}
          </button>
          <button
            className={`flex-1 py-3 text-center ${activeTab === "View" ? "text-white" : "text-gray-500"}`}
            onClick={() => handleTabPress("View")}
          >
            View
            {activeTab === "View" && <div className="h-0.5 bg-primary mt-2 mx-auto w-1/2"></div>}
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {activeTab === "Edit" ? (
            <>
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-2">
                  <Image
                    src={user.profile_picture || "/images/penguin.png"}
                    alt="Profile"
                    width={100}
                    height={100}
                    className="rounded-full opacity-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                    </div>
                  </div>
                </div>
                <button className="text-primary">Change photo</button>
              </div>

              {renderTextInput(name, setName, "Name", "name", MAX_OTHER_LENGTH)}
              {renderTextInput(bio, setBio, "Bio", "highlight_bio", MAX_BIO_LENGTH)}

              <h3 className="font-bold text-white mb-2 mt-4">My Tags</h3>
              <div className="border border-primary rounded-lg p-4 mb-4 flex items-center justify-between">
                <div className="flex flex-wrap gap-2 flex-1">
                  {userTags.length > 0 ? (
                    userTags.map((tag, index) => (
                      <span key={index} className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">Add tags</span>
                  )}
                </div>
                <button onClick={handleTagsPress}>
                  <ChevronRight className="text-primary" size={24} />
                </button>
              </div>

              <h3 className="font-bold text-white mb-2">Looking for...</h3>
              {renderTextInput(lookingFor, setLookingFor, "What are you looking for?", "looking_for", MAX_OTHER_LENGTH)}

              <h3 className="font-bold text-white mb-2">What I Like</h3>
              {renderTextInput(likes, setLikes, "What do you like?", "likes", MAX_OTHER_LENGTH)}

              <h3 className="font-bold text-white mb-2">What I Dislike</h3>
              {renderTextInput(dislikes, setDislikes, "What do you dislike?", "dislikes", MAX_OTHER_LENGTH)}

              <h3 className="font-bold text-white mb-2">Must Vibe Facts</h3>
              {vibeFacts.map((fact, index) => (
                <div key={index} className="relative mb-4">
                  <div
                    className="border border-primary rounded-lg p-4 flex items-center cursor-pointer"
                    onClick={() => handleEditFact(index)}
                  >
                    <p className={`flex-1 ${!fact ? "text-gray-500" : "text-white"}`}>{fact || `Fact #${index + 1}`}</p>
                    <span className="text-primary font-bold ml-2">#{index + 1}</span>
                  </div>
                  <button
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full border border-primary bg-black flex items-center justify-center"
                    onClick={() => handleEditFact(index)}
                  >
                    <Edit size={10} className="text-white" />
                  </button>
                </div>
              ))}

              <h3 className="font-bold text-white mb-2">Things I wanna show u</h3>
              <div className="flex flex-wrap gap-3 mb-6">{[...Array(6)].map((_, index) => renderPhotoBox(index))}</div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-white text-lg">View Content</p>
            </div>
          )}
        </div>
      </div>

      <VibeFactEditModal
        isVisible={editingFactIndex !== null}
        onClose={() => setEditingFactIndex(null)}
        factIndex={editingFactIndex !== null ? editingFactIndex : 0}
        initialFact={editingFactIndex !== null ? vibeFacts[editingFactIndex] : ""}
        onSave={handleSaveFact}
      />

      <EditFieldModal
        isVisible={editingField !== null}
        onClose={() => setEditingField(null)}
        fieldName={editingField || ""}
        initialValue={
          editingField === "name"
            ? name
            : editingField === "highlight_bio"
              ? bio
              : editingField === "looking_for"
                ? lookingFor
                : editingField === "likes"
                  ? likes
                  : editingField === "dislikes"
                    ? dislikes
                    : ""
        }
        onSave={handleSaveField}
        maxLength={editingField === "highlight_bio" ? MAX_BIO_LENGTH : MAX_OTHER_LENGTH}
      />
    </div>
  )
}
