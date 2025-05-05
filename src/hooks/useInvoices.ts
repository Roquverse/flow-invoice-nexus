
import { useState, useEffect, useCallback } from "react";
import { Invoice, InvoiceFormData } from "@/types/invoices";
import { Client } from "@/types/clients";
import { Project } from "@/types/projects";
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  updateInvoiceStatus,
} from "@/services/invoiceService";
import { getClients } from "@/services/clientService";
import { getProjects } from "@/services/projectService";

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const invoicesData = await getInvoices();
      setInvoices(invoicesData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch invoices");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchClientsAndProjects = useCallback(async () => {
    try {
      const [clientsData, projectsData] = await Promise.all([
        getClients(),
        getProjects(),
      ]);
      setClients(clientsData);
      setProjects(projectsData);
    } catch (err) {
      console.error("Error fetching clients and projects:", err);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
    fetchClientsAndProjects();
  }, [fetchInvoices, fetchClientsAndProjects]);

  const addInvoice = async (invoiceData: InvoiceFormData) => {
    setLoading(true);
    try {
      const newInvoice = await createInvoice(invoiceData);
      if (newInvoice) {
        setInvoices((prev) => [newInvoice, ...prev]);
        return newInvoice.id;
      }
      return null;
    } catch (err) {
      setError("Failed to add invoice");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateInvoiceData = async (
    id: string,
    invoiceData: InvoiceFormData
  ) => {
    setLoading(true);
    try {
      const updatedInvoice = await updateInvoice(id, invoiceData);
      if (updatedInvoice) {
        setInvoices((prev) =>
          prev.map((invoice) => (invoice.id === id ? updatedInvoice : invoice))
        );
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to update invoice");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeInvoice = async (id: string) => {
    setLoading(true);
    try {
      const success = await deleteInvoice(id);
      if (success) {
        setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to delete invoice");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const changeInvoiceStatus = async (
    id: string,
    status: "draft" | "sent" | "viewed" | "paid" | "overdue" | "cancelled"
  ) => {
    try {
      const success = await updateInvoiceStatus(id, status);
      if (success) {
        setInvoices((prev) =>
          prev.map((invoice) =>
            invoice.id === id ? { ...invoice, status } : invoice
          )
        );
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to update invoice status");
      console.error(err);
      return false;
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.business_name : "-";
  };

  const getProjectName = (projectId: string | null | undefined) => {
    if (!projectId) return "-";
    const project = projects.find((p) => p.id === projectId);
    return project ? project.name : "-";
  };

  // Generate an invoice number
  const generateInvoiceNumber = async (): Promise<string> => {
    try {
      // Get the current date
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      
      // Count existing invoices for this month
      const monthInvoices = invoices.filter(inv => {
        const invDate = new Date(inv.issue_date);
        return invDate.getMonth() + 1 === date.getMonth() + 1 && 
               invDate.getFullYear() === date.getFullYear();
      });
      
      const nextNum = (monthInvoices.length + 1).toString().padStart(3, '0');
      return `INV-${year}${month}-${nextNum}`;
    } catch (err) {
      console.error("Error generating invoice number:", err);
      return `INV-${Date.now()}`;
    }
  };

  return {
    invoices,
    clients,
    projects,
    loading,
    error,
    fetchInvoices,
    addInvoice,
    updateInvoice: updateInvoiceData,
    removeInvoice,
    changeInvoiceStatus,
    getClientName,
    getProjectName,
    generateInvoiceNumber,
  };
};
