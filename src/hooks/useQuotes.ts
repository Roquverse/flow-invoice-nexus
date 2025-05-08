
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Quote, QuoteFormData } from "@/types/quotes";
import { toast } from "sonner";
import { convertQuoteToInvoice } from "@/services/quoteService";

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

  // Modified addQuote function to work with QuoteFormData
  const addQuote = async (quoteFormData: QuoteFormData) => {
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("User not authenticated");
      }
      
      // First, create the quote without items
      const quoteData = {
        user_id: session.user.id,
        client_id: quoteFormData.client_id,
        project_id: quoteFormData.project_id || null,
        quote_number: quoteFormData.quote_number || `QT-${Date.now()}`,
        reference: quoteFormData.reference || null,
        issue_date: quoteFormData.issue_date,
        expiry_date: quoteFormData.expiry_date,
        status: quoteFormData.status || "draft",
        total_amount: quoteFormData.total_amount || 0,
        tax_amount: quoteFormData.tax_amount || 0,
        discount_amount: quoteFormData.discount_amount || 0,
        currency: quoteFormData.currency,
        payment_percentage: quoteFormData.payment_percentage || 100,
        payment_amount: quoteFormData.payment_amount || 0,
        notes: quoteFormData.notes || null,
        terms: quoteFormData.terms || null,
        footer: quoteFormData.footer || null,
      };

      const { data: newQuote, error } = await supabase
        .from('quotes')
        .insert(quoteData)
        .select()
        .single();

      if (error) throw error;

      // Then, add the items
      if (quoteFormData.items && quoteFormData.items.length > 0 && newQuote) {
        const itemsToInsert = quoteFormData.items.map(item => ({
          quote_id: newQuote.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          tax_rate: item.tax_rate || null,
          discount_rate: item.discount_rate || null,
          amount: item.quantity * item.unit_price,
        }));

        const { error: itemsError } = await supabase
          .from('quote_items')
          .insert(itemsToInsert);

        if (itemsError) {
          console.error("Error adding quote items:", itemsError);
        }
      }

      await fetchQuotes();
      return newQuote as Quote;
    } catch (error) {
      console.error("Error adding quote:", error);
      throw error;
    }
  };

  // Modified updateQuote function to work with QuoteFormData
  const updateQuote = async (quoteId: string, quoteFormData: QuoteFormData) => {
    try {
      // First, update the quote without items
      const quoteData = {
        client_id: quoteFormData.client_id,
        project_id: quoteFormData.project_id || null,
        quote_number: quoteFormData.quote_number,
        reference: quoteFormData.reference || null,
        issue_date: quoteFormData.issue_date,
        expiry_date: quoteFormData.expiry_date,
        status: quoteFormData.status || "draft",
        total_amount: quoteFormData.total_amount || 0,
        tax_amount: quoteFormData.tax_amount || 0,
        discount_amount: quoteFormData.discount_amount || 0,
        currency: quoteFormData.currency,
        payment_percentage: quoteFormData.payment_percentage || 100,
        payment_amount: quoteFormData.payment_amount || 0,
        notes: quoteFormData.notes || null,
        terms: quoteFormData.terms || null,
        footer: quoteFormData.footer || null,
      };

      const { data: updatedQuote, error } = await supabase
        .from('quotes')
        .update(quoteData)
        .eq('id', quoteId)
        .select()
        .single();

      if (error) throw error;

      // Delete existing items
      const { error: deleteError } = await supabase
        .from('quote_items')
        .delete()
        .eq('quote_id', quoteId);

      if (deleteError) {
        console.error(`Error deleting items for quote ${quoteId}:`, deleteError);
      }

      // Add updated items
      if (quoteFormData.items && quoteFormData.items.length > 0) {
        const itemsToInsert = quoteFormData.items.map(item => ({
          quote_id: quoteId,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          tax_rate: item.tax_rate || null,
          discount_rate: item.discount_rate || null,
          amount: item.quantity * item.unit_price,
        }));

        const { error: itemsError } = await supabase
          .from('quote_items')
          .insert(itemsToInsert);

        if (itemsError) {
          console.error(`Error updating items for quote ${quoteId}:`, itemsError);
        }
      }

      await fetchQuotes();
      return updatedQuote as Quote;
    } catch (error) {
      console.error(`Error updating quote ${quoteId}:`, error);
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
  
  // Add convertToInvoice function
  const convertToInvoice = async (quoteId: string): Promise<string | null> => {
    try {
      const invoiceId = await convertQuoteToInvoice(quoteId);
      if (invoiceId) {
        toast.success("Quote successfully converted to invoice");
      } else {
        toast.error("Failed to convert quote to invoice");
      }
      return invoiceId;
    } catch (error) {
      console.error("Error converting quote to invoice:", error);
      toast.error("Failed to convert quote to invoice");
      return null;
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
    generateQuoteNumber,
    convertToInvoice
  };
};
