import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Receipt } from "@/types/receipts";
import { Client } from "@/types/clients";
import { Invoice } from "@/types/invoices";
import { Quote } from "@/types/quotes";
import { Search, Eye, PlusCircle, Printer } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { getClients } from "@/services/clientService";
import { useInvoices } from "@/hooks/useInvoices";
import { useQuotes } from "@/hooks/useQuotes";
import { useReceipts } from "@/hooks/useReceipts";
import ReceiptPreview from "@/components/receipt/ReceiptPreview";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const ReceiptsPage = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  // Use hooks to get data
  const { invoices } = useInvoices();
  const { quotes } = useQuotes();
  const { receipts: allReceipts } = useReceipts();

  const receiptPreviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, [allReceipts]);

  const fetchData = async () => {
    try {
      // Use data from hooks
      setReceipts(allReceipts || []);

      // Only call the API for clients
      const clientsData = await getClients();
      setClients(clientsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
      });
    }
  };

  const filteredReceipts = receipts.filter((receipt) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      receipt.receipt_number.toLowerCase().includes(searchTerm) ||
      (receipt.client_id &&
        getClientName(receipt.client_id).toLowerCase().includes(searchTerm))
    );
  });

  const getClientName = (clientId: string): string => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.business_name : "Unknown Client";
  };

  const handlePreview = (receipt: Receipt) => {
    setSelectedReceipt(receipt);

    // Find the corresponding client, invoice, and quote
    const client = clients.find((c) => c.id === receipt.client_id) || null;
    setSelectedClient(client);

    const invoice = invoices?.find((i) => i.id === receipt.invoice_id) || null;
    setSelectedInvoice(invoice);

    const quote = quotes?.find((q) => q.id === receipt.quote_id) || null;
    setSelectedQuote(quote);

    setPreviewOpen(true);
  };

  const handlePrint = async () => {
    if (receiptPreviewRef.current) {
      try {
        const canvas = await html2canvas(receiptPreviewRef.current, {
          scale: 2, // Increase quality
          logging: false,
          useCORS: true,
          backgroundColor: "#ffffff",
        });

        // A4 dimensions in mm
        const a4Width = 210;
        const a4Height = 297;

        // Create PDF with A4 dimensions
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        // Calculate scaling to fit the A4 page while maintaining aspect ratio
        const imgWidth = a4Width;
        const imgHeight = (canvas.height * a4Width) / canvas.width;

        // Add the image centered on the page
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 1.0),
          "JPEG",
          0,
          0,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );

        // Save the PDF
        pdf.save(`receipt-${selectedReceipt?.receipt_number || "preview"}.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Receipts</h1>
        <div className="flex items-center space-x-2">
          <Input
            type="search"
            placeholder="Search receipts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          <Link to="/dashboard/modern-receipt">
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Receipt
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Receipt Number</TableHead>
              <TableHead>Client Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReceipts.map((receipt) => (
              <TableRow key={receipt.id}>
                <TableCell>{receipt.receipt_number}</TableCell>
                <TableCell>{getClientName(receipt.client_id)}</TableCell>
                <TableCell>
                  {new Date(receipt.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{receipt.amount}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreview(receipt)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Receipt Preview</DialogTitle>
          </DialogHeader>
          {selectedReceipt && (
            <div className="mt-4">
              <div ref={receiptPreviewRef}>
                <ReceiptPreview
                  receipt={selectedReceipt}
                  client={selectedClient || undefined}
                  invoice_id={selectedInvoice?.id}
                  quote_id={selectedQuote?.id}
                />
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print / Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReceiptsPage;
