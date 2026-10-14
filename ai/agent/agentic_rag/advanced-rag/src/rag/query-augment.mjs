import { ChatPromptTemplate } from '@langchain/core/prompts';
// 在一个AI系统里， 最核心就是几个prompt 模块
import * as z from 'zod';

export const QueryAugmentSchema = z.object({
  queries:z
    .array(z.string())
    .length(3)
    .describe('恰好3条中文检索问句：不同角度改写或扩写;保留订单号、品牌等字面信息;不要编造事实'),
})

const AUGMENT_PROMPT = ChatPromptTemplate.fromMessages([
  [
    "system",
    `用户会给出一句中文问题。请另外写出恰好3条检索用的问句（与原意一致，角度尽量不同）
     便于搜索引擎或向量库分别召回：
     可改写说法、换提问角度、或略加限定词；专有名词、型号、订单号等必须保留原样。
     只输出结构化字段 queries(长度为3的字符串数组)
    `
  ],
  ["human", "{query}"]
]);

function normalizeThreeQueries(original, list) {
  const out = (list ?? [])
    .map((s) => (typeof s === "string")?s.trim():"")
    .filter(Boolean)
  while(out.length < 3) out.push(original)
  return out.slice(0, 3)

}

export async function augmentQuery(chatModel, query) {
  // queries [] : 3
  const structured = chatModel.withStructuredOutput(QueryAugmentSchema);
  const chain = AUGMENT_PROMPT.pipe(structured); // 工作节点的编排
  try {
    const raw = await chain.invoke({query});
    return { queries: normalizeThreeQueries(query, raw.queries) }
  } catch(error) {
    return { queries: normalizeThreeQueries(query, [])}
  }
}

export function retrievalQueryString(original, augmentation) {
  return [original, ...(augmentation.queries ?? [])]
    .map(s => typeof s === "string"?s.trim():"")
    .filter(Boolean)
}