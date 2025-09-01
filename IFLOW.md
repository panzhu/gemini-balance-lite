# Gemini Balance Lite - iFlow 上下文文档

## 项目概述

Gemini Balance Lite 是一个轻量级的无服务器边缘函数项目，用于代理和负载均衡 Google Gemini API。主要功能包括：

- **API 代理**: 将 Gemini API 请求中转到国内可访问的服务器
- **负载均衡**: 支持多个 Gemini API Key 的随机轮询使用
- **多平台部署**: 支持 Vercel、Deno、Cloudflare Workers、Netlify 等多种部署方式
- **格式兼容**: 同时支持原生 Gemini API 格式和 OpenAI API 格式

## 技术栈

- **运行时**: JavaScript/Node.js (边缘函数)
- **部署平台**: Vercel、Deno Deploy、Cloudflare Workers、Netlify Functions
- **核心依赖**: 原生 Fetch API (无外部依赖)

## 项目结构

```
src/
  index.js          # Cloudflare Workers 入口点
  handle_request.js  # 主请求处理逻辑
  verify_keys.js    # API Key 验证功能
  openai.mjs        # OpenAI 格式兼容处理
  deno_index.ts     # Deno 部署入口点
api/
  vercel_index.js   # Vercel API 路由
netlify/
  functions/
    api.js          # Netlify Functions 入口
```

## 构建和运行命令

### 本地开发
```bash
npm install -g vercel
vercel dev
```

### 部署命令
- **Vercel**: `vercel --prod`
- **Deno**: 通过 Deno Deploy 控制台部署
- **Cloudflare**: 通过 Wrangler CLI 或 Web UI 部署
- **Netlify**: 通过 Netlify CLI 或 Git 连接部署

## API 端点

### Gemini 原生代理
- `POST /v1beta/models/*` - 原生 Gemini API 端点
- 支持流式和非流式响应

### API Key 验证
- `POST /verify` - 批量验证 Gemini API Key 有效性

### OpenAI 兼容格式
- `POST /chat/completions` - OpenAI 聊天补全格式
- `POST /completions` - OpenAI 补全格式
- `POST /embeddings` - OpenAI 嵌入格式
- `GET /models` - 模型列表

## 开发约定

### 请求头处理
- `x-goog-api-key`: 支持多个 API Key 逗号分隔，自动负载均衡
- `Authorization: Bearer <key>`: OpenAI 格式认证

### 响应处理
- 移除敏感响应头（transfer-encoding, connection 等）
- 保持 CORS 友好配置
- 支持 Server-Sent Events (SSE) 流式响应

### 错误处理
- 统一的错误响应格式
- 详细的错误日志记录
- 友好的用户错误信息

## 部署配置

各平台配置文件：
- `vercel.json` - Vercel 部署配置
- `wrangler.toml` - Cloudflare Workers 配置
- `netlify.toml` - Netlify 配置

## 测试和验证

使用 curl 命令测试部署：
```bash
# 测试 API Key 验证
curl -X POST https://your-domain/verify -H "x-goog-api-key: key1,key2"

# 测试 Gemini 代理
curl -X POST https://your-domain/v1beta/models/gemini-pro:generateContent \
  -H "Content-Type: application/json" \
  -H "x-goog-api-key: your-key" \
  -d '{"contents":[{"role":"user","parts":[{"text":"Hello"}]}]}'

# 测试 OpenAI 格式
curl -X POST https://your-domain/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-key" \
  -d '{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"Hello"}]}'
```

## 注意事项

1. **国内访问**: 需要配置自定义域名才能在国内正常访问
2. **API Key 安全**: 不要在客户端暴露 API Key，使用代理层进行认证
3. **速率限制**: 注意 Gemini API 的调用频率限制
4. **地域限制**: Cloudflare Workers 可能分配到香港节点导致无法使用

## 故障排除

- 检查部署平台的日志输出
- 验证 API Key 是否有效（使用 /verify 端点）
- 确认网络连接和域名解析正常