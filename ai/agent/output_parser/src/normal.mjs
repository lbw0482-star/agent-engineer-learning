import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';
import { JsonOutputParser } from '@langchain/core/output_parsers';

const model = new ChatOpenAI({
  modelName: process.env.MODEL_NAME,
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  }
});

const parser = new JsonOutputParser();  // 解析器

const prompt = `
请介绍一下爱因斯坦的信息。 请以 JSON 格式返回， 
包含以下字段： name(姓名)、birth_year(出生年份)、
nationality(国籍)、major_achievements(主要成就, 数组)、
famous_theory(著名理论)
${parser.getFormatInstructions()}
`
console.log(prompt, '------------------------');
try {
  console.log("正在调用大模型....\n");
  const response = await model.invoke(prompt);
  console.log(response.content);

  // 使用正则提取 markdown 代码块中的 JSON 内容
  // 分组
  // const jsonMatch = response.content.match(/```json\s*([\s\S]*?)\s*```/);
  // // 正则业务
  // const jsonStr = jsonMatch ? jsonMatch[1] : response.content;
  // console.log(jsonStr);
  // const jsonResult = JSON.parse(jsonStr);
  // console.log('\n 解析后的JSON 对象:');
  // console.log(jsonResult);
  const result = await parser.parse(response.content);
  console.log(result, result.name);
} catch(err) {
  console.error(err.message);
}
