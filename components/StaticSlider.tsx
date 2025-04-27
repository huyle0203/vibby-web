"use client"

import { useState } from "react"
import Image from "next/image"

export interface User {
  id: number
  name: string
  username: string
  bio: string
  profilePicture: string
  lookingFor: string
  musicTaste: string[]
  likes: string
  dislikes: string
  hobbies: string[]
  pets: string[]
  images: string[]
  vibeFacts: string[]
}

const data: User[] = [
  {
    id: 1,
    profilePicture: "/images/penguin2.png",
    name: "Vibby",
    username: "@vibby",
    bio: "ur favorite cat penguin that helps u vibe",
    lookingFor: "New friends to vibe with",
    musicTaste: ["EDM", "Pop", "K-pop"],
    likes: "Dancing, coding, anime",
    dislikes: "Negativity, cold weather",
    hobbies: ["Coding", "Dancing", "Watching anime"],
    pets: ["Virtual pet penguin"],
    images: ["/images/penguin2.png", "/images/penguin2.png", "/images/penguin2.png"],
    vibeFacts: [
      "I can speak 5 languages fluently",
      "I've never eaten a fish",
      "I can solve a Rubik's cube in under a minute",
    ],
  },
  {
    id: 2,
    profilePicture: "/images/kanna.jpeg",
    name: "Uyen",
    username: "@princess_uyen",
    bio: "i wanna be a princess & im looking for a prince",
    lookingFor: "My prince charming",
    musicTaste: ["Disney soundtracks", "Classical"],
    likes: "Tiaras, ballgowns, fairy tales",
    dislikes: "Frogs (unless they're princes)",
    hobbies: ["Singing", "Dancing", "Reading fairy tales"],
    pets: ["A royal corgi"],
    images: ["/images/kanna.jpeg", "/images/kanna.jpeg", "/images/kanna.jpeg"],
    vibeFacts: [
      "I've watched every Disney movie at least 10 times",
      "I can recite the entire script of 'Frozen'",
      "I once met a real prince at a charity event",
    ],
  },
  {
    id: 3,
    profilePicture: "/images/gigachad.png",
    name: "Buzz",
    username: "@buzz_gt",
    bio: "Cant wait to rock this semester",
    lookingFor: "GT friends who love Buzz",
    musicTaste: ["J-pop", "Anime OSTs"],
    likes: "Cosplay, manga collecting",
    dislikes: "People who say anime is just cartoons",
    hobbies: ["Cosplaying", "Reading manga", "Learning Japanese"],
    pets: ["A Shiba Inu named Naruto"],
    images: ["/images/gigachad.png", "/images/gigachad.png", "/images/gigachad.png"],
    vibeFacts: [
      "I've been to Japan 7 times for anime conventions",
      "My manga collection has over 1000 volumes",
      "I once cosplayed for 30 days straight",
    ],
  },
  {
    id: 4,
    profilePicture: "/images/penguin2.png",
    name: "Devam",
    username: "@dev_am",
    bio: "3rd year cs student bruh",
    lookingFor: "Study groups, hackathon partners",
    musicTaste: ["Lo-fi", "Indie rock"],
    likes: "Coding challenges, coffee",
    dislikes: "Bugs, all-nighters (but still do them)",
    hobbies: ["Coding", "Playing chess", "Solving puzzles"],
    pets: ["A rubber duck for debugging"],
    images: ["/images/penguin2.png", "/images/penguin2.png", "/images/penguin2.png"],
    vibeFacts: [
      "I've won 3 hackathons in the past year",
      "I can type at 120 WPM",
      "I once debugged code in my sleep (literally)",
    ],
  },
  {
    id: 5,
    profilePicture: "/images/penguin2.png",
    name: "Jason",
    username: "@jason_chen",
    bio: "handsome Chinese boy",
    lookingFor: "Friends to explore the city with",
    musicTaste: ["Mandopop", "R&B"],
    likes: "Photography, street food",
    dislikes: "Early mornings, spicy food",
    hobbies: ["Photography", "Exploring new restaurants", "Learning languages"],
    pets: ["A goldfish named Nemo"],
    images: ["/images/penguin2.png", "/images/penguin2.png", "/images/penguin2.png"],
    vibeFacts: [
      "I've tried over 500 different street foods",
      "My photos have been featured in National Geographic",
      "I can do a backflip on command",
    ],
  },
  {
    id: 6,
    profilePicture: "/images/penguin2.png",
    name: "Huy",
    username: "@huy_creator",
    bio: "the creator of this app lmao",
    lookingFor: "Beta testers, fellow developers",
    musicTaste: ["Electronic", "Synthwave"],
    likes: "App development, UI/UX design",
    dislikes: "Spaghetti code, scope creep",
    hobbies: ["Coding", "Designing UIs", "Playing video games"],
    pets: ["A cat named Pixel"],
    images: ["/images/penguin2.png", "/images/penguin2.png", "/images/penguin2.png"],
    vibeFacts: [
      "I've launched 5 apps in the past year",
      "I can code in 10 different programming languages",
      "I once stayed awake for 72 hours straight to finish a project",
    ],
  },
]

interface StaticSliderProps {
  onUserSelect: (user: User) => void
}

export default function StaticSlider({ onUserSelect }: StaticSliderProps) {
  const [displayedItems, setDisplayedItems] = useState(3)

  const handleShowMore = () => {
    setDisplayedItems((prevItems) => Math.min(prevItems + 3, data.length))
  }

  return (
    <div className="w-full">
      <div className="flex overflow-x-auto pb-4 hide-scrollbar">
        {data.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-48 h-64 mr-8 p-1 border-2 border-[#3A93FA] rounded-md flex flex-col items-center justify-center bg-black cursor-pointer"
            onClick={() => onUserSelect(item)}
          >
            <div className="w-36 h-36 rounded-full overflow-hidden flex items-center justify-center mb-2 bg-black">
              <div className="w-[80%] h-[80%] relative">
                <Image
                  src={item.profilePicture || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
            </div>
            <h3 className="text-lg font-bold text-center mb-1 text-white">{item.name}</h3>
            <p className="text-sm text-center text-white line-clamp-2">{item.bio}</p>
          </div>
        ))}
      </div>

      {displayedItems < data.length && (
        <button
          className="bg-[#3A93FA] px-4 py-2 rounded-full mt-4 mb-6 mx-auto block font-bold text-white"
          onClick={handleShowMore}
        >
          Show Me More!
        </button>
      )}

      {displayedItems > 3 && (
        <div className="flex overflow-x-auto pb-4 mt-4 hide-scrollbar">
          {data.slice(3, displayedItems).map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-48 h-64 mr-8 p-1 border-2 border-[#3A93FA] rounded-md flex flex-col items-center justify-center bg-black cursor-pointer"
              onClick={() => onUserSelect(item)}
            >
              <div className="w-36 h-36 rounded-full overflow-hidden flex items-center justify-center mb-2 bg-black">
                <div className="w-[80%] h-[80%] relative">
                  <Image
                    src={item.profilePicture || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
              </div>
              <h3 className="text-lg font-bold text-center mb-1 text-white">{item.name}</h3>
              <p className="text-sm text-center text-white line-clamp-2">{item.bio}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
