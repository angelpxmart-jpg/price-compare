export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "query required" });
  }

  try {
    const url = `https://api.biggo.com/api/v1/spa/search/${encodeURIComponent(q)}/product`;
    const resp = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "site": "biggo.com.tw",
        "region": "tw",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36"
      }
    });

    if (!resp.ok) {
      return res.status(resp.status).json({ error: `BigGo error: ${resp.status}` });
    }

    const data = await resp.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, s-maxage=300");
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
