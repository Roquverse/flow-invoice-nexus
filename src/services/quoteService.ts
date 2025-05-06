import { supabase } from "@/integrations/supabase/client";
import { Quote, QuoteFormData } from "@/types/quotes";

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

    // Cast status field to the correct type
    const typedData =
      data?.map((quote) => ({
        ...quote,
        status: quote.status as
          | "draft"
          | "sent"
          | "viewed"
          | "accepted"
          | "rejected"
          | "expired",
      })) || [];

    return typedData;
  } catch (e) {
    console.error("Error accessing quotes:", e);
    return [];
  }
}

/**
 * Get a specific quote by ID along with its items
 */
export async function getQuoteById(
  id: string
): Promise<{ quote: Quote; items: any[] }> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    throw new Error("User not authenticated");
  }

  try {
    // Get quote
    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.user.id)
      .single();

    if (quoteError) {
      console.error(`Error fetching quote ${id}:`, quoteError);
      throw new Error(`Could not find quote with ID: ${id}`);
    }

    // Get quote items
    const { data: items, error: itemsError } = await supabase
      .from("quote_items")
      .select("*")
      .eq("quote_id", id);

    if (itemsError) {
      console.error(`Error fetching items for quote ${id}:`, itemsError);
      throw new Error("Could not fetch quote items");
    }

    // Cast status field to the correct type
    const typedQuote = {
      ...quote,
      status: quote.status as
        | "draft"
        | "sent"
        | "viewed"
        | "accepted"
        | "rejected"
        | "expired",
    };

    return { quote: typedQuote, items: items || [] };
  } catch (e) {
    console.error("Error retrieving quote:", e);
    throw e;
  }
}

/**
 * Create a new quote with its items
 */
export async function createQuote(
  quoteData: QuoteFormData
): Promise<Quote | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    // Insert the quote
    const { data: newQuote, error: quoteError } = await supabase
      .from("quotes")
      .insert({
        user_id: user.user.id,
        client_id: quoteData.client_id,
        project_id: quoteData.project_id || null,
        quote_number: quoteData.quote_number || `QT-${Date.now()}`,
        reference: quoteData.reference || null,
        issue_date: quoteData.issue_date,
        expiry_date: quoteData.expiry_date,
        status: quoteData.status || "draft",
        total_amount: quoteData.total_amount || 0,
        tax_amount: quoteData.tax_amount || 0,
        discount_amount: quoteData.discount_amount || 0,
        currency: quoteData.currency,
        payment_percentage: quoteData.payment_percentage || 100,
        payment_amount: quoteData.payment_amount || quoteData.total_amount || 0,
        notes: quoteData.notes || null,
        terms: quoteData.terms || null,
        footer: quoteData.footer || null,
      })
      .select()
      .single();

    if (quoteError) {
      console.error("Error creating quote:", quoteError);
      return null;
    }

    // Cast status field to the correct type
    const typedQuote = {
      ...newQuote,
      status: newQuote.status as
        | "draft"
        | "sent"
        | "viewed"
        | "accepted"
        | "rejected"
        | "expired",
    };

    // Insert the quote items
    if (quoteData.items && quoteData.items.length > 0) {
      const itemsToInsert = quoteData.items.map((item) => ({
        quote_id: typedQuote.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: item.tax_rate || null,
        discount_rate: item.discount_rate || null,
        amount: item.quantity * item.unit_price,
      }));

      const { error: itemsError } = await supabase
        .from("quote_items")
        .insert(itemsToInsert);

      if (itemsError) {
        console.error("Error creating quote items:", itemsError);
        // Consider rolling back the quote creation or just log the error
      }
    }

    return typedQuote;
  } catch (e) {
    console.error("Error creating quote:", e);
    return null;
  }
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

  try {
    // Update the quote
    const { data: updatedQuote, error: quoteError } = await supabase
      .from("quotes")
      .update({
        client_id: quoteData.client_id,
        project_id: quoteData.project_id || null,
        quote_number: quoteData.quote_number,
        reference: quoteData.reference || null,
        issue_date: quoteData.issue_date,
        expiry_date: quoteData.expiry_date,
        status: quoteData.status || "draft",
        total_amount: quoteData.total_amount || 0,
        tax_amount: quoteData.tax_amount || 0,
        discount_amount: quoteData.discount_amount || 0,
        currency: quoteData.currency,
        payment_percentage: quoteData.payment_percentage || 100,
        payment_amount: quoteData.payment_amount || quoteData.total_amount || 0,
        notes: quoteData.notes || null,
        terms: quoteData.terms || null,
        footer: quoteData.footer || null,
      })
      .eq("id", id)
      .eq("user_id", user.user.id)
      .select()
      .single();

    if (quoteError) {
      console.error(`Error updating quote ${id}:`, quoteError);
      return null;
    }

    // Cast status field to the correct type
    const typedQuote = {
      ...updatedQuote,
      status: updatedQuote.status as
        | "draft"
        | "sent"
        | "viewed"
        | "accepted"
        | "rejected"
        | "expired",
    };

    // Delete existing items
    const { error: deleteError } = await supabase
      .from("quote_items")
      .delete()
      .eq("quote_id", id);

    if (deleteError) {
      console.error(`Error deleting items for quote ${id}:`, deleteError);
    }

    // Insert updated items
    if (quoteData.items && quoteData.items.length > 0) {
      const itemsToInsert = quoteData.items.map((item) => ({
        quote_id: id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: item.tax_rate || null,
        discount_rate: item.discount_rate || null,
        amount: item.quantity * item.unit_price,
      }));

      const { error: itemsError } = await supabase
        .from("quote_items")
        .insert(itemsToInsert);

      if (itemsError) {
        console.error(`Error updating items for quote ${id}:`, itemsError);
      }
    }

    return typedQuote;
  } catch (e) {
    console.error(`Error updating quote ${id}:`, e);
    return null;
  }
}

/**
 * Delete a quote and its items
 */
export async function deleteQuote(id: string): Promise<boolean> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return false;

  try {
    // Delete quote items first
    const { error: itemsError } = await supabase
      .from("quote_items")
      .delete()
      .eq("quote_id", id);

    if (itemsError) {
      console.error(`Error deleting items for quote ${id}:`, itemsError);
    }

    // Then delete the quote
    const { error: quoteError } = await supabase
      .from("quotes")
      .delete()
      .eq("id", id)
      .eq("user_id", user.user.id);

    if (quoteError) {
      console.error(`Error deleting quote ${id}:`, quoteError);
      return false;
    }

    return true;
  } catch (e) {
    console.error(`Error deleting quote ${id}:`, e);
    return false;
  }
}

/**
 * Update the status of a quote
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
    console.error(`Error updating status for quote ${id}:`, e);
    return false;
  }
}

/**
 * Convert a quote to an invoice
 */
export async function convertQuoteToInvoice(
  id: string
): Promise<string | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    // Get the quote with its items
    const { quote, items } = await getQuoteById(id);

    if (!quote) {
      console.error(`Quote with id ${id} not found`);
      return null;
    }

    // Create an invoice from the quote
    const { data: newInvoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        user_id: user.user.id,
        client_id: quote.client_id,
        project_id: quote.project_id || null,
        invoice_number: `INV-${Date.now()}`, // Generate a new invoice number
        reference: `Quote: ${quote.quote_number}`,
        issue_date: new Date().toISOString().split("T")[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        status: "draft",
        total_amount: quote.total_amount,
        tax_amount: quote.tax_amount || 0,
        discount_amount: quote.discount_amount || 0,
        currency: quote.currency,
        notes: quote.notes || null,
        terms: quote.terms || null,
        footer: quote.footer || null,
      })
      .select()
      .single();

    if (invoiceError) {
      console.error(`Error creating invoice from quote ${id}:`, invoiceError);
      return null;
    }

    // Create invoice items from quote items
    if (items && items.length > 0) {
      const invoiceItems = items.map((item) => ({
        invoice_id: newInvoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: item.tax_rate || null,
        discount_rate: item.discount_rate || null,
        amount: item.amount,
      }));

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(invoiceItems);

      if (itemsError) {
        console.error(
          `Error creating invoice items from quote ${id}:`,
          itemsError
        );
      }
    }

    return newInvoice.id;
  } catch (e) {
    console.error(`Error converting quote ${id} to invoice:`, e);
    return null;
  }
}

/**
 * Generate a new quote number
 */
export async function generateQuoteNumber(): Promise<string> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return `QT-${Date.now()}`;

  try {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");

    const { data: quotes, error } = await supabase
      .from("quotes")
      .select("quote_number")
      .eq("user_id", user.user.id)
      .like("quote_number", `QT-${year}${month}-%`);

    if (error) {
      console.error("Error fetching quotes for number generation:", error);
      return `QT-${year}${month}-001`;
    }

    // Find the highest number
    let highestNum = 0;
    if (quotes && quotes.length > 0) {
      quotes.forEach((quote) => {
        const numStr = quote.quote_number.split("-")[2];
        const num = parseInt(numStr);
        if (!isNaN(num) && num > highestNum) {
          highestNum = num;
        }
      });
    }

    // Generate next number
    const nextNum = (highestNum + 1).toString().padStart(3, "0");
    return `QT-${year}${month}-${nextNum}`;
  } catch (e) {
    console.error("Error generating quote number:", e);
    return `QT-${Date.now()}`;
  }
}
