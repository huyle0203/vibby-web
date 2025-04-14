"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { useChatContext } from "@/context/ChatContext"
import { callOpenAIAssistant } from "@/utils/api"
import CustomTextInput from "@/components/CustomTextInput"
import StaticSlider, { type User } from "@/components/StaticSlider"
import UserProfileModal from "@/components/UserProfileModal"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function AIChatbotPage() {
  const { initialMessage, setInitialMessage } = useChatContext()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showBios, setShowBios] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // If there's an initial message, process it
    if (initialMessage) {
      handleInitialMessage()
    }
    // If there are no messages yet, add a welcome message
    else if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "Hi there! I'm Vibby, your friendly assistant. How can I help you find your vibe today?",
        },
      ])
    }
  }, [initialMessage])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleInitialMessage = async () => {
    const newMessage: Message = { role: "user", content: initialMessage }
    setMessages([newMessage])
    setInitialMessage("")
    await getAssistantResponse(initialMessage)
  }

  const handleSendMessage = async () => {
    if (inputText.trim() && !isLoading) {
      const newMessage: Message = { role: "user", content: inputText }
      setMessages((prevMessages) => [...prevMessages, newMessage])
      const currentInput = inputText
      setInputText("")
      await getAssistantResponse(currentInput)
    }
  }

  const getAssistantResponse = async (message: string) => {
    setIsLoading(true)
    try {
      const assistantMessage = await callOpenAIAssistant(message)
      const assistantResponses = assistantMessage.split("\n").filter((msg: string) => msg.trim() !== "")

      for (const response of assistantResponses) {
        const newAssistantMessage: Message = { role: "assistant", content: response }
        setMessages((prevMessages) => [...prevMessages, newAssistantMessage])

        if (response.includes("Vibby gotchu") || response.includes("Have a look at their bio")) {
          setShowBios(true)
        }

        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    } catch (error) {
      console.error("Error getting response from OpenAI Assistant:", error)
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
    setIsProfileModalVisible(true)
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <header className="flex items-center p-4 border-b border-gray-800">
        <button onClick={() => router.back()} className="mr-4 hover:text-gray-300">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Chat with Vibby</h1>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {messages.map((message, index) => (
            <div key={index} className={`flex mb-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                  <Image src="/images/penguin2.png" alt="Vibby" width={32} height={32} />
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                  message.role === "user" ? "bg-[#3A93FA]" : "bg-[#36454F]"
                }`}
              >
                <p>{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />

          {showBios && (
            <div className="my-6">
              <StaticSlider onUserSelect={handleUserSelect} />
            </div>
          )}
        </div>
      </main>

      <footer className="p-4 border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-2">
              <div className="animate-pulse flex space-x-2">
                <div className="h-2 w-2 bg-[#3A93FA] rounded-full"></div>
                <div className="h-2 w-2 bg-[#3A93FA] rounded-full animation-delay-200"></div>
                <div className="h-2 w-2 bg-[#3A93FA] rounded-full animation-delay-400"></div>
              </div>
            </div>
          ) : (
            <CustomTextInput
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onSubmit={handleSendMessage}
              placeholder="Type a message..."
              disabled={isLoading}
            />
          )}
        </div>
      </footer>

      {selectedUser && (
        <UserProfileModal
          isVisible={isProfileModalVisible}
          onClose={() => setIsProfileModalVisible(false)}
          user={selectedUser}
        />
      )}
    </div>
  )
}
