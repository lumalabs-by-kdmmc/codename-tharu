// Thin OpenAI client. Reads OPENAI_API_KEY; model configurable via LLM_MODEL.
// Returns parsed JSON (models are called in JSON mode).

const DEFAULT_MODEL = () => process.env.LLM_MODEL || "gpt-4o-mini";

export function hasLLM() {
  return !!process.env.OPENAI_API_KEY;
}

async function call(body) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    const e = new Error("OpenAI key not configured");
    e.code = "NO_LLM";
    throw e;
  }
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    throw new Error("LLM request failed: " + r.status + " " + t.slice(0, 200));
  }
  const j = await r.json();
  const content = (j.choices && j.choices[0] && j.choices[0].message.content) || "{}";
  return JSON.parse(content);
}

export async function chatJSON(messages, { model, temperature = 0.7 } = {}) {
  return call({ model: model || DEFAULT_MODEL(), messages, response_format: { type: "json_object" }, temperature });
}

export async function visionJSON(prompt, imageDataUrl, { model, temperature = 0.6 } = {}) {
  const messages = [{
    role: "user",
    content: [
      { type: "text", text: prompt },
      { type: "image_url", image_url: { url: imageDataUrl } },
    ],
  }];
  // Vision needs a vision-capable model regardless of LLM_MODEL default.
  return call({ model: model || "gpt-4o", messages, response_format: { type: "json_object" }, temperature, max_tokens: 900 });
}
