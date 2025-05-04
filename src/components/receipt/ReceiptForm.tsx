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
import { AlertCircle, Save, ArrowLeft, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useReceipts } from "@/hooks/useReceipts";
import { useClients } from "@/hooks/useClients";
import { useInvoices } from "@/hooks/useInvoices";
import { Receipt } from "@/types/receipts";
import { Invoice } from "@/types/invoices";
import { Client } from "@/types/clients";
import { formatCurrency } from "@/utils/formatters";
import { DatePicker } from "@/components/ui/date-picker";
import { getClientById } from "@/services/clientService";
import { getInvoiceById } from "@/services/invoiceService";
import ReceiptPreview from "./ReceiptPreview";
import { downloadPDF } from "@/utils/pdf";

interface ReceiptFormProps {
  receipt?: Receipt;
  isEditing?: boolean;
}

const CURRENCIES = [
  { value: "NGN", label: "NGN - Nigerian Naira" },
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "JPY", label: "JPY - Japanese Yen" },
];

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "credit_card", label: "Credit Card" },
  { value: "paypal", label: "PayPal" },
  { value: "other", label: "Other" },
];

const ReceiptForm: React.FC<ReceiptFormProps> = ({
  receipt,
  isEditing = false,
}) => {
  const navigate = useNavigate();
  const { clients } = useClients();
  const { invoices } = useInvoices();
  const { addReceipt, updateReceipt, generateReceiptNumber } = useReceipts();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Receipt>>({
    id: "",
    receipt_number: "",
    client_id: "",
    invoice_id: "",
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    currency: "USD",
    payment_method: "bank_transfer",
    payment_reference: "",
    notes: "",
  });

  // Preview state
  const [showPreview, setShowPreview] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Filter invoices to show only those belonging to the selected client
  const clientInvoices = invoices.filter(
    (invoice) =>
      invoice.client_id === formData.client_id &&
      invoice.status !== "paid" &&
      invoice.status !== "cancelled"
  );

  useEffect(() => {
    const fetchData = async () => {
      if (isEditing && receipt) {
        setFormData(receipt);
      } else {
        // Generate a new receipt number for new receipts
        const newReceiptNumber = await generateReceiptNumber();
        setFormData((prev) => ({ ...prev, receipt_number: newReceiptNumber }));
      }
    };

    fetchData();
  }, [isEditing, receipt, generateReceiptNumber]);

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

  // Fetch invoice data when invoice_id changes
  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (formData.invoice_id) {
        const { invoice } = await getInvoiceById(formData.invoice_id);
        setCurrentInvoice(invoice);
      } else {
        setCurrentInvoice(null);
      }
    };

    fetchInvoiceData();
  }, [formData.invoice_id]);

  // Autofill amount and currency when selecting an invoice
  useEffect(() => {
    if (formData.invoice_id) {
      const selectedInvoice = invoices.find(
        (invoice) => invoice.id === formData.invoice_id
      );
      if (selectedInvoice) {
        setFormData((prev) => ({
          ...prev,
          client_id: selectedInvoice.client_id,
          amount: selectedInvoice.total_amount,
          currency: selectedInvoice.currency,
        }));
      }
    }
  }, [formData.invoice_id, invoices]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Convert amount to number if it's the amount field
    if (name === "amount") {
      const amount = parseFloat(value) || 0;
      setFormData((prev) => ({
        ...prev,
        amount,
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    // Convert "none" to empty string for invoice_id
    if (name === "invoice_id" && value === "none") {
      setFormData((prev) => ({ ...prev, [name]: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Reset invoice_id if client_id changes
    if (name === "client_id" && value !== formData.client_id) {
      setFormData((prev) => ({ ...prev, invoice_id: "" }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.client_id) {
        throw new Error("Please select a client");
      }

      if (!formData.receipt_number) {
        throw new Error("Receipt number is required");
      }

      if (!formData.amount || formData.amount <= 0) {
        throw new Error("Amount must be greater than zero");
      }

      let receiptId = "";

      if (isEditing && receipt) {
        const updatedReceipt = await updateReceipt(
          receipt.id,
          formData as Receipt
        );
        receiptId = receipt.id;
      } else {
        const newReceipt = await addReceipt(formData as Receipt);
        receiptId = newReceipt?.id;
      }

      // Redirect to the preview page with the receipt ID
      if (receiptId) {
        navigate(`/dashboard/receipts/preview/${receiptId}`);
      } else {
        navigate("/dashboard/receipts");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

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
        "receipt",
        formData.receipt_number || "draft"
      );
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setError("Failed to download PDF");
    }
  };

  return (
    <div className="p-6 w-full" style={{ maxWidth: "100%" }}>
      <div className="mb-6 flex items-center">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard/receipts")}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Receipts
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? "Edit Receipt" : "Create New Receipt"}
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
              Receipt Preview
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
            <ReceiptPreview
              ref={previewRef}
              receipt={formData as Receipt}
              client={currentClient}
              invoice={currentInvoice}
            />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid grid-cols-1 gap-6 mb-8 w-full">
          <Card className="w-full" style={{ width: "100%" }}>
            <CardHeader>
              <CardTitle>Receipt Details</CardTitle>
              <CardDescription>
                Basic information about the receipt
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 w-full">
              <div className="space-y-2">
                <Label htmlFor="receipt_number">Receipt Number</Label>
                <Input
                  id="receipt_number"
                  name="receipt_number"
                  value={formData.receipt_number || ""}
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
                <Label htmlFor="invoice_id">Related Invoice (Optional)</Label>
                <Select
                  value={formData.invoice_id || ""}
                  onValueChange={(value) =>
                    handleSelectChange("invoice_id", value)
                  }
                  disabled={!formData.client_id}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        formData.client_id
                          ? "Select invoice"
                          : "Select client first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {clientInvoices.map((invoice) => (
                      <SelectItem key={invoice.id} value={invoice.id}>
                        {invoice.invoice_number} -{" "}
                        {formatCurrency(invoice.total_amount, invoice.currency)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <DatePicker
                  id="date"
                  value={formData.date ? new Date(formData.date) : undefined}
                  onChange={(date) => handleDateChange("date", date)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_method">Payment Method</Label>
                <Select
                  value={formData.payment_method || "bank_transfer"}
                  onValueChange={(value) =>
                    handleSelectChange("payment_method", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_reference">
                  Payment Reference (Optional)
                </Label>
                <Input
                  id="payment_reference"
                  name="payment_reference"
                  value={formData.payment_reference || ""}
                  onChange={handleInputChange}
                  placeholder="Transaction ID, check number, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.amount || ""}
                  onChange={handleInputChange}
                  required
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

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>Notes for the receipt</CardDescription>
            </CardHeader>
            <CardContent className="w-full">
              <div className="space-y-2 w-full">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes || ""}
                  onChange={handleInputChange}
                  placeholder="Any additional notes about this payment"
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
            onClick={() => navigate("/dashboard/receipts")}
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
            {isEditing ? "Update Receipt" : "Create Receipt"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReceiptForm;
