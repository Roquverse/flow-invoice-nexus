
import { supabase } from "@/integrations/supabase/client";
import { Project, ProjectFormData } from "@/types/projects";

/**
 * Get all projects for the current user
 */
export async function getProjects(): Promise<Project[]> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return [];

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      return [];
    }

    // Cast status field to the correct type
    const typedData = data?.map(project => ({
      ...project,
      status: project.status as "active" | "completed" | "on-hold" | "cancelled"
    })) || [];

    return typedData;
  } catch (e) {
    console.error("Error accessing projects:", e);
    return [];
  }
}

/**
 * Get a specific project by ID
 */
export async function getProjectById(id: string): Promise<Project | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.user.id)
      .single();

    if (error) {
      console.error(`Error fetching project ${id}:`, error);
      return null;
    }

    return data;
  } catch (e) {
    console.error("Error accessing project:", e);
    return null;
  }
}

/**
 * Create a new project
 */
export async function createProject(
  project: ProjectFormData
): Promise<Project | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: user.user.id,
        name: project.name,
        client_id: project.client_id || null,
        description: project.description || null,
        status: project.status || "active",
        start_date: project.start_date || null,
        end_date: project.end_date || null,
        budget: project.budget || null,
        currency: project.currency || "USD",
        hourly_rate: project.hourly_rate || null,
        is_fixed_price: project.is_fixed_price || false,
        tags: project.tags || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating project:", error);
      return null;
    }

    return data;
  } catch (e) {
    console.error("Error creating project:", e);
    return null;
  }
}

/**
 * Update an existing project
 */
export async function updateProject(
  id: string,
  project: ProjectFormData
): Promise<Project | null> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return null;

  try {
    const { data, error } = await supabase
      .from("projects")
      .update({
        name: project.name,
        client_id: project.client_id || null,
        description: project.description || null,
        status: project.status || "active",
        start_date: project.start_date || null,
        end_date: project.end_date || null,
        budget: project.budget || null,
        currency: project.currency || "USD",
        hourly_rate: project.hourly_rate || null,
        is_fixed_price: project.is_fixed_price || false,
        tags: project.tags || null,
      })
      .eq("id", id)
      .eq("user_id", user.user.id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating project ${id}:`, error);
      return null;
    }

    return data;
  } catch (e) {
    console.error("Error updating project:", e);
    return null;
  }
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<boolean> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return false;

  try {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)
      .eq("user_id", user.user.id);

    if (error) {
      console.error(`Error deleting project ${id}:`, error);
      return false;
    }

    return true;
  } catch (e) {
    console.error("Error deleting project:", e);
    return false;
  }
}

/**
 * Get clients for dropdown selection
 */
export async function getClientsList(): Promise<ClientBasicInfo[]> {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) return [];

  try {
    const { data, error } = await supabase
      .from("clients")
      .select("id, business_name")
      .eq("user_id", user.user.id)
      .eq("status", "active")
      .order("business_name");

    if (error) {
      console.error("Error fetching clients list:", error);
      return [];
    }

    return data || [];
  } catch (e) {
    console.error("Error accessing clients list:", e);
    return [];
  }
}
