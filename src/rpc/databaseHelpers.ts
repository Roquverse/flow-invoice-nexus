
import { supabase } from "@/integrations/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";

interface TableColumn {
  name: string;
  dataType: string;
}

/**
 * Executes a raw SQL query safely.
 */
export const executeQuery = async <T,>(query: string): Promise<T[]> => {
  try {
    const { data, error } = await supabase.rpc<T>("execute_query", { query_text: query });
    
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
    // Use raw SQL query to get tables to avoid type errors
    const query = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'";
    const data = await executeQuery<{ table_name: string }>(query);

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
      // Use a safer way to get schema info
      const query = `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${table}' AND table_schema = 'public'`;
      const data = await executeQuery<{ column_name: string; data_type: string }>(query);
      
      schemas[table] = {
        columns: data.map(col => col.column_name),
        types: data.reduce((acc: Record<string, string>, col: any) => {
          acc[col.column_name] = col.data_type;
          return acc;
        }, {})
      };
    }
    
    return schemas;
  } catch (error) {
    console.error("Failed to get table schemas:", error);
    return {};
  }
};

// Functions for the DebugDatabase component
export const getAllTables = getTablesList;

export const getTableColumns = async (tableName: string): Promise<TableColumn[]> => {
  try {
    const query = `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${tableName}' AND table_schema = 'public'`;
    const data = await executeQuery<{ column_name: string; data_type: string }>(query);
    
    return data.map(col => ({
      name: col.column_name,
      dataType: col.data_type
    }));
  } catch (error) {
    console.error(`Failed to get columns for ${tableName}:`, error);
    return [];
  }
};

export const getSampleTableData = async (tableName: string, limit: number = 10): Promise<any[]> => {
  try {
    const query = `SELECT * FROM "${tableName}" LIMIT ${limit}`;
    const data = await executeQuery(query);
    
    return data;
  } catch (error) {
    console.error(`Failed to get data for ${tableName}:`, error);
    return [];
  }
};
