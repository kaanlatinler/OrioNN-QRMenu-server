const { Sequelize } = require("sequelize");
const config = require("./src/config/env").development;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: "mysql",
    port: config.port,
  }
);

async function resetDatabase() {
  try {
    console.log("Connecting to database...");
    await sequelize.authenticate();
    console.log("Connection established successfully.");

    // Show current tables
    console.log("\nCurrent tables in database:");
    const [tables] = await sequelize.query("SHOW TABLES");
    tables.forEach((table) => {
      console.log(`- ${Object.values(table)[0]}`);
    });

    console.log("\nDropping all tables...");
    await sequelize.drop();
    console.log("All tables dropped successfully.");

    console.log("Recreating tables...");
    // Import models after dropping tables
    require("./src/models");

    // Wait a moment for tables to be created
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("\nNew tables created:");
    const [newTables] = await sequelize.query("SHOW TABLES");
    newTables.forEach((table) => {
      console.log(`- ${Object.values(table)[0]}`);
    });

    console.log("\nDatabase reset completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error resetting database:", error);
    process.exit(1);
  }
}

resetDatabase();
