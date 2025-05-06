import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import ReceiptForm from "@/components/receipt/ReceiptForm";
import { toast } from "sonner";

/**
 * Receipt page that provides a professional design for creating and editing receipts.
 */
const ModernReceiptPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const location = useLocation();
  // Extract ID from URL path - handles both /receipts/edit/:id and /receipts/:id/edit formats
  const id = params.id;
  const isEditing = Boolean(id);

  useEffect(() => {
    // Debug log to track the route and ID
    console.log("ModernReceiptPage Route:", location.pathname);
    console.log("Receipt ID from params:", id);
    console.log("isEditing:", isEditing);

    if (isEditing) {
      console.log(`Loading receipt data for editing. Receipt ID: ${id}`);
    } else {
      console.log("Creating new receipt");
    }
  }, [id, isEditing, location.pathname]);

  return <ReceiptForm isEditing={isEditing} />;
};

export default ModernReceiptPage;
