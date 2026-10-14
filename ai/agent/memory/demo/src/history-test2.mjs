import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';
import {
//   // InMemoryChatMessageHistory  // 短期内存记忆
  FileSystemChatMessageHistory  // 文件记忆  
} from '@langchain/community/stores/message/file_system';
import {
  HumanMessage, 
  SystemMessage,
  AIMessage
} from '@langchain/core/messages';
import path from 'node:path'; // fs path 模块

const model = new ChatOpenAI({
  modelName:process.env.MODEL_NAME,
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  }
}) 

async function fileHistoryDemo() {
  // Promise 类上的静态方法， pending -> rejected
  // return Promise.reject("失败了");
  // return Promise.resolve("成功了");
  console.log(process.cwd());
  // InMemory 当前的Agent
  // file 最近几次聊的 
  // milvus 
  const filePath = path.join(process.cwd(), "chat_history.json");
  const sessionId = "user_session_001"; // 多用户
  const systemMessage = new SystemMessage(
    "你是一个友好，幽默的做菜助手，喜欢分享美食和烹饪技巧"
  );
  console.log("[第一轮对话]");
  // 
  const history = new FileSystemChatMessageHistory({
    filePath,
    sessionId
  });
  const userMessage1 = new HumanMessage(
    "红烧肉怎么做"
  );
  await history.addMessage(userMessage1);
  const messages1 = [systemMessage, ...(await history.getMessages())];
  const response1 = await model.invoke(messages1);
  console.log(response1);
  await history.addMessage(response1);
  console.log(`用户：${userMessage1.content}\n`);
  console.log(`组手: ${response1.content}\n`);
  console.log(`[第二轮对话 基于历史记录]`);
  const userMessage2 = new HumanMessage(
    "好吃吗？"
  )
  await history.addMessage(userMessage2);
  const message2 = [systemMessage, ...(await history.getMessages())];
  const response2 = await model.invoke(message2);
  await history.addMessage(response2);
  console.log(`助手：${response2.content} \n`);
  
  const allMessages = await history.getMessages();
  console.log(`共保存了${allMessages.length}条对话`); 
  allMessages.forEach((msg, index) => {
    console.log(msg);
    const type = msg.type;
    const prefix = type === 'human'? '用户': '助手';
    console.log(`${index + 1} . [${prefix}]: ${msg.content.substring(0, 50)}...`)
  })
}
// Promise<T>
fileHistoryDemo()
  // .then(console.log)
  .catch(console.error)
  // .finally(() => {
  //   console.log("finally");
  // });