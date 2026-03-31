const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());

// 📁 Static files serve
app.use(express.static(path.join(__dirname, "../frontend")));

// 📥 Download API
app.post("/download", (req, res) => {
    const { url, format, quality } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL required" });
    }

    // ✅ cookies path FIX
    const cookiesPath = path.join(__dirname, "cookies.txt");


// 📁 downloads folder ensure
const downloadsDir = path.join(__dirname, "downloads");
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir);
}

  // 📁 output file
const fileName = `file_${Date.now()}`;
const outputTemplate = path.join(downloadsDir, `${fileName}.%(ext)s`);

   // ✅ Windows + Railway compatible yt-dlp path
const ytdlpPath = process.platform === "win32" ? "yt-dlp" : "/usr/local/bin/yt-dlp";

// 🎯 yt-dlp command
let command;

if (format === "mp3") {
    command = `${ytdlpPath} -x --audio-format mp3 \
--cookies "${cookiesPath}" \
--extractor-args "youtube:player_client=android" \
-o "${outputTemplate}" "${url}"`;
} else {
    command = `${ytdlpPath} -f "bestvideo+bestaudio/best" \
--cookies "${cookiesPath}" \
--extractor-args "youtube:player_client=android" \
-o "${outputTemplate}" "${url}"`;
}

    console.log("Running command:", command);

    exec(command, (error, stdout, stderr) => {
        console.log("STDOUT:", stdout);
        console.error("STDERR:", stderr);

        if (error) {
            return res.status(500).json({ error: "Download failed" });
        }

        // 📁 Find downloaded file
        const ext = format === "mp3" ? "mp3" : "mp4";
        const filePath = path.join(__dirname, "downloads", `${fileName}.${ext}`);

        // 📤 Send file
        res.download(filePath, err => {
            if (err) {
                console.error(err);
            }

            // 🧹 cleanup
            fs.unlink(filePath, () => {});
        });
    });
});

// 🚀 Server start
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🔥 Server running on port ${PORT}`);
});