
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllTables, getSampleTableData, getTableColumns, AllowedTable } from "@/rpc/databaseHelpers";

const DebugDatabase = () => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<AllowedTable | "">("");
  const [tableData, setTableData] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTables = async () => {
      try {
        const tableNames = await getAllTables();
        setTables(tableNames);
      } catch (error) {
        console.error("Error loading tables:", error);
      }
    };

    loadTables();
  }, []);

  const handleTableSelect = async (tableName: string) => {
    // Validate that the selected table name is an allowed table
    if (!isAllowedTable(tableName)) {
      console.error(`Table name ${tableName} is not in the allowed list`);
      return;
    }
    
    setSelectedTable(tableName);
    setLoading(true);
    
    try {
      // Now we're sure tableName is an AllowedTable
      const columnData = await getTableColumns(tableName);
      setColumns(columnData);
      
      const data = await getSampleTableData(tableName);
      setTableData(data);
    } catch (error) {
      console.error(`Error loading data for table ${tableName}:`, error);
      setTableData([]);
      setColumns([]);
    } finally {
      setLoading(false);
    }
  };

  // Type guard function
  function isAllowedTable(tableName: string): tableName is AllowedTable {
    const allowedTables: string[] = [
      "clients", "invoices", "quotes", "receipts", "user_profiles",
      "company_settings", "admin_users", "billing_settings", "invoice_items",
      "notification_preferences", "payment_methods", "quote_items",
      "security_settings", "session_history", "projects"
    ];
    return allowedTables.includes(tableName);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Explorer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select onValueChange={handleTableSelect} value={selectedTable}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a table" />
            </SelectTrigger>
            <SelectContent>
              {tables.map((table) => (
                <SelectItem key={table} value={table}>
                  {table}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : selectedTable ? (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>Sample data from {selectedTable}</TableCaption>
              <TableHeader>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableHead key={index}>{column.column_name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex}>
                        {JSON.stringify(row[column.column_name])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-4">Select a table to view data</div>
        )}
      </CardContent>
    </Card>
  );
};

export default DebugDatabase;
