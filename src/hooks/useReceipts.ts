import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Receipt } from "@/types";
import { toast } from "sonner";

export const useReceipts = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReceipts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("receipts")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setReceipts(data || []);
      } catch (error) {
        setError((error as Error).message || "Failed to fetch receipts");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  const createReceipt = async (receiptData: Receipt) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("receipts")
        .insert([receiptData])
        .select();

      if (error) {
        throw error;
      }

      setReceipts((prevReceipts) => [...prevReceipts, ...(data as Receipt[])]);
      toast.success("Receipt created successfully!");
    } catch (error) {
      setError((error as Error).message || "Failed to create receipt");
      toast.error(error as string);
    } finally {
      setLoading(false);
    }
  };

  const updateReceipt = async (id: string, updates: Partial<Receipt>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("receipts")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) {
        throw error;
      }

      setReceipts((prevReceipts) =>
        prevReceipts.map((receipt) => (receipt.id === id ? { ...receipt, ...data[0] } : receipt))
      );
      toast.success("Receipt updated successfully!");
    } catch (error) {
      setError((error as Error).message || "Failed to update receipt");
      toast.error(error as string);
    } finally {
      setLoading(false);
    }
  };

  const deleteReceipt = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.from("receipts").delete().eq("id", id);

    if (error) throw error;

    // Update state by removing the deleted receipt
    setReceipts((prev) => prev.filter((receipt) => receipt.id !== id));
    
    toast.success("Receipt deleted successfully!");
  } catch (error) {
    const errorMessage = (error as Error).message || "Failed to delete receipt";
    setError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

  return {
    receipts,
    loading,
    error,
    createReceipt,
    updateReceipt,
    deleteReceipt,
  };
};
