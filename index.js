const express = require("express");
const rakib = require("rakib-videos-downloader");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    "Rakib AllDL API is live! \n" +
    "Owner: Rakib Adil \n" +
    "devwp: wa.me/+8801811276038 \n" +
    "This API supports downloading from Facebook, Instagram, YouTube, TikTok, CapCut, Pinterest, Twitter and more.\n" +
    "Thank you!"
  );
});

app.get("/rakib", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing URL!" });

  try {
    console.log("Requested URL:", url);

    const data = await rakib.alldown(url);
    console.log("Downloader Response:", data);

    if (!data || !data.video) {
      return res.status(404).json({ error: "Video not found or unsupported link.🔍" });
    }

    res.json({
      video: data.video,
      thumbnail: data.thumbnail || null,
      title: data.title || "Video",
      platform: data.platform || "unknown"
    });

  } catch (err) {
    console.error("Download Error:", err.message);
    res.status(500).json({ error: "Download failed ❌", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Rakib AllDL API running on port ${PORT}`);
});
