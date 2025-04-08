const express = require("express");
const router = express.Router();
const videoController = require("../controllers/VideoController");
const donwloadServices = require("../services/DownloadServices");

router.get("/formats", videoController.getVideoFormats);
router.post("/download", donwloadServices.downloadVideo);

module.exports = router;
