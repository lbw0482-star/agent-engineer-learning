import {
  createLLMAsJudge, // 创建一个LLM作为判断器
  RAG_GROUNDEDNESS_PROMPT, // RAG 幻觉检测提示词
  RAG_HELPFULNESS_PROMPT, // RAG 帮助性检测提示词
  RAG_RETRIEVAL_RELEVANCE_PROMPT, // RAG 检索相关性检测提示词
} from "openevals"
import { ChatOpenAI } from "@langchain/openai";

const judge = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
  model: process.env.MODEL_NAME ?? "qwen-plus",
  temperature: 0,
});

const ragGroundnessJudge = createLLMAsJudge({
  prompt: RAG_GROUNDEDNESS_PROMPT,
  feedbackKey: "rag_groundness",
  judge,
  continuous: true,
});

const ragHelpfulnessJudge = createLLMAsJudge({
  prompt: RAG_HELPFULNESS_PROMPT,
  feedbackKey: "rag_helpfullness",
  judge,
  continuous: true,
});

const ragRetrievalRelevanceJudge = createLLMAsJudge({
  prompt: RAG_RETRIEVAL_RELEVANCE_PROMPT,
  feedbackKey: "rag_retrieval_relevance",
  judge,
  continuous: true,
});
// 幻觉评估器 函数
export async function ragGroundnessEvaluator({ outputs }) {
  return ragGroundnessJudge({
    context: { documents: outputs.context},
    outputs: { answer: outputs.answer}
  })
}

// 帮助性评估器 函数
export async function ragHelpfulnessEvaluator({ inputs, outputs }) {
  return ragHelpfulnessJudge({
    inputs,
    outputs: {
      answer: outputs.answer,
    }
  })
}

// 检索相关性评估器 函数
export async function ragRetrievalRelevanceEvaluator({ inputs, outputs }) {
  return ragRetrievalRelevanceJudge({
    inputs,
    context: { documents: outputs.context }
  })
}

export const ragEvaluators = [
  ragGroundnessEvaluator,
  ragHelpfulnessEvaluator,
  ragRetrievalRelevanceEvaluator,
]