// command line
import "dotenv/config";
import { ask } from "./rag_agent.mjs"

const DEFAULT_QUESTIONS = [
  "无理由退货要在几天内？"
]

const args = process.argv.slice(2);
console.log(args);
const questions = args.length > 0 ? [args.join(" ")]: DEFAULT_QUESTIONS;
console.log(questions);

for (let i = 0; i < questions.length; i++) {
  const question = questions[i];
  console.log(`问题 ${i + 1}: ${question}`)

  const { answer, context } = await ask(question);
  console.log(answer);
  console.log("-----------------");
  // console.log(context);
}