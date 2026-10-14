import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
// 结构化
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from 'zod';

const model = new ChatOpenAI({
  modelName: process.env.MODEL_NAME,
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  }
});
// output结构化输出， 再严苛一点， Schema 来约束
const scientistSchema = z.object({
  name: z.string().describe('科学家的姓名'),
  birth_year: z.number().describe('出生年份'),
  death_year: z.number().optional().describe('死亡年份, 如果还在世则不填'),
  nationality: z.string().describe('国籍'),
  fields: z.array(z.string()).describe('研究领域列表'),
  awards: z.array(
    z.object({
      name: z.string().describe('奖项名称'),
      year: z.number().describe('获奖年份'),
      reason: z.string().describe('获奖原因'),
    })
  ).describe('获得的重要奖项列表'),
  major_achievements: z.array(z.string()).describe('主要成就列表'),
  famous_theory: z.array(
    z.object({
      name: z.string().describe('理论名称'),
      year: z.number().describe('提出年份'),
      description: z.string().describe('理论简要描述'),
    })
  ).describe('著名理论列表'),
  biography: z.string().describe('简短传记， 100字以内'),
});

const parser = StructuredOutputParser.fromZodSchema(scientistSchema);

const question = `请介绍一下居里夫人的详细信息, 
${parser.getFormatInstructions()}`;

console.log(question);

try {
  console.log('正在调用大模型 (使用 StructuredOutputParser) \n');
  const response = await model.invoke(question);
  console.log(response.content);
  const result = await parser.parse(response.content);
  console.log(`姓名：${result.name}`);
  console.log(`国籍：${result.nationality}`);
} catch (error) {
  console.error('解析错误:', error);
}