const { Visitor } = require("../models");

exports.createVisitor = async (req, res) => {
  const { ip, userAgent, videoUrl } = req.body;

  try {
    const visitor = await Visitor.create({
      ip,
      userAgent,
      videoUrl,
    });

    res.status(201).json(visitor);
  } catch (error) {
    res.status(500).json({ error: "Failed to create visitor" });
  }
};
