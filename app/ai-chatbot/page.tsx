"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function AIChatbotPage() {
  const router = useRouter()
  const [initialMessage, setInitialMessage] = useState("")

  useEffect(() => {
    // Get the initial message from localStorage
    const message = localStorage.getItem("initialMessage")
    if (message) {
      setInitialMessage(message)
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="flex items-center p-4 border-b border-gray-800">
        <button onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Chat with Vibby</h1>
      </header>

      <main className="flex-1 p-4">
        {initialMessage && (
          <div className="mb-4 p-3 bg-gray-900 rounded-lg max-w-[80%]">
            <p>You: {initialMessage}</p>
          </div>
        )}
        <div className="p-3 bg-blue-900 rounded-lg max-w-[80%] ml-auto">
          <p>Vibby: Hi there! I'm Vibby, your friendly assistant. How can I help you today?</p>
        </div>
      </main>

      <footer className="p-4 border-t border-gray-800">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 p-3 bg-gray-900 rounded-l-lg border-0 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button className="bg-[#3A93FA] text-white p-3 rounded-r-lg">Send</button>
        </div>
      </footer>
    </div>
  )
}

