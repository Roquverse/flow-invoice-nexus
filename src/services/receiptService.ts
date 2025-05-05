
import { supabase } from "@/integrations/supabase/client";
import { Receipt, ReceiptFormData } from "@/types/receipts";

/**
 * Get all receipts for the current user
 */
export async function getReceipts(): Promise<Receipt[]> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return [];

  try {
    const { data, error } = await supabase
      .from("receipts")
      .select("*")
      .eq("user_id", user.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching receipts:", error);
      return [];
    }

    return data || [];
  } catch (e) {
    console.error("Error accessing receipts:", e);
    return [];
  }
}

/**
 * Get a specific receipt by ID
 */
export async function getReceiptById(id: string): Promise<Receipt | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    const { data, error } = await supabase
      .from("receipts")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.user.id)
      .single();

    if (error) {
      console.error(`Error fetching receipt ${id}:`, error);
      return null;
    }

    return data;
  } catch (e) {
    console.error("Error accessing receipt:", e);
    return null;
  }
}

/**
 * Create a new receipt
 */
export async function createReceipt(receiptData: ReceiptFormData): Promise<Receipt | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    const { data, error } = await supabase
      .from("receipts")
      .insert({
        user_id: user.user.id,
        client_id: receiptData.client_id,
        invoice_id: receiptData.invoice_id || null,
        receipt_number: receiptData.receipt_number || `RCT-${Date.now()}`,
        reference: receiptData.reference || null,
        date: receiptData.date,
        amount: receiptData.amount,
        payment_method: receiptData.payment_method,
        payment_reference: receiptData.payment_reference || null,
        notes: receiptData.notes || null,
        currency: receiptData.currency,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating receipt:", error);
      return null;
    }

    // If receipt is linked to an invoice, update the invoice status to paid
    if (receiptData.invoice_id) {
      const { error: invoiceError } = await supabase
        .from("invoices")
        .update({ status: "paid" })
        .eq("id", receiptData.invoice_id)
        .eq("user_id", user.user.id);

      if (invoiceError) {
        console.error(`Error updating invoice ${receiptData.invoice_id} status:`, invoiceError);
      }
    }

    return data;
  } catch (e) {
    console.error("Error creating receipt:", e);
    return null;
  }
}

/**
 * Update an existing receipt
 */
export async function updateReceipt(id: string, receiptData: ReceiptFormData): Promise<Receipt | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    // Get current receipt to check if invoice_id changed
    const { data: currentReceipt, error: fetchError } = await supabase
      .from("receipts")
      .select("invoice_id")
      .eq("id", id)
      .eq("user_id", user.user.id)
      .single();

    if (fetchError) {
      console.error(`Error fetching receipt ${id}:`, fetchError);
      return null;
    }

    // Update receipt
    const { data, error } = await supabase
      .from("receipts")
      .update({
        client_id: receiptData.client_id,
        invoice_id: receiptData.invoice_id || null,
        receipt_number: receiptData.receipt_number,
        reference: receiptData.reference || null,
        date: receiptData.date,
        amount: receiptData.amount,
        payment_method: receiptData.payment_method,
        payment_reference: receiptData.payment_reference || null,
        notes: receiptData.notes || null,
        currency: receiptData.currency,
      })
      .eq("id", id)
      .eq("user_id", user.user.id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating receipt ${id}:`, error);
      return null;
    }

    // Handle invoice status updates
    // If invoice_id changed from null to a value, mark that invoice as paid
    if (!currentReceipt.invoice_id && receiptData.invoice_id) {
      const { error: invoiceError } = await supabase
        .from("invoices")
        .update({ status: "paid" })
        .eq("id", receiptData.invoice_id)
        .eq("user_id", user.user.id);

      if (invoiceError) {
        console.error(`Error updating invoice ${receiptData.invoice_id} status:`, invoiceError);
      }
    }
    // If invoice_id changed from one value to another, reset the old invoice and mark the new one as paid
    else if (
      currentReceipt.invoice_id &&
      receiptData.invoice_id &&
      currentReceipt.invoice_id !== receiptData.invoice_id
    ) {
      // Reset old invoice to "sent" status
      await supabase
        .from("invoices")
        .update({ status: "sent" })
        .eq("id", currentReceipt.invoice_id)
        .eq("user_id", user.user.id);

      // Mark new invoice as paid
      await supabase
        .from("invoices")
        .update({ status: "paid" })
        .eq("id", receiptData.invoice_id)
        .eq("user_id", user.user.id);
    }
    // If invoice_id changed from a value to null, reset that invoice's status
    else if (currentReceipt.invoice_id && !receiptData.invoice_id) {
      await supabase
        .from("invoices")
        .update({ status: "sent" })
        .eq("id", currentReceipt.invoice_id)
        .eq("user_id", user.user.id);
    }

    return data;
  } catch (e) {
    console.error(`Error updating receipt ${id}:`, e);
    return null;
  }
}

/**
 * Delete a receipt
 */
export async function deleteReceipt(id: string): Promise<boolean> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return false;

  try {
    // First check if this receipt is linked to an invoice
    const { data: receipt, error: fetchError } = await supabase
      .from("receipts")
      .select("invoice_id")
      .eq("id", id)
      .eq("user_id", user.user.id)
      .single();

    if (!fetchError && receipt && receipt.invoice_id) {
      // Update invoice status back to "sent"
      const { error: invoiceError } = await supabase
        .from("invoices")
        .update({ status: "sent" })
        .eq("id", receipt.invoice_id)
        .eq("user_id", user.user.id);

      if (invoiceError) {
        console.error(`Error updating invoice ${receipt.invoice_id} status:`, invoiceError);
      }
    }

    // Delete the receipt
    const { error } = await supabase
      .from("receipts")
      .delete()
      .eq("id", id)
      .eq("user_id", user.user.id);

    if (error) {
      console.error(`Error deleting receipt ${id}:`, error);
      return false;
    }

    return true;
  } catch (e) {
    console.error(`Error deleting receipt ${id}:`, e);
    return false;
  }
}

/**
 * Generate a new receipt number
 */
export async function generateReceiptNumber(): Promise<string> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return `RCT-${Date.now()}`;

  try {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    const { data: receipts, error } = await supabase
      .from("receipts")
      .select("receipt_number")
      .eq("user_id", user.user.id)
      .like("receipt_number", `RCT-${year}${month}-%`);

    if (error) {
      console.error("Error fetching receipts for number generation:", error);
      return `RCT-${year}${month}-001`;
    }

    // Find the highest number
    let highestNum = 0;
    if (receipts && receipts.length > 0) {
      receipts.forEach(receipt => {
        const numStr = receipt.receipt_number.split('-')[2];
        const num = parseInt(numStr);
        if (!isNaN(num) && num > highestNum) {
          highestNum = num;
        }
      });
    }

    // Generate next number
    const nextNum = (highestNum + 1).toString().padStart(3, '0');
    return `RCT-${year}${month}-${nextNum}`;
  } catch (e) {
    console.error("Error generating receipt number:", e);
    return `RCT-${Date.now()}`;
  }
}
