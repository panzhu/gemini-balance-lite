import { defaultTokenBucket } from './token_bucket.js';
import { logError, categorizeError } from './error_handler.js';
import { fetchWithTimeout } from './fetch_utils.js';
import { handleRoot, handleVerify, handleOpenAI, handleGemini, handleMetrics } from './routes.js';
import { ROOT_PATHS, VERIFY_PATH, OPENAI_ENDPOINTS } from './constants.js';
import { withMetrics } from './metrics.js';
import { ENV_FETCH_TIMEOUT, DEFAULT_FETCH_TIMEOUT } from './constants.js';

export const handleRequest = withMetrics(async (request) => {

  const url = new URL(request.url);
  const pathname = url.pathname;
  const search = url.search;

  if (pathname === '/metrics') {
    return handleMetrics();
  }

  if (ROOT_PATHS.includes(pathname)) {
    return handleRoot();
  }

  if (pathname === VERIFY_PATH && request.method === 'POST') {
    return handleVerify(request);
  }

  // 处理OpenAI格式请求
  const isOpenAIEndpoint = OPENAI_ENDPOINTS.some(endpoint =>
    url.pathname.endsWith(endpoint)
  );
  if (isOpenAIEndpoint) {
    return handleOpenAI(request);
  }

  // 只有以/models开头的请求才转发给Gemini API
  if (!pathname.startsWith('/models')) {
    return new Response('Not Found', { status: 404 });
  }

  const { targetUrl } = handleGemini(request, pathname, search);

  try {
    const headers = new Headers();
    for (const [key, value] of request.headers.entries()) {
      if (key.trim().toLowerCase() === 'x-goog-api-key') {
        const apiKeys = value.split(',').map(k => k.trim()).filter(k => k);
        if (apiKeys.length > 0) {
          const selectedKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
          console.log(`Gemini Selected API Key: ${selectedKey}`);
          headers.set('x-goog-api-key', selectedKey);
        }
      } else {
        if (key.trim().toLowerCase() === 'content-type') {
          headers.set(key, value);
        }
      }
    }

    console.log('Request Sending to Gemini')
    console.log('targetUrl:' + targetUrl)
    console.log(headers)

    // 使用令牌桶算法进行速率限制
    await defaultTokenBucket.waitForTokens(1);

    // Get timeout from environment variable or use default
    const FETCH_TIMEOUT = parseInt(process.env[ENV_FETCH_TIMEOUT]) || DEFAULT_FETCH_TIMEOUT;

    const response = await fetchWithTimeout(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.body
    }, FETCH_TIMEOUT);

    console.log("Call Gemini Success")

    const responseHeaders = new Headers(response.headers);

    console.log('Header from Gemini:')
    console.log(responseHeaders)

    responseHeaders.delete('transfer-encoding');
    responseHeaders.delete('connection');
    responseHeaders.delete('keep-alive');
    responseHeaders.delete('content-encoding');
    responseHeaders.set('Referrer-Policy', 'no-referrer');

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders
    });

  } catch (error) {
    // Log detailed error information with context
    logError(error, 'handleRequest', {
      targetUrl,
      requestMethod: request.method,
      requestHeaders: Object.fromEntries(request.headers.entries())
    });

    // Return appropriate error response
    const category = categorizeError(error);
    let status = 500;
    let message = 'Internal Server Error';

    switch (category) {
      case 'network_error':
        message = 'Network Error: Unable to reach Gemini API';
        break;
      case 'authentication_error':
        status = 401;
        message = 'Authentication Error: Invalid API Key';
        break;
      case 'rate_limit_error':
        status = 429;
        message = 'Rate Limit Exceeded: Too many requests';
        break;
      case 'validation_error':
        status = 400;
        message = 'Bad Request: Invalid request parameters';
        break;
      case 'timeout_error':
        message = 'Request Timeout: The request took too long';
        break;
    }

    return new Response(message, {
      status,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
});
