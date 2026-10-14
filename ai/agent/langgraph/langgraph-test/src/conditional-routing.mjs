import {
  Annotation, // 注释 工作流的状态值的描述 数据 state
  END, // 结束节点
  START,  // 开始节点
  StateGraph // 状态图 流程编排器 节点的组织
} from '@langchain/langgraph';
// 状态申明
const StateAnnotation = Annotation.Root({
  query: Annotation({
    reducer: (_prev, next) => next,
    default: () => ""
  }),
  route: Annotation({
    reducer: (_prev, next) => next,
    default: () => "chat"
  }),
  answer: Annotation({
    reducer: (_prev, next) => next,
    default: () => ""
  })
});
// 节点申明 走向可以选择的 
const router = (state) => {
  const isMath = /[+\-*/]/.test(state.query); // 
  // 下一步怎么走？ 
  // 如果是数学问题， 走math 节点， 否则走chat 节点
  return {route: isMath ? "math": "chat" }
}

const mathNode = (state) => {
  try {
    return { answer: String(eval(state.query))} // "1+2"->js 1+2=3 -> 3 -> String "3" 
  } catch {
    return { answer: "表达式无法计算" }
  }
}

const chatNode = (state) => ({ answer: `你说的是：${state.query}`})

const graph = new StateGraph(StateAnnotation)
  .addNode("router", router) // 路由节点, name "router"
  .addNode("math", mathNode)
  .addNode("chat", chatNode)
  .addEdge(START, "router") // 走向固定
  // 条件跳转 state.route 值判断， math , chat
  // 分支条件
  .addConditionalEdges("router", (state) => state.route, {
    math: "math",
    chat: "chat"
  })
  .addEdge("math", END)
  .addEdge("chat", END)
  .compile()

// 流程图
const drawable = await graph.getGraphAsync();
const mermaid = drawable.drawMermaid({ withStyles: true });
console.log(mermaid);
// langchain langgraph 共享底层想同基础设施 llm 
console.log("result:", await graph.invoke({query: "你好"}))
console.log("result:", await graph.invoke({query: "1+2"}))