import pkg from "pg";
const { Client } = pkg;
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the connection string from command line arguments or read from file
let connectionString = process.argv[2];

// If no connection string provided via command line, try to read from file
if (!connectionString) {
  try {
    connectionString = fs.readFileSync("connection_string.txt", "utf8").trim();
  } catch (error) {
    console.error("Error: Connection string is required");
    console.error(
      "Usage: node apply_receipt_quote_migration.js <connection_string>"
    );
    console.error(
      "Or ensure connection_string.txt exists with valid connection string"
    );
    process.exit(1);
  }
}

async function applyMigration() {
  const client = new Client({
    connectionString,
  });

  try {
    // Migration SQL
    const migrationSql =
      "ALTER TABLE receipts ADD COLUMN IF NOT EXISTS quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL;";

    // Connect to the database
    console.log("Connecting to database...");
    await client.connect();

    // Apply the migration
    console.log("Applying migration to add quote_id to receipts table...");
    await client.query(migrationSql);

    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Error applying migration:", error.message);
  } finally {
    // Close the connection
    await client.end();
  }
}

applyMigration();
