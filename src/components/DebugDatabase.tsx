
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Fix the type to handle string values
interface TableSchema {
  name: string;
  columns: {
    name: string;
    type: string;
    is_nullable: boolean;
    is_identity: boolean;
  }[];
}

const DebugDatabase: React.FC = () => {
  const [tables, setTables] = useState<TableSchema[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all tables from the database
  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true);
        
        // Use a raw SQL query instead of the problematic information_schema approach
        const { data, error } = await supabase.rpc('get_all_tables');

        if (error) throw error;

        if (data) {
          const tableSchemas: TableSchema[] = [];
          
          // For each table, fetch its columns
          for (const tableName of data) {
            const { data: columns, error: columnsError } = await supabase.rpc('get_table_columns', {
              table_name: tableName
            });

            if (columnsError) throw columnsError;

            tableSchemas.push({
              name: tableName,
              columns: columns.map((col: any) => ({
                name: col.column_name,
                type: col.data_type,
                is_nullable: col.is_nullable === "YES",
                is_identity: col.is_identity === "YES",
              })),
            });
          }

          setTables(tableSchemas);
        }
      } catch (err) {
        console.error("Error fetching tables:", err);
        setError("Failed to fetch database schema");
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  // Fetch data for a specific table
  const fetchTableData = async (tableName: string) => {
    try {
      setLoading(true);
      // Use a more type-safe approach with direct string type
      const { data, error } = await supabase
        .from(tableName)
        .select('*');

      if (error) throw error;
      setTableData(data || []);
      setSelectedTable(tableName);
    } catch (err) {
      console.error(`Error fetching data for table ${tableName}:`, err);
      setError(`Failed to fetch data for ${tableName}`);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  // Render methods
  const renderTableList = () => (
    <div>
      <h2>Database Tables</h2>
      {loading ? (
        <p>Loading tables...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <ul>
          {tables.map((table) => (
            <li key={table.name}>
              <button onClick={() => fetchTableData(table.name)}>
                {table.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const renderTableData = () => (
    <div>
      <h2>Data from table: {selectedTable}</h2>
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              {tables
                .find((table) => table.name === selectedTable)
                ?.columns.map((column) => (
                  <th key={column.name}>{column.name}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                {tables
                  .find((table) => table.name === selectedTable)
                  ?.columns.map((column) => (
                    <td key={column.name}>{JSON.stringify(row[column.name])}</td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div>
      <h1>Debug Database</h1>
      {renderTableList()}
      {selectedTable && renderTableData()}
    </div>
  );
};

export default DebugDatabase;
