#!/bin/bash

# Connection string (will be passed as an argument)
CONNECTION_STRING=$1

# Check if connection string is provided
if [ -z "$CONNECTION_STRING" ]; then
  echo "Error: Connection string is required"
  echo "Usage: ./apply_migration.sh <connection_string>"
  exit 1
fi

# Apply the migration
echo "Applying migration..."
psql "$CONNECTION_STRING" -f supabase/migrations/20240504_settings_tables.sql

echo "Migration completed." 