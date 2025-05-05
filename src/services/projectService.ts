
import { Project, ProjectFormData } from "../types/projects";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";

export const projectService = {
  /**
   * Get all projects for the current user
   */
  getProjects: async (): Promise<Project[]> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Cast the status field to the ProjectStatus type
      return (data || []).map((project) => ({
        ...project,
        // Cast the status to one of the acceptable values from the ProjectStatus type
        status: project.status as "active" | "completed" | "on-hold" | "cancelled",
        // Make sure tags is an array
        tags: project.tags || [],
      }));
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  },

  /**
   * Get a project by ID
   */
  getProjectById: async (id: string): Promise<Project> => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      // Cast the status field to the ProjectStatus type
      return {
        ...data,
        // Cast the status to one of the acceptable values from the ProjectStatus type
        status: data.status as "active" | "completed" | "on-hold" | "cancelled",
        // Make sure tags is an array
        tags: data.tags || [],
      };
    } catch (error) {
      console.error("Error fetching project:", error);
      throw error;
    }
  },

  /**
   * Create a new project
   */
  createProject: async (projectData: ProjectFormData): Promise<Project> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from("projects")
        .insert({
          ...projectData,
          user_id: user.user.id,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Cast the status field to the ProjectStatus type
      return {
        ...data,
        // Cast the status to one of the acceptable values from the ProjectStatus type
        status: data.status as "active" | "completed" | "on-hold" | "cancelled",
        // Make sure tags is an array
        tags: data.tags || [],
      };
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  },

  /**
   * Update an existing project
   */
  updateProject: async (id: string, projectData: Partial<Project>): Promise<Project> => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .update(projectData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Cast the status field to the ProjectStatus type
      return {
        ...data,
        // Cast the status to one of the acceptable values from the ProjectStatus type
        status: data.status as "active" | "completed" | "on-hold" | "cancelled",
        // Make sure tags is an array
        tags: data.tags || [],
      };
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  },

  /**
   * Delete a project
   */
  deleteProject: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  },

  /**
   * Get basic client info for all clients
   */
  getClientBasicInfo: async () => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("id, business_name, contact_name");

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error fetching client basic info:", error);
      throw error;
    }
  },
};
