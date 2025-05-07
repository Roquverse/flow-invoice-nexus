
import { supabase } from "@/integrations/supabase/client";

// Get all tables in the database
export async function loadTables(): Promise<string[]> {
  try {
    // This is a simplification. In a real app, you would need 
    // to query schema information from PostgreSQL system tables
    // or use a predefined list of tables from your schema
    return [
      "clients",
      "invoices",
      "quotes",
      "receipts",
      "user_profiles",
      "company_settings"
    ];
  } catch (error) {
    console.error("Error loading tables:", error);
    return [];
  }
}

// Get columns for a specific table
export async function getTableColumns(tableName: string): Promise<any[]> {
  try {
    // For demonstration purposes, we're returning a simplified structure
    // In a real app, you would query PostgreSQL information_schema
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      console.error(`Error loading columns for table ${tableName}:`, error);
      return [];
    }
    
    // If we have data, extract column names from the first row
    if (data && data.length > 0) {
      const columnNames = Object.keys(data[0]);
      return columnNames.map(name => ({ 
        column_name: name,
        data_type: typeof data[0][name]
      }));
    }
    
    return [];
  } catch (error) {
    console.error(`Error loading columns for table ${tableName}:`, error);
    return [];
  }
}

// Add these functions to match imports in other files
export async function getAllTables(): Promise<string[]> {
  return await loadTables();
}

export async function getSampleTableData(tableName: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(10);
    
    if (error) {
      console.error(`Error loading sample data for table ${tableName}:`, error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error(`Error loading sample data for table ${tableName}:`, error);
    return [];
  }
}
