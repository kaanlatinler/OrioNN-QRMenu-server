const ytdl = require("ytdl-core");

exports.getVideoFormats = async (req, res) => {
  const videoURL = req.query.url;

  if (!ytdl.validateURL(videoURL)) {
    return res.status(400).json({ error: "Geçersiz URL" });
  }

  try {
    const info = await ytdl.getInfo(videoURL);
    const formats = info.formats;

    const uniqueResolutions = [];

    const filteredFormats = formats
      .filter(
        (format) =>
          format.container === "mp4" && format.hasVideo && format.qualityLabel
      )
      .map((format) => {
        const resolution = format.qualityLabel;

        if (!uniqueResolutions.includes(resolution)) {
          uniqueResolutions.push(resolution);
          return {
            itag: format.itag,
            resolution,
            container: format.container,
            hasAudio: format.hasAudio,
            hasVideo: format.hasVideo,
            size: format.contentLength,
          };
        }
        return null;
      })
      .filter(Boolean);

    res.json({
      title: info.videoDetails.title,
      formats: filteredFormats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Formatlar alınamadı" });
  }
};
