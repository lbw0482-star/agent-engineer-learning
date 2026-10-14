import "dotenv/config";
// 命令
import { Command } from "@langchain/langgraph"
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import {
  createAgent, 
  createMiddleware,
  HumanMessage,
  AIMessage,
  ToolMessage,
  tool 
} from "langchain"

const model = new ChatOpenAI({
  model: process.env.MODEL_NAME,
  apiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
  temperature: 0,
})

const getCurrentTime = tool(() => new Date().toISOString(), {
  name: "get_current_time",
  description: "返回当前UTC 时间的ISO 8601 字符串",
  schema: z.object({})
});

const extendedToolsMiddleware = createMiddleware({
  name: "ExtendedToolsMiddleware",
  stateSchema: z.object({
    toolInvocationCount: z.number().default(0)
  }),
  tools: [getCurrentTime],
  wrapToolCall: async (request, handler) => {
    const toolName = request.tool?.name ?? request.toolCall.name ;
    console.log(`[Tools] 即将执行: ${toolName}`,
      "args:",
      request.toolCall.args ?? {}
    );
    const result = await handler(request);
    if (!ToolMessage.isInstance(result)) return result;

    const wrapped = new ToolMessage({
      content: `${result.content}\n[wrapToolCall] 
      已由ExtendedToolsMiddleware 包裹`,
      tool_call_id: result.tool_call_id,
      name: result.name,
    });

    return new Command({
      update: {
        toolInvocationCount: request.state.toolInvocationCount + 1,
        messages: [wrapped]
      }
    })

  },
  afterAgent: (state) => {
    console.log(
      `[Tools] agent 结束, middleware统计工具调用：
      ${state.toolInvocationCount} 次`
    )
  }
})

const agent = createAgent({
  model,
  tools: [], // 顶层tools
  systemPrompt: "你是一个助手",
  middleware: [
    extendedToolsMiddleware
  ]
});

for (const text of [
  // "王者荣耀 日本比赛夺冠了， 谁是MVP?",
  "给我当前时间"
]) {
  const { messages, toolInvocationCount } = await agent.invoke({
    messages: [new HumanMessage(text)]
  });
  console.log(messages, toolInvocationCount)
}