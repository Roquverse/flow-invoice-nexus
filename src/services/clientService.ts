
import { supabase } from "@/integrations/supabase/client";
import { Client, ClientFormData } from "@/types/clients";

/**
 * Get all clients for the current user
 */
export async function getClients(): Promise<Client[]> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return [];

  try {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", user.user.id)
      .order("business_name");

    if (error) {
      console.error("Error fetching clients:", error);
      return [];
    }

    // Properly cast the status field to ensure type compatibility
    const typedData = data?.map(client => ({
      ...client, 
      status: (client.status || 'active') as "active" | "inactive" | "archived"
    })) || [];

    return typedData;
  } catch (e) {
    console.error("Error accessing clients:", e);
    return [];
  }
}

/**
 * Get a specific client by ID
 */
export async function getClientById(id: string): Promise<Client | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.user.id)
      .single();

    if (error) {
      console.error(`Error fetching client ${id}:`, error);
      return null;
    }

    // Cast status field to the correct type
    return data ? {
      ...data,
      status: (data.status || 'active') as "active" | "inactive" | "archived"
    } : null;
  } catch (e) {
    console.error("Error accessing client:", e);
    return null;
  }
}

/**
 * Create a new client
 */
export async function createClient(
  client: ClientFormData
): Promise<Client | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    const { data, error } = await supabase
      .from("clients")
      .insert({
        user_id: user.user.id,
        business_name: client.business_name,
        contact_name: client.contact_name || null,
        email: client.email || null,
        phone: client.phone || null,
        address: client.address || null,
        city: client.city || null,
        postal_code: client.postal_code || null,
        country: client.country || null,
        tax_id: client.tax_id || null,
        notes: client.notes || null,
        status: client.status || "active",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating client:", error);
      return null;
    }

    // Cast status field to the correct type
    return data ? {
      ...data,
      status: (data.status || 'active') as "active" | "inactive" | "archived"
    } : null;
  } catch (e) {
    console.error("Error creating client:", e);
    return null;
  }
}

/**
 * Update an existing client
 */
export async function updateClient(
  id: string,
  client: ClientFormData
): Promise<Client | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    const { data, error } = await supabase
      .from("clients")
      .update({
        business_name: client.business_name,
        contact_name: client.contact_name || null,
        email: client.email || null,
        phone: client.phone || null,
        address: client.address || null,
        city: client.city || null,
        postal_code: client.postal_code || null,
        country: client.country || null,
        tax_id: client.tax_id || null,
        notes: client.notes || null,
        status: client.status || "active",
      })
      .eq("id", id)
      .eq("user_id", user.user.id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating client ${id}:`, error);
      return null;
    }

    // Cast status field to the correct type
    return data ? {
      ...data,
      status: (data.status || 'active') as "active" | "inactive" | "archived"
    } : null;
  } catch (e) {
    console.error("Error updating client:", e);
    return null;
  }
}

/**
 * Delete a client
 */
export async function deleteClient(id: string): Promise<boolean> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return false;

  try {
    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", id)
      .eq("user_id", user.user.id);

    if (error) {
      console.error(`Error deleting client ${id}:`, error);
      return false;
    }

    return true;
  } catch (e) {
    console.error("Error deleting client:", e);
    return false;
  }
}
