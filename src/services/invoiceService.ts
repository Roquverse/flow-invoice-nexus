
import { supabase } from "@/integrations/supabase/client";
import { Invoice, InvoiceFormData } from "@/types/invoices";

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

    // Cast status field to the correct type
    const typedData = data?.map(invoice => ({
      ...invoice,
      status: invoice.status as "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled"
    })) || [];

    return typedData;
  } catch (e) {
    console.error("Error accessing invoices:", e);
    return [];
  }
}

/**
 * Get a specific invoice by ID along with its items
 */
export async function getInvoiceById(id: string): Promise<{ invoice: Invoice, items: any[] }> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    throw new Error("User not authenticated");
  }

  try {
    // Get invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.user.id)
      .single();

    if (invoiceError) {
      console.error(`Error fetching invoice ${id}:`, invoiceError);
      throw new Error(`Could not find invoice with ID: ${id}`);
    }

    // Get invoice items
    const { data: items, error: itemsError } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", id);

    if (itemsError) {
      console.error(`Error fetching items for invoice ${id}:`, itemsError);
      throw new Error("Could not fetch invoice items");
    }

    // Cast status field to the correct type
    const typedInvoice = {
      ...invoice,
      status: invoice.status as "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled"
    };

    return { invoice: typedInvoice, items: items || [] };
  } catch (e) {
    console.error("Error retrieving invoice:", e);
    throw e;
  }
}

/**
 * Create a new invoice with its items
 */
export async function createInvoice(invoiceData: InvoiceFormData): Promise<Invoice | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    // Insert the invoice
    const { data: newInvoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        user_id: user.user.id,
        client_id: invoiceData.client_id,
        project_id: invoiceData.project_id || null,
        invoice_number: invoiceData.invoice_number || `INV-${Date.now()}`,
        reference: invoiceData.reference || null,
        issue_date: invoiceData.issue_date,
        due_date: invoiceData.due_date,
        status: invoiceData.status || "draft",
        total_amount: invoiceData.total_amount || 0,
        tax_amount: invoiceData.tax_amount || 0,
        discount_amount: invoiceData.discount_amount || 0,
        currency: invoiceData.currency,
        notes: invoiceData.notes || null,
        terms: invoiceData.terms || null,
        footer: invoiceData.footer || null,
      })
      .select()
      .single();

    if (invoiceError) {
      console.error("Error creating invoice:", invoiceError);
      return null;
    }

    // Cast status field to the correct type
    const typedInvoice = {
      ...newInvoice,
      status: newInvoice.status as "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled"
    };

    // Insert the invoice items
    if (invoiceData.items && invoiceData.items.length > 0) {
      const itemsToInsert = invoiceData.items.map((item) => ({
        invoice_id: typedInvoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: item.tax_rate || null,
        discount_rate: item.discount_rate || null,
        amount: item.quantity * item.unit_price,
      }));

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(itemsToInsert);

      if (itemsError) {
        console.error("Error creating invoice items:", itemsError);
        // Consider rolling back the invoice creation or just log the error
      }
    }

    return typedInvoice;
  } catch (e) {
    console.error("Error creating invoice:", e);
    return null;
  }
}

/**
 * Update an existing invoice and its items
 */
export async function updateInvoice(id: string, invoiceData: InvoiceFormData): Promise<Invoice | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    // Update the invoice
    const { data: updatedInvoice, error: invoiceError } = await supabase
      .from("invoices")
      .update({
        client_id: invoiceData.client_id,
        project_id: invoiceData.project_id || null,
        invoice_number: invoiceData.invoice_number,
        reference: invoiceData.reference || null,
        issue_date: invoiceData.issue_date,
        due_date: invoiceData.due_date,
        status: invoiceData.status || "draft",
        total_amount: invoiceData.total_amount || 0,
        tax_amount: invoiceData.tax_amount || 0,
        discount_amount: invoiceData.discount_amount || 0,
        currency: invoiceData.currency,
        notes: invoiceData.notes || null,
        terms: invoiceData.terms || null,
        footer: invoiceData.footer || null,
      })
      .eq("id", id)
      .eq("user_id", user.user.id)
      .select()
      .single();

    if (invoiceError) {
      console.error(`Error updating invoice ${id}:`, invoiceError);
      return null;
    }

    // Cast status field to the correct type
    const typedInvoice = {
      ...updatedInvoice,
      status: updatedInvoice.status as "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled"
    };

    // Delete existing items
    const { error: deleteError } = await supabase
      .from("invoice_items")
      .delete()
      .eq("invoice_id", id);

    if (deleteError) {
      console.error(`Error deleting items for invoice ${id}:`, deleteError);
    }

    // Insert updated items
    if (invoiceData.items && invoiceData.items.length > 0) {
      const itemsToInsert = invoiceData.items.map((item) => ({
        invoice_id: id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: item.tax_rate || null,
        discount_rate: item.discount_rate || null,
        amount: item.quantity * item.unit_price,
      }));

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(itemsToInsert);

      if (itemsError) {
        console.error(`Error updating items for invoice ${id}:`, itemsError);
      }
    }

    return typedInvoice;
  } catch (e) {
    console.error(`Error updating invoice ${id}:`, e);
    return null;
  }
}

/**
 * Delete an invoice and its items
 */
export async function deleteInvoice(id: string): Promise<boolean> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return false;

  try {
    // Delete invoice items first
    const { error: itemsError } = await supabase
      .from("invoice_items")
      .delete()
      .eq("invoice_id", id);

    if (itemsError) {
      console.error(`Error deleting items for invoice ${id}:`, itemsError);
    }

    // Then delete the invoice
    const { error: invoiceError } = await supabase
      .from("invoices")
      .delete()
      .eq("id", id)
      .eq("user_id", user.user.id);

    if (invoiceError) {
      console.error(`Error deleting invoice ${id}:`, invoiceError);
      return false;
    }

    return true;
  } catch (e) {
    console.error(`Error deleting invoice ${id}:`, e);
    return false;
  }
}

/**
 * Update the status of an invoice
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
    console.error(`Error updating status for invoice ${id}:`, e);
    return false;
  }
}

/**
 * Generate a new invoice number
 */
export async function generateInvoiceNumber(): Promise<string> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return `INV-${Date.now()}`;

  try {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    const { data: invoices, error } = await supabase
      .from("invoices")
      .select("invoice_number")
      .eq("user_id", user.user.id)
      .like("invoice_number", `INV-${year}${month}-%`);

    if (error) {
      console.error("Error fetching invoices for number generation:", error);
      return `INV-${year}${month}-001`;
    }

    // Find the highest number
    let highestNum = 0;
    if (invoices && invoices.length > 0) {
      invoices.forEach(invoice => {
        const numStr = invoice.invoice_number.split('-')[2];
        const num = parseInt(numStr);
        if (!isNaN(num) && num > highestNum) {
          highestNum = num;
        }
      });
    }

    // Generate next number
    const nextNum = (highestNum + 1).toString().padStart(3, '0');
    return `INV-${year}${month}-${nextNum}`;
  } catch (e) {
    console.error("Error generating invoice number:", e);
    return `INV-${Date.now()}`;
  }
}
