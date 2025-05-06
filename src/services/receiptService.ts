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
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching receipts:", error);
      return [];
    }

    // Cast payment_method field to the correct type
    const typedData =
      data?.map((receipt) => ({
        ...receipt,
        payment_method: receipt.payment_method as
          | "cash"
          | "bank_transfer"
          | "credit_card"
          | "paypal"
          | "other",
      })) || [];

    return typedData;
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

    // Cast payment_method field to the correct type
    return data
      ? {
          ...data,
          payment_method: data.payment_method as
            | "cash"
            | "bank_transfer"
            | "credit_card"
            | "paypal"
            | "other",
        }
      : null;
  } catch (e) {
    console.error("Error accessing receipt:", e);
    return null;
  }
}

/**
 * Create a new receipt
 */
export async function createReceipt(
  receipt: ReceiptFormData
): Promise<string | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    const { data, error } = await supabase
      .from("receipts")
      .insert({
        user_id: user.user.id,
        client_id: receipt.client_id,
        invoice_id: receipt.invoice_id || null,
        quote_id: receipt.quote_id || null,
        receipt_number: receipt.receipt_number,
        reference: receipt.reference || null,
        date: receipt.date,
        amount: receipt.amount,
        payment_method: receipt.payment_method,
        payment_reference: receipt.payment_reference || null,
        notes: receipt.notes || null,
        currency: receipt.currency,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating receipt:", error);
      return null;
    }

    return data?.id || null;
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
  receipt: ReceiptFormData
): Promise<Receipt | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    const { data, error } = await supabase
      .from("receipts")
      .update({
        client_id: receipt.client_id,
        invoice_id: receipt.invoice_id || null,
        quote_id: receipt.quote_id || null,
        receipt_number: receipt.receipt_number,
        reference: receipt.reference || null,
        date: receipt.date,
        amount: receipt.amount,
        payment_method: receipt.payment_method,
        payment_reference: receipt.payment_reference || null,
        notes: receipt.notes || null,
        currency: receipt.currency,
      })
      .eq("id", id)
      .eq("user_id", user.user.id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating receipt ${id}:`, error);
      return null;
    }

    // Cast payment_method field to the correct type
    return data
      ? {
          ...data,
          payment_method: data.payment_method as
            | "cash"
            | "bank_transfer"
            | "credit_card"
            | "paypal"
            | "other",
        }
      : null;
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
