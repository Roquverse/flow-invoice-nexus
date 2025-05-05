import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { invoiceService } from "@/services/invoiceService";
import { Project } from "@/types/projects";
import { projectService } from "@/services/projectService";
import { useClients } from "@/hooks/useClients";
import { useAuth } from "@/contexts/AuthContext";

// Define the schema for form validation
const schema = yup.object({
  client_id: yup.string().required("Client is required"),
  project_id: yup.string().required("Project is required"),
  invoice_date: yup.date().required("Invoice Date is required"),
  due_date: yup.date().required("Due Date is required"),
  status: yup.string().required("Status is required"),
  notes: yup.string(),
  terms: yup.string(),
  items: yup.array().of(
    yup.object({
      id: yup.string().required(),
      name: yup.string().required("Item Name is required"),
      quantity: yup.number().required("Quantity is required").positive("Quantity must be positive"),
      unit_price: yup.number().required("Unit Price is required").positive("Unit Price must be positive"),
    })
  ),
}).required();

interface FormData {
  client_id: string;
  project_id: string;
  invoice_date: Date;
  due_date: Date;
  status: string;
  notes: string;
  terms: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    unit_price: number;
  }[];
}

interface InvoiceFormProps {
  isEditing?: boolean;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ isEditing }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<any>({ items: [] });
  const [projects, setProjects] = useState<Project[]>([]);
  const { clients, loading: clientsLoading, error: clientsError } = useClients();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      client_id: "",
      project_id: "",
      invoice_date: new Date(),
      due_date: new Date(),
      status: "draft",
      notes: "",
      terms: "",
      items: [],
    },
  });

  useEffect(() => {
    const fetchInvoice = async () => {
      if (isEditing && id) {
        setLoading(true);
        try {
          const invoiceData = await invoiceService.getInvoiceById(id);
          setInvoice(invoiceData);

          // Set default values for the form
          setValue("client_id", invoiceData.client_id);
          setValue("project_id", invoiceData.project_id);
          setValue("invoice_date", new Date(invoiceData.invoice_date));
          setValue("due_date", new Date(invoiceData.due_date));
          setValue("status", invoiceData.status);
          setValue("notes", invoiceData.notes);
          setValue("terms", invoiceData.terms);
          setValue("items", invoiceData.items);
        } catch (error: any) {
          setError(error.message || "Failed to load invoice");
          toast.error(error.message || "Failed to load invoice");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchInvoice();
  }, [isEditing, id, setValue]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await projectService.getProjects();
        setProjects(projectsData);
      } catch (error: any) {
        setError(error.message || "Failed to load projects");
        toast.error(error.message || "Failed to load projects");
      }
    };

    fetchProjects();
  }, []);

  // Fix the issue where id is accessed on a string type
  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = e.target.value;
    if (clientId) {
      setInvoice((prev) => ({
        ...prev,
        client_id: clientId,
      }));
    }
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const projectId = e.target.value;
    if (projectId) {
      setInvoice((prev) => ({
        ...prev,
        project_id: projectId,
      }));
    }
  };

  const handleDateChange = (dateType: string, date: Date) => {
    setInvoice((prev) => ({
      ...prev,
      [dateType]: date.toISOString(),
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setInvoice((prev) => ({
      ...prev,
      status: status,
    }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const notes = e.target.value;
    setInvoice((prev) => ({
      ...prev,
      notes: notes,
    }));
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const terms = e.target.value;
    setInvoice((prev) => ({
      ...prev,
      terms: terms,
    }));
  };

  const addItem = () => {
    const newItem = { id: uuidv4(), name: "", quantity: 1, unit_price: 0 };
    setInvoice((prev) => ({
      ...prev,
      items: [...(prev.items || []), newItem],
    }));
  };

  const updateItem = (itemId: string, field: string, value: string | number) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items?.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Use proper id handling in deleteItem function
  const deleteItem = (itemId: string) => {
    setInvoice((prev) => ({
      ...prev,
      items: prev.items?.filter((item) => item.id !== itemId) || [],
    }));
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      if (isEditing && id) {
        await invoiceService.updateInvoice(id, data);
        toast.success("Invoice updated successfully!");
      } else {
        await invoiceService.createInvoice(data);
        toast.success("Invoice created successfully!");
      }
      navigate("/dashboard/invoices");
    } catch (error: any) {
      setError(error.message || "Failed to save invoice");
      toast.error(error.message || "Failed to save invoice");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">{isEditing ? "Edit Invoice" : "Create New Invoice"}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="client_id">Client</Label>
            <Select onValueChange={(value) => setValue("client_id", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients?.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.business_name || client.contact_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.client_id && <p className="text-red-500 text-sm">{errors.client_id.message}</p>}
          </div>

          <div>
            <Label htmlFor="project_id">Project</Label>
            <Select onValueChange={(value) => setValue("project_id", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects?.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.project_id && <p className="text-red-500 text-sm">{errors.project_id.message}</p>}
          </div>

          <div>
            <Label htmlFor="invoice_date">Invoice Date</Label>
            <Input
              type="date"
              id="invoice_date"
              {...register("invoice_date", { valueAsDate: true })}
              className="w-full"
            />
            {errors.invoice_date && <p className="text-red-500 text-sm">{errors.invoice_date.message}</p>}
          </div>

          <div>
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              type="date"
              id="due_date"
              {...register("due_date", { valueAsDate: true })}
              className="w-full"
            />
            {errors.due_date && <p className="text-red-500 text-sm">{errors.due_date.message}</p>}
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={(value) => setValue("status", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              className="w-full"
            />
            {errors.notes && <p className="text-red-500 text-sm">{errors.notes.message}</p>}
          </div>

          <div>
            <Label htmlFor="terms">Terms</Label>
            <Textarea
              id="terms"
              {...register("terms")}
              className="w-full"
            />
            {errors.terms && <p className="text-red-500 text-sm">{errors.terms.message}</p>}
          </div>

          <div>
            <Label>Items</Label>
            {invoice.items?.map((item: any, index: number) => (
              <div key={item.id} className="grid grid-cols-5 gap-2 mb-2">
                <Input
                  type="text"
                  placeholder="Item Name"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, "name", e.target.value)}
                  className="col-span-2"
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                  className="w-20"
                />
                <Input
                  type="number"
                  placeholder="Unit Price"
                  value={item.unit_price}
                  onChange={(e) => updateItem(item.id, "unit_price", Number(e.target.value))}
                  className="w-24"
                />
                <Button type="button" variant="destructive" size="sm" onClick={() => deleteItem(item.id)}>
                  Delete
                </Button>
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={addItem}>
              Add Item
            </Button>
            {errors.items && <p className="text-red-500 text-sm">{errors.items.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {isEditing ? "Update Invoice" : "Create Invoice"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InvoiceForm;
