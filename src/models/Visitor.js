module.exports = (sequelize, DataTypes) => {
  const Visitor = sequelize.define(
    "Visitor",
    {
      ip: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userAgent: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      videoUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      downloadedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "visitors",
      timestamps: false,
    }
  );

  return Visitor;
};
