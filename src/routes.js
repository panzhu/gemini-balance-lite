import { getMetricsSummary } from './metrics.js';
import { GEMINI_API_BASE_URL, GEMINI_API_VERSION } from './constants.js';

export function handleMetrics() {
  const metrics = getMetricsSummary();
  return new Response(JSON.stringify(metrics, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export function handleGemini(request, pathname, search) {
  // Construct the target URL for the Gemini API
  const targetUrl = `${GEMINI_API_BASE_URL}/${GEMINI_API_VERSION}${pathname}${search}`;
  return { targetUrl };
}