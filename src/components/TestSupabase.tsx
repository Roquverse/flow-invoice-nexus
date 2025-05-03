import { useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client";

const TestSupabase = () => {
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Testing...");

  useEffect(() => {
    async function testConnection() {
      try {
        // Using a basic health check instead of querying specific tables
        const { error } = await supabase.auth.getSession();
        if (error) throw error;
        setConnectionStatus("Connected successfully to Supabase!");
      } catch (error) {
        setConnectionStatus("Connection failed. Check console for details.");
        console.error("Supabase connection error:", error);
      }
    }

    testConnection();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Supabase Connection Test</h2>
      <p>{connectionStatus}</p>
    </div>
  );
};

export default TestSupabase;
