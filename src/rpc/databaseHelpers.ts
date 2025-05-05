
import { supabase } from "../integrations/supabase/client";

/**
 * Gets column information for a specified table
 */
export async function getTableColumns(tableName: string) {
  const { data, error } = await supabase.rpc("get_table_columns", {
    table_name: tableName
  });

  if (error) {
    console.error("Error fetching table columns:", error);
    return null;
  }

  return data;
}

/**
 * Executes a simple query to get some rows from a table
 */
export async function getSampleTableData(tableName: string, limit = 5) {
  // We need to use 'any' type here because the table name is dynamic
  const { data, error } = await supabase
    .from(tableName as any)
    .select("*")
    .limit(limit);

  if (error) {
    console.error(`Error fetching sample data for ${tableName}:`, error);
    return null;
  }

  return data;
}

/**
 * Gets a list of all tables in the public schema
 */
export async function getAllTables() {
  const { data, error } = await supabase
    .from("pg_tables")
    .select("tablename")
    .eq("schemaname", "public");

  if (error) {
    console.error("Error fetching tables:", error);
    return null;
  }

  return data?.map(t => t.tablename) || [];
}
