"use client"

import { useState } from "react"
import Image from "next/image"
import { MoreHorizontal, MessageCircle, PowerIcon as Pulse, X } from "lucide-react"
import { timeAgo } from "@/utils/timeAgo"

interface PostItemProps {
  id: string
  username: string
  content: string
  createdAt: string
  commentCount: number
  userPhoto: string
  images?: string[]
  averageVibe?: number
  vibeCount?: number
}

export default function PostItem({
  id,
  username,
  content,
  createdAt,
  commentCount,
  userPhoto,
  images = [],
  averageVibe,
  vibeCount,
}: PostItemProps) {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)

  const handleImagePress = (image: string) => {
    setZoomedImage(image)
  }

  const closeZoomedImage = () => {
    setZoomedImage(null)
  }

  return (
    <div className="border-b border-gray-800 py-4">
      <div className="flex">
        <Image
          src={userPhoto || "/placeholder.svg"}
          alt={username}
          width={40}
          height={40}
          className="rounded-full mr-3"
        />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <span className="font-bold text-white">{username}</span>
              <span className="text-gray-500 ml-1">· {timeAgo(createdAt)}</span>
            </div>
            <button>
              <MoreHorizontal className="text-white" size={20} />
            </button>
          </div>
          <p className="text-white mb-3">{content}</p>

          {images.length > 0 && (
            <div className="flex overflow-x-auto mb-3 space-x-2 pb-2 hide-scrollbar">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-48 h-64 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => handleImagePress(image)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Post image ${index + 1}`}
                    width={192}
                    height={256}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <Pulse className="text-primary mr-1" size={18} />
              <span className="text-primary text-sm">
                {averageVibe !== undefined ? `${averageVibe.toFixed(1)}% (${vibeCount})` : "No vibes yet"}
              </span>
            </div>
            <div className="flex items-center">
              <MessageCircle className="text-white mr-1" size={18} />
              <span className="text-white text-sm">{commentCount}</span>
            </div>
          </div>
        </div>
      </div>

      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={closeZoomedImage}
        >
          <div className="relative max-w-full max-h-full">
            <Image
              src={zoomedImage || "/placeholder.svg"}
              alt="Zoomed image"
              width={800}
              height={800}
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              className="absolute top-4 right-4 bg-black bg-opacity-50 rounded-full p-2"
              onClick={closeZoomedImage}
            >
              <X className="text-white" size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
