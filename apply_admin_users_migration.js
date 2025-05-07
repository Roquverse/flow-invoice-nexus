const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Read connection string from file
const connectionString = fs
  .readFileSync("./connection_string.txt", "utf8")
  .trim();

// Initialize Supabase client
const supabase = createClient(connectionString, "your-service-role-key");

// Function to apply a migration from a file
async function applyMigration(filePath) {
  try {
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.error(`Migration file not found: ${filePath}`);
      return false;
    }

    // Read the SQL file
    const sql = fs.readFileSync(filePath, "utf8");

    console.log(`Applying migration: ${path.basename(filePath)}`);
    console.log("-".repeat(50));

    // Execute the SQL query
    const { error } = await supabase.rpc("exec_sql", { sql_query: sql });

    if (error) {
      console.error("Error applying migration:", error);
      return false;
    }

    console.log("Migration applied successfully!");
    return true;
  } catch (err) {
    console.error("Error:", err);
    return false;
  }
}

// Main function
async function main() {
  const migrationPath = path.join(
    __dirname,
    "supabase",
    "migrations",
    "20240601_admin_users.sql"
  );

  console.log("Starting admin_users table migration...");
  const success = await applyMigration(migrationPath);

  if (success) {
    console.log("Migration completed successfully.");
  } else {
    console.error("Migration failed.");
    process.exit(1);
  }
}

// Run the main function
main();
