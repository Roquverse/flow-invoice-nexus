import { useState, useEffect, useCallback } from "react";
import { Receipt, ReceiptFormData } from "@/types/receipts";
import { Client } from "@/types/clients";
import { Invoice } from "@/types/invoices";
import {
  getReceipts,
  getReceiptById,
  createReceipt,
  updateReceipt,
  deleteReceipt,
} from "@/services/receiptService";
import { getClients } from "@/services/clientService";
import { getInvoices } from "@/services/invoiceService";

export const useReceipts = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReceipts = useCallback(async () => {
    setLoading(true);
    try {
      const receiptsData = await getReceipts();
      setReceipts(receiptsData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch receipts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchClientsAndInvoices = useCallback(async () => {
    try {
      const [clientsData, invoicesData] = await Promise.all([
        getClients(),
        getInvoices(),
      ]);
      setClients(clientsData);
      setInvoices(invoicesData);
    } catch (err) {
      console.error("Error fetching clients and invoices:", err);
    }
  }, []);

  useEffect(() => {
    fetchReceipts();
    fetchClientsAndInvoices();
  }, [fetchReceipts, fetchClientsAndInvoices]);

  const addReceipt = async (receiptData: ReceiptFormData) => {
    setLoading(true);
    try {
      const newReceipt = await createReceipt(receiptData);
      if (newReceipt) {
        setReceipts((prev) => [newReceipt, ...prev]);
        return newReceipt.id;
      }
      return null;
    } catch (err) {
      setError("Failed to add receipt");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateReceiptData = async (
    id: string,
    receiptData: ReceiptFormData
  ) => {
    setLoading(true);
    try {
      const updatedReceipt = await updateReceipt(id, receiptData);
      if (updatedReceipt) {
        setReceipts((prev) =>
          prev.map((receipt) => (receipt.id === id ? updatedReceipt : receipt))
        );
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to update receipt");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeReceipt = async (id: string) => {
    setLoading(true);
    try {
      const success = await deleteReceipt(id);
      if (success) {
        setReceipts((prev) => prev.filter((receipt) => receipt.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to delete receipt");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.business_name : "-";
  };

  const getInvoiceNumber = (invoiceId: string | null | undefined) => {
    if (!invoiceId) return "-";
    const invoice = invoices.find((i) => i.id === invoiceId);
    return invoice ? invoice.invoice_number : "-";
  };

  const getUnpaidInvoices = (clientId: string) => {
    return invoices.filter(
      (invoice) => invoice.client_id === clientId && invoice.status !== "paid"
    );
  };

  return {
    receipts,
    clients,
    invoices,
    loading,
    error,
    fetchReceipts,
    addReceipt,
    updateReceipt: updateReceiptData,
    removeReceipt,
    getClientName,
    getInvoiceNumber,
    getUnpaidInvoices,
  };
};
