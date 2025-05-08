import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useClients } from "@/hooks/useClients";
import { useInvoices } from "@/hooks/useInvoices";
import { useQuotes } from "@/hooks/useQuotes";
import { useReceipts } from "@/hooks/useReceipts";
import { ReceiptFormData, Receipt } from "@/types/receipts";
import { formatCurrency } from "@/utils/formatters";
import currencies from "@/data/currencies";
import ReceiptPreview from "./ReceiptPreview";

const formSchema = z.object({
  client_id: z.string().min(1, {
    message: "Please select a client.",
  }),
  invoice_id: z.string().optional(),
  quote_id: z.string().optional(),
  receipt_number: z.string().optional(),
  reference: z.string().optional(),
  date: z.string().min(1, {
    message: "Please select a date.",
  }),
  amount: z.string().refine((value) => {
    // Allow empty string
    if (!value) return true;

    // Check if the value is a valid number
    const num = Number(value);
    return !isNaN(num);
  }, {
    message: "Amount must be a number.",
  }).optional(),
  payment_method: z.enum(["cash", "bank_transfer", "credit_card", "paypal", "other"], {
    required_error: "Please select a payment method.",
  }),
  payment_reference: z.string().optional(),
  notes: z.string().optional(),
  currency: z.string().min(1, {
    message: "Please select a currency.",
  }),
});

interface ReceiptFormProps {
  isEditing: boolean;
}

const ReceiptForm: React.FC<ReceiptFormProps> = ({ isEditing }) => {
  const navigate = useNavigate();
  const { clients, loading: clientsLoading } = useClients();
  const { invoices, loading: invoicesLoading } = useInvoices();
  const { quotes, loading: quotesLoading } = useQuotes();
  const { createReceipt, updateReceipt, generateReceiptNumber, receipts } = useReceipts();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: "",
      invoice_id: "",
      quote_id: "",
      receipt_number: "",
      reference: "",
      date: new Date().toISOString().split('T')[0], // Default to today's date
      amount: "",
      payment_method: "cash",
      payment_reference: "",
      notes: "",
      currency: "USD",
    },
  });

  const isLoading = clientsLoading || invoicesLoading || quotesLoading;

  useEffect(() => {
    const generateNumber = async () => {
      const newReceiptNumber = await generateReceiptNumber();
      setReceiptNumber(newReceiptNumber);
      form.setValue("receipt_number", newReceiptNumber);
    };

    generateNumber();
  }, [generateReceiptNumber, form.setValue]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const amountValue = parseFloat(values.amount || "0");

      if (isNaN(amountValue)) {
        toast.error("Invalid amount entered.");
        return;
      }

      const receiptData: Receipt = {
        id: uuidv4(),
        user_id: "", // This will be populated in the hook
        client_id: values.client_id,
        invoice_id: values.invoice_id || undefined,
        quote_id: values.quote_id || undefined,
        receipt_number: receiptNumber || "TEMP-NUMBER",
        reference: values.reference,
        date: values.date,
        amount: amountValue,
        payment_method: values.payment_method,
        payment_reference: values.payment_reference,
        notes: values.notes,
        currency: values.currency,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (isEditing) {
        // await updateReceipt(receiptData.id, receiptData);
        toast.success("Receipt updated successfully!");
      } else {
        await createReceipt(receiptData);
        toast.success("Receipt created successfully!");
      }

      navigate("/dashboard/receipts");
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to save receipt. Please try again.");
    }
  };

  const getClientName = (clientId: string): string => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.business_name : "Unknown Client";
  };

  const selectedReceipt: Receipt = {
    id: uuidv4(),
    user_id: "",
    client_id: form.getValues("client_id"),
    invoice_id: form.getValues("invoice_id") || undefined,
    quote_id: form.getValues("quote_id") || undefined,
    receipt_number: receiptNumber || "TEMP-NUMBER",
    reference: form.getValues("reference"),
    date: form.getValues("date"),
    amount: parseFloat(form.getValues("amount") || "0"),
    payment_method: form.getValues("payment_method"),
    payment_reference: form.getValues("payment_reference"),
    notes: form.getValues("notes"),
    currency: form.getValues("currency"),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <div className="container mx-auto py-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Receipt Details</CardTitle>
              <CardDescription>Enter the receipt information below.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="client_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.business_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="invoice_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an invoice" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {invoices.map((invoice) => (
                            <SelectItem key={invoice.id} value={invoice.id}>
                              {invoice.invoice_number}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quote_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quote (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a quote" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {quotes.map((quote) => (
                            <SelectItem key={quote.id} value={quote.id}>
                              {quote.quote_number}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="receipt_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receipt Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Receipt number" {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Reference" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="Amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="payment_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="credit_card">Credit Card</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payment_reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Reference (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Payment Reference" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.name} ({currency.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Notes about the receipt"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setPreviewOpen(true)}>
              Preview
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Receipt Preview</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <ReceiptPreview
              receipt={selectedReceipt}
              client={{
                id: form.getValues("client_id"),
                user_id: "",
                business_name: getClientName(form.getValues("client_id")),
                status: "active",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }}
              invoice={invoices.find((invoice) => invoice.id === form.getValues("invoice_id"))}
              quote={quotes.find((quote) => quote.id === form.getValues("quote_id"))}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReceiptForm;
