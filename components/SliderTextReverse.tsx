"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimationControls } from "framer-motion"

const textItems = [
  "love music",
  "knock2 fan",
  "likes to code",
  "burger lover",
  "book enthusiast",
  "meow meow meow",
  "wannabe youtubers",
  "brainrot skibidi",
  "cs2200 enjoyers",
  "kayne west homies",
]

export default function SliderTextReverse() {
  const controls = useAnimationControls()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const animate = async () => {
      const containerWidth = containerRef.current?.scrollWidth || 0
      const viewportWidth = containerRef.current?.offsetWidth || 0

      if (containerWidth > viewportWidth) {
        await controls.start({
          x: containerWidth,
          transition: {
            duration: 90,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          },
        })
      }
    }

    animate()

    // Re-run animation when window is resized
    const handleResize = () => {
      controls.stop()
      animate()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [controls])

  return (
    <div className="w-full overflow-hidden">
      <motion.div ref={containerRef} className="flex whitespace-nowrap" initial={{ x: "-100%" }} animate={controls}>
        {[...textItems, ...textItems].map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="inline-flex px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 mr-2 sm:mr-3 bg-black border-2 border-[#3A93FA] rounded-full"
          >
            <span className="text-xs sm:text-sm font-bold whitespace-nowrap">{item}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

