
import { supabase } from "@/integrations/supabase/client";

/**
 * Gets all table names from the database
 */
export async function getAllTables() {
  try {
    // Use PostgreSQL's built-in information schema
    const { data, error } = await supabase.rpc('get_all_tables');
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Error fetching tables:", err);
    return [];
  }
}

/**
 * Gets all columns for a specific table
 */
export async function getTableColumns(tableName: string) {
  try {
    const { data, error } = await supabase.rpc('get_table_columns', {
      table_name: tableName
    });
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error(`Error fetching columns for table ${tableName}:`, err);
    return [];
  }
}

/**
 * Gets data from a specific table
 */
export async function getTableData(tableName: string) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*');
      
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error(`Error fetching data for table ${tableName}:`, err);
    return [];
  }
}
