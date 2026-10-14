import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url"
import { ChatOpenAI } from "@langchain/openai";
// 文件系统中间件
import { 
  createFilesystemMiddleware, // 中间件
  FilesystemBackend  // 落实文件操作的支持
} from "deepagents";
import {
  createAgent,
  HumanMessage
} from 'langchain'

// 开箱即用的harness deepagents
// 当前文件路径 file:// url 
// console.log(path.dirname(fileURLToPath(import.meta.url)))
const workspaceDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "workspace"
);
// console.log(workspaceDir);

const permissions = [
  { operations: ["read"], paths: ["/secret.txt"], mode: "deny" },
  { operations: ["write"], paths: ["/todo.md"], mode: "allow" },
  { operations: ["write"], paths: ["/**"], mode: "deny" }
];

fs.rmSync(workspaceDir, { recursive: true, force: true });
fs.mkdirSync(workspaceDir);
fs.writeFileSync(path.join(workspaceDir, "secret.txt"), "机密：不得读取", 
"utf8");

const model = new ChatOpenAI({
  model: process.env.MODEL_NAME,
  apiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
  temperature: 0,
})

const agent = createAgent({
  model,
  tools: [],
  systemPrompt: `
  工作区根路径为/ 。用ls、read_file、write_file、edit_file 操作文件, 
  路径以/ 开头。 中文回答。
  `,
  middleware: [
    // 业务层 拿来就用 
    createFilesystemMiddleware({
      permissions,
      backend: new FilesystemBackend({
        rootDir: workspaceDir,
        // permissions, // harness 
        virtualMode : true ,
      })
    })
  ]
});

console.log("工作区：", workspaceDir);
console.log("权限：", JSON.stringify(permissions, null, 2));

async function run(label, prompt) {
  console.log(prompt);
  const { messages } = await agent.invoke(
    { messages: [new HumanMessage(prompt)] },
    { recursionLimit: 20}
  )
  console.log(messages);
}

async function expectDenied(label, prompt) {
  console.log(`\n == ${label} (预期拒绝) === \n`, prompt, "\n");
  try {
    const { messages } = await agent.invoke({
      messages: [ new HumanMessage(prompt)]
    }, {
      recursionLimit: 5
    });

    const denied = messages.some((m) => m.getType?.() === "tool" &&
      m.status === "error" && /permission denied/.test(String(m.content))
    );
    console.log(denied ? "OK: 已拒绝" : "未触发拒绝（异常）");
  } catch(e) {
    const msg = e.cause?.message ?? e.message;
    console.log("X", msg);
  }
}

// await run(
//   "允许的操作",
//   "write_file 创建 /todo.md（三条待办）, edit_file 把一条标为完成, ls /, 一句话总结"
// );

// await expectDenied("禁止读", "只调用 read_file, 路径 /secret.txt ");
await expectDenied("禁止写", "只调用 write_file, 路径 /hack.txt, 内容 text。")