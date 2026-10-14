import "dotenv/config";
// node 异步无阻塞的 性能好 no blocking  async 
import { 
  existsSync, // 同步
  readFileSync, 
  readdirSync 
} from "fs"; // 异步（默认） 同步  Sync 
import { join, resolve } from "path";
import { MilvusClient, DataType, IndexType, MetricType } from "@zilliz/milvus2-sdk-node"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";

const COLLECTION = process.env.MILVUS_COLLECTION ?? "rag_docs";
// 项目上线 milvus 独立于程序外 aliyun 服务 
// MilvusClient 自动带上https 
const MILVUS_ADDRESS = process.env.MILVUS_URI.replace(/^https?:\/\//, "") ?? "localhost:19530" 

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  model: process.env.EMBEDDING_MODEL ?? "text-embedding-v3",
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
})

const client = new MilvusClient({
  address: MILVUS_ADDRESS,
})

async function loadChunks(dataDir = "./data") {
  if (!existsSync(dataDir)) {
    throw new Error(`Data directory ${dataDir} does not exist`);
  }
  console.log(readdirSync(dataDir), "files");
  const files = readdirSync(dataDir).filter((f) => /\.(text|md)$/.test(f));
  if (files.length === 0) {
    throw new Error(`No .text/.md files found in ${dataDir}`);
  }
  // Document -> Chunk Document
  const docs = files.map(f => ({
    pageContent: readFileSync(join(dataDir, f), "utf-8"),
    // test: resolve(dataDir, f),
    metadata: {
      source: f
    }
  }))
  // console.log(docs);
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  return splitter.splitDocuments(docs);
}

async function main() {
  try {
    console.log("Connecting to Milvus ...");
    await client.connectPromise;
    console.log("Connected\n");

    const chunks = await loadChunks();
    console.log(chunks);

    if ((await client.hasCollection({ collection_name: COLLECTION})).value) {
      await client.dropCollection({ collection_name: COLLECTION });
      console.log(`Collection ${COLLECTION} dropped \n`);
    }

    const vectors = await embeddings.embedDocuments(
      chunks.map(c => c.pageContent)
    );
    console.log(vectors);
    const dim = vectors[0].length;
    await client.createCollection({
      collection_name: COLLECTION,
      fields: [
        {
          name: "langchain_primaryid",
          is_primary_key: true,
          data_type: DataType.Int64,
          autoID: true
        },
        { name: "langchain_vector", data_type: DataType.FloatVector, dim },
        { name: "langchain_text", data_type: DataType.VarChar, max_length: 8000 },
        { name: "source", data_type: DataType.VarChar, max_length: 256 }
      ]
    });
    console.log("Collection created");
    console.log("\n Creating index ...");
    await client.createIndex({
      collection_name: COLLECTION,
      field_name: "langchain_vector",
      index_type: IndexType.IVF_FLAT,
      metric_type: MetricType.L2,
      params: {
        nlist: 128,
      }
    });
    console.log("Index created");

    await client.loadCollection({ collection_name: COLLECTION });

    const data = chunks.map((chunk, i) => ({
      langchain_text: chunk.pageContent,
      source: chunk.metadata.source,
      langchain_vector: vectors[i],
    }));

    const result = await client.insert({
      collection_name: COLLECTION,
      data,
    })
    console.log(`Inserted ${result.insert_cnt} records \n`);
  } catch(error) {
    console.error(error.message);
    process.exit(1);
  }
}

main();