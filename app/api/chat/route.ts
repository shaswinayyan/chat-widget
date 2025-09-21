import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { botId, message } = await request.json()

    if (!botId || !message) {
      return NextResponse.json({ error: "Missing botId or message" }, { status: 400 })
    }

    const huggingfaceApiKey = process.env.HUGGINGFACE_API_KEY
    const huggingfaceModel = process.env.HUGGINGFACE_MODEL || "google/flan-t5-small"

    if (!huggingfaceApiKey) {
      return NextResponse.json({ error: "HuggingFace API key not configured" }, { status: 500 })
    }

    // Call HuggingFace Inference API
    const response = await fetch(`https://api-inference.huggingface.co/models/${huggingfaceModel}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${huggingfaceApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: message,
        parameters: {
          max_length: 200,
          temperature: 0.7,
          do_sample: true,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("HuggingFace API error:", errorText)
      return NextResponse.json({ error: "Failed to get response from AI model" }, { status: 500 })
    }

    const data = await response.json()

    // Handle different response formats from HuggingFace
    let aiResponse = ""
    if (Array.isArray(data) && data[0]?.generated_text) {
      aiResponse = data[0].generated_text
    } else if (data.generated_text) {
      aiResponse = data.generated_text
    } else if (typeof data === "string") {
      aiResponse = data
    } else {
      aiResponse = "I received your message but had trouble generating a response."
    }

    // Clean up the response (remove the original input if it's repeated)
    if (aiResponse.startsWith(message)) {
      aiResponse = aiResponse.substring(message.length).trim()
    }

    return NextResponse.json({
      response: aiResponse || "I understand your message. How else can I help you?",
      botId,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
