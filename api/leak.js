import crypto from "crypto";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { password, email } = req.query;

  // --- Password check (free, no key, k-anonymity) ---
  if (password) {
    const sha1 = crypto.createHash("sha1").update(password).digest("hex").toUpperCase();
    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);

    const r = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const body = await r.text();
    let count = 0;
    for (const line of body.split("\n")) {
      const [hash, c] = line.trim().split(":");
      if (hash === suffix) { count = parseInt(c, 10); break; }
    }
    return res.status(200).json({
      type: "password",
      pwned: count > 0,
      count,
      message: count > 0
        ? `⚠️ Found in ${count.toLocaleString()} breaches. Change it everywhere.`
        : "✅ Not found in known breaches."
    });
  }

  // --- Email check (link-out; HIBP needs a key for the API) ---
  if (email) {
    return res.status(200).json({
      type: "email",
      links: [
        { name: "Have I Been Pwned", url: `https://haveibeenpwned.com/account/${encodeURIComponent(email)}` },
        { name: "Firefox Monitor", url: `https://monitor.firefox.com/` },
        { name: "DeHashed", url: `https://dehashed.com/search?query=${encodeURIComponent(email)}` },
        { name: "LeakCheck", url: `https://leakcheck.io/` },
        { name: "IntelX", url: `https://intelx.io/?s=${encodeURIComponent(email)}` },
        { name: "Snusbase", url: `https://snusbase.com/` },
        { name: "Leak-Lookup", url: `https://leak-lookup.com/` }
      ]
    });
  }

  return res.status(400).json({ error: "Send ?password= or ?email=" });
}
