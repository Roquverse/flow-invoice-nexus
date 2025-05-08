
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "@/types/quotes";
import { toast } from "sonner";

export const useQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Set quotes with proper type casting
      setQuotes((data || []) as Quote[]);
    } catch (e) {
      setError(e as Error);
      console.error("Error fetching quotes:", e);
    } finally {
      setLoading(false);
    }
  };

  // Add getClientName function
  const getClientName = (clientId: string): string => {
    // This is just a placeholder function that will be updated when client data is available
    return "Client";
  };

  // Add getProjectName function
  const getProjectName = (projectId: string): string => {
    // This is just a placeholder function that will be updated when project data is available
    return "Project";
  };

  // Add changeQuoteStatus function
  const changeQuoteStatus = async (quoteId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status })
        .eq('id', quoteId);

      if (error) throw error;
      
      await fetchQuotes();
      return true;
    } catch (error) {
      console.error("Error changing quote status:", error);
      return false;
    }
  };

  // Add removeQuote function
  const removeQuote = async (quoteId: string) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', quoteId);

      if (error) throw error;
      
      setQuotes(quotes.filter(quote => quote.id !== quoteId));
      return true;
    } catch (error) {
      console.error("Error removing quote:", error);
      return false;
    }
  };

  // Add addQuote function
  const addQuote = async (quote: Partial<Quote>) => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .insert(quote)
        .select();

      if (error) throw error;
      
      await fetchQuotes();
      return data?.[0] as Quote;
    } catch (error) {
      console.error("Error adding quote:", error);
      throw error;
    }
  };

  // Add updateQuote function
  const updateQuote = async (quoteId: string, quote: Partial<Quote>) => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .update(quote)
        .eq('id', quoteId)
        .select();

      if (error) throw error;
      
      await fetchQuotes();
      return data?.[0] as Quote;
    } catch (error) {
      console.error("Error updating quote:", error);
      throw error;
    }
  };

  // Add generateQuoteNumber function
  const generateQuoteNumber = async (): Promise<string> => {
    try {
      const { count, error } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      
      const nextNumber = (count || 0) + 1;
      return `QT-${new Date().getFullYear()}-${nextNumber.toString().padStart(4, '0')}`;
    } catch (error) {
      console.error("Error generating quote number:", error);
      return `QT-${new Date().getFullYear()}-0001`;
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  return {
    quotes,
    loading,
    error,
    fetchQuotes,
    getClientName,
    getProjectName,
    changeQuoteStatus,
    removeQuote,
    addQuote,
    updateQuote,
    generateQuoteNumber
  };
};
