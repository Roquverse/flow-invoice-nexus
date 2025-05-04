import { supabase } from "@/integrations/supabase/client";
import {
  Invoice,
  InvoiceFormData,
  InvoiceItem,
  InvoiceItemFormData,
} from "@/types/invoices";

/**
 * Get all invoices for the current user
 */
export async function getInvoices(): Promise<Invoice[]> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return [];

  try {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("user_id", user.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching invoices:", error);
      return [];
    }

    return data || [];
  } catch (e) {
    console.error("Error accessing invoices:", e);
    return [];
  }
}

/**
 * Get a specific invoice by ID, including its items
 */
export async function getInvoiceById(id: string): Promise<{
  invoice: Invoice | null;
  items: InvoiceItem[];
}> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user)
    return {
      invoice: null,
      items: [],
    };

  try {
    // Get the invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.user.id)
      .single();

    if (invoiceError) {
      console.error(`Error fetching invoice ${id}:`, invoiceError);
      return {
        invoice: null,
        items: [],
      };
    }

    // Get the invoice items
    const { data: items, error: itemsError } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", id)
      .order("created_at");

    if (itemsError) {
      console.error(`Error fetching items for invoice ${id}:`, itemsError);
      return {
        invoice,
        items: [],
      };
    }

    return {
      invoice,
      items: items || [],
    };
  } catch (e) {
    console.error("Error accessing invoice:", e);
    return {
      invoice: null,
      items: [],
    };
  }
}

/**
 * Generate a new invoice number
 */
async function generateInvoiceNumber(): Promise<string> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return "INV-001";

  try {
    // Get the latest invoice to determine the next number
    const { data, error } = await supabase
      .from("invoices")
      .select("invoice_number")
      .eq("user_id", user.user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error fetching latest invoice:", error);
      return "INV-001";
    }

    if (!data || data.length === 0) {
      return "INV-001";
    }

    // Extract the number from the latest invoice number and increment
    const latestInvoiceNumber = data[0].invoice_number;
    const matches = latestInvoiceNumber.match(/\d+$/);

    if (!matches) {
      return "INV-001";
    }

    const nextNumber = parseInt(matches[0]) + 1;
    return `INV-${String(nextNumber).padStart(3, "0")}`;
  } catch (e) {
    console.error("Error generating invoice number:", e);
    return "INV-001";
  }
}

/**
 * Calculate total amount for an invoice
 */
function calculateTotalAmount(items: InvoiceItemFormData[]): number {
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
 * Create a new invoice with its items
 */
export async function createInvoice(
  invoiceData: InvoiceFormData
): Promise<Invoice | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  // Start a Supabase transaction
  const { data, error } = await supabase.rpc("create_invoice", {
    p_user_id: user.user.id,
    p_client_id: invoiceData.client_id,
    p_project_id: invoiceData.project_id || null,
    p_invoice_number:
      invoiceData.invoice_number || (await generateInvoiceNumber()),
    p_reference: invoiceData.reference || null,
    p_issue_date: invoiceData.issue_date,
    p_due_date: invoiceData.due_date,
    p_status: invoiceData.status || "draft",
    p_total_amount: calculateTotalAmount(invoiceData.items),
    p_tax_amount: invoiceData.tax_amount || null,
    p_discount_amount: invoiceData.discount_amount || null,
    p_currency: invoiceData.currency,
    p_notes: invoiceData.notes || null,
    p_terms: invoiceData.terms || null,
    p_footer: invoiceData.footer || null,
    p_items: invoiceData.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      tax_rate: item.tax_rate || null,
      discount_rate: item.discount_rate || null,
      amount: item.quantity * item.unit_price,
    })),
  });

  if (error) {
    console.error("Error creating invoice:", error);
    return null;
  }

  return data;
}

/**
 * Update an existing invoice and its items
 */
export async function updateInvoice(
  id: string,
  invoiceData: InvoiceFormData
): Promise<Invoice | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  // Start a Supabase transaction
  const { data, error } = await supabase.rpc("update_invoice", {
    p_invoice_id: id,
    p_user_id: user.user.id,
    p_client_id: invoiceData.client_id,
    p_project_id: invoiceData.project_id || null,
    p_reference: invoiceData.reference || null,
    p_issue_date: invoiceData.issue_date,
    p_due_date: invoiceData.due_date,
    p_status: invoiceData.status || "draft",
    p_total_amount: calculateTotalAmount(invoiceData.items),
    p_tax_amount: invoiceData.tax_amount || null,
    p_discount_amount: invoiceData.discount_amount || null,
    p_currency: invoiceData.currency,
    p_notes: invoiceData.notes || null,
    p_terms: invoiceData.terms || null,
    p_footer: invoiceData.footer || null,
    p_items: invoiceData.items.map((item) => ({
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
    console.error(`Error updating invoice ${id}:`, error);
    return null;
  }

  return data;
}

/**
 * Delete an invoice and its items
 */
export async function deleteInvoice(id: string): Promise<boolean> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return false;

  try {
    // Delete the invoice items first
    const { error: itemsError } = await supabase
      .from("invoice_items")
      .delete()
      .eq("invoice_id", id);

    if (itemsError) {
      console.error(`Error deleting items for invoice ${id}:`, itemsError);
      return false;
    }

    // Then delete the invoice
    const { error } = await supabase
      .from("invoices")
      .delete()
      .eq("id", id)
      .eq("user_id", user.user.id);

    if (error) {
      console.error(`Error deleting invoice ${id}:`, error);
      return false;
    }

    return true;
  } catch (e) {
    console.error("Error deleting invoice:", e);
    return false;
  }
}

/**
 * Update invoice status
 */
export async function updateInvoiceStatus(
  id: string,
  status: "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled"
): Promise<boolean> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return false;

  try {
    const { error } = await supabase
      .from("invoices")
      .update({ status })
      .eq("id", id)
      .eq("user_id", user.user.id);

    if (error) {
      console.error(`Error updating status for invoice ${id}:`, error);
      return false;
    }

    return true;
  } catch (e) {
    console.error("Error updating invoice status:", e);
    return false;
  }
}
