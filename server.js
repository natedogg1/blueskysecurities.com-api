import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const IEX_KEY = process.env.IEX_API_KEY;
const METALS_KEY = process.env.METALS_API_KEY;

app.get("/prices", async (req, res) => {
  try {
    const [stocks, crypto, metals] = await Promise.all([
      fetch(
        `https://cloud.iexapis.com/stable/stock/market/batch?symbols=AAPL,MSFT,SPY&types=quote&token=${IEX_KEY}`
      ).then(r => r.json()),

      fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
      ).then(r => r.json()),

      fetch(
        `https://metals-api.com/api/latest?access_key=${METALS_KEY}&base=USD&symbols=XAU,XAG`
      ).then(r => r.json())
    ]);

    res.json({ stocks, crypto, metals });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch prices" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
