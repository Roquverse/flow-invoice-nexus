import { useState, useEffect } from "react";
import { toast } from "sonner";
import * as clientService from "@/services/clientService";
import { Client, ClientFormData } from "@/types/clients";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getClients();
      setClients(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to load clients")
      );
      console.error("Error loading clients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const getClient = async (id: string): Promise<Client | null> => {
    try {
      const client = await clientService.getClientById(id);
      return client;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error(`Failed to get client ${id}`)
      );
      console.error(`Error getting client ${id}:`, err);
      return null;
    }
  };

  const addClient = async (
    clientData: ClientFormData
  ): Promise<Client | null> => {
    try {
      setLoading(true);
      const newClient = await clientService.createClient(clientData);

      if (newClient) {
        setClients((prev) => [...prev, newClient]);
        toast.success("Client added successfully");
        return newClient;
      } else {
        toast.error("Failed to add client");
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to add client"));
      console.error("Error adding client:", err);
      toast.error("Error adding client");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (
    id: string,
    clientData: ClientFormData
  ): Promise<Client | null> => {
    try {
      setLoading(true);
      const updatedClient = await clientService.updateClient(id, clientData);

      if (updatedClient) {
        setClients((prev) =>
          prev.map((client) => (client.id === id ? updatedClient : client))
        );
        toast.success("Client updated successfully");
        return updatedClient;
      } else {
        toast.error("Failed to update client");
        return null;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error(`Failed to update client ${id}`)
      );
      console.error(`Error updating client ${id}:`, err);
      toast.error("Error updating client");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeClient = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      const success = await clientService.deleteClient(id);

      if (success) {
        setClients((prev) => prev.filter((client) => client.id !== id));
        toast.success("Client deleted successfully");
        return true;
      } else {
        toast.error("Failed to delete client");
        return false;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error(`Failed to delete client ${id}`)
      );
      console.error(`Error deleting client ${id}:`, err);
      toast.error("Error deleting client");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    clients,
    loading,
    error,
    fetchClients,
    getClient,
    addClient,
    updateClient,
    removeClient,
  };
}
