import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  PlusCircle,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  MoreVertical,
  ExternalLink,
  Edit,
  Trash,
} from "lucide-react";

// Sample project data
const initialProjects = [
  {
    id: "1",
    name: "Website Redesign",
    client: "Acme Corporation",
    clientId: "1",
    description: "Complete redesign of company website with new branding",
    startDate: "2023-10-12",
    dueDate: "2023-12-20",
    status: "In Progress",
    progress: 65,
    team: ["John D.", "Sarah M.", "David K."],
    budget: "$12,000.00",
    invoiced: "$7,800.00",
  },
  {
    id: "2",
    name: "Mobile App Development",
    client: "Globex Industries",
    clientId: "2",
    description: "Create a native mobile application for iOS and Android",
    startDate: "2023-09-05",
    dueDate: "2024-01-15",
    status: "In Progress",
    progress: 40,
    team: ["Emily R.", "Michael T."],
    budget: "$24,000.00",
    invoiced: "$9,600.00",
  },
  {
    id: "3",
    name: "SEO Optimization",
    client: "Wayne Enterprises",
    clientId: "5",
    description: "Improve search engine rankings and organic traffic",
    startDate: "2023-11-01",
    dueDate: "2023-12-15",
    status: "Not Started",
    progress: 0,
    team: ["Lisa J."],
    budget: "$5,000.00",
    invoiced: "$0.00",
  },
  {
    id: "4",
    name: "E-commerce Integration",
    client: "Stark Industries",
    clientId: "4",
    description: "Integrate payment gateway and shopping cart functionality",
    startDate: "2023-08-15",
    dueDate: "2023-10-30",
    status: "Completed",
    progress: 100,
    team: ["Robert P.", "James R.", "Natasha R."],
    budget: "$18,500.00",
    invoiced: "$18,500.00",
  },
];

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Filter projects based on search query and status filter
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Delete project handler
  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500">Manage your client projects</p>
        </div>
        <Link to="/dashboard/projects/new">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search projects..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow overflow-hidden border border-gray-100 hover:border-green-200 transition-all duration-200"
          >
            <div className="p-5">
              <div className="flex items-start justify-between">
                <Link
                  to={`/dashboard/projects/${project.id}`}
                  className="hover:text-green-600"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {project.name}
                  </h3>
                </Link>
                <div className="relative">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                  {/* Dropdown menu would go here */}
                </div>
              </div>

              <Link
                to={`/dashboard/clients/${project.clientId}`}
                className="text-sm text-gray-600 hover:text-green-600 mb-3 inline-block"
              >
                {project.client}
              </Link>

              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {project.description}
              </p>

              <div className="flex justify-between mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    {new Date(project.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{new Date(project.dueDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      project.status === "Completed"
                        ? "bg-green-500"
                        : project.progress > 50
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                    }`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between mb-4">
                <div className="text-sm">
                  <span className="text-gray-500">Budget:</span>
                  <span className="ml-1 font-medium">{project.budget}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Invoiced:</span>
                  <span className="ml-1 font-medium">{project.invoiced}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex -space-x-2">
                  {project.team.slice(0, 3).map((member, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium"
                      title={member}
                    >
                      {member
                        .split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </div>
                  ))}
                  {project.team.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-500">
                      +{project.team.length - 3}
                    </div>
                  )}
                </div>

                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    project.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : project.status === "In Progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {project.status}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 px-5 py-3 bg-gray-50 flex justify-between">
              <Link
                to={`/dashboard/projects/${project.id}`}
                className="text-sm text-gray-600 hover:text-green-600 flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View Details
              </Link>
              <div className="flex space-x-2">
                <Link to={`/dashboard/projects/${project.id}/edit`}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4 text-gray-500" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No projects found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery
              ? `No projects match "${searchQuery}"`
              : "You don't have any projects yet."}
          </p>
          <Link to="/dashboard/projects/new">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Project
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
