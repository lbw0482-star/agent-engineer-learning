// 上下文 memory 管理的三个手段，  截断
import { InMemoryChatMessageHistory } from '@langchain/core/chat_history';
import { 
  HumanMessage,
  AIMessage, 
  trimMessages  // langchain 自带的history 裁剪工具， 留下最近的
  // 被裁剪的老消息 （总结）， 留下来的来（history clear, 新的messages ）
} from '@langchain/core/messages';
// token 计算的 
import { getEncoding } from 'js-tiktoken';// 准确计算token开销

async function messageCountTruncation() {
  const history = new InMemoryChatMessageHistory();
  const maxMessages = 4; 
  const messages = [
    { type: 'human', content: '我叫李四' },
    { type: 'ai', content: '你好李四，很高兴认识你！' },
    { type: 'human', content: '我是一名设计师' },
    { type: 'ai', content: '设计师是个很有创造力的职业！你主要做什么类型的设计？' },
    { type: 'human', content: '我喜欢艺术和音乐' },
    { type: 'ai', content: '艺术和音乐都是很好的爱好，它们能激发创作灵感。' },
    { type: 'human', content: '我擅长 UI/UX 设计' },
    { type: 'ai', content: 'UI/UX 设计非常重要，好的用户体验能让产品更成功！' },
  ];

  for (const msg of messages) {
    if (msg.type === 'human') {
      await history.addMessage(new HumanMessage(msg.content));
    } else {
      await history.addMessage(new AIMessage(msg.content));
    }
  }
  // invoke 之前截断
  let allMessages = await history.getMessages();
  const trimmedMessages = allMessages.slice(-maxMessages);
  console.log(`保留消息数量：${trimmedMessages.length}`);
  console.log(`保留的消息：`,trimmedMessages.map(
    m => `${m.constructor.name}: ${m.content}`).join('\n'))
}
// messages token 计算
function countTokens(messages, encoder) {
  let total = 0;
  for (const msg of messages) {
    const content = typeof msg.content === 'string'? msg.content : 
    JSON.stringify(msg.content)
    total += encoder.encode(content).length;
  }
  return total;
}

async function tokenCountTruncation() {
  const history = new InMemoryChatMessageHistory();
  const maxTokens = 100; // tokens 上限
  const messages = [
    { type: 'human', content: '我叫李四' },
    { type: 'ai', content: '你好李四，很高兴认识你！' },
    { type: 'human', content: '我是一名设计师' },
    { type: 'ai', content: '设计师是个很有创造力的职业！你主要做什么类型的设计？' },
    { type: 'human', content: '我喜欢艺术和音乐' },
    { type: 'ai', content: '艺术和音乐都是很好的爱好，它们能激发创作灵感。' },
    { type: 'human', content: '我擅长 UI/UX 设计' },
    { type: 'ai', content: 'UI/UX 设计非常重要，好的用户体验能让产品更成功！' },
  ];
  for (const msg of messages) {
    if (msg.type === 'human') {
      await history.addMessage(new HumanMessage(msg.content));
    } else {
      await history.addMessage(new AIMessage(msg.content));
    }
  }

  let allMessages = await history.getMessages();
  const enc = getEncoding("cl100k_base");// 编码
  // 最近的, content 定制的token 长度计算， 截取
  const trimmedMessages = await trimMessages(allMessages, {
    maxTokens: maxTokens,
    // 不同llm token 计算方式不一样
    // 二分
    tokenCounter: async (msgs) => countTokens(msgs, enc),
    strategy: "last"
  });

  console.log(trimmedMessages, '------------------');
  const totalTokens = countTokens(trimmedMessages, enc);
  console.log(`总token 数量：${totalTokens}`);
  console.log(countTokens([{ type: 'ai', content: '设计师是个很有创造力的职业！你主要做什么类型的设计？' }], enc));
}

async function runAll() { 
  await messageCountTruncation(); // 消息数量截断 简单 slice  展示思路
  await tokenCountTruncation(); // token 数量截断  复杂 计算token开销 生产
}

runAll()
  .catch(console.error)
