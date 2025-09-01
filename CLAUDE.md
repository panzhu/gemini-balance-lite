# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

*   **安装Vercel CLI**: `npm install -g vercel`
*   **本地Vercel开发**: `vercel dev` (在项目根目录运行)
*   **安装依赖**: `npm install`
*   **Cloudflare Workers开发**: `npx wrangler dev` (如果安装了`wrangler`，否则可能需要全局安装 `npm install -g wrangler`)
*   **Deno开发**: `deno run --allow-net --allow-env src/deno_index.ts` (这需要Deno运行时环境)

### 配置选项

*   **FETCH_TIMEOUT**: Gemini API请求超时时间（毫秒），默认30000
*   **RATE_LIMIT_CAPACITY**: 令牌桶容量，默认10
*   **RATE_LIMIT_REFILL_RATE**: 令牌填充速率（每秒），默认5
*   **MODELS_CACHE_TTL**: /models端点缓存时间（毫秒），默认3600000

## 高级代码架构和结构

该项目是一个Gemini API代理，旨在通过边缘函数在国内免费中转Gemini API，并支持聚合多个Gemini API Key进行负载均衡。

### 核心功能
*   **Gemini API 代理**: 处理并转发Gemini原生API格式的请求。
*   **API Key 校验**: 提供一个端点 (`/verify`) 来校验Gemini API Key的有效性。
*   **OpenAI 格式兼容**: 支持OpenAI API格式的请求 (`/chat` 或 `/chat/completions`)。

### 部署平台
项目设计为无服务器（Serverless）轻量版，支持在多种边缘函数平台部署：
*   **Vercel**: 使用 `vercel.json` 配置路由到 `/api/vercel_index.js` (虽然 `vercel.json` 指向 `vercel_index.js`, 但通过 `ls src/` 看到的是 `index.js`, 这可能是一个Vercel构建过程中的重命名或映射)。
*   **Deno Deploy**: 入口点为 `src/deno_index.ts`。
*   **Cloudflare Workers**: 使用 `wrangler.toml` 进行配置。
*   **Netlify**: 使用 `netlify.toml` 配置重定向到 `/.netlify/functions/api`。

### 主要文件 (`src/` 目录)
*   `deno_index.ts`: Deno部署的入口文件。
*   `handle_request.js`: 核心请求处理逻辑，可能包含API路由、密钥处理和负载均衡的实现。
*   `index.js`: 可能是一个通用的入口文件或Vercel/Netlify部署的默认入口。
*   `openai.mjs`: 处理将OpenAI格式请求转换为Gemini请求的逻辑。
*   `verify_keys.js`: 包含用于验证API Key的逻辑。
