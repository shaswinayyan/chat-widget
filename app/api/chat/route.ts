import { InferenceClient } from "@huggingface/inference";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { botId, message } = await req.json();
  const client = new InferenceClient(process.env.HF_TOKEN);

  let fullResponse = "";

  const stream = client.chatCompletionStream({
      provider: "nscale",
      model: "Qwen/Qwen3-4B-Thinking-2507",
      messages: [{ role: "user", content: message }],
  });

  for await (const chunk of stream) {
      if (chunk.choices?.length > 0) {
          const delta = chunk.choices[0].delta.content || "";
          fullResponse += delta;
          // optionally send this delta to frontend via SSE/websocket
      }
  }

  return NextResponse.json({ response: fullResponse, botId });
}
