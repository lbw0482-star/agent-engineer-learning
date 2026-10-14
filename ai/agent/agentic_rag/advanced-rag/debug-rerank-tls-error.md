# Debug Session: rerank-tls-error
- **Status**: [OPEN]
- **Issue**: 调用 DashScope rerank 接口时，Node `fetch` 报 `ERR_SSL_TLSV1_UNRECOGNIZED_NAME`，导致 hybrid retrieval 在 rerank 节点失败。
- **Debug Server**: http://127.0.0.1:7777/event
- **Log File**: .dbg/trae-debug-log-rerank-tls-error.ndjson

## Reproduction Steps
1. 在 `advanced-rag` 项目根目录运行触发 hybrid retrieval 的脚本。
2. 观察 `rerank` 节点是否在 `DashscopeRerank.compressDocuments` 内报 `fetch failed`。

## Hypotheses & Verification
| ID | Hypothesis | Likelihood | Effort | Evidence |
|----|------------|------------|--------|----------|
| A | rerank `baseUrl` 域名写错，导致 TLS SNI 不匹配 | High | Low | Pending |
| B | 运行时实际读取到的 `baseUrl`/`apiKey` 与预期不一致 | High | Low | Pending |
| C | `documents` 或请求体异常，服务端提前拒绝连接 | Medium | Low | Pending |
| D | Node 进程网络环境与 shell 不一致，导致 fetch 握手失败 | Medium | Medium | Pending |
| E | 单次边缘节点抖动导致 TLS 握手失败，重试后本应恢复 | Low | Low | Pending |

## Log Evidence
- `.dbg/trae-debug-log-rerank-tls-error.ndjson` 显示 `baseUrl` 实际值为 `https://dashscope.aliyuns.com/api/v1/services/rerank/text-rerank/text-rerank`
- 同一批日志记录到 `causeCode=ERR_SSL_TLSV1_UNRECOGNIZED_NAME`
- `src/rag/hybrid-retrieval.mjs` 中 reranker 构造参数硬编码为 `aliyuns.com`，与 `.env` 中 `aliyuncs.com` 不一致
- 修复后 `post-fix` 日志显示 `baseUrl` 已变为 `https://dashscope.aliyuncs.com/api/v1/services/rerank/text-rerank/text-rerank`
- 修复后 `post-fix` 日志记录 `status=200`、`ok=true`

## Verification Conclusion
- 假设判定：
  - A ✅ Confirmed：日志记录的实际 `baseUrl` 为 `dashscope.aliyuns.com`，代码硬编码同样写错
  - B ✅ Confirmed：实际使用的是硬编码错误 URL，不是 `.env` 中正确配置
  - C ❌ Rejected：错误发生在 TLS 握手阶段，请求体尚未进入业务处理
  - D ❌ Rejected：同一进程稳定复现到同一错误 URL，且错误指向 SNI 名称不匹配
  - E ❌ Rejected：3 次重试都命中同一错误 URL，同类错误稳定复现
- `pre-fix`: 请求发往错误域名 `dashscope.aliyuns.com`，TLS 握手失败
- `post-fix`: 请求发往正确域名 `dashscope.aliyuncs.com`，接口返回 `200`
- 当前状态：等待用户确认是否完成清理
