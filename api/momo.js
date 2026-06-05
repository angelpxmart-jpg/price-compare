export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, s-maxage=1800"); // 30min cache

  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "query required", products: [] });

  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "no api key", products: [] });

  try {
    const momoUrl = `https://www.momoshop.com.tw/search/${encodeURIComponent(q)}?searchType=1`;

    const resp = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: momoUrl,
        formats: ["json"],
        waitFor: 5000,
        proxy: "stealth",
        jsonOptions: {
          prompt: "Extract all product listings from this momo search results page. Return an array called 'products' where each item has: name (product title), price (the final selling price as a number, after any discount shown)"
        }
      })
    });

    const data = await resp.json();
    const products = data.data?.json?.products || data.data?.json?.productListings || [];
    return res.json({ products });
  } catch (err) {
    return res.status(500).json({ error: String(err), products: [] });
  }
}
