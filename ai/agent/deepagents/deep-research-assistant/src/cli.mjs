// 除了开发者， 面向其他Agent的调用 
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";//file://
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { HumanMessage } from "@langchain/core/messages";

import { createIntelligenceDeskAgent, projectDir } from "./agent.mjs";

const recursionLimit = 300;

const FILE_TOOLS = new Set([
  "write_file",
  "edit_file",
  "read_file",
  "ls",
  "glob", // 通配符匹配
  "grep" // 关键词搜索文件内容
]);

const EVAL_TOOL = "eval";
const PREVIEW_LEN = 100;
const RESULT_PREVIEW_LEN = 120;

async function readQuery() {
  // node a.js a b c 
  const fromArgs = process.argv.slice(2).join(" ").trim();
  if (fromArgs) return fromArgs;
  // console.log('--', fromArgs);
  const rl = readline.createInterface({
    input,
    output
  })

  try {
    return (await rl.question("请输入调研主题：")).trim();
  } finally {
    rl.close();
  }
}

async function run(query) {
  console.log(`query: ${query} \n`);
  console.log(`recursionLimit: ${recursionLimit} \n`);
  console.log(`-`.repeat(50));

  const agent = createIntelligenceDeskAgent();
  const pending = new Map(); 
  const pendingEval = new Map();

  for await(const [namespace, chunk] of await agent.stream(
    { messages: [ new HumanMessage(query)]},
    { streamMode: "updates", subgraphs: true, recursionLimit }
  )) {

  }
}

async function main() {
  console.log('深度调研助手');

  const query = await readQuery();
  if (!query) {
    console.error("请提供调研主题");
    process.exit(1);
  }
  console.log(query);

  try {
    await run(query);
  }  catch(err) {
    console.error(err.message);
    process.exit(1);
  }
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })