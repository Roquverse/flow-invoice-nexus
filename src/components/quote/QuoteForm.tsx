import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  FileText,
} from "lucide-react";
import { useQuotes } from "@/hooks/useQuotes";
import { useClients } from "@/hooks/useClients";
import { useProjects } from "@/hooks/useProjects";
import { Quote, QuoteItem, QuoteFormData } from "@/types/quotes";
import { Client } from "@/types/clients";
import { formatCurrency } from "@/utils/formatters";
import { getClientById } from "@/services/clientService";
import { getQuoteById } from "@/services/quoteService";
import QuotePreview from "./QuotePreview";
import { downloadPDF } from "@/utils/pdf";
import "@/styles/invoice-form.css";

interface QuoteFormProps {
  quote?: Quote;
  isEditing?: boolean;
}

const DEFAULT_QUOTE_ITEM: Partial<QuoteItem> = {
  id: crypto.randomUUID(),
  description: "",
  quantity: 1,
  unit_price: 0,
  amount: 0, // Will be calculated
  total: 0, // Will be calculated
};

const CURRENCIES = [
  { value: "NGN", label: "NGN - Nigerian Naira" },
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "JPY", label: "JPY - Japanese Yen" },
];

const PAYMENT_PLANS = [
  { value: "full", label: "Full Payment" },
  { value: "part", label: "Partial Payment" },
];

const QuoteForm: React.FC<QuoteFormProps> = ({
  quote: initialQuote,
  isEditing = false,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { clients } = useClients();
  const { projects } = useProjects();
  const { addQuote, updateQuote, generateQuoteNumber } = useQuotes();

  // Form state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quoteNumber, setQuoteNumber] = useState<string>("");
  const [clientId, setClientId] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");
  const [reference, setReference] = useState<string>("");
  const [issueDate, setIssueDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [expiryDate, setExpiryDate] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [status, setStatus] = useState<string>("draft");
  const [currency, setCurrency] = useState<string>("USD");
  const [paymentPlan, setPaymentPlan] = useState<"full" | "part">("full");
  const [paymentPercentage, setPaymentPercentage] = useState<number>(100);
  const [items, setItems] = useState<QuoteItem[]>([
    { ...(DEFAULT_QUOTE_ITEM as QuoteItem) },
  ]);
  const [notes, setNotes] = useState<string>("");
  const [terms, setTerms] = useState<string>(
    "This quote is valid for 30 days from the date of issue."
  );
  const [taxRate, setTaxRate] = useState<number>(0);

  // Track quote number generation to prevent loops
  const [quoteNumberGenerated, setQuoteNumberGenerated] =
    useState<boolean>(false);

  // Calculated values
  const [subtotal, setSubtotal] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  // Preview state
  const [showPreview, setShowPreview] = useState(false);
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Fetch quote data in edit mode
  useEffect(() => {
    const fetchQuoteData = async () => {
      if (isEditing && id) {
        try {
          setLoading(true);
          const { quote, items: fetchedItems } = await getQuoteById(id);

          if (quote) {
            // Populate form with existing quote data
            setQuoteNumber(quote.quote_number);
            setClientId(quote.client_id);
            setProjectId(quote.project_id || "");
            setReference(quote.reference || "");
            setIssueDate(quote.issue_date);
            setExpiryDate(quote.expiry_date);
            setStatus(quote.status);
            setCurrency(quote.currency);
            setPaymentPlan(quote.payment_plan || "full");
            setPaymentPercentage(quote.payment_percentage || 100);
            setItems(
              fetchedItems.length > 0
                ? fetchedItems
                : [{ ...(DEFAULT_QUOTE_ITEM as QuoteItem) }]
            );
            setNotes(quote.notes || "");
            setTerms(quote.terms || "");
            setTaxRate(quote.tax_rate || 0);

            // Set calculated values
            setSubtotal(quote.subtotal || 0);
            setTaxAmount(quote.tax_amount || 0);
            setTotalAmount(quote.total_amount || 0);
            setPaymentAmount(quote.payment_amount || 0);

            // Mark quote number as generated
            setQuoteNumberGenerated(true);
          }
        } catch (err) {
          console.error("Error fetching quote data:", err);
          setError(
            err instanceof Error ? err.message : "Failed to fetch quote data"
          );
        } finally {
          setLoading(false);
        }
      } else if (!isEditing && !quoteNumberGenerated) {
        // Generate new quote number immediately for new quotes (only if not already generated)
        generateQuoteNumber()
          .then((newQuoteNumber) => {
            setQuoteNumber(newQuoteNumber);
            setQuoteNumberGenerated(true);
          })
          .catch((err) => {
            console.error("Error generating quote number:", err);
            // Use a fallback quote number if generation fails
            const fallbackNumber = `QT-${new Date()
              .toISOString()
              .split("T")[0]
              .replace(/-/g, "")}-${Date.now().toString().slice(-6)}`;
            setQuoteNumber(fallbackNumber);
            setQuoteNumberGenerated(true);
          });
      }
    };

    fetchQuoteData();
  }, [isEditing, id, generateQuoteNumber, quoteNumberGenerated]);

  // Fetch client data when client_id changes
  useEffect(() => {
    const fetchClientData = async () => {
      if (clientId) {
        try {
          const client = await getClientById(clientId);
          setCurrentClient(client);
        } catch (err) {
          console.error("Error fetching client data:", err);
        }
      } else {
        setCurrentClient(null);
      }
    };

    fetchClientData();
  }, [clientId]);

  // Calculate totals whenever items or tax rate changes
  useEffect(() => {
    // Calculate subtotal
    const newSubtotal = items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.unit_price;
      return sum + itemTotal;
    }, 0);

    // Calculate tax amount
    const newTaxAmount = (newSubtotal * taxRate) / 100;

    // Calculate total
    const newTotalAmount = newSubtotal + newTaxAmount;

    // Calculate payment amount based on plan and percentage
    const newPaymentAmount =
      paymentPlan === "full"
        ? newTotalAmount
        : (newTotalAmount * paymentPercentage) / 100;

    // Update state for calculated values only
    setSubtotal(newSubtotal);
    setTaxAmount(newTaxAmount);
    setTotalAmount(newTotalAmount);
    setPaymentAmount(newPaymentAmount);

    // DON'T update items here as it would cause an infinite loop
    // since this effect depends on items
  }, [items, taxRate, paymentPlan, paymentPercentage]);

  // Separate function to calculate an item's total
  const calculateItemTotal = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    switch (name) {
      case "client_id":
        setClientId(value);
        break;
      case "project_id":
        setProjectId(value);
        break;
      case "reference":
        setReference(value);
        break;
      case "issue_date":
        setIssueDate(value);
        break;
      case "expiry_date":
        setExpiryDate(value);
        break;
      case "currency":
        setCurrency(value);
        break;
      case "payment_plan":
        setPaymentPlan(value as "full" | "part");
        if (value === "full") {
          setPaymentPercentage(100);
        }
        break;
      case "payment_percentage":
        setPaymentPercentage(Number(value) || 0);
        break;
      case "notes":
        setNotes(value);
        break;
      case "terms":
        setTerms(value);
        break;
      case "tax_rate":
        setTaxRate(Number(value) || 0);
        break;
      default:
        break;
    }
  };

  // Add a new item
  const addItem = () => {
    const newItem = {
      ...DEFAULT_QUOTE_ITEM,
      id: crypto.randomUUID(),
    } as QuoteItem;

    // Initialize total and amount
    newItem.total = calculateItemTotal(newItem.quantity, newItem.unit_price);
    newItem.amount = newItem.total;

    setItems((prevItems) => [...prevItems, newItem]);
  };

  // Update an item
  const updateItem = (
    itemId: string,
    field: keyof QuoteItem,
    value: string | number
  ) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };

          // Recalculate amount if quantity or unit_price changed
          if (field === "quantity" || field === "unit_price") {
            const qty = field === "quantity" ? Number(value) : item.quantity;
            const price =
              field === "unit_price" ? Number(value) : item.unit_price;
            updatedItem.amount = calculateItemTotal(qty, price);
            updatedItem.total = updatedItem.amount;
          }

          return updatedItem;
        }
        return item;
      })
    );
  };

  // Remove an item
  const removeItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  // Show preview
  const handlePreview = () => {
    setShowPreview(true);
  };

  // Download PDF
  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;

    try {
      await downloadPDF(
        previewRef,
        `Quote-${quoteNumber}`,
        "quote",
        quoteNumber
      );
    } catch (err) {
      console.error("Error downloading PDF:", err);
    }
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent, submitStatus?: string) => {
    e.preventDefault();

    if (!clientId) {
      setError("Client is required");
      return;
    }

    if (!quoteNumber) {
      setError("Quote number is required");
      return;
    }

    // Check that items have descriptions
    const emptyItems = items.filter((item) => !item.description.trim());
    if (emptyItems.length > 0) {
      setError("All items must have a description");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Calculate payment amount based on plan setting in UI
      const calculatedPaymentAmount =
        paymentPlan === "full"
          ? totalAmount // Full payment
          : (totalAmount * paymentPercentage) / 100; // Partial payment

      // Log the data for debugging
      console.log("Quote data before submission:", {
        client_id: clientId,
        project_id: projectId || undefined,
        quote_number: quoteNumber,
        reference: reference || undefined,
        issue_date: issueDate,
        expiry_date: expiryDate,
        status: submitStatus || status,
        currency,
        // payment_plan is kept in UI but not sent to server
        payment_percentage: paymentPercentage,
        payment_amount: calculatedPaymentAmount,
        items,
        notes,
        terms,
        tax_rate: taxRate,
        subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
      });

      // Prepare the form data (without payment_plan field)
      const quoteData: QuoteFormData = {
        client_id: clientId,
        project_id: projectId || undefined,
        quote_number: quoteNumber,
        reference: reference || undefined,
        issue_date: issueDate,
        expiry_date: expiryDate,
        status: (submitStatus || status) as
          | "draft"
          | "sent"
          | "viewed"
          | "accepted"
          | "rejected"
          | "expired",
        currency: currency,
        // payment_plan is not included as it doesn't exist in DB
        payment_percentage: paymentPercentage,
        payment_amount: calculatedPaymentAmount,
        items: items.map((item) => ({
          ...item,
          // Ensure description isn't undefined
          description: item.description || "",
          // Recalculate amount just to be safe
          amount: calculateItemTotal(item.quantity, item.unit_price),
          // Make sure these fields have numbers
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
        })),
        notes: notes || undefined,
        terms: terms || undefined,
        tax_rate: taxRate,
        subtotal: subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
      };

      let result;
      if (isEditing && id) {
        result = await updateQuote(id, quoteData);
        if (!result) {
          throw new Error("Failed to update quote. Check your input data.");
        }
      } else {
        result = await addQuote(quoteData);
        if (!result) {
          throw new Error("Failed to create quote. Check your input data.");
        }
      }

      navigate("/dashboard/quotes");
    } catch (err) {
      // Show detailed error message if available
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "object" && err !== null) {
        setError(`Error: ${JSON.stringify(err)}`);
      } else {
        setError("Failed to save quote - unknown error");
      }
      console.error("Error submitting quote:", err);
    } finally {
      setLoading(false);
    }
  };

  // Prepare form data for preview
  const getQuoteForPreview = (): Quote => {
    return {
      id: id || "",
      user_id: "",
      client_id: clientId,
      project_id: projectId || undefined,
      quote_number: quoteNumber,
      reference: reference || undefined,
      issue_date: issueDate,
      expiry_date: expiryDate,
      status: status as
        | "draft"
        | "sent"
        | "viewed"
        | "accepted"
        | "rejected"
        | "expired",
      total_amount: totalAmount,
      tax_amount: taxAmount,
      currency: currency,
      payment_plan: paymentPlan,
      payment_percentage: paymentPercentage,
      payment_amount: paymentAmount,
      notes: notes || undefined,
      terms: terms || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      subtotal: subtotal,
      tax_rate: taxRate,
      items: items,
    };
  };

  if (loading && !items.length) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {showPreview ? (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <button
              type="button"
              className="button button-secondary"
              onClick={() => setShowPreview(false)}
            >
              <ArrowLeft size={16} className="mr-2" /> Back to Edit
            </button>
            <button
              type="button"
              className="button button-primary bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleDownloadPDF}
              disabled={loading}
            >
              <FileText size={16} className="mr-2" /> Download PDF
            </button>
          </div>
          <div ref={previewRef} className="bg-white p-8 rounded-lg shadow">
            <QuotePreview
              quote={getQuoteForPreview()}
              client={currentClient}
              items={items}
            />
          </div>
        </div>
      ) : (
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">
              {isEditing ? "Edit Quote" : "Create New Quote"}
            </h2>
          </div>

          <div onSubmit={(e) => handleSubmit(e)} className="form-wrapper">
            <div className="form-body">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded flex items-center">
                  <AlertCircle size={18} className="mr-2" />
                  {error}
                </div>
              )}

              <div className="form-row">
                <div className="form-group required">
                  <label className="form-label">Customer Name</label>
                  <select
                    className="form-select"
                    name="client_id"
                    value={clientId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select or add a customer</option>
                    {clients?.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.business_name || client.contact_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group required">
                  <label className="form-label">Quote#</label>
                  <input
                    type="text"
                    className="form-input"
                    name="quote_number"
                    value={quoteNumber}
                    readOnly
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Reference#</label>
                  <input
                    type="text"
                    className="form-input"
                    name="reference"
                    value={reference}
                    onChange={handleInputChange}
                    placeholder="Reference number"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group required">
                  <label className="form-label">Quote Date</label>
                  <input
                    type="date"
                    className="form-input"
                    name="issue_date"
                    value={issueDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="date"
                    className="form-input"
                    name="expiry_date"
                    value={expiryDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Project</label>
                  <select
                    className="form-select"
                    name="project_id"
                    value={projectId}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a project (optional)</option>
                    {projects?.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Currency</label>
                  <select
                    className="form-select"
                    name="currency"
                    value={currency}
                    onChange={handleInputChange}
                  >
                    {CURRENCIES.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Payment Plan</label>
                  <select
                    className="form-select"
                    name="payment_plan"
                    value={paymentPlan}
                    onChange={handleInputChange}
                  >
                    {PAYMENT_PLANS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Payment Percentage{" "}
                    {paymentPlan === "part" ? "(Required)" : ""}
                  </label>
                  <div className="form-input-with-icon">
                    <input
                      type="number"
                      className="form-input"
                      name="payment_percentage"
                      value={paymentPercentage}
                      onChange={handleInputChange}
                      min="1"
                      max="100"
                      disabled={paymentPlan === "full"}
                      style={{ width: "15%", height: "35px" }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section-header">
                <h3 className="form-section-title">Quote Items</h3>
              </div>

              <div className="modern-items-table">
                <table>
                  <thead>
                    <tr>
                      <th className="description-col">Description</th>
                      <th className="quantity-col">Qty</th>
                      <th className="price-col">Price</th>
                      <th className="amount-col">Amount</th>
                      <th className="action-col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <input
                            type="text"
                            className="form-input description-input"
                            value={item.description}
                            onChange={(e) =>
                              updateItem(item.id, "description", e.target.value)
                            }
                            placeholder="Item description"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-input quantity-input"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(item.id, "quantity", e.target.value)
                            }
                            min="1"
                          />
                        </td>
                        <td>
                          <div className="price-input-wrapper">
                            <input
                              type="number"
                              className="form-input price-input"
                              value={item.unit_price}
                              onChange={(e) =>
                                updateItem(
                                  item.id,
                                  "unit_price",
                                  e.target.value
                                )
                              }
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </td>
                        <td className="amount-cell">
                          {formatCurrency(
                            calculateItemTotal(item.quantity, item.unit_price),
                            currency
                          )}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="delete-item-btn"
                            onClick={() => removeItem(item.id)}
                            disabled={items.length === 1}
                            title="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={5}>
                        <button
                          type="button"
                          className="add-item-btn"
                          onClick={addItem}
                        >
                          <Plus size={16} className="add-icon" /> Add Item
                        </button>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="form-totals">
                <div className="left-col flex gap-2">
                  <div className="form-group" style={{ width: "40%" }}>
                    <label className="form-label">Notes</label>
                    <textarea
                      className="form-textarea"
                      name="notes"
                      value={notes}
                      onChange={handleInputChange}
                      placeholder="Notes - visible to customer"
                      rows={4}
                    ></textarea>
                  </div>

                  <div className="form-group" style={{ width: "40%" }}>
                    <label className="form-label">Terms</label>
                    <textarea
                      className="form-textarea"
                      name="terms"
                      value={terms}
                      onChange={handleInputChange}
                      placeholder="Terms and conditions"
                      rows={4}
                    ></textarea>
                  </div>
                </div>

                <div
                  className="right-col"
                  style={{ width: "40%", marginLeft: "auto" }}
                >
                  <div className="totals-table">
                    <div className="totals-row">
                      <div className="totals-label">Subtotal</div>
                      <div className="totals-value">
                        {formatCurrency(subtotal, currency)}
                      </div>
                    </div>

                    <div className="totals-row">
                      <div className="totals-label">
                        <div className="flex items-center gap-2">
                          <span>Tax</span>
                          <div className="tax-input-container">
                            <input
                              type="number"
                              className="tax-rate-input"
                              name="tax_rate"
                              value={taxRate}
                              onChange={handleInputChange}
                              min="0"
                              max="100"
                              step="0.1"
                            />
                            <span className="tax-symbol">%</span>
                          </div>
                        </div>
                      </div>
                      <div className="totals-value">
                        {formatCurrency(taxAmount, currency)}
                      </div>
                    </div>

                    <div className="totals-row total">
                      <div className="totals-label">Total</div>
                      <div className="totals-value">
                        {formatCurrency(totalAmount, currency)}
                      </div>
                    </div>

                    {paymentPlan === "part" && (
                      <div className="totals-row payment-amount">
                        <div className="totals-label">
                          Payment Amount ({paymentPercentage}%)
                        </div>
                        <div className="totals-value">
                          {formatCurrency(paymentAmount, currency)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <div className="form-actions-left">
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                </div>
                <div className="form-actions-right">
                  <button
                    type="button"
                    className="button button-secondary mobile-full-width"
                    onClick={handlePreview}
                  >
                    <FileText size={16} className="button-icon" />
                    Preview
                  </button>
                  <button
                    type="button"
                    className="button button-secondary mobile-full-width"
                    onClick={(e) => handleSubmit(e, "draft")}
                  >
                    Save as Draft
                  </button>
                  <button
                    type="submit"
                    className="button button-primary mobile-full-width bg-green-600 hover:bg-green-700 text-white"
                    disabled={loading}
                    onClick={(e) => handleSubmit(e, "sent")}
                  >
                    <Save size={16} className="button-icon" />
                    {isEditing ? "Update Quote" : "Save and Send"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuoteForm;
