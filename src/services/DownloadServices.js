const ytdl = require("ytdl-core");
const fs = require("fs");

exports.downloadVideo = async (req, res) => {
  const { url: videoURL, format = "video", itag } = req.body;

  if (!ytdl.validateURL(videoURL)) {
    return res.status(400).send("Geçersiz YouTube URL’si");
  }

  try {
    const info = await ytdl.getInfo(videoURL);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, "");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${title}.${format === "audio" ? "mp3" : "mp4"}"`
    );
    res.setHeader(
      "Content-Type",
      format === "audio" ? "audio/mpeg" : "video/mp4"
    );

    const streamOptions =
      format === "audio"
        ? { filter: "audioonly" }
        : itag
        ? { quality: itag }
        : { quality: "highestvideo" };

    ytdl(videoURL, streamOptions).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.toString());
  }
};
