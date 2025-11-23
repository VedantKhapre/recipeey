import { GoogleGenerativeAI } from "@google/generative-ai";
import { getApiModel, DEFAULT_MODEL } from "@/lib/models";

export const runtime = "edge";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
);

export async function POST(req: Request) {
  try {
    const { messages, model = DEFAULT_MODEL } = await req.json();

    // Get all messages except the last one for history
    const allPreviousMessages = messages.slice(0, -1);

    // Convert messages to Gemini format
    let chatHistory = allPreviousMessages.map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }),
    );

    // Gemini requires history to start with 'user' role, so filter out leading assistant messages
    while (chatHistory.length > 0 && chatHistory[0].role === "model") {
      chatHistory = chatHistory.slice(1);
    }

    const lastMessage = messages[messages.length - 1];

    // Initialize Gemini model
    const geminiModel = genAI.getGenerativeModel({
      model: getApiModel(model),
    });

    // Start chat with history
    const chat = geminiModel.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
    });

    // Send message and get streaming response
    const result = await chat.sendMessageStream(lastMessage.content);

    // Create a readable stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
