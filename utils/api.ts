import axios from "axios"

// Create a function to safely access environment variables
const getEnvVariable = (name: string): string => {
  const value = process.env[name]
  if (!value) {
    console.warn(`Environment variable ${name} is not set`)
    return ""
  }
  return value
}

// Get API key and Assistant ID from environment variables
const OPENAI_API_KEY = getEnvVariable("NEXT_PUBLIC_OPENAI_API_KEY")
const ASSISTANT_ID = getEnvVariable("NEXT_PUBLIC_ASSISTANT_ID")
const OPENAI_API_ENDPOINT = "https://api.openai.com/v1"

// For debugging purposes
console.log("API Key available:", !!OPENAI_API_KEY)
console.log("Assistant ID available:", !!ASSISTANT_ID)

// Create a function to simulate responses when API key is not available
const simulateResponse = async (message: string): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

  if (message.toLowerCase().includes("music") || message.toLowerCase().includes("sing")) {
    return "Vibby gotchu 🤩! Have a look at their bio!\nI found some people who love music and might be a great match for you!"
  } else if (message.toLowerCase().includes("code") || message.toLowerCase().includes("programming")) {
    return "Vibby gotchu 🤩! Have a look at their bio!\nI found some tech enthusiasts who love coding!"
  } else {
    return "Hi there! I'm Vibby, your friendly assistant. I can help you find people with similar interests. Tell me more about what you're looking for!"
  }
}

export const callOpenAIAssistant = async (message: string) => {
  // If API key is not available, use simulation
  if (!OPENAI_API_KEY || !ASSISTANT_ID) {
    console.warn("Using simulated responses because API key or Assistant ID is missing")
    return simulateResponse(message)
  }

  try {
    // Create API instance with the API key
    const api = axios.create({
      baseURL: OPENAI_API_ENDPOINT,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "OpenAI-Beta": "assistants=v2",
      },
    })

    // Step 1: Create a thread
    console.log("Creating thread...")
    const threadResponse = await api.post("/threads", {})
    const threadId = threadResponse.data.id
    console.log("Thread created:", threadId)

    // Step 2: Add a message to the thread
    console.log("Adding message to thread...")
    await api.post(`/threads/${threadId}/messages`, {
      role: "user",
      content: message,
    })
    console.log("Message added to thread")

    // Step 3: Run the assistant
    console.log("Running assistant...")
    const runResponse = await api.post(`/threads/${threadId}/runs`, {
      assistant_id: ASSISTANT_ID,
    })
    const runId = runResponse.data.id
    console.log("Run created:", runId)

    // Step 4: Wait for the run to complete
    console.log("Waiting for run to complete...")
    let runStatus
    let attempts = 0
    const maxAttempts = 30 // Prevent infinite loops

    do {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait for 1 second
      const statusResponse = await api.get(`/threads/${threadId}/runs/${runId}`)
      runStatus = statusResponse.data.status
      console.log("Run status:", runStatus)
      attempts++

      if (attempts >= maxAttempts) {
        console.warn("Maximum attempts reached, breaking loop")
        break
      }
    } while (runStatus !== "completed" && runStatus !== "failed" && runStatus !== "cancelled")

    if (runStatus !== "completed") {
      console.error("Run did not complete successfully:", runStatus)
      return "Sorry, I couldn't process your request. Please try again later."
    }

    // Step 5: Retrieve the assistant's messages
    console.log("Retrieving messages...")
    const messagesResponse = await api.get(`/threads/${threadId}/messages`)
    const assistantMessages = messagesResponse.data.data
      .filter((msg: any) => msg.role === "assistant")
      .map((msg: any) => {
        if (msg.content && msg.content[0] && msg.content[0].text) {
          return msg.content[0].text.value
        }
        return ""
      })
      .filter(Boolean)

    console.log("Retrieved messages:", assistantMessages.length)
    return assistantMessages.join(" ")
  } catch (error: any) {
    console.error("Error calling OpenAI Assistant API:", error)
    console.error("Error details:", error.response?.data || error.message)

    // Return a fallback response
    return "Sorry, I'm having trouble connecting to my brain right now. Could you try again in a moment?"
  }
}
