import { FETCHABLE, enc } from "./_sources.js";

const TIMEOUT = 9000;

async function fetchOne(src, q) {
  const url = src.build(q);
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml"
      }
    });
    const html = await res.text();
    return { id: src.id, ok: true, results: src.parse ? src.parse(html) : [], url };
  } catch (e) {
    return { id: src.id, ok: false, error: String(e), url };
  } finally {
    clearTimeout(t);
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const q = {
    first: req.query.first || "",
    last: req.query.last || "",
    city: req.query.city || "",
    state: req.query.state || "",
    age: req.query.age || "",
    address: req.query.address || ""
  };

  if (!q.first && !q.last && !q.address) {
    return res.status(400).json({ error: "Need at least a name or address." });
  }

  // Fire all fetchable sources in parallel.
  const settled = await Promise.allSett
