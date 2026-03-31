const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

// 📁 Frontend serve
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// 📁 Download folder
const DOWNLOADS = path.join(__dirname, "downloads");

// Create folder if not exists
if (!fs.existsSync(DOWNLOADS)) {
  fs.mkdirSync(DOWNLOADS);
}

// 🎯 Download API
app.post("/download", (req, res) => {
  const { url, format = "mp4", quality = "best" } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const fileName = `file_${Date.now()}`;
  const outputTemplate = path.join(DOWNLOADS, `${fileName}.%(ext)s`);

  let command;

  // 🎵 MP3 Download (FIXED)
  if (format === "mp3") {
    command = `yt-dlp -x --audio-format mp3 -o "${outputTemplate}" "${url}"`;
  }

  // 🎬 MP4 Download (FIXED)
  else {
    let qualityFormat = "best";

    if (quality === "360") qualityFormat = "bestvideo[height<=360]+bestaudio";
    if (quality === "720") qualityFormat = "bestvideo[height<=720]+bestaudio";
    if (quality === "1080") qualityFormat = "bestvideo[height<=1080]+bestaudio";

    command = `yt-dlp -f "${qualityFormat}" -o "${outputTemplate}" "${url}"`;
  }

  console.log("Running command:", command);

  exec(command, (error, stdout, stderr) => {
    console.log("STDOUT:", stdout);
    console.log("STDERR:", stderr);

    if (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: stderr || "Download failed" });
    }

    // 📂 Find downloaded file
    const files = fs.readdirSync(DOWNLOADS);
    const downloadedFile = files.find((f) => f.startsWith(fileName));

    if (!downloadedFile) {
      return res.status(500).json({ error: "File not found" });
    }

    const filePath = path.join(DOWNLOADS, downloadedFile);

    // 📤 Send file
    res.download(filePath, downloadedFile, (err) => {
      if (err) {
        console.error("Download error:", err);
      }
      
      // 🧹 Delete file after download
      fs.unlink(filePath, () => {});
    });
  });
});

// 🚀 Start server (FIXED for Railway)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});