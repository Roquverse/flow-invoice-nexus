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
  Plus,
  MoreVertical,
  Trash2,
  Building,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@/components/ui/dropdown";
import { useClients } from "@/hooks/useClients";
import { ClientFormData, Client } from "@/types/clients";
import ErrorBoundary from "@/components/ErrorBoundary";

const ClientsPage: React.FC = () => {
  const { clients, loading, addClient, updateClient, removeClient } =
    useClients();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [formData, setFormData] = useState<ClientFormData>({
    business_name: "",
    contact_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    country: "",
    tax_id: "",
    notes: "",
    status: "active",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditDialogOpen && selectedClient) {
      await updateClient(selectedClient.id, formData);
      setIsEditDialogOpen(false);
    } else {
      await addClient(formData);
      setIsAddDialogOpen(false);
    }

    resetForm();
  };

  const handleEditClick = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      business_name: client.business_name,
      contact_name: client.contact_name || "",
      email: client.email || "",
      phone: client.phone || "",
      address: client.address || "",
      city: client.city || "",
      postal_code: client.postal_code || "",
      country: client.country || "",
      tax_id: client.tax_id || "",
      notes: client.notes || "",
      status: client.status as "active" | "inactive" | "archived",
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedClient) {
      await removeClient(selectedClient.id);
      setIsDeleteDialogOpen(false);
    }
  };

  const resetForm = () => {
    setFormData({
      business_name: "",
      contact_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postal_code: "",
      country: "",
      tax_id: "",
      notes: "",
      status: "active",
    });
    setSelectedClient(null);
  };

  const filteredClients = clients.filter(
    (client) =>
      client.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.contact_name &&
        client.contact_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.email &&
        client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500">Manage your client information</p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Client
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No clients found
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "No clients match your search"
              : "You haven't added any clients yet"}
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
              <Plus className="mr-2 h-4 w-4" /> Add Your First Client
            </Button>
          )}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business Name</TableHead>
              <TableHead>Contact Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">
                  {client.business_name}
                </TableCell>
                <TableCell>{client.contact_name || "-"}</TableCell>
                <TableCell>{client.email || "-"}</TableCell>
                <TableCell>{client.phone || "-"}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.status === "active"
                        ? "bg-green-100 text-green-800"
                        : client.status === "inactive"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {client.status.charAt(0).toUpperCase() +
                      client.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(client)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(client)}
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

      {/* Add Client Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden">
          <ErrorBoundary>
            <DialogHeader className="px-6 pt-6 pb-2">
              <DialogTitle className="text-xl font-semibold">
                Add New Client
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="business_name"
                    className="text-sm font-medium required"
                  >
                    Business Name
                  </Label>
                  <Input
                    id="business_name"
                    value={formData.business_name}
                    onChange={handleInputChange}
                    required
                    className="h-10 bg-white"
                    placeholder="Enter business name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="contact_name"
                      className="text-sm font-medium"
                    >
                      Contact Name
                    </Label>
                    <Input
                      id="contact_name"
                      value={formData.contact_name}
                      onChange={handleInputChange}
                      className="h-10 bg-white"
                      placeholder="Enter contact name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-10 bg-white"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="h-10 bg-white"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax_id" className="text-sm font-medium">
                      Tax ID / VAT Number
                    </Label>
                    <Input
                      id="tax_id"
                      value={formData.tax_id}
                      onChange={handleInputChange}
                      className="h-10 bg-white"
                      placeholder="Enter tax ID"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="h-10 bg-white"
                    placeholder="Enter street address"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium">
                      City
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="h-10 bg-white"
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="postal_code"
                      className="text-sm font-medium"
                    >
                      Postal Code
                    </Label>
                    <Input
                      id="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      className="h-10 bg-white"
                      placeholder="Enter postal code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-medium">
                      Country
                    </Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="h-10 bg-white"
                      placeholder="Enter country"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="status"
                    className="text-sm font-medium block mb-2"
                  >
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: value as "active" | "inactive" | "archived",
                      }))
                    }
                  >
                    <SelectTrigger id="status" className="h-10 w-full bg-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium">
                    Notes
                  </Label>
                  <textarea
                    id="notes"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Additional notes about this client"
                  />
                </div>
              </div>
              <DialogFooter className="px-6 py-4 bg-gray-50 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsAddDialogOpen(false);
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
                  Add Client
                </Button>
              </DialogFooter>
            </form>
          </ErrorBoundary>
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden">
          <ErrorBoundary>
            <DialogHeader className="px-6 pt-6 pb-2">
              <DialogTitle className="text-xl font-semibold">
                Edit Client
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="business_name"
                    className="text-sm font-medium required"
                  >
                    Business Name
                  </Label>
                  <Input
                    id="business_name"
                    value={formData.business_name}
                    onChange={handleInputChange}
                    required
                    className="h-10 bg-white"
                    placeholder="Enter business name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="contact_name"
                      className="text-sm font-medium"
                    >
                      Contact Name
                    </Label>
                    <Input
                      id="contact_name"
                      value={formData.contact_name}
                      onChange={handleInputChange}
                      className="h-10 bg-white"
                      placeholder="Enter contact name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-10 bg-white"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="h-10 bg-white"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax_id" className="text-sm font-medium">
                      Tax ID / VAT Number
                    </Label>
                    <Input
                      id="tax_id"
                      value={formData.tax_id}
                      onChange={handleInputChange}
                      className="h-10 bg-white"
                      placeholder="Enter tax ID"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="h-10 bg-white"
                    placeholder="Enter street address"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium">
                      City
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="h-10 bg-white"
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="postal_code"
                      className="text-sm font-medium"
                    >
                      Postal Code
                    </Label>
                    <Input
                      id="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      className="h-10 bg-white"
                      placeholder="Enter postal code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-sm font-medium">
                      Country
                    </Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="h-10 bg-white"
                      placeholder="Enter country"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="status"
                    className="text-sm font-medium block mb-2"
                  >
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: value as "active" | "inactive" | "archived",
                      }))
                    }
                  >
                    <SelectTrigger id="status" className="h-10 w-full bg-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-medium">
                    Notes
                  </Label>
                  <textarea
                    id="notes"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Additional notes about this client"
                  />
                </div>
              </div>
              <DialogFooter className="px-6 py-4 bg-gray-50 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    resetForm();
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
                  Update Client
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
            <DialogTitle>Delete Client</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {selectedClient?.business_name}
              </span>
              ?
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
                setSelectedClient(null);
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

export default ClientsPage;
