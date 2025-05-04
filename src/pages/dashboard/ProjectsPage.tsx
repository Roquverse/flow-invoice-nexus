import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  Calendar,
  DollarSign,
  Tag,
  Briefcase,
  Loader2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjects } from "@/hooks/useProjects";
import { Project, ProjectFormData } from "@/types/projects";
import { formatCurrency } from "@/utils/formatters";
import ErrorBoundary from "@/components/ErrorBoundary";

const ProjectsPage: React.FC = () => {
  const {
    projects,
    clients,
    loading,
    addProject,
    updateProject,
    removeProject,
  } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    client_id: "",
    description: "",
    status: "active",
    start_date: "",
    end_date: "",
    budget: undefined,
    currency: "USD",
    hourly_rate: undefined,
    is_fixed_price: false,
    tags: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [id]: target.checked }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [id]: value ? parseFloat(value) : undefined,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setFormData((prev) => ({ ...prev, tags: tagsArray }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditDialogOpen && selectedProject) {
      await updateProject(selectedProject.id, formData);
      setIsEditDialogOpen(false);
    } else {
      await addProject(formData);
      setIsAddDialogOpen(false);
    }

    resetForm();
  };

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      name: project.name,
      client_id: project.client_id || "",
      description: project.description || "",
      status: project.status as
        | "active"
        | "completed"
        | "on-hold"
        | "cancelled",
      start_date: project.start_date || "",
      end_date: project.end_date || "",
      budget: project.budget,
      currency: project.currency,
      hourly_rate: project.hourly_rate,
      is_fixed_price: project.is_fixed_price,
      tags: project.tags || [],
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedProject) {
      await removeProject(selectedProject.id);
      setIsDeleteDialogOpen(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      client_id: "",
      description: "",
      status: "active",
      start_date: "",
      end_date: "",
      budget: undefined,
      currency: "USD",
      hourly_rate: undefined,
      is_fixed_price: false,
      tags: [],
    });
    setSelectedProject(null);
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description &&
        project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getClientName = (clientId: string | null) => {
    if (!clientId) return "-";
    const client = clients.find((c) => c.id === clientId);
    return client ? client.business_name : "-";
  };

  const getBudgetDisplay = (project: Project) => {
    if (project.is_fixed_price && project.budget) {
      return formatCurrency(project.budget, project.currency);
    } else if (project.hourly_rate) {
      return `${formatCurrency(project.hourly_rate, project.currency)}/hr`;
    }
    return "-";
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "on-hold":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500">
            Manage your projects and billable work
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No projects found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "No projects match your search"
              : "You haven't added any projects yet"}
          </p>
          {searchTerm ? (
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Clear Search
            </Button>
          ) : (
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Create Your First Project
            </Button>
          )}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{project.name}</span>
                    {project.description && (
                      <span className="text-xs text-gray-500 truncate max-w-64">
                        {project.description}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getClientName(project.client_id)}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                      project.status
                    )}`}
                  >
                    {project.status.charAt(0).toUpperCase() +
                      project.status.slice(1).replace("-", " ")}
                  </span>
                </TableCell>
                <TableCell>
                  {project.start_date ? (
                    <div className="text-sm">
                      <div>
                        Start:{" "}
                        {new Date(project.start_date).toLocaleDateString()}
                      </div>
                      {project.end_date && (
                        <div>
                          End: {new Date(project.end_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{getBudgetDisplay(project)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(project)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(project)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Add/Edit Project Dialog */}
      <Dialog
        open={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (isAddDialogOpen) setIsAddDialogOpen(open);
          if (isEditDialogOpen) setIsEditDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden">
          <ErrorBoundary>
            <DialogHeader className="px-6 pt-6 pb-2">
              <DialogTitle className="text-xl font-semibold">
                {isEditDialogOpen ? "Edit Project" : "Create New Project"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Project Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="h-10"
                    placeholder="Enter project name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_id" className="text-sm font-medium">
                    Client
                  </Label>
                  <Select
                    value={formData.client_id || "none"}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        client_id: value === "none" ? "" : value,
                      }))
                    }
                  >
                    <SelectTrigger
                      id="client_id"
                      className="h-10 w-full bg-white"
                    >
                      <SelectValue placeholder="-- Select Client --" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <SelectItem value="none">-- No Client --</SelectItem>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.business_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <textarea
                    id="description"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter project description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="project_status"
                      className="text-sm font-medium block mb-2"
                    >
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: value as
                            | "active"
                            | "completed"
                            | "on-hold"
                            | "cancelled",
                        }))
                      }
                    >
                      <SelectTrigger
                        id="project_status"
                        className="h-10 w-full bg-white"
                      >
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on-hold">On Hold</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center mb-2">
                      <Label htmlFor="tags" className="text-sm font-medium">
                        Tags
                      </Label>
                      <span className="text-xs text-gray-400 ml-1">
                        (comma separated)
                      </span>
                    </div>
                    <Input
                      id="tags"
                      value={formData.tags?.join(", ") || ""}
                      onChange={handleTagsChange}
                      placeholder="design, website, logo"
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date" className="text-sm font-medium">
                      Start Date
                    </Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      className="h-10 bg-white"
                      placeholder="dd/mm/yyyy"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end_date" className="text-sm font-medium">
                      End Date
                    </Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      className="h-10 bg-white"
                      placeholder="dd/mm/yyyy"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_fixed_price"
                    checked={formData.is_fixed_price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_fixed_price: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 mr-2"
                    style={{ marginLeft: "200px" }}
                  />
                  <Label
                    htmlFor="is_fixed_price"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Fixed Price Project
                  </Label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-sm font-medium">
                      Currency
                    </Label>
                    <Select
                      value={formData.currency || "NGN"}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, currency: value }))
                      }
                    >
                      <SelectTrigger
                        id="currency"
                        className="h-10 w-full bg-white"
                      >
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NGN">NGN (₦)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD ($)</SelectItem>
                        <SelectItem value="AUD">AUD ($)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.is_fixed_price ? (
                    <div className="space-y-2">
                      <Label htmlFor="budget" className="text-sm font-medium">
                        Total Budget
                      </Label>
                      <Input
                        id="budget"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.budget?.toString() || ""}
                        onChange={handleInputChange}
                        className="h-10 bg-white"
                        placeholder="0.00"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label
                        htmlFor="hourly_rate"
                        className="text-sm font-medium"
                      >
                        Hourly Rate
                      </Label>
                      <Input
                        id="hourly_rate"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.hourly_rate?.toString() || ""}
                        onChange={handleInputChange}
                        className="h-10 bg-white"
                        placeholder="0.00"
                      />
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter className="px-6 py-4 bg-gray-50 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsAddDialogOpen(false);
                    setIsEditDialogOpen(false);
                  }}
                  type="button"
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isEditDialogOpen ? "Update Project" : "Create Project"}
                </Button>
              </DialogFooter>
            </form>
          </ErrorBoundary>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedProject?.name}</span>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedProject(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsPage;
