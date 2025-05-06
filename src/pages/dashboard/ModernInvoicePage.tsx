import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import InvoiceForm from "@/components/invoice/InvoiceForm";
import { toast } from "sonner";

/**
 * Invoice page that provides a professional design for creating and editing invoices.
 */
const ModernInvoicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isEditing = Boolean(id);

  useEffect(() => {
    // Debug log to track the route and ID
    console.log("ModernInvoicePage Route:", location.pathname);
    console.log("Invoice ID from params:", id);
    console.log("isEditing:", isEditing);

    if (isEditing) {
      console.log(`Loading invoice data for editing. Invoice ID: ${id}`);
    } else {
      console.log("Creating new invoice");
    }
  }, [id, isEditing, location.pathname]);

  return <InvoiceForm isEditing={isEditing} />;
};

export default ModernInvoicePage;
