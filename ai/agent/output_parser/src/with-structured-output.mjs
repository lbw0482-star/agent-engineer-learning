import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

const model = new ChatOpenAI({
  modelName: process.env.MODEL_NAME,
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  }
});

const scientistSchema = z.object({
  name: z.string().describe('科学家的姓名'),
  birth_year: z.number().describe('出生年份'),
  nationality: z.string().describe('国籍'),
  fields: z.array(z.string()).describe('研究领域列表'),
});
// tool call 讨巧的做法， 升级为语义化更好地withStructuredOutput
// 底层 tool call 
const structuredModel = model.withStructuredOutput(scientistSchema);

const result = await structuredModel.invoke("介绍一下爱因斯坦");
console.log(result);
console.log('------------------');
console.log(JSON.stringify(result, null, 2));