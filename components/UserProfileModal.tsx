"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { X, Share, MessageCircle, Heart } from "lucide-react"
import type { User } from "./StaticSlider"

interface UserProfileModalProps {
  isVisible: boolean
  onClose: () => void
  user: User
}

export default function UserProfileModal({ isVisible, onClose, user }: UserProfileModalProps) {
  const [isRendered, setIsRendered] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsRendered(true)
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden"
    } else {
      const timer = setTimeout(() => {
        setIsRendered(false)
      }, 300)
      // Re-enable body scrolling when modal is closed
      document.body.style.overflow = ""
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  if (!isRendered) return null

  return (
    <div
      className={`fixed inset-0 z-50 bg-black bg-opacity-70 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed bottom-0 left-0 right-0 max-h-[85vh] w-full max-w-md mx-auto overflow-y-auto bg-black border border-[#3A93FA] rounded-t-xl transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300">
            <X size={24} />
          </button>

          <div className="flex items-center mb-4">
            <div className="w-20 h-20 rounded-full overflow-hidden mr-4 bg-[#57D0FF]">
              <div className="w-full h-full relative">
                <Image src={user.profilePicture || "/placeholder.svg"} alt={user.name} fill className="object-cover" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-gray-400">{user.username}</p>
            </div>
          </div>

          <p className="text-lg text-white text-center font-semibold mb-6">{user.bio}</p>

          <div className="flex justify-around mb-6">
            <div className="flex flex-col items-center">
              <button className="p-2 rounded-full hover:bg-gray-800">
                <Share size={24} className="text-white" />
              </button>
              <span className="text-xs text-gray-400 mt-1">Share</span>
            </div>
            <div className="flex flex-col items-center">
              <button className="p-2 rounded-full hover:bg-gray-800">
                <MessageCircle size={24} className="text-white" />
              </button>
              <span className="text-xs text-gray-400 mt-1">Message</span>
            </div>
            <div className="flex flex-col items-center">
              <button className="p-2 rounded-full hover:bg-gray-800">
                <Heart size={24} className="text-white" />
              </button>
              <span className="text-xs text-gray-400 mt-1">Vibe</span>
            </div>
          </div>

          <div className="h-px bg-gray-800 my-4" />

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-white font-semibold mb-2">Looking for...</h3>
              <div className="border border-[#3A93FA] rounded-lg p-3 bg-black">
                <p className="text-gray-300 text-sm">{user.lookingFor}</p>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Music Taste</h3>
              <div className="flex flex-wrap gap-1">
                {user.musicTaste.map((genre, index) => (
                  <span key={index} className="bg-[#3A93FA] text-white text-xs px-2 py-1 rounded-full">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">What I Like</h3>
              <div className="border border-[#3A93FA] rounded-lg p-3 bg-black">
                <p className="text-gray-300 text-sm">{user.likes}</p>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Hobbies</h3>
              <div className="flex flex-wrap gap-1">
                {user.hobbies.map((hobby, index) => (
                  <span key={index} className="bg-[#3A93FA] text-white text-xs px-2 py-1 rounded-full">
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">What I Dislike</h3>
              <div className="border border-[#3A93FA] rounded-lg p-3 bg-black">
                <p className="text-gray-300 text-sm">{user.dislikes}</p>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Pets</h3>
              <div className="flex flex-wrap gap-1">
                {user.pets.map((pet, index) => (
                  <span key={index} className="bg-[#3A93FA] text-white text-xs px-2 py-1 rounded-full">
                    {pet}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-3">Must vibe facts</h3>
          <div className="space-y-3 mb-6">
            {user.vibeFacts.map((fact, index) => (
              <div key={index} className="border border-[#3A93FA] rounded-lg p-3 bg-black">
                <div className="text-[#3A93FA] font-bold mb-1">#{index + 1}</div>
                <p className="text-white">{fact}</p>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-bold text-white mb-3">Things I wanna show you</h3>
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="col-span-2 row-span-2">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={user.images[0] || "/placeholder.svg"}
                  alt={`${user.name}'s photo 1`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={user.images[1] || "/placeholder.svg"}
                  alt={`${user.name}'s photo 2`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <div className="aspect-square relative rounded-lg overflow-hidden">
                <Image
                  src={user.images[2] || "/placeholder.svg"}
                  alt={`${user.name}'s photo 3`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="col-span-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src={user.images[3] || "/placeholder.svg"}
                    alt={`${user.name}'s photo 4`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src={user.images[4] || "/placeholder.svg"}
                    alt={`${user.name}'s photo 5`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src={user.images[5] || "/placeholder.svg"}
                    alt={`${user.name}'s photo 6`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <button className="bg-[#3A93FA] text-white font-bold py-2 px-8 rounded-full">Connect</button>
          </div>
        </div>
      </div>
    </div>
  )
}
