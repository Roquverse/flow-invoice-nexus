import { supabase } from "@/integrations/supabase/client";
import {
  Quote,
  QuoteFormData,
  QuoteItem,
  QuoteItemFormData,
} from "@/types/quotes";

/**
 * Get all quotes for the current user
 */
export async function getQuotes(): Promise<Quote[]> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return [];

  try {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("user_id", user.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching quotes:", error);
      return [];
    }

    return data || [];
  } catch (e) {
    console.error("Error accessing quotes:", e);
    return [];
  }
}

/**
 * Get a specific quote by ID, including its items
 */
export async function getQuoteById(id: string): Promise<{
  quote: Quote | null;
  items: QuoteItem[];
}> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user)
    return {
      quote: null,
      items: [],
    };

  try {
    // Get the quote
    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.user.id)
      .single();

    if (quoteError) {
      console.error(`Error fetching quote ${id}:`, quoteError);
      return {
        quote: null,
        items: [],
      };
    }

    // Get the quote items
    const { data: items, error: itemsError } = await supabase
      .from("quote_items")
      .select("*")
      .eq("quote_id", id)
      .order("created_at");

    if (itemsError) {
      console.error(`Error fetching items for quote ${id}:`, itemsError);
      return {
        quote,
        items: [],
      };
    }

    return {
      quote,
      items: items || [],
    };
  } catch (e) {
    console.error("Error accessing quote:", e);
    return {
      quote: null,
      items: [],
    };
  }
}

/**
 * Generate a new quote number
 */
async function generateQuoteNumber(): Promise<string> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return "QUO-001";

  try {
    // Get the latest quote to determine the next number
    const { data, error } = await supabase
      .from("quotes")
      .select("quote_number")
      .eq("user_id", user.user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error fetching latest quote:", error);
      return "QUO-001";
    }

    if (!data || data.length === 0) {
      return "QUO-001";
    }

    // Extract the number from the latest quote number and increment
    const latestQuoteNumber = data[0].quote_number;
    const matches = latestQuoteNumber.match(/\d+$/);

    if (!matches) {
      return "QUO-001";
    }

    const nextNumber = parseInt(matches[0]) + 1;
    return `QUO-${String(nextNumber).padStart(3, "0")}`;
  } catch (e) {
    console.error("Error generating quote number:", e);
    return "QUO-001";
  }
}

/**
 * Calculate total amount for a quote
 */
function calculateTotalAmount(items: QuoteItemFormData[]): number {
  return items.reduce((total, item) => {
    const itemAmount = item.quantity * item.unit_price;
    const discountAmount = item.discount_rate
      ? itemAmount * (item.discount_rate / 100)
      : 0;
    const taxAmount = item.tax_rate
      ? (itemAmount - discountAmount) * (item.tax_rate / 100)
      : 0;
    return total + itemAmount - discountAmount + taxAmount;
  }, 0);
}

/**
 * Create a new quote with its items
 */
export async function createQuote(
  quoteData: QuoteFormData
): Promise<Quote | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  // Start a Supabase transaction
  const { data, error } = await supabase.rpc("create_quote", {
    p_user_id: user.user.id,
    p_client_id: quoteData.client_id,
    p_project_id: quoteData.project_id || null,
    p_quote_number: quoteData.quote_number || (await generateQuoteNumber()),
    p_reference: quoteData.reference || null,
    p_issue_date: quoteData.issue_date,
    p_expiry_date: quoteData.expiry_date,
    p_status: quoteData.status || "draft",
    p_total_amount: calculateTotalAmount(quoteData.items),
    p_tax_amount: quoteData.tax_amount || null,
    p_discount_amount: quoteData.discount_amount || null,
    p_currency: quoteData.currency,
    p_notes: quoteData.notes || null,
    p_terms: quoteData.terms || null,
    p_footer: quoteData.footer || null,
    p_items: quoteData.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      tax_rate: item.tax_rate || null,
      discount_rate: item.discount_rate || null,
      amount: item.quantity * item.unit_price,
    })),
  });

  if (error) {
    console.error("Error creating quote:", error);
    return null;
  }

  return data;
}

/**
 * Update an existing quote and its items
 */
export async function updateQuote(
  id: string,
  quoteData: QuoteFormData
): Promise<Quote | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  // Start a Supabase transaction
  const { data, error } = await supabase.rpc("update_quote", {
    p_quote_id: id,
    p_user_id: user.user.id,
    p_client_id: quoteData.client_id,
    p_project_id: quoteData.project_id || null,
    p_reference: quoteData.reference || null,
    p_issue_date: quoteData.issue_date,
    p_expiry_date: quoteData.expiry_date,
    p_status: quoteData.status || "draft",
    p_total_amount: calculateTotalAmount(quoteData.items),
    p_tax_amount: quoteData.tax_amount || null,
    p_discount_amount: quoteData.discount_amount || null,
    p_currency: quoteData.currency,
    p_notes: quoteData.notes || null,
    p_terms: quoteData.terms || null,
    p_footer: quoteData.footer || null,
    p_items: quoteData.items.map((item) => ({
      id: item.id || null,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      tax_rate: item.tax_rate || null,
      discount_rate: item.discount_rate || null,
      amount: item.quantity * item.unit_price,
    })),
  });

  if (error) {
    console.error(`Error updating quote ${id}:`, error);
    return null;
  }

  return data;
}

/**
 * Delete a quote and its items
 */
export async function deleteQuote(id: string): Promise<boolean> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return false;

  try {
    // Delete the quote items first
    const { error: itemsError } = await supabase
      .from("quote_items")
      .delete()
      .eq("quote_id", id);

    if (itemsError) {
      console.error(`Error deleting items for quote ${id}:`, itemsError);
      return false;
    }

    // Then delete the quote
    const { error } = await supabase
      .from("quotes")
      .delete()
      .eq("id", id)
      .eq("user_id", user.user.id);

    if (error) {
      console.error(`Error deleting quote ${id}:`, error);
      return false;
    }

    return true;
  } catch (e) {
    console.error("Error deleting quote:", e);
    return false;
  }
}

/**
 * Update quote status
 */
export async function updateQuoteStatus(
  id: string,
  status: "draft" | "sent" | "viewed" | "accepted" | "rejected" | "expired"
): Promise<boolean> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return false;

  try {
    const { error } = await supabase
      .from("quotes")
      .update({ status })
      .eq("id", id)
      .eq("user_id", user.user.id);

    if (error) {
      console.error(`Error updating status for quote ${id}:`, error);
      return false;
    }

    return true;
  } catch (e) {
    console.error("Error updating quote status:", e);
    return false;
  }
}

/**
 * Convert quote to invoice
 */
export async function convertQuoteToInvoice(
  id: string
): Promise<string | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    const { data, error } = await supabase.rpc("convert_quote_to_invoice", {
      p_quote_id: id,
      p_user_id: user.user.id,
    });

    if (error) {
      console.error(`Error converting quote ${id} to invoice:`, error);
      return null;
    }

    return data; // Returns the new invoice ID
  } catch (e) {
    console.error("Error converting quote to invoice:", e);
    return null;
  }
}
