
import { supabase } from "@/integrations/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";

/**
 * Executes a raw SQL query safely.
 */
export const executeQuery = async <T,>(query: string): Promise<T[]> => {
  try {
    const { data, error } = await supabase.rpc("execute_query", { query_text: query });
    
    if (error) {
      throw new Error(`SQL query error: ${error.message}`);
    }
    
    return data as T[];
  } catch (error) {
    console.error("Failed to execute query:", error);
    throw error;
  }
};

/**
 * Gets the list of tables in the public schema.
 */
export const getTablesList = async (): Promise<string[]> => {
  try {
    // Use information_schema to get tables from public schema
    const { data, error } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public");

    if (error) {
      console.error("Error fetching tables:", error);
      return [];
    }

    return data.map((row) => row.table_name);
  } catch (error) {
    console.error("Failed to get tables list:", error);
    return [];
  }
};

/**
 * Gets all table schemas from the database.
 */
export const getTableSchemas = async () => {
  try {
    const tables = await getTablesList();
    
    // Create schema object to store all table schemas
    const schemas: Record<string, any> = {};
    
    // For each table, get its schema
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table as any)
        .select()
        .limit(0);
        
      if (error) {
        console.error(`Error fetching schema for ${table}:`, error);
        continue;
      }
      
      schemas[table] = {
        columns: Object.keys(data?.[0] || {}),
      };
    }
    
    return schemas;
  } catch (error) {
    console.error("Failed to get table schemas:", error);
    return {};
  }
};
