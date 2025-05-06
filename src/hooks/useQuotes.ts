import { useState, useEffect, useCallback } from "react";
import { Quote, QuoteFormData } from "@/types/quotes";
import { Client } from "@/types/clients";
import { Project } from "@/types/projects";
import {
  getQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote,
  updateQuoteStatus,
  convertQuoteToInvoice,
} from "@/services/quoteService";
import { getClients } from "@/services/clientService";
import { projectService } from "@/services/projectService";

// Memoized quote number for the current session
let cachedQuoteNumber: string | null = null;

export const useQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const quotesData = await getQuotes();
      setQuotes(quotesData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch quotes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchClientsAndProjects = useCallback(async () => {
    try {
      const [clientsData, projectsData] = await Promise.all([
        getClients(),
        projectService.getProjects(),
      ]);
      setClients(clientsData);
      setProjects(projectsData);
    } catch (err) {
      console.error("Error fetching clients and projects:", err);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
    fetchClientsAndProjects();
  }, [fetchQuotes, fetchClientsAndProjects]);

  const addQuote = async (quoteData: QuoteFormData) => {
    setLoading(true);
    try {
      const newQuote = await createQuote(quoteData);
      if (newQuote) {
        setQuotes((prev) => [newQuote, ...prev]);
        return newQuote.id;
      }
      return null;
    } catch (err) {
      setError("Failed to add quote");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateQuoteData = async (id: string, quoteData: QuoteFormData) => {
    setLoading(true);
    try {
      const updatedQuote = await updateQuote(id, quoteData);
      if (updatedQuote) {
        setQuotes((prev) =>
          prev.map((quote) => (quote.id === id ? updatedQuote : quote))
        );
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to update quote");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeQuote = async (id: string) => {
    setLoading(true);
    try {
      const success = await deleteQuote(id);
      if (success) {
        setQuotes((prev) => prev.filter((quote) => quote.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to delete quote");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const changeQuoteStatus = async (
    id: string,
    status: "draft" | "sent" | "viewed" | "accepted" | "rejected" | "expired"
  ) => {
    try {
      const success = await updateQuoteStatus(id, status);
      if (success) {
        setQuotes((prev) =>
          prev.map((quote) => (quote.id === id ? { ...quote, status } : quote))
        );
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to update quote status");
      console.error(err);
      return false;
    }
  };

  const convertToInvoice = async (id: string) => {
    setLoading(true);
    try {
      const invoiceId = await convertQuoteToInvoice(id);
      if (invoiceId) {
        // Update the quote status to accepted
        await changeQuoteStatus(id, "accepted");
        return invoiceId;
      }
      return null;
    } catch (err) {
      setError("Failed to convert quote to invoice");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
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

  // Generate a quote number
  const generateQuoteNumber = async (): Promise<string> => {
    // Return cached quote number if available
    if (cachedQuoteNumber) {
      return cachedQuoteNumber;
    }

    try {
      // Get the current date
      const date = new Date();
      const year = date.getFullYear().toString().slice(-2);
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");

      // Use timestamp for uniqueness
      const timestamp = Date.now().toString().slice(-6);

      // Create quote number in format QT-YYMMDD-XXXXXX (last 6 digits of timestamp)
      const quoteNumber = `QT-${year}${month}${day}-${timestamp}`;

      // Cache the quote number for this session
      cachedQuoteNumber = quoteNumber;

      return quoteNumber;
    } catch (err) {
      console.error("Error generating quote number:", err);
      const fallback = `QT-${Date.now()}`;
      cachedQuoteNumber = fallback;
      return fallback;
    }
  };

  return {
    quotes,
    clients,
    projects,
    loading,
    error,
    fetchQuotes,
    addQuote,
    updateQuote: updateQuoteData,
    removeQuote,
    changeQuoteStatus,
    convertToInvoice,
    getClientName,
    getProjectName,
    generateQuoteNumber,
  };
};
