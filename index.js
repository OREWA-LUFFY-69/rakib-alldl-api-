const express = require('express');
const axios = require('axios');
const ytdl = require('ytdl-core'); // For YouTube video downloading
const TikTokScraper = require('tiktok-scraper'); // For TikTok video downloading
const cheerio = require('cheerio'); // For scraping websites like Facebook and Instagram
const puppeteer = require('puppeteer'); // For handling more complex page scraping (like Instagram)

const app = express();
const PORT = 3000;

// Function to handle YouTube video downloads
async function downloadYouTube(url) {
  try {
    if (!ytdl.validateURL(url)) {
      throw new Error('Invalid YouTube URL.');
    }
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
    return format.url;
  } catch (err) {
    throw new Error('Failed to download YouTube video.');
  }
}

// Function to handle TikTok video downloads
async function downloadTikTok(url) {
  try {
    const video = await TikTokScraper.getVideoMeta(url);
    return video.collector[0].videoUrl;
  } catch (err) {
    throw new Error('Failed to download TikTok video.');
  }
}

// Function to scrape Facebook video (using cheerio or puppeteer for complex cases)
async function downloadFacebook(url) {
  try {
    // For demonstration, this is a placeholder. You need a scraping solution or service for Facebook.
    const response = await axios.get(`https://www.fbdown.net/?url=${url}`);
    const $ = cheerio.load(response.data);
    const downloadUrl = $('a[href*="fbdown.net/download"]').attr('href'); // Simplified
    return downloadUrl;
  } catch (err) {
    throw new Error('Failed to download Facebook video.');
  }
}

// Function to scrape Instagram video (requires puppeteer for Instagram login and scraping)
async function downloadInstagram(url) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    
    const videoUrl = await page.evaluate(() => {
      const video = document.querySelector('video');
      return video ? video.src : null;
    });
    
    await browser.close();
    if (videoUrl) {
      return videoUrl;
    } else {
      throw new Error('Could not find Instagram video.');
    }
  } catch (err) {
    throw new Error('Failed to download Instagram video.');
  }
}

// Main route to handle video downloads
app.get('/rakib', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Please provide a video URL.' });
  }

  try {
    let downloadUrl;

    // Detect platform and call the appropriate function
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      downloadUrl = await downloadYouTube(url);
    } else if (url.includes('tiktok.com')) {
      downloadUrl = await downloadTikTok(url);
    } else if (url.includes('facebook.com')) {
      downloadUrl = await downloadFacebook(url);
    } else if (url.includes('instagram.com')) {
      downloadUrl = await downloadInstagram(url);
    } else {
      return res.status(400).json({ error: 'Unsupported platform.' });
    }

    // Return the video download URL
    res.json({ videoUrl: downloadUrl });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to fetch the video.', details: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}`);
});
