// This script applies the SQL migration to your Supabase PostgreSQL database

import pkg from "pg";
const { Client } = pkg;
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the connection string from command line arguments
const connectionString = process.argv[2];

if (!connectionString) {
  console.error("Error: Connection string is required");
  console.error("Usage: node apply_migration.js <connection_string>");
  process.exit(1);
}

async function applyMigration() {
  const client = new Client({
    connectionString,
  });

  try {
    // Read the migration file
    const migrationPath = path.join(
      __dirname,
      "supabase",
      "migrations",
      "20240504_settings_tables.sql"
    );
    const migrationSql = fs.readFileSync(migrationPath, "utf8");

    // Connect to the database
    console.log("Connecting to database...");
    await client.connect();

    // Apply the migration
    console.log("Applying migration...");
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
