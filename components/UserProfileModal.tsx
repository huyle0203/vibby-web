"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import type { User } from "./StaticSlider"

interface UserProfileModalProps {
  isVisible: boolean
  onClose: () => void
  user: User
}

export default function UserProfileModal({ isVisible, onClose, user }: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState(0)

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-black border-2 border-[#3A93FA] rounded-xl p-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300">
          <X size={24} />
        </button>

        <div className="flex flex-col items-center mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
            <div className="w-full h-full relative">
              <Image src={user.profilePicture || "/placeholder.svg"} alt={user.name} fill className="object-cover" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white">{user.name}</h2>
          <p className="text-gray-400">{user.username}</p>
        </div>

        <div className="flex border-b border-gray-800 mb-4">
          <button
            className={`flex-1 py-2 ${activeTab === 0 ? "text-white border-b-2 border-[#3A93FA]" : "text-gray-500"}`}
            onClick={() => setActiveTab(0)}
          >
            About
          </button>
          <button
            className={`flex-1 py-2 ${activeTab === 1 ? "text-white border-b-2 border-[#3A93FA]" : "text-gray-500"}`}
            onClick={() => setActiveTab(1)}
          >
            Photos
          </button>
          <button
            className={`flex-1 py-2 ${activeTab === 2 ? "text-white border-b-2 border-[#3A93FA]" : "text-gray-500"}`}
            onClick={() => setActiveTab(2)}
          >
            Vibe Facts
          </button>
        </div>

        {activeTab === 0 && (
          <div className="text-white">
            <div className="mb-3">
              <h3 className="text-lg font-semibold mb-1">Bio</h3>
              <p>{user.bio}</p>
            </div>
            <div className="mb-3">
              <h3 className="text-lg font-semibold mb-1">Looking For</h3>
              <p>{user.lookingFor}</p>
            </div>
            <div className="mb-3">
              <h3 className="text-lg font-semibold mb-1">Music Taste</h3>
              <div className="flex flex-wrap gap-2">
                {user.musicTaste.map((genre, index) => (
                  <span key={index} className="bg-gray-800 px-2 py-1 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <h3 className="text-lg font-semibold mb-1">Likes</h3>
              <p>{user.likes}</p>
            </div>
            <div className="mb-3">
              <h3 className="text-lg font-semibold mb-1">Dislikes</h3>
              <p>{user.dislikes}</p>
            </div>
            <div className="mb-3">
              <h3 className="text-lg font-semibold mb-1">Hobbies</h3>
              <div className="flex flex-wrap gap-2">
                {user.hobbies.map((hobby, index) => (
                  <span key={index} className="bg-gray-800 px-2 py-1 rounded-full text-sm">
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div className="grid grid-cols-2 gap-2">
            {user.images.map((image, index) => (
              <div key={index} className="aspect-square relative rounded-md overflow-hidden">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${user.name}'s photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 2 && (
          <div className="text-white">
            <h3 className="text-lg font-semibold mb-2">Vibe Facts</h3>
            <ul className="list-disc pl-5 space-y-2">
              {user.vibeFacts.map((fact, index) => (
                <li key={index}>{fact}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button className="bg-[#3A93FA] text-white font-bold py-2 px-6 rounded-full">Connect</button>
        </div>
      </div>
    </div>
  )
}
