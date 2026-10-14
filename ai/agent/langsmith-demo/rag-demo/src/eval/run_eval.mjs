// RAG 量化评估 
import "dotenv/config";
import { Client } from "langsmith";
import { evaluate } from "langsmith/evaluation";
import { ask } from "../rag_agent.mjs";
import { ragEvaluators } from "./evaluators.mjs";

const DATASET_NAME = "rag-eval-v1";
const client = new Client({
  apiKey: process.env.LANGCHAIN_API_KEY
});

async function runRagAgent(inputs) {
  const { answer, context } = await ask(inputs.question);
  return {
    answer,
    context: context.map(d => d.pageContent)
  }
}

async function main() {
  const result = await evaluate(runRagAgent, {
    data: DATASET_NAME,
    evaluators: ragEvaluators,
    client,
    experimentPrefix: `rag-openevals-${process.env.MODEL_NAME ?? "qwen"}`,
    maxConcurrency: 2
  })
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })