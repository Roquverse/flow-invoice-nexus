import { supabase } from "@/integrations/supabase/client";

// Fix the TableColumn type
export async function loadTables(): Promise<string[]> {
  try {
    const { data, error } = await supabase.from("tables").select("name");
    if (error) {
      console.error("Error loading tables:", error);
      return [];
    }
    return data.map((table) => table.name);
  } catch (error) {
    console.error("Error loading tables:", error);
    return [];
  }
}

// Fix the type parameter
export async function getTableColumns(tableName: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from("columns")
      .select("*")
      .eq("table_name", tableName);
    if (error) {
      console.error(`Error loading columns for table ${tableName}:`, error);
      return [];
    }
    return data;
  } catch (error) {
    console.error(`Error loading columns for table ${tableName}:`, error);
    return [];
  }
}
