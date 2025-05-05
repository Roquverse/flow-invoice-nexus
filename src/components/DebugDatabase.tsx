import React, { useState, useEffect } from "react";
import { supabase } from "../integrations/supabase/client";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { AlertCircle, Check, Copy, Database, Play, Trash } from "lucide-react";

const DebugDatabase = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [tableInfo, setTableInfo] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("query");

  useEffect(() => {
    // Load query history from localStorage
    const savedHistory = localStorage.getItem("queryHistory");
    if (savedHistory) {
      try {
        setQueryHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse query history:", e);
      }
    }

    // Fetch table information
    fetchTableInfo();
  }, []);

  const fetchTableInfo = async () => {
    try {
      const { data, error } = await supabase.rpc("get_schema_info");
      
      if (error) {
        console.error("Error fetching schema info:", error);
        return;
      }
      
      setTableInfo(data || []);
    } catch (e) {
      console.error("Error in fetchTableInfo:", e);
    }
  };

  const executeQuery = async () => {
    if (!query.trim()) {
      toast.error("Please enter a query");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // Only allow SELECT queries for safety
      const trimmedQuery = query.trim();
      if (!trimmedQuery.toLowerCase().startsWith("select")) {
        throw new Error("Only SELECT queries are allowed for safety reasons");
      }

      const { data, error } = await supabase.rpc("execute_query", {
        query_text: trimmedQuery,
      });

      if (error) {
        throw error;
      }

      setResults(data);
      
      // Add to history if not already present
      if (!queryHistory.includes(trimmedQuery)) {
        const newHistory = [trimmedQuery, ...queryHistory].slice(0, 20);
        setQueryHistory(newHistory);
        localStorage.setItem("queryHistory", JSON.stringify(newHistory));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Failed to copy"));
  };

  const loadQuery = (savedQuery: string) => {
    setQuery(savedQuery);
    setActiveTab("query");
  };

  const clearHistory = () => {
    setQueryHistory([]);
    localStorage.removeItem("queryHistory");
    toast.success("Query history cleared");
  };

  const renderResults = () => {
    if (loading) {
      return <div className="p-4 text-center">Loading results...</div>;
    }

    if (error) {
      return (
        <div className="p-4 bg-red-50 text-red-800 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Error executing query</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      );
    }

    if (!results) {
      return (
        <div className="p-4 text-center text-gray-500">
          Execute a query to see results
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          Query executed successfully, but returned no results
        </div>
      );
    }

    // Get column names from the first result
    const columns = Object.keys(results[0]);

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((column) => (
                <th key={column} className="border p-2 text-left">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={`${rowIndex}-${column}`} className="border p-2">
                    {typeof row[column] === "object"
                      ? JSON.stringify(row[column])
                      : String(row[column] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2 text-sm text-gray-500">
          {results.length} {results.length === 1 ? "row" : "rows"} returned
        </div>
      </div>
    );
  };

  const renderTableInfo = () => {
    if (tableInfo.length === 0) {
      return <div className="p-4 text-center text-gray-500">Loading schema information...</div>;
    }

    // Group by table name
    const tableGroups: Record<string, any[]> = {};
    tableInfo.forEach(column => {
      if (!tableGroups[column.table_name]) {
        tableGroups[column.table_name] = [];
      }
      tableGroups[column.table_name].push(column);
    });

    return (
      <div className="space-y-6">
        {Object.entries(tableGroups).map(([tableName, columns]) => (
          <div key={tableName} className="border rounded-md overflow-hidden">
            <div className="bg-gray-100 p-3 font-medium flex justify-between items-center">
              <span>{tableName}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(`SELECT * FROM ${tableName} LIMIT 100;`)}
                className="h-8"
              >
                <Copy className="h-4 w-4 mr-1" /> Query
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border-b p-2 text-left">Column</th>
                    <th className="border-b p-2 text-left">Type</th>
                    <th className="border-b p-2 text-left">Nullable</th>
                    <th className="border-b p-2 text-left">Default</th>
                  </tr>
                </thead>
                <tbody>
                  {columns.map((column, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        {column.column_name}
                        {column.is_primary_key && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                            PK
                          </span>
                        )}
                      </td>
                      <td className="p-2">{column.data_type}</td>
                      <td className="p-2">
                        {column.is_nullable ? "YES" : "NO"}
                      </td>
                      <td className="p-2">{column.column_default || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Database Explorer</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="query">
            <Play className="h-4 w-4 mr-2" /> Query Editor
          </TabsTrigger>
          <TabsTrigger value="schema">
            <Database className="h-4 w-4 mr-2" /> Schema Browser
          </TabsTrigger>
        </TabsList>

        <TabsContent value="query" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SQL Query</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter your SQL query here (SELECT statements only)"
                className="font-mono"
                rows={5}
              />
              <div className="mt-4 flex justify-between">
                <Button onClick={executeQuery} disabled={loading}>
                  {loading ? "Executing..." : "Execute Query"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(query)}
                  disabled={!query}
                >
                  <Copy className="h-4 w-4 mr-2" /> Copy Query
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>{renderResults()}</CardContent>
          </Card>

          {queryHistory.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Query History</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="h-8"
                >
                  <Trash className="h-4 w-4 mr-1" /> Clear
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {queryHistory.map((savedQuery, index) => (
                    <div
                      key={index}
                      className="p-2 border rounded-md hover:bg-gray-50 flex justify-between items-center cursor-pointer"
                      onClick={() => loadQuery(savedQuery)}
                    >
                      <div className="font-mono text-sm truncate flex-1">
                        {savedQuery}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(savedQuery);
                        }}
                        className="h-7 w-7 p-0"
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="schema">
          <Card>
            <CardHeader>
              <CardTitle>Database Schema</CardTitle>
            </CardHeader>
            <CardContent>{renderTableInfo()}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DebugDatabase;
