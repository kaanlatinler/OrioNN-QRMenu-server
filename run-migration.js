const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "qr_menu",
  });

  try {
    const migrationPath = path.join(
      __dirname,
      "migrations",
      "add-view-count-to-products.sql"
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    console.log("Running migration: add-view-count-to-products.sql");
    await connection.execute(migrationSQL);

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await connection.end();
  }
}

runMigration();
