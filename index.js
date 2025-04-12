const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Rakib AllDL API is Live!, \n Owner: Rakib Adil, \n Devwp : wa.me/+8801811276038, \n ");
});

// Main route to handle video download
app.get("/rakib", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing video URL!" });

  try {
    // Use a third-party API to fetch video information
    const apiUrl = `https://aiovideodl.ml/api?url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);

    // Check if the response has valid data
    if (response.data && response.data.medias && response.data.medias.length > 0) {
      res.json({
        platform: response.data.title || "Video",
        thumbnail: response.data.thumbnail,
        video: response.data.medias[0].url
      });
    } else {
      res.status(404).json({ error: "Video not found or unsupported link." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch video", details: err.message });
  }
});

// Set the port for the API to listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Rakib AllDL API running on port", PORT);
});
