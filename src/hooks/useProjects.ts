import { useState, useEffect } from "react";
import { toast } from "sonner";
import { projectService } from "@/services/projectService";
import { Project, ProjectFormData, ClientBasicInfo } from "@/types/projects";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<ClientBasicInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      setProjects(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to load projects")
      );
      console.error("Error loading projects:", err);
      // Don't throw, set empty array to prevent app from crashing
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const data = await projectService.getClientBasicInfo();
      setClients(data || []);
    } catch (err) {
      console.error("Error loading clients for dropdown:", err);
      // Don't throw, set empty array to prevent app from crashing
      setClients([]);
    }
  };

  useEffect(() => {
    // Use Promise.allSettled to prevent one failure from affecting the other
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.allSettled([fetchProjects(), fetchClients()]);
      } catch (err) {
        console.error("Error loading initial data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getProject = async (id: string): Promise<Project | null> => {
    try {
      const project = await projectService.getProjectById(id);
      return project;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error(`Failed to get project ${id}`)
      );
      console.error(`Error getting project ${id}:`, err);
      return null;
    }
  };

  const addProject = async (
    projectData: ProjectFormData
  ): Promise<Project | null> => {
    try {
      setLoading(true);
      const newProject = await projectService.createProject(projectData);

      if (newProject) {
        setProjects((prev) => [...prev, newProject]);
        toast.success("Project added successfully");
        return newProject;
      } else {
        toast.error("Failed to add project");
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to add project"));
      console.error("Error adding project:", err);
      toast.error("Error adding project");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (
    id: string,
    projectData: ProjectFormData
  ): Promise<Project | null> => {
    try {
      setLoading(true);
      const updatedProject = await projectService.updateProject(
        id,
        projectData
      );

      if (updatedProject) {
        setProjects((prev) =>
          prev.map((project) => (project.id === id ? updatedProject : project))
        );
        toast.success("Project updated successfully");
        return updatedProject;
      } else {
        toast.error("Failed to update project");
        return null;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error(`Failed to update project ${id}`)
      );
      console.error(`Error updating project ${id}:`, err);
      toast.error("Error updating project");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeProject = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      await projectService.deleteProject(id);
      setProjects((prev) => prev.filter((project) => project.id !== id));
      toast.success("Project deleted successfully");
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error(`Failed to delete project ${id}`)
      );
      console.error(`Error deleting project ${id}:`, err);
      toast.error("Error deleting project");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    projects,
    clients,
    loading,
    error,
    fetchProjects,
    fetchClients,
    getProject,
    addProject,
    updateProject,
    removeProject,
  };
}
