// api/_sources.js

// Sources we can actually fetch server-side and parse.
// Each returns a normalized array: { name, title, snippet, url, source }
export const FETCHABLE = [
  {
    id: "truepeoplesearch",
    name: "TruePeopleSearch",
    build: (q) => `https://www.truepeoplesearch.com/results?name=${enc(q.first + " " + q.last)}&citystatezip=${enc(q.city || "")}`,
    parse: truepeoplesearch
  },
  {
    id: "fastpeoplesearch",
    name: "FastPeopleSearch",
    build: (q) => `https://www.fastpeoplesearch.com/name/${enc((q.first + "-" + q.last).toLowerCase())}_${enc((q.city || "").toLowerCase())}`,
    parse: fastpeoplesearch
  },
  {
    id: "whitepages",
    name: "Whitepages",
    build: (q) => `https://www.whitepages.com/name/${enc(q.first)}-${enc(q.last)}/${enc(q.city || "")}`,
    parse: truepeoplesearch // generic fallback parser
  },
  {
    id: "familysearch",
    name: "FamilySearch",
    build: (q) => `https://www.familysearch.org/search/record/results?q.givenName=${enc(q.first)}&q.surname=${enc(q.last)}`,
    parse: generic
  }
];

// 700+ link-out sources, grouped. These open in new tabs pre-filled.
// (Full list lives in data.js on the client — this mirrors the fetchable subset.)
export const LINK_ONLY_GROUPS = ["records", "states", "leaks", "dorks", "social", "misc"];

export function enc(s = "") {
  return encodeURIComponent(String(s).trim());
}

/* ---------- parsers ---------- */

function truepeoplesearch(html) {
  const out = [];
  // TruePeopleSearch cards contain data in a predictable structure.
  const cardRe = /<div class="card-summary[\s\S]*?<\/div>\s*<\/div>/g;
  const nameRe = /<span class="h4">([^<]+)<\/span>/;
  const addrRe = /<span itemprop="streetAddress">([^<]+)<\/span>/;
  const ageRe = /Age:\s*<\/span>\s*<span[^>]*>(\d+)</;
  let m;
  while ((m = cardRe.exec(html))) {
    const block = m[0];
    const name = nameRe.exec(block)?.[1]?.trim();
    const addr = addrRe.exec(block)?.[1]?.trim();
    const age = ageRe.exec(block)?.[1]?.trim();
    if (name) out.push({
      name: "TruePeopleSearch",
      title: name,
      snippet: [addr, age ? `Age ${age}` : ""].filter(Boolean).join(" • "),
      url: "https://www.truepeoplesearch.com",
      source: "people"
    });
    if (out.length >= 10) break;
  }
  return out;
}

function fastpeoplesearch(html) {
  return generic(html, "FastPeopleSearch");
}

function generic(html, name = "Result") {
  // Cheap universal extractor: pull <title>, meta description, and first headings.
  const out = [];
  const title = /<title>([^<]+)<\/title>/i.exec(html)?.[1]?.trim();
  const desc = /<meta[^>]+name="description"[^>]+content="([^"]+)"/i.exec(html)?.[1]?.trim();
  if (title) out.push({ name, title, snippet: desc || "", url: "", source: "people" });
  // grab a few <h2>/<h3> as candidate rows
  const hRe = /<h[23][^>]*>([^<]{3,80})<\/h[23]>/gi;
  let h, i = 0;
  while ((h = hRe.exec(html)) && i < 8) {
    const t = h[1].trim();
    if (t && !out.some(o => o.title === t)) out.push({ name, title: t, snippet: "", url: "", source: "people" });
    i++;
  }
  return out;
}
