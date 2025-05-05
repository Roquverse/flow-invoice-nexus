
import React, { useState, useEffect } from "react";
import { supabase } from "../integrations/supabase/client";
import { PostgrestResponse } from "@supabase/supabase-js";

type TableColumn = {
  name: string;
  type: string;
  is_nullable: boolean;
};

type TableInfo = {
  name: string;
  columns: TableColumn[];
  rows: any[];
};

export default function DebugDatabase() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTables() {
      try {
        // Get list of tables from the schema
        const { data: tableList, error: tableError } = await supabase
          .from("pg_tables")
          .select("tablename")
          .eq("schemaname", "public");

        if (tableError) throw tableError;
        if (!tableList) throw new Error("No tables found");

        // Convert to array of table names
        const tableNames = tableList.map((t) => t.tablename);
        
        // For each table, get info and first few rows
        const tablesInfo: TableInfo[] = [];
        
        for (const tableName of tableNames) {
          // Get columns info
          const { data: columnsData, error: columnsError } = await supabase.rpc(
            "get_table_columns",
            { table_name: tableName as string }
          );
          
          if (columnsError) {
            console.error(`Error fetching columns for ${tableName}:`, columnsError);
            continue;
          }
          
          // Get rows (first 5)
          // We need to use 'any' type here because the table name is dynamic
          const { data: rows, error: rowsError } = await supabase
            .from(tableName as any)
            .select("*")
            .limit(5);
            
          if (rowsError) {
            console.error(`Error fetching rows for ${tableName}:`, rowsError);
            continue;
          }
          
          tablesInfo.push({
            name: tableName,
            columns: columnsData || [],
            rows: rows || []
          });
        }
        
        setTables(tablesInfo);
      } catch (err) {
        console.error("Error fetching database info:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    
    fetchTables();
  }, []);

  const handleTableClick = (tableName: string) => {
    setSelectedTable(tableName);
  };

  if (loading) return <div>Loading database info...</div>;
  if (error) return <div>Error: {error}</div>;

  const selectedTableInfo = tables.find(t => t.name === selectedTable);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Database Debug</h1>
      
      <div className="flex gap-4">
        <div className="w-1/4">
          <h2 className="text-xl font-semibold mb-2">Tables</h2>
          <ul className="border rounded p-2">
            {tables.map((table) => (
              <li 
                key={table.name} 
                className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedTable === table.name ? 'bg-gray-200' : ''}`}
                onClick={() => handleTableClick(table.name)}
              >
                {table.name}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="w-3/4">
          {selectedTableInfo ? (
            <>
              <h2 className="text-xl font-semibold mb-2">Table: {selectedTableInfo.name}</h2>
              
              <div className="mb-4">
                <h3 className="font-medium mb-1">Columns</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Type</th>
                        <th className="border p-2">Nullable</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTableInfo.columns && selectedTableInfo.columns.map((column, i) => (
                        <tr key={i}>
                          <td className="border p-2">{column.name}</td>
                          <td className="border p-2">{column.type}</td>
                          <td className="border p-2">{column.is_nullable ? "Yes" : "No"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Sample Data (First 5 rows)</h3>
                <div className="overflow-x-auto">
                  {selectedTableInfo.rows && selectedTableInfo.rows.length > 0 ? (
                    <table className="min-w-full border">
                      <thead>
                        <tr className="bg-gray-50">
                          {Object.keys(selectedTableInfo.rows[0]).map((key) => (
                            <th key={key} className="border p-2">{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedTableInfo.rows.map((row, i) => (
                          <tr key={i}>
                            {Object.values(row).map((value: any, j) => (
                              <td key={j} className="border p-2">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No data available</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p>Select a table to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}
