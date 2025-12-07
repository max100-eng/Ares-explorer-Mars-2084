export async function ping() {
  const res = await fetch('/api/ping');
  return res.json();
}

export async function callGemini(prompt: string, options?: { mock?: boolean }) {
  const qs = options && options.mock ? '?mock=true' : '';
  const res = await fetch(`/api/gemini${qs}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API error ${res.status}`);
  }
  return res.json();
}
