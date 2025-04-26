"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"

interface OwnProfileModalProps {
  isVisible: boolean
  onClose: () => void
  user: {
    name: string
    username: string
    bio: string
    profilePicture: string
    lookingFor: string
    likes: string
    dislikes: string
    tags: string[]
    images: string[]
    vibeFacts: string[]
  }
}

export default function OwnProfileModal({ isVisible, onClose, user }: OwnProfileModalProps) {
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isVisible])

  if (!isVisible) return null

  const renderInfoBox = (title: string, content: string) => (
    <div className="mb-3">
      <h3 className="text-white font-bold mb-1">{title}</h3>
      <div className="border border-primary rounded-lg p-3">
        <p className="text-gray-300">{content || "Not specified"}</p>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-end justify-center md:items-center">
      <div className="bg-black border-t-2 border-gray-800 md:border-2 md:border-gray-800 rounded-t-3xl md:rounded-xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-white z-10">
          <X size={24} />
        </button>

        <div className="overflow-auto p-4">
          <div className="flex items-center mb-4">
            <Image
              src={user.profilePicture || "/placeholder.svg"}
              alt={user.name}
              width={80}
              height={80}
              className="rounded-full mr-4"
            />
            <div>
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-gray-400">{user.username}</p>
            </div>
          </div>

          <p className="text-white text-lg text-center font-semibold mb-6">{user.bio}</p>

          <div className="h-px bg-gray-800 my-6"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-4">
              {renderInfoBox("Looking for...", user.lookingFor)}
              {renderInfoBox("What I Like", user.likes)}
              {renderInfoBox("What I Dislike", user.dislikes)}
            </div>
            <div>
              <h3 className="text-white font-bold mb-1">My Tags</h3>
              <div className="border border-primary rounded-lg p-3">
                <div className="flex flex-wrap gap-2">
                  {user.tags.map((tag, index) => (
                    <span key={index} className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-white text-lg font-bold mb-3">Must vibe facts</h3>
          <div className="space-y-3 mb-6">
            {user.vibeFacts.map((fact, index) => (
              <div key={index} className="border border-primary rounded-lg p-3">
                <div className="flex">
                  <span className="text-primary font-bold mr-2">#{index + 1}</span>
                  <p className="text-white">{fact}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-white text-lg font-bold mb-3">Things I wanna show you</h3>
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="col-span-2 row-span-2">
              <Image
                src={user.images[0] || "/images/penguin.png"}
                alt="Gallery 1"
                width={200}
                height={200}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <Image
                src={user.images[1] || "/images/penguin.png"}
                alt="Gallery 2"
                width={100}
                height={100}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <Image
                src={user.images[2] || "/images/penguin.png"}
                alt="Gallery 3"
                width={100}
                height={100}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <Image
                src={user.images[3] || "/images/penguin.png"}
                alt="Gallery 4"
                width={100}
                height={100}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <Image
                src={user.images[4] || "/images/penguin.png"}
                alt="Gallery 5"
                width={100}
                height={100}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <Image
                src={user.images[5] || "/images/penguin.png"}
                alt="Gallery 6"
                width={100}
                height={100}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <button className="bg-primary text-white font-bold py-2 px-6 rounded-full">Connect</button>
          </div>
        </div>
      </div>
    </div>
  )
}
