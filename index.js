const express = require('express');
const axios = require('axios');
const ytdl = require('ytdl-core');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// YouTube Downloader
async function downloadYouTube(url) {
  if (!ytdl.validateURL(url)) throw new Error('Invalid YouTube URL');
  const info = await ytdl.getInfo(url);
  const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
  return format.url;
}

// TikTok Downloader via API
async function downloadTikTok(url) {
  const { data } = await axios.get(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`);
  if (data.data && data.data.play) return data.data.play;
  throw new Error('TikTok download failed');
}

// Facebook Downloader via public API
async function downloadFacebook(url) {
  const { data } = await axios.get(`https://fbdownloader.online/api/ajaxSearch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: `q=${encodeURIComponent(url)}`
  });
  if (data && data.links && data.links[0]) return data.links[0].url;
  throw new Error('Facebook download failed');
}

// Instagram Downloader via external scraper
async function downloadInstagram(url) {
  const { data } = await axios.get(`https://instadownloader.co/api?url=${encodeURIComponent(url)}`);
  if (data && data.url) return data.url;
  throw new Error('Instagram download failed');
}

// Main route
app.get('/rakib', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Provide a URL' });

  try {
    let downloadUrl;

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      downloadUrl = await downloadYouTube(url);
    } else if (url.includes('tiktok.com')) {
      downloadUrl = await downloadTikTok(url);
    } else if (url.includes('facebook.com')) {
      downloadUrl = await downloadFacebook(url);
    } else if (url.includes('instagram.com')) {
      downloadUrl = await downloadInstagram(url);
    } else {
      return res.status(400).json({ error: 'Unsupported platform' });
    }

    res.json({ success: true, url: downloadUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Download failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Rakib Adil Video Downloader API is running at http://localhost:${PORT}`);
});
