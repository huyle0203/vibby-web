"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { motion, useAnimationControls } from "framer-motion"

interface SliderItem {
  id: number
  image: string
  name: string
  bio: string
}

const data: SliderItem[] = [
  { id: 1, image: "/images/penguin2.png", name: "Vibby", bio: "ur favorite car penguin that helps u vibe hahahaha" },
  { id: 2, image: "/images/kanna.jpeg", name: "Uyen", bio: "i wanna be a princess & im looking for a prince" },
  { id: 3, image: "/images/gigachad.png", name: "Archer", bio: "im a weeb and i love anime" },
  { id: 4, image: "/images/gigachad.png", name: "Devam", bio: "3rd year cs student bruh" },
  { id: 5, image: "/images/gigachad.png", name: "Jason", bio: "handsome Chinese boy" },
  { id: 6, image: "/images/gigachad.png", name: "Huy", bio: "the creator of this app lmao" },
]

export default function Slider() {
  const controls = useAnimationControls()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const startAnimation = async () => {
      const containerWidth = containerRef.current?.scrollWidth || 0
      const viewportWidth = containerRef.current?.offsetWidth || 0
      const distance = containerWidth - viewportWidth

      if (distance > 0) {
        await controls.start({
          x: -distance,
          transition: {
            duration: 80,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          },
        })
      }
    }

    startAnimation()

    const handleResize = () => {
      controls.stop()
      startAnimation()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [controls])

  return (
    <div className="w-full h-full overflow-hidden">
      <motion.div ref={containerRef} className="flex h-full" animate={controls}>
        {[...data, ...data].map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex-shrink-0 w-48 h-64 mr-8 p-1 border-2 border-[#3A93FA] rounded-md flex flex-col items-center justify-center"
          >
            <div className="w-36 h-36 rounded-full overflow-hidden bg-[#3A93FA] flex items-center justify-center mb-2">
              <div className="w-[97%] h-[97%] rounded-full overflow-hidden relative">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-1">{item.name}</h3>
            <p className="text-sm text-center line-clamp-2">{item.bio}</p>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
