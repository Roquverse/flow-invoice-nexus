import React, { forwardRef, useEffect, useState } from "react";
import { formatCurrency } from "@/utils/formatters";
import { Receipt } from "@/types/receipts";
import { Client } from "@/types/clients";
import { supabase } from "@/integrations/supabase/client";

interface ReceiptPreviewProps {
  receipt: Receipt;
  client?: Client;
  invoice_id?: string;
  quote_id?: string;
  ref?: React.Ref<HTMLDivElement>;
}

const highlightColor = "#2563eb"; // Tailwind blue-600
const lightGray = "#f3f4f6"; // Tailwind gray-100
const borderGray = "#e5e7eb"; // Tailwind gray-200
const textGray = "#374151"; // Tailwind gray-700
const labelGray = "#6b7280"; // Tailwind gray-500

const ReceiptPreview = forwardRef<HTMLDivElement, ReceiptPreviewProps>(
  ({ receipt, client, invoice_id, quote_id }, ref) => {
    const [companyName, setCompanyName] = useState<string>("Loading...");
    const [companyLogo, setCompanyLogo] = useState<string | null>(null);
    const [operatorName, setOperatorName] = useState<string>("Loading...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          // Fetch company settings
          const { data: companyData, error: companyError } = await supabase
            .from("company_settings")
            .select("*")
            .eq("user_id", receipt.user_id)
            .single();

          if (companyError) {
            console.error("Error fetching company settings:", companyError);
          } else {
            setCompanyName(companyData.company_name || "COMPANY NAME NOT SET");
            setCompanyLogo(companyData.logo_url || null);
          }

          // Fetch operator (user) profile
          const { data: userData, error: userError } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("id", receipt.user_id)
            .single();

          if (userError) {
            console.error("Error fetching user profile:", userError);
          } else {
            setOperatorName(
              [userData.first_name, userData.last_name]
                .filter(Boolean)
                .join(" ") ||
                userData.email ||
                "N/A"
            );
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [receipt.user_id]);

    const formattedAmount = formatCurrency(
      receipt.amount || 0,
      receipt.currency || "NGN"
    );

    const formattedDate = receipt.date
      ? new Date(receipt.date).toLocaleString()
      : "N/A";

    if (loading) {
      return <div>Loading receipt data...</div>;
    }

    return (
      <div
        ref={ref}
        style={{
          background: "#fff",
          maxWidth: 420,
          margin: "40px auto",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
          fontFamily: "Inter, Roboto, system-ui, sans-serif",
          fontSize: 16,
          color: textGray,
          padding: 32,
          border: `1px solid ${borderGray}`,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          {companyLogo && (
            <img
              src={companyLogo}
              alt="Company Logo"
              style={{
                maxWidth: 120,
                maxHeight: 60,
                margin: "0 auto 12px auto",
                display: "block",
                objectFit: "contain",
                borderRadius: 8,
                background: lightGray,
              }}
            />
          )}
          <div
            style={{
              fontWeight: 700,
              fontSize: 26,
              color: highlightColor,
              letterSpacing: 1,
            }}
          >
            {companyName}
          </div>
          <div style={{ fontSize: 14, color: labelGray, marginTop: 4 }}>
            {formattedDate}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{ borderTop: `1px solid ${borderGray}`, margin: "24px 0" }}
        />

        {/* Details Section */}
        <div style={{ display: "grid", rowGap: 18 }}>
          <Detail label="Client" value={client?.business_name || "N/A"} />
          <Detail label="Invoice ID" value={invoice_id || "N/A"} />
          <Detail label="Quote ID" value={quote_id || "N/A"} />
          <Detail label="Receipt Number" value={receipt.receipt_number} />
          <Detail label="Date" value={formattedDate} />
          <Detail
            label="Payment Method"
            value={receipt.payment_method || "N/A"}
          />
          <Detail label="Reference" value={receipt.reference || "N/A"} />
          <Detail label="Notes" value={receipt.notes || "N/A"} />
          <Detail label="Operator" value={operatorName} />
        </div>

        {/* Divider */}
        <div
          style={{ borderTop: `1px solid ${borderGray}`, margin: "24px 0" }}
        />

        {/* Amount Section */}
        <div style={{ textAlign: "center", margin: "32px 0 0 0" }}>
          <div style={{ fontSize: 18, color: labelGray, marginBottom: 4 }}>
            Amount
          </div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 32,
              color: highlightColor,
              letterSpacing: 1,
              background: lightGray,
              borderRadius: 12,
              display: "inline-block",
              padding: "8px 32px",
              marginTop: 4,
            }}
          >
            {formattedAmount}
          </div>
        </div>
      </div>
    );
  }
);

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={{ color: labelGray, fontWeight: 500 }}>{label}</span>
      <span
        style={{
          color: textGray,
          fontWeight: 600,
          textAlign: "right",
          maxWidth: 220,
          overflowWrap: "break-word",
        }}
      >
        {value}
      </span>
    </div>
  );
}

ReceiptPreview.displayName = "ReceiptPreview";

export default ReceiptPreview;
