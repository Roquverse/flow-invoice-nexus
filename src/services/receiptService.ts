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
 * Generate a new receipt number
 */
async function generateReceiptNumber(): Promise<string> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return "RCT-001";

  try {
    // Get the latest receipt to determine the next number
    const { data, error } = await supabase
      .from("receipts")
      .select("receipt_number")
      .eq("user_id", user.user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error fetching latest receipt:", error);
      return "RCT-001";
    }

    if (!data || data.length === 0) {
      return "RCT-001";
    }

    // Extract the number from the latest receipt number and increment
    const latestReceiptNumber = data[0].receipt_number;
    const matches = latestReceiptNumber.match(/\d+$/);

    if (!matches) {
      return "RCT-001";
    }

    const nextNumber = parseInt(matches[0]) + 1;
    return `RCT-${String(nextNumber).padStart(3, "0")}`;
  } catch (e) {
    console.error("Error generating receipt number:", e);
    return "RCT-001";
  }
}

/**
 * Create a new receipt
 */
export async function createReceipt(
  receiptData: ReceiptFormData
): Promise<Receipt | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    // If this receipt is linked to an invoice, mark the invoice as paid
    if (receiptData.invoice_id) {
      const { error: invoiceError } = await supabase
        .from("invoices")
        .update({ status: "paid" })
        .eq("id", receiptData.invoice_id)
        .eq("user_id", user.user.id);

      if (invoiceError) {
        console.error(
          `Error updating invoice ${receiptData.invoice_id} status:`,
          invoiceError
        );
        // Continue with creating receipt anyway
      }
    }

    const { data, error } = await supabase
      .from("receipts")
      .insert({
        user_id: user.user.id,
        client_id: receiptData.client_id,
        invoice_id: receiptData.invoice_id || null,
        receipt_number:
          receiptData.receipt_number || (await generateReceiptNumber()),
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

    return data;
  } catch (e) {
    console.error("Error creating receipt:", e);
    return null;
  }
}

/**
 * Update an existing receipt
 */
export async function updateReceipt(
  id: string,
  receiptData: ReceiptFormData
): Promise<Receipt | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    // Check if the invoice_id is being changed
    const { data: existingReceipt } = await supabase
      .from("receipts")
      .select("invoice_id")
      .eq("id", id)
      .eq("user_id", user.user.id)
      .single();

    if (
      existingReceipt &&
      existingReceipt.invoice_id !== receiptData.invoice_id
    ) {
      // If previously linked to an invoice, revert that invoice's status
      if (existingReceipt.invoice_id) {
        await supabase
          .from("invoices")
          .update({ status: "sent" })
          .eq("id", existingReceipt.invoice_id)
          .eq("user_id", user.user.id);
      }

      // If newly linked to an invoice, mark that invoice as paid
      if (receiptData.invoice_id) {
        await supabase
          .from("invoices")
          .update({ status: "paid" })
          .eq("id", receiptData.invoice_id)
          .eq("user_id", user.user.id);
      }
    }

    const { data, error } = await supabase
      .from("receipts")
      .update({
        client_id: receiptData.client_id,
        invoice_id: receiptData.invoice_id || null,
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

    return data;
  } catch (e) {
    console.error("Error updating receipt:", e);
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
    // Check if this receipt is linked to an invoice
    const { data: receipt } = await supabase
      .from("receipts")
      .select("invoice_id")
      .eq("id", id)
      .eq("user_id", user.user.id)
      .single();

    // If linked to an invoice, update that invoice's status
    if (receipt && receipt.invoice_id) {
      const { error: invoiceError } = await supabase
        .from("invoices")
        .update({ status: "sent" })
        .eq("id", receipt.invoice_id)
        .eq("user_id", user.user.id);

      if (invoiceError) {
        console.error(
          `Error updating invoice ${receipt.invoice_id} status:`,
          invoiceError
        );
        // Continue with deleting receipt anyway
      }
    }

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
    console.error("Error deleting receipt:", e);
    return false;
  }
}
