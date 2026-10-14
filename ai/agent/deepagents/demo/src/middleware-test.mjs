// 中间件
import "dotenv/config";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import {
  createAgent, // 创建Agent
  createMiddleware, // 创建中间件
  HumanMessage, // 人类消息
  AIMessage // 机器消息
} from "langchain";

const model = new ChatOpenAI({
  model: process.env.MODEL_NAME,
  apiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
  temperature: 0,
})
// 日志 中间件 模型调用次数统计
//用户 request agent   中间  生成 response
// middleware 是 Agent 的一部分  不影响Agent 的运行情况下添加一些额外的功能
const loggingMiddleware = createMiddleware({
  name: "LoggingMiddleware",
  stateSchema: z.object({
    modelCallCount: z.number().default(0)
  }),
  // 监听Agent的全生命周期 hooks
  beforeAgent: (state) => {
    console.log("\n [Logging] agent 开始，消息数：", state.messages.length);
  },
  beforeModel: (state) => {
    console.log(`[Logging] 即将调用模型，当前消息数：${state.messages.length}, 
    已调用 ${state.modelCallCount} 次模型
    `)
  },
  afterModel: (state) => {
    const last = state.messages.at(-1);
    const preview = typeof last?.content === "string"
      ? last.content.slice(0, 280)
      : JSON.stringify(last?.content)?.slice(0,280);
    console.log(`[Logging]模型返回: ${preview}...`)
    return {
      modelCallCount: state.modelCallCount + 1
    }
  },
  afterAgent: (state) => {
    console.log(`[Logging] agent 结束, 
      累计模型调用：${state.modelCallCount}次\n`)
  }
})
// 用户问题  加上上下文    回答
const addContextMiddleware = createMiddleware({
  name: "AddContextMiddleware",
  wrapModelCall: async (request, handler) => {
    console.log("[Add Context]注入额外system上下文")
    return handler({
      ...request,
      // 覆盖systemPrompt
      systemMessage: request.systemMessage.concat(
        "\n\n 请用一句话简洁回答"
      )
    })
  }
})

const blockedContentMiddleware = createMiddleware({
  name: "BlockedContentMiddleware",
  beforeModel: {
     canJumpTo: ["end"],
     hook: (state) => {
        const last = state.messages.at(-1);
        const text = typeof last?.content === "string"
        ? last.content: String(last?.content ?? "");
        if (text.includes("BLOCKED")) {
          console.log("[Blocked] 检测到Blocked, 短路结束");
          return {
            messages: [new AIMessage("改请求已被 middleware 拦截， 无法处理")],
            jumpTo: "end"
          }
        } 

     }
  }
})

// 创建Agent 很多底层的活不用干
// 聚焦业务， 快速启动 
const agent = createAgent({
  model,
  tools: [],
  systemPrompt: "你是一个助手。",
  middleware: [
    loggingMiddleware,
    addContextMiddleware,
    blockedContentMiddleware
  ]
})

for (const text of [
  // "用中文说：langchain createAgent 中的middleware 是什么？",
  "这句话包含Block 关键词"
]) {
  const { messages, modelCallCount } = await agent.invoke({
    messages: [ new HumanMessage(text) ]
  })
  console.log("回复:", messages.at(-1)?.content);
  console.log("modelCallCount:", modelCallCount);
}