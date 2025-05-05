import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  FileText,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useInvoices } from "@/hooks/useInvoices";
import { useClients } from "@/hooks/useClients";
import { useProjects } from "@/hooks/useProjects";
import { Invoice, InvoiceItem } from "@/types/invoices";
import { Client } from "@/types/clients";
import { formatCurrency } from "@/utils/formatters";
import { DatePicker } from "@/components/ui/date-picker";
import { getClientById } from "@/services/clientService";
import InvoicePreview from "./InvoicePreview";
import { downloadPDF } from "@/utils/pdf";

interface InvoiceFormProps {
  invoice?: Invoice;
  isEditing?: boolean;
}

const DEFAULT_INVOICE_ITEM: Partial<InvoiceItem> = {
  id: crypto.randomUUID(),
  description: "",
  quantity: 1,
  unit_price: 0,
  amount: 0,
  total: 0,
};

const CURRENCIES = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "JPY", label: "JPY - Japanese Yen" },
];

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoice,
  isEditing = false,
}) => {
  const navigate = useNavigate();
  const { clients } = useClients();
  const { projects } = useProjects();
  const { addInvoice, updateInvoice, generateInvoiceNumber } = useInvoices();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Invoice>>({
    id: "",
    invoice_number: "",
    client_id: "",
    project_id: "",
    issue_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    status: "draft",
    currency: "USD",
    subtotal: 0,
    tax_rate: 0,
    tax_amount: 0,
    total_amount: 0,
    notes: "",
    terms: "Payment is due within 30 days from the date of invoice.",
    items: [{ ...DEFAULT_INVOICE_ITEM as InvoiceItem }],
  });

  // Preview state
  const [showPreview, setShowPreview] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (isEditing && invoice) {
        setFormData(invoice);
      } else {
        // Generate a new invoice number for new invoices
        const newInvoiceNumber = await generateInvoiceNumber();
        setFormData((prev) => ({ ...prev, invoice_number: newInvoiceNumber }));
      }
    };

    fetchData();
  }, [isEditing, invoice, generateInvoiceNumber]);

  useEffect(() => {
    console.log("Clients data:", clients);
  }, [clients]);

  // Fetch client data when client_id changes
  useEffect(() => {
    const fetchClientData = async () => {
      if (formData.client_id) {
        const client = await getClientById(formData.client_id);
        setCurrentClient(client);
      }
    };

    fetchClientData();
  }, [formData.client_id]);

  // Preview and PDF handlers
  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleDownloadPDF = async () => {
    if (!currentClient) return;

    try {
      await downloadPDF(
        previewRef,
        currentClient.business_name.replace(/\s+/g, "-").toLowerCase(),
        "invoice",
        formData.invoice_number || "draft"
      );
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setError("Failed to download PDF");
    }
  };

  const calculateTotals = (updatedItems: InvoiceItem[]) => {
    // Make sure each item has a total value
    const itemsWithTotal = updatedItems.map(item => ({
      ...item,
      total: (item.total !== undefined) ? item.total : (item.quantity * item.unit_price)
    }));

    const subtotal = itemsWithTotal.reduce((sum, item) => sum + (item.total || 0), 0);
    const taxAmount = (subtotal * (formData.tax_rate || 0)) / 100;
    const totalAmount = subtotal + taxAmount;

    return {
      subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount,
    };
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Recalculate totals if tax rate changes
    if (name === "tax_rate") {
      const taxRate = parseFloat(value) || 0;
      const taxAmount = ((formData.subtotal || 0) * taxRate) / 100;
      const totalAmount = (formData.subtotal || 0) + taxAmount;

      setFormData((prev) => ({
        ...prev,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total_amount: totalAmount,
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    // Convert "none" to empty string for project_id
    if (name === "project_id" && value === "none") {
      setFormData((prev) => ({ ...prev, [name]: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (name: string, value: Date | undefined) => {
    if (value) {
      setFormData((prev) => ({
        ...prev,
        [name]: value.toISOString().split("T")[0],
      }));
    }
  };

  const handleItemChange = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setFormData((prev) => {
      const updatedItems = prev.items?.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value } as InvoiceItem;

          // Recalculate item total if quantity or unit_price changes
          if (field === "quantity" || field === "unit_price") {
            const quantity = field === "quantity" ? Number(value) : item.quantity;
            const unitPrice = field === "unit_price" ? Number(value) : item.unit_price;
            updatedItem.total = quantity * unitPrice;
            updatedItem.amount = quantity * unitPrice; // Set amount as well
          }

          return updatedItem;
        }
        return item;
      }) || [];

      // Recalculate subtotal, tax, and total
      const { subtotal, tax_amount, total_amount } =
        calculateTotals(updatedItems);

      return {
        ...prev,
        items: updatedItems,
        subtotal,
        tax_amount,
        total_amount,
      };
    });
  };

  const addItem = () => {
    setFormData((prev) => {
      // Cast the DEFAULT_INVOICE_ITEM to a proper InvoiceItem with a valid id
      const newItem = { 
        ...DEFAULT_INVOICE_ITEM, 
        id: crypto.randomUUID(),
        invoice_id: formData.id || crypto.randomUUID()  // Use a placeholder ID that will be replaced on save
      } as InvoiceItem;
      
      const updatedItems = [...(prev.items || []), newItem];
      
      return {
        ...prev,
        items: updatedItems,
      };
    });
  };

  const removeItem = (itemId: string) => {
    setFormData((prev) => {
      const updatedItems = prev.items?.filter((item) => item.id !== itemId) || [];

      // Don't allow removing the last item
      if (updatedItems.length === 0) {
        return prev;
      }

      // Recalculate subtotal, tax, and total
      const { subtotal, tax_amount, total_amount } =
        calculateTotals(updatedItems);

      return {
        ...prev,
        items: updatedItems,
        subtotal,
        tax_amount,
        total_amount,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.client_id) {
        throw new Error("Please select a client");
      }

      if (!formData.invoice_number) {
        throw new Error("Invoice number is required");
      }

      let invoiceId = "";

      if (isEditing && invoice) {
        const updatedInvoice = await updateInvoice(invoice.id, formData as any);
        invoiceId = invoice.id;
      } else {
        const newInvoice = await addInvoice(formData as any);
        invoiceId = newInvoice?.id;
      }

      // Redirect to a preview page with the invoice ID
      if (invoiceId) {
        navigate(`/dashboard/invoices/preview/${invoiceId}`);
      } else {
        navigate("/dashboard/invoices");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 w-full" style={{ maxWidth: "100%" }}>
      <div className="mb-6 flex items-center">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard/invoices")}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Invoices
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Edit Invoice" : "Create New Invoice"}
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 p-4 rounded-md text-red-800 mb-4 flex items-center">
          <AlertCircle className="mr-2 h-5 w-5" />
          {error}
        </div>
      )}

      {showPreview && currentClient && (
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Invoice Preview
            </h2>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Close Preview
              </Button>
              <Button
                onClick={handleDownloadPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Download PDF
              </Button>
            </div>
          </div>
          <div className="border rounded-lg p-4 bg-gray-50">
            <InvoicePreview
              ref={previewRef}
              invoice={formData as Invoice}
              items={formData.items || []}
              client={currentClient}
            />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: "100%" }}>
        <div className="grid grid-cols-1 gap-6 mb-8 w-full">
          <Card className="w-full" style={{ width: "100%" }}>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
              <CardDescription>
                Basic information about the invoice
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 w-full">
              <div className="space-y-2">
                <Label htmlFor="invoice_number">Invoice Number</Label>
                <Input
                  id="invoice_number"
                  name="invoice_number"
                  value={formData.invoice_number || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client_id">Client</Label>
                <Select
                  value={formData.client_id || ""}
                  onValueChange={(value) =>
                    handleSelectChange("client_id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.business_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="project_id">Project (Optional)</Label>
                <Select
                  value={formData.project_id || ""}
                  onValueChange={(value) =>
                    handleSelectChange("project_id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="issue_date">Issue Date</Label>
                <DatePicker
                  id="issue_date"
                  value={
                    formData.issue_date
                      ? new Date(formData.issue_date)
                      : undefined
                  }
                  onChange={(date) => handleDateChange("issue_date", date)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <DatePicker
                  id="due_date"
                  value={
                    formData.due_date ? new Date(formData.due_date) : undefined
                  }
                  onChange={(date) => handleDateChange("due_date", date)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency || "USD"}
                  onValueChange={(value) =>
                    handleSelectChange("currency", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full" style={{ width: "100%" }}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Invoice Items</CardTitle>
                <CardDescription>List of products or services</CardDescription>
              </div>
              <Button
                type="button"
                onClick={addItem}
                className="flex items-center"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </CardHeader>
            <CardContent className="w-full">
              <div className="grid grid-cols-12 gap-4 font-medium text-sm mb-2 px-2 w-full">
                <div className="col-span-5">Description</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2">Unit Price</div>
                <div className="col-span-2">Total</div>
                <div className="col-span-1"></div>
              </div>
              {formData.items?.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-4 mb-4 items-start"
                >
                  <div className="col-span-5">
                    <Input
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(item.id, "description", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "quantity",
                          Number(e.target.value)
                        )
                      }
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "unit_price",
                          Number(e.target.value)
                        )
                      }
                      required
                    />
                  </div>
                  <div className="col-span-2 flex items-center">
                    <div className="text-gray-700 font-medium">
                      {formatCurrency(item.total, formData.currency || "USD")}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      disabled={formData.items?.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-gray-500" />
                      <span className="sr-only">Delete item</span>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="border-t p-6 flex flex-col items-end">
              <div className="w-full md:w-64 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-medium">
                    {formatCurrency(
                      formData.subtotal || 0,
                      formData.currency || "USD"
                    )}
                  </span>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <Input
                      type="number"
                      name="tax_rate"
                      min="0"
                      max="100"
                      step="0.01"
                      value={formData.tax_rate || 0}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-sm">% Tax:</span>
                  </div>
                  <div className="flex-shrink-0 text-sm font-medium">
                    {formatCurrency(
                      formData.tax_amount || 0,
                      formData.currency || "USD"
                    )}
                  </div>
                </div>
                <div className="flex justify-between pt-3 border-t font-bold">
                  <span>Total:</span>
                  <span>
                    {formatCurrency(
                      formData.total_amount || 0,
                      formData.currency || "USD"
                    )}
                  </span>
                </div>
              </div>
            </CardFooter>
          </Card>

          <Card className="w-full" style={{ width: "100%" }}>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Notes and terms for the invoice</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 w-full">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes || ""}
                  onChange={handleInputChange}
                  placeholder="Any additional notes for the client"
                  rows={4}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="terms">Terms and Conditions</Label>
                <Textarea
                  id="terms"
                  name="terms"
                  value={formData.terms || ""}
                  onChange={handleInputChange}
                  placeholder="Payment terms and conditions"
                  rows={4}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard/invoices")}
          >
            Cancel
          </Button>
          {formData.client_id && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePreview}
              className="border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              <FileText className="mr-2 h-4 w-4" />
              Preview
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? "Update Invoice" : "Create Invoice"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
