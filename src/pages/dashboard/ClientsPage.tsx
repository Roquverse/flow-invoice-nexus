import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PlusCircle,
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  Edit,
  Trash,
} from "lucide-react";

// Sample client data
const initialClients = [
  {
    id: "1",
    name: "Acme Corporation",
    email: "contact@acmecorp.com",
    phone: "+1 (555) 123-4567",
    status: "Active",
    totalInvoices: 12,
    totalPaid: "$24,500.00",
    outstanding: "$3,200.00",
  },
  {
    id: "2",
    name: "Globex Industries",
    email: "info@globex.com",
    phone: "+1 (555) 987-6543",
    status: "Active",
    totalInvoices: 8,
    totalPaid: "$16,750.00",
    outstanding: "$0.00",
  },
  {
    id: "3",
    name: "Umbrella Corporation",
    email: "business@umbrellacorp.com",
    phone: "+1 (555) 456-7890",
    status: "Inactive",
    totalInvoices: 5,
    totalPaid: "$8,300.00",
    outstanding: "$1,500.00",
  },
  {
    id: "4",
    name: "Stark Industries",
    email: "sales@stark.com",
    phone: "+1 (555) 789-0123",
    status: "Active",
    totalInvoices: 15,
    totalPaid: "$32,100.00",
    outstanding: "$4,800.00",
  },
  {
    id: "5",
    name: "Wayne Enterprises",
    email: "contact@wayne.com",
    phone: "+1 (555) 234-5678",
    status: "Active",
    totalInvoices: 10,
    totalPaid: "$19,850.00",
    outstanding: "$2,100.00",
  },
];

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState(initialClients);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter clients based on search query
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Delete client handler
  const handleDeleteClient = (id: string) => {
    setClients(clients.filter((client) => client.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500">Manage your client relationships</p>
        </div>
        <Link to="/dashboard/clients/new">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search clients..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Export
              </Button>
              <Button variant="outline" size="sm">
                Filter
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Invoices
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Outstanding
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {client.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          <Link
                            to={`/dashboard/clients/${client.id}`}
                            className="hover:text-green-600"
                          >
                            {client.name}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex flex-col">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-1" />
                        <a
                          href={`mailto:${client.email}`}
                          className="hover:text-green-600"
                        >
                          {client.email}
                        </a>
                      </div>
                      <div className="flex items-center mt-1">
                        <Phone className="h-4 w-4 text-gray-400 mr-1" />
                        <a
                          href={`tel:${client.phone}`}
                          className="hover:text-green-600"
                        >
                          {client.phone}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        client.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.totalInvoices}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.totalPaid}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.outstanding}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/dashboard/clients/${client.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4 text-gray-500" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClient(client.id)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{filteredClients.length}</span> of{" "}
              <span className="font-medium">{clients.length}</span> clients
            </div>
            <div className="flex-1 flex justify-end">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;
