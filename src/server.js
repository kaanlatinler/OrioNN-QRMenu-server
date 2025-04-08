const express = require("express");

const path = require("path");

const app = express();
const { port } = require("./config/env") || 3000;

const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const visitorRoutes = require("./routes/VisitorRoutes");
const videoRoutes = require("./routes/VideoRoutes");

// Statik dosyaları sun
app.use(express.static(path.join(__dirname, "public")));

// Video indirme endpoint’i

app.use("/api/videos", videoRoutes);
app.use("/api/visitors", visitorRoutes);

app.listen(port, () => {
  console.log(`Server çalışıyor: http://localhost:${port}`);
});
