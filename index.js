const express = require("express");
const rakib = require("rakib-videos-downloader"); // your npm package
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Rakib AllDL API is live! \n Owner : Rakib Adil \n devwp: wa.me/+8801811276038 \n a api for all platform videos download and its for messenger bot \n Thank you ");
});

// Main route like: /rakib?url=https://...
app.get("/rakib", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  try {
    const data = await rakib.alldown(url); // your npm magic
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Download failed", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rakib AllDL API running on port ${PORT}`));
