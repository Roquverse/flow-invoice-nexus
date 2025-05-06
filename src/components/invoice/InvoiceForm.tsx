import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  Send,
  Download,
  ChevronDown,
} from "lucide-react";
import { invoiceService } from "@/services/invoiceService";
import { projectService } from "@/services/projectService";
import { useClients } from "@/hooks/useClients";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanySettings } from "@/hooks/useSettings";
import {
  InvoiceFormData,
  InvoiceItemFormData,
  Invoice,
} from "@/types/invoices";
import { formatCurrency } from "@/utils/formatters";
import "@/styles/invoice.css";

// Define invoice status type from Invoice interface
type InvoiceStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "paid"
  | "overdue"
  | "cancelled";

// Define the schema for form validation
const schema = yup
  .object({
    client_id: yup.string().required("Client is required"),
    project_id: yup.string().nullable(),
    invoice_date: yup.date().required("Invoice date is required"),
    due_date: yup.date().required("Due date is required"),
    status: yup.string().required("Status is required"),
    notes: yup.string(),
    terms: yup.string(),
    currency: yup.string().required("Currency is required"),
    items: yup.array().of(
      yup.object({
        id: yup.string().required(),
        name: yup.string().required("Item name is required"),
        quantity: yup
          .number()
          .required("Quantity is required")
          .positive("Quantity must be positive"),
        unit_price: yup
          .number()
          .required("Unit price is required")
          .positive("Unit price must be positive"),
      })
    ),
  })
  .required();

interface FormData {
  client_id: string;
  project_id: string | null;
  invoice_date: Date;
  due_date: Date;
  status: InvoiceStatus;
  notes: string;
  terms: string;
  reference?: string;
  currency: string;
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

const InvoiceForm: React.FC<InvoiceFormProps> = ({ isEditing = false }) => {
  const { user } = useAuth();
  const { companySettings } = useCompanySettings();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [invoiceData, setInvoiceData] = useState<{
    invoice: Invoice;
    items: any[];
  } | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const { clients, loading: clientsLoading } = useClients();
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [reference, setReference] = useState("");
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      client_id: "",
      project_id: null,
      invoice_date: new Date(),
      due_date: new Date(new Date().setDate(new Date().getDate() + 30)),
      status: "draft" as InvoiceStatus,
      notes: "",
      terms: "",
      currency: "NGN",
      items: [{ id: uuidv4(), name: "", quantity: 1, unit_price: 0 }],
    },
  });

  const items = watch("items") || [];
  const currency = watch("currency");
  const selectedClientId = watch("client_id");

  useEffect(() => {
    // Add the modern-invoice-page class to the dashboard-content element
    const dashboardContent = document.querySelector(".dashboard-content");
    if (dashboardContent) {
      dashboardContent.classList.add("modern-invoice-page");
    }

    // Cleanup function to remove the class when component unmounts
    return () => {
      if (dashboardContent) {
        dashboardContent.classList.remove("modern-invoice-page");
      }
    };
  }, []);

  useEffect(() => {
    console.log("InvoiceForm mounted with id:", id);
    console.log("isEditing flag:", isEditing);

    const fetchInvoice = async () => {
      if (isEditing && id) {
        console.log(`Attempting to fetch invoice with ID: ${id}`);
        setLoading(true);
        try {
          // Add a small delay to ensure proper state updates
          await new Promise((resolve) => setTimeout(resolve, 100));

          const data = await invoiceService.getInvoiceById(id);
          console.log("Fetched invoice data:", data);

          if (!data) {
            console.error("No data returned from getInvoiceById");
            toast.error("Failed to load invoice data");
            setLoading(false);
            return;
          }

          setInvoiceData(data);
          const { invoice, items } = data;
          console.log("Invoice details:", invoice);
          console.log("Invoice items:", items);

          setReference(invoice.reference || "");

          // Set default values for the form
          setValue("client_id", invoice.client_id);
          setValue("project_id", invoice.project_id || null);
          setValue(
            "invoice_date",
            new Date(invoice.issue_date || invoice.created_at)
          );
          setValue("due_date", new Date(invoice.due_date));
          setValue("status", invoice.status as InvoiceStatus);
          setValue("notes", invoice.notes || "");
          setValue("terms", invoice.terms || "");
          setValue("currency", invoice.currency || "USD");

          // Transform items from API format to form format
          if (items && items.length > 0) {
            const formattedItems = items.map((item) => ({
              id: item.id,
              name: item.description,
              quantity: item.quantity,
              unit_price: item.unit_price,
            }));
            console.log("Formatted items for form:", formattedItems);
            setValue("items", formattedItems);
          }

          // Set tax and discount values
          setTax(invoice.tax_amount || 0);
          setDiscount(invoice.discount_amount || 0);

          toast.success("Invoice data loaded successfully");
        } catch (error: any) {
          console.error("Error fetching invoice:", error);
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

        // Filter projects by client if a client is selected
        if (selectedClientId) {
          const clientProjects = projectsData.filter(
            (project) => project.client_id === selectedClientId
          );
          setProjects(clientProjects);
        } else {
          setProjects(projectsData);
        }
      } catch (error: any) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [selectedClientId]);

  // Calculate totals whenever items, tax, or discount changes
  useEffect(() => {
    if (items) {
      const calculatedSubtotal = items.reduce((acc, item) => {
        const qty = Number(item.quantity) || 0;
        const price = Number(item.unit_price) || 0;
        return acc + qty * price;
      }, 0);
      setSubtotal(calculatedSubtotal);

      // Calculate tax amount as percentage of subtotal
      const taxAmount = calculatedSubtotal * (Number(tax) / 100);

      // Calculate total with tax and discount
      const numDiscount = Number(discount) || 0;
      const calculatedTotal = calculatedSubtotal + taxAmount - numDiscount;
      setTotal(calculatedTotal < 0 ? 0 : calculatedTotal);
    }
  }, [items, tax, discount]);

  // Generate a unique invoice number
  useEffect(() => {
    const generateReference = () => {
      if (!isEditing) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const randomDigits = Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0");

        setReference(`INV-${year}${month}-${randomDigits}`);
      }
    };

    generateReference();
  }, [isEditing]);

  // Add console logging to verify the company details are being loaded
  useEffect(() => {
    console.log("Company settings in InvoiceForm:", companySettings);
    console.log("User in InvoiceForm:", user);
  }, [companySettings, user]);

  const addItem = () => {
    const currentItems = watch("items") || [];
    setValue("items", [
      ...currentItems,
      { id: uuidv4(), name: "", quantity: 1, unit_price: 0 },
    ]);
  };

  const updateItem = (
    itemId: string,
    field: string,
    value: string | number
  ) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setValue("items", updatedItems);
  };

  const deleteItem = (itemId: string) => {
    if (items.length <= 1) {
      toast.error("Invoice must have at least one item");
      return;
    }
    const updatedItems = items.filter((item) => item.id !== itemId);
    setValue("items", updatedItems);
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      // Transform form data to match the InvoiceFormData interface
      const formattedInvoiceData: InvoiceFormData = {
        client_id: data.client_id,
        project_id: data.project_id,
        issue_date: data.invoice_date.toISOString(),
        due_date: data.due_date.toISOString(),
        status: data.status,
        notes: data.notes,
        terms: data.terms,
        reference: reference,
        currency: data.currency,
        discount_amount: discount,
        tax_amount: tax,
        subtotal: subtotal,
        total_amount: total,
        items: data.items.map((item) => ({
          id: item.id,
          description: item.name,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      };

      if (isEditing && id) {
        await invoiceService.updateInvoice(id, formattedInvoiceData);
        toast.success("Invoice updated successfully");
      } else {
        await invoiceService.createInvoice(formattedInvoiceData);
        toast.success("Invoice created successfully");
      }

      navigate("/dashboard/invoices");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Failed to save invoice");
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvoice = async () => {
    // This would be implemented with an email service in a real app
    toast.success("Invoice sent to client!");
  };

  const getSelectedClient = () => {
    if (!selectedClientId || !clients) return null;
    return clients.find((client) => client.id === selectedClientId);
  };

  const selectedClient = getSelectedClient();

  return (
    <div className="modern-invoice-page">
      <div className="invoice-actions">
        <div className="invoice-actions-left">
          <button
            className="invoice-button button-secondary"
            onClick={() => navigate("/dashboard/invoices")}
            type="button"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
        <div className="invoice-actions-right">
          <button
            className="invoice-button button-primary"
            onClick={handleSubmit(onSubmit)}
            type="button"
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save {isEditing ? "Changes" : "Invoice"}
              </>
            )}
          </button>
          {isEditing && (
            <button
              className="invoice-button button-accent"
              onClick={handleSendInvoice}
              type="button"
            >
              <Send size={16} />
              Send Invoice
            </button>
          )}
        </div>
      </div>

      <form
        className="modern-invoice-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="form-grid">
          <div className="invoice-header">
            <div className="invoice-header-left">
              <div className="invoice-logo">
                <img
                  src="/logo-light.png"
                  alt="Company Logo"
                  className="logo-image"
                />
              </div>
              <div className="invoice-label">INVOICE</div>
            </div>
            <div className="invoice-header-right">
              <div className="invoice-number">
                <div className="field-label">Invoice #</div>
                <div className="invoice-number-display">{reference}</div>
              </div>
            </div>
          </div>

          <div className="invoice-details-grid">
            <div className="invoice-from">
              <h3>From</h3>
              <div className="company-details">
                <div className="company-name">
                  {companySettings?.company_name ||
                    user?.email ||
                    "Your Company Name"}
                </div>
                <div className="company-address">
                  {companySettings?.address || "Address not set"}
                  <br />
                  {companySettings?.city || ""}{" "}
                  {companySettings?.postal_code || ""}
                  <br />
                  {companySettings?.country || "Country not set"}
                </div>
                <div className="company-contact">
                  {user?.email || "email@example.com"}
                  <br />
                  {user?.phone || "Phone not set"}
                </div>
              </div>
            </div>

            <div className="invoice-to">
              <h3>Bill To</h3>
              <div className="client-select-container">
                <select
                  {...register("client_id")}
                  className={`client-select ${errors.client_id ? "error" : ""}`}
                >
                  <option value="">Select a client</option>
                  {clients &&
                    clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.business_name}
                      </option>
                    ))}
                </select>
                <ChevronDown className="select-icon" />
              </div>
              {errors.client_id && (
                <div className="error-message">{errors.client_id.message}</div>
              )}

              {selectedClient && (
                <div className="client-details">
                  <div className="client-name">
                    {selectedClient.business_name}
                  </div>
                  <div className="client-address">
                    {selectedClient.address || ""}
                    <br />
                    {selectedClient.city || ""}{" "}
                    {selectedClient.postal_code || ""}
                    <br />
                    {selectedClient.country || ""}
                  </div>
                  <div className="client-contact">
                    {selectedClient.email || ""}
                    <br />
                    {selectedClient.phone || ""}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="invoice-meta-grid">
            <div className="invoice-meta">
              <div className="meta-group">
                <label>Project (Optional)</label>
                <div className="select-container">
                  <select {...register("project_id")} className="form-select">
                    <option value="">None</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="meta-row">
                <div className="meta-group">
                  <label>Invoice Date</label>
                  <Controller
                    name="invoice_date"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="date"
                        className={`form-input ${
                          errors.invoice_date ? "error" : ""
                        }`}
                        value={
                          field.value
                            ? new Date(field.value).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          field.onChange(date);
                        }}
                      />
                    )}
                  />
                  {errors.invoice_date && (
                    <div className="error-message">
                      {errors.invoice_date.message}
                    </div>
                  )}
                </div>

                <div className="meta-group">
                  <label>Due Date</label>
                  <Controller
                    name="due_date"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="date"
                        className={`form-input ${
                          errors.due_date ? "error" : ""
                        }`}
                        value={
                          field.value
                            ? new Date(field.value).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          field.onChange(date);
                        }}
                      />
                    )}
                  />
                  {errors.due_date && (
                    <div className="error-message">
                      {errors.due_date.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="meta-row">
              <div className="meta-group">
                <label>Currency</label>
                <div className="select-container">
                  <select {...register("currency")} className="form-select">
                    <option value="NGN">NGN - Nigerian Naira</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                  </select>
                </div>
              </div>

              <div className="meta-group">
                <label>Status</label>
                <div className="select-container">
                  <select {...register("status")} className="form-select">
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="invoice-items-section">
            <h3>Items</h3>
            <div className="invoice-items-table">
              <div className="invoice-items-header">
                <div className="item-description">Description</div>
                <div className="item-quantity">Qty</div>
                <div className="item-price">Rate</div>
                <div className="item-total">Total</div>
                <div className="item-actions"></div>
              </div>

              {items.map((item, index) => (
                <div key={item.id} className="invoice-item">
                  <div className="item-description">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        updateItem(item.id, "name", e.target.value)
                      }
                      placeholder="Item description"
                      className={`form-input ${
                        errors.items?.[index]?.name ? "error" : ""
                      }`}
                    />
                    {errors.items?.[index]?.name && (
                      <div className="error-message">
                        {errors.items[index].name.message}
                      </div>
                    )}
                  </div>
                  <div className="item-quantity">
                    <label className="field-label-mobile">Quantity:</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={item.quantity}
                      onChange={(e) => {
                        let value: number | string = e.target.value;
                        if (value !== "") {
                          value = parseInt(value) || 1;
                        }
                        updateItem(item.id, "quantity", value);
                      }}
                      onBlur={(e) => {
                        if (e.target.value === "") {
                          updateItem(item.id, "quantity", 1);
                        }
                      }}
                      className="form-input"
                    />
                    {errors.items?.[index]?.quantity && (
                      <div className="error-message">
                        {errors.items[index].quantity.message}
                      </div>
                    )}
                  </div>
                  <div className="item-price">
                    <label className="field-label-mobile">Rate:</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? ""
                            : parseFloat(e.target.value) || 0;
                        updateItem(item.id, "unit_price", value);
                      }}
                      onBlur={(e) => {
                        if (e.target.value === "") {
                          updateItem(item.id, "unit_price", 0);
                        }
                      }}
                      className="form-input"
                    />
                    {errors.items?.[index]?.unit_price && (
                      <div className="error-message">
                        {errors.items[index].unit_price.message}
                      </div>
                    )}
                  </div>
                  <div className="item-total">
                    <label className="field-label-mobile">Total:</label>
                    <span className="total-value">
                      {formatCurrency(
                        (item.quantity || 0) * (item.unit_price || 0),
                        currency
                      )}
                    </span>
                  </div>
                  <div className="item-actions">
                    <button
                      type="button"
                      onClick={() => deleteItem(item.id)}
                      className="delete-item-button"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="add-item-row">
                <button
                  type="button"
                  onClick={addItem}
                  className="add-item-button"
                >
                  <Plus size={16} />
                  <span>Add Item</span>
                </button>
              </div>
            </div>

            <div className="invoice-totals">
              <div className="totals-row">
                <div className="total-label">Subtotal</div>
                <div className="total-amount">
                  {formatCurrency(subtotal, currency)}
                </div>
              </div>

              <div className="totals-row">
                <div className="total-label-with-input">
                  <label>Tax (%)</label>
                  <input
                    type="number"
                    value={tax}
                    onChange={(e) => {
                      const taxRate = parseFloat(e.target.value) || 0;
                      setTax(taxRate);
                    }}
                    className="tax-input"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
                <div className="total-amount">
                  {formatCurrency(subtotal * (tax / 100), currency)}
                </div>
              </div>

              <div className="totals-row">
                <div className="total-label-with-input">
                  <label>Discount</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) =>
                      setDiscount(parseFloat(e.target.value) || 0)
                    }
                    className="discount-input"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="total-amount">
                  {formatCurrency(discount, currency)}
                </div>
              </div>

              <div className="totals-row grand-total">
                <div className="total-label">Total</div>
                <div className="total-amount">
                  {formatCurrency(total, currency)}
                </div>
              </div>
            </div>
          </div>

          <div className="invoice-footer">
            <div className="invoice-notes">
              <h3>Notes</h3>
              <textarea
                {...register("notes")}
                className="form-textarea"
                placeholder="Notes for the client (optional)"
              ></textarea>
            </div>

            <div className="invoice-terms">
              <h3>Terms & Conditions</h3>
              <textarea
                {...register("terms")}
                className="form-textarea"
                placeholder="Payment terms and conditions (optional)"
              ></textarea>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
