import "dotenv/config";
import WebSocket from "ws";// tencent 流式tts ws 协议
// sse  文本的， 请求 get 
import crypto from "node:crypto"; // 加密
import fs from "node:fs";

const SECRET_ID = process.env.SECRET_ID;
const SECRET_KEY = process.env.SECRET_KEY;
const APP_ID = process.env.APP_ID;

console.log(SECRET_ID, SECRET_KEY, APP_ID, "-------");

const VOICE_TYPE = 101001;
const OUTPUT_FILE = "output3.mp3";
const TEXT_INTERVAL_MS = 3000;


const TEXTS = [
  "傍晚我还在为晚霞开心",
  "突然电话响起：系统崩了",
  "我心里一沉冲回办公室",
  "好在大家一起排查后终于恢复",
  "我长长松了口气"
];
// 等待指定时间 await sleep(1000);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 文档
function buildWsUrl() {
  const now = Math.floor(Date.now() / 1000); // 当前时间秒数向下取整
  const sessionId = `session_${now}_${Math.random().toString(36).slice(2)}`;
  const params = {
    Action: "TextToStreamAudioWSv2", // 文本到流式声音 基于WebSocket 协议
    AppId: parseInt(APP_ID),
    Codec: "mp3",
    Expired: now + 3600,
    SampleRate: 16000, // 采样率 16kHz 16000Hz
    SecretId: SECRET_ID,
    SessionId: sessionId,
    Speed: 0,
    Timestamp: now,
    VoiceType: VOICE_TYPE,
    Volume: 5,
  }
  const sortedKeys = Object.keys(params).sort();
  // url params ?a=1&b=2
  const signStr = sortedKeys.map((k) => `${k}=${params[k]}`).join("&");
  const rawStr = `GETtts.cloud.tencent.com/stream_wsv2?${signStr}`;
  const signature = crypto
    .createHmac("sha1", SECRET_KEY)
    .update(rawStr)
    .digest("base64");
  // ?a=1&b=2
  const searchParams = new URLSearchParams({
    ...params,
    Signature: signature,
  });
  return {
    sessionId,
    url: `wss://tts.cloud.tencent.com/stream_wsv2?${searchParams.toString()}`
  }
}

async function sendTexts(ws, sessionId) {
  for (let i = 0; i < TEXTS.length; i++) {
    ws.send(JSON.stringify({session_id: sessionId, message_id: `msg_${i}`, 
      action:"ACTION_SYNTHESIS", data: TEXTS[i]}));
    console.log(`[文本] 已发送：${TEXTS[i]}`);
    if (i < TEXTS.length -1) await sleep(TEXT_INTERVAL_MS);
  }
  ws.send(JSON.stringify({ session_id: sessionId, action: "ACTION_COMPLETE"}));
  console.log("[文本]已发送ACTION_COMPLETE");
}

function streamTTS() {
  if (!SECRET_ID || !SECRET_KEY || !APP_ID) {
    throw new Error("请先在 .env 文件中配置 SECRET_ID, SECRET_KEY, APP_ID");
  }
  const { url, sessionId } = buildWsUrl();
  const ws = new WebSocket(url);  // 连接 ws 服务器
  // 水管子 一头扎到目标文件  一头联向 ws 服务器， 用于写入音频数据， bundle , 写入文件
  const writeStream = fs.createWriteStream(OUTPUT_FILE, { flags: "w" });
  let totalBytes = 0; // 已写入的字节数
  let closed = false; // 是否关闭了连接
  let sent = false; // 是否发送了文本

  const closeAll= () => {
    if (closed) return;
    closed = true;
    writeStream.end(() => {
      console.log(`[保存] 音频已保存到${OUTPUT_FILE}, 共${totalBytes}字节`);
    })
    if (ws.readyState < WebSocket.CLOSING) ws.close();
  }
  ws.on("open", () => {
    console.log("[连接] WebSocket 已建立, 等待服务器就绪...");
  });
  // 有消息了
  ws.on("message", async (data, isBinary) => {
    if (isBinary) {
      writeStream.write(data);
      totalBytes += data.length;
      return;
    }
    // 发送完了， 消息， 报错
    try {
      const msg = JSON.parse(data.toString());
      console.log("【消息】", JSON.stringify(msg));
      // 服务端就绪、可以发文本了
      if (msg.ready === 1 && !sent) {
        sent = true;
        await sendTexts(ws, sessionId); // 发送文本
      }
      if (msg.code && msg.code !== 0) {
        console.log(`【错误】 code=${msg.code}, message=${msg.message}`);
        closeAll();
      } else if (msg.final === 1) {  // 合成结束
        console.log('[完成] 合成结束');
        closeAll();
      }
    } catch(e) {
      console.error("[解析错误]", e.message);
    }
  });

  ws.on("error", (err) => {
    console.error("[WebSocket 错误]", err.message);
    closeAll();
  });

  ws.on("close", (code, reason) => {
    console.log(`断开 连接已关闭， code=${code}, reason=${reason}`);
    closeAll();
  });

}

streamTTS();