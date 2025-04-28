"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Slider from "@/components/Slider"
import SliderText from "@/components/SliderText"
import SliderTextReverse from "@/components/SliderTextReverse"
import CustomTextInput from "@/components/CustomTextInput"
import { useChatContext } from "@/context/ChatContext"

export default function HomePage() {
  const [textValue, setTextValue] = useState("")
  const router = useRouter()
  const { setInitialMessage } = useChatContext()

  const handleSubmit = () => {
    if (textValue.trim()) {
      setInitialMessage(textValue)
      router.push("/ai-chatbot")
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-black text-white p-4">
      <div className="w-full max-w-5xl flex flex-col items-center h-full">
        <h1 className="text-4xl md:text-5xl font-bold text-center mt-4 md:mt-10 mb-4 md:mb-8">
          Find and <br /> be Found.
        </h1>

        <div className="w-full flex-1 flex flex-col">
          <div className="w-full h-64 mb-4 overflow-hidden">
            <Slider />
          </div>

          <div className="w-full flex flex-col gap-2 mb-4">
            <SliderText />
            <SliderTextReverse />
          </div>

          <div className="w-full h-px bg-gray-800 my-4" />
        </div>

        <div className="w-full max-w-md mb-4 md:mb-8">
          <CustomTextInput
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            onSubmit={handleSubmit}
            placeholder="Tell Vibby who you are looking for..."
          />
        </div>
      </div>
    </main>
  )
}
