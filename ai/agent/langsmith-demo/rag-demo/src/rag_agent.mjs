// langgraph 设计图
// compile Agent  
import "dotenv/config";
import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { ChatPromptTemplate } from "@langchain/core/prompts";
// 输出解析器 只要字符串输出
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Milvus } from "@langchain/community/vectorstores/milvus";

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: process.env.OPENAI_API_BASE_URL,
  },
  model: process.env.EMBEDDING_MODEL ?? "text-embedding-v3",
});

const llm = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: process.env.OPENAI_API_BASE_URL,
  },
  model: process.env.MODEL_NAME ?? "qwen-plus",
  temperature: 0,
})
// store
const vectorStore = await Milvus.fromExistingCollection(embeddings, {
  collectionName: process.env.MILVUS_COLLECTION ?? "rag_docs",
  url: process.env.MILVUS_URL ?? "http://localhost:19530",
});

const retriever = vectorStore.asRetriever({k: 4});

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `你是客服助手。 仅根据下面[上下文]回答：上下文没有的信息请明确说不知道，不要编造。\n\n
    上下文: {context}
    `
  ],
  [
    "human",
    "{question}"
  ]
])
// 线性的 
const chain = RunnableSequence.from([prompt, llm, new StringOutputParser()]);

const GraphState = Annotation.Root({
  question: Annotation,
  context: Annotation,
  answer: Annotation
});
// 检索节点
async function retrieve(state) {
  const docs = await retriever.invoke(state.question);
  return { context: docs }
}

async function generate(state) {
  const contextText = state.context.map(d => d.pageContent).join("\n\n");
  const answer = await chain.invoke({
    context: contextText,
    question: state.question
  });
  return { answer }
}
// 设计
const workflow = new StateGraph(GraphState)
  .addNode("retrieve", retrieve)
  .addNode("generate", generate)
  .addEdge(START, "retrieve")
  .addEdge("retrieve", "generate")
  .addEdge("generate", END);
// 设计 -》 Agent
export const ragApp = workflow.compile();

export async function ask(question) {
  const result = await ragApp.invoke({question});
  return {
    answer: result.answer,
    context: result.context ?? []
  }
}