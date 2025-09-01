import { getMetricsSummary } from './metrics.js';
import { GEMINI_API_BASE_URL, GEMINI_API_VERSION, ROOT_RESPONSE_MESSAGE } from './constants.js';
import { handleVerification } from './verify_keys.js';
import openaiHandler from './openai.mjs';

export function handleMetrics() {
  const metrics = getMetricsSummary();
  return new Response(JSON.stringify(metrics, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export function handleRoot() {
  return new Response(ROOT_RESPONSE_MESSAGE, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' }
  });
}

export function handleVerify(request) {
  return handleVerification(request);
}

export async function handleOpenAI(request) {
  return openaiHandler.fetch(request);
}

export function handleGemini(request, pathname, search) {
  // Construct the target URL for the Gemini API
  // Ensure pathname starts with '/' and avoid double slashes
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const targetUrl = `${GEMINI_API_BASE_URL}/${GEMINI_API_VERSION}${normalizedPath}${search}`;
  return { targetUrl };
}