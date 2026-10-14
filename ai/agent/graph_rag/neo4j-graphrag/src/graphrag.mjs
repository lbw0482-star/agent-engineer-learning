import "dotenv/config";
// 引入 Neo4jGraph 类
import { Neo4jGraph } from "@langchain/community/graphs/neo4j_graph";
import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, END, START } from "@langchain/langgraph";
import { HumanMessage } from '@langchain/core/messages';

const graph = new Neo4jGraph({
  url: "bolt://localhost:7687",
  username: "neo4j",
  password: "12345678"
});

const llm = new ChatOpenAI({
  model: process.env.MODEL_NAME,
  temperature: 0,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL
  }
});
const state = {
  // 会话消息
  // reduce
  messages: {
    // 旧的写法， reducer 新写法
    value: (left, right) => 
      left.concat(Array.isArray(right)?right:[right]),
    default: () => []
  },
  query: null,
  cypher: null, // llm 生成的 cypher 语句 text2cypher
  context: null,
  answer: null,
}
// 动态的
async function parseQuestion(state) {
  const lastMessage = state.messages[state.messages.length -1];
  return {
    query: lastMessage.content
  }
}

async function generateCypher(state) {
  const prompt = `
    你是一个专业的 Neo4j Cypher 生成器。
    严格按照下面的结构生成正确语句，只返回Cypher 代码， 不要任何解释、不要标点、不要markdown。

    节点：
    - Product: 奶茶品牌
    - Ingredient: 配料
    - Type: 奶茶类型
    - Method: 制作工艺
    - People: 适合人群

    关系方向（必须严格遵守）：
    - (Product)-[:属于]->(Type)
    - (Product)-[:包含]->(Ingredient)
    - (Product)-[:适合]->(People)
    - (Ingredient)-[:使用]->(Method)

    规则：
    1. 关系方向绝对不能反
    2. 多跳查询使用多个Math, 不能连错路径
    3. 只返回最终可运行的Cypher语句

    用户问题: ${state.query}
  `
  const res = await llm.invoke([new HumanMessage(prompt)]);
  return {
    cypher: res.content
  }
}

async function executeGraphQuery(state) {
  try {
    const res = await graph.query(state.cypher);
    return {
      context: JSON.stringify(res)
    }
  } catch(err) {
    return {
      context: "未查询到相关知识"
    }
  }
}

async function generateAnswer(state) {
  const prompt = `
    你是奶茶专家，根据下方[检索结果]回答用户问题，检索结果为空或不足时简要说明无法从图谱得到
    答案，不要编造。
    回答要求：
    - 直接列出事实，不要推断图谱中未出现的配料（如水、冰、添加剂等）。

    检索结果:${state.context}
    用户问题:${state.query}
  `
  const res = await llm.invoke([new HumanMessage(prompt)]);
  return {
    answer: res.content
  }
}

// Root
const workflow = new StateGraph({
  channels: state
})
.addNode('parse', parseQuestion)
.addNode('generateCypher', generateCypher)
.addNode('executeGraph', executeGraphQuery)
.addNode('generateAnswer', generateAnswer)
.addEdge(START, 'parse')
.addEdge('parse', 'generateCypher')
.addEdge('generateCypher', 'executeGraph')
.addEdge('executeGraph', 'generateAnswer')
.addEdge('generateAnswer', END)

const app = workflow.compile();
const drawable = await app.getGraphAsync();
const mermaid = drawable.drawMermaid({ withStyles: true });
console.log('--- LangGraph 工作流 （Mermaid ）---')
console.log(mermaid);

async function runGraphRAG(question) {
  const res = await app.invoke({
    messages: [new HumanMessage(question)],
  });

  console.log('======================');
  console.log('用户问题:', question);
  console.log('生成Cypher', res.cypher);
  console.log('检索结果:', res.context);
  console.log('最终回答:', res.answer);
  console.log('='.repeat(50));
  return res.answer;
}

async function main() {
  try {
    const results = await Promise.all([
      runGraphRAG('我们这款珍珠奶茶有哪些配料?'),
      runGraphRAG('台式奶茶的饮品都有哪些配料？'),
      runGraphRAG('珍珠奶茶适合哪些人群引用？'),
    ])
    console.log(results);
  } finally {
    // 释放 Neo4j 连接
    await graph.close();
  }
}

main()
  .catch(console.error)
