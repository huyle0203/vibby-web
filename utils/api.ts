import axios from "axios"

// insert API keys!
// const OPENAI_API_KEY = 
// const ASSISTANT_ID = 
// const OPENAI_API_ENDPOINT = 


const api = axios.create({
  baseURL: OPENAI_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENAI_API_KEY}`,
    "OpenAI-Beta": "assistants=v2",
  },
})


export const callOpenAIAssistant = async (message: string) => {
  try {
    console.log("Creating thread...")
    const threadResponse = await api.post("/threads", {})
    const threadId = threadResponse.data.id
    console.log("Thread created:", threadId)

    console.log("Adding message to thread...")
    await api.post(`/threads/${threadId}/messages`, {
      role: "user",
      content: message,
    })
    console.log("Message added to thread")

    console.log("Running assistant...")
    const runResponse = await api.post(`/threads/${threadId}/runs`, {
      assistant_id: ASSISTANT_ID,
    })
    const runId = runResponse.data.id
    console.log("Run created:", runId)

    console.log("Waiting for run to complete...")
    let runStatus
    let attempts = 0
    const maxAttempts = 30 // stops infinite loops

    do {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // waits 1 second
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

    return "Sorry, I'm having trouble connecting to my brain right now. Could you try again in a moment?"
  }
}
