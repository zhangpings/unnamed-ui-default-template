import { createOpenAI } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { ProxyAgent } from "undici";

// 配置代理 - 请根据您的代理地址修改
const proxyUrl =
  process.env.HTTP_PROXY || process.env.HTTPS_PROXY || "http://127.0.0.1:7890";
const proxyAgent = new ProxyAgent(proxyUrl);

const openai = createOpenAI({
  fetch: (url, options) => {
    return fetch(url, {
      ...options,
      // @ts-expect-error - undici ProxyAgent dispatcher
      dispatcher: proxyAgent,
    });
  },
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-5-nano"),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
