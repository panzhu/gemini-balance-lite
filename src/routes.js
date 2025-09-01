import { getMetricsSummary } from './metrics.js';

export function handleMetrics() {
  const metrics = getMetricsSummary();
  return new Response(JSON.stringify(metrics, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}