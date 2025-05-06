import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Generate PDF from a DOM element
 * @param element The DOM element to convert to PDF
 * @param filename The name of the PDF file
 */
export const generatePDF = async (
  element: HTMLElement,
  filename: string
): Promise<void> => {
  try {
    // Create a canvas from the element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Allow loading of images from other domains
      logging: false,
      backgroundColor: "#ffffff",
    });

    // Create a PDF with the dimensions of the element
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    // Calculate the PDF dimensions to fit the content
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Add the image to the PDF
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    // Save the PDF
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

/**
 * Generate and download a PDF from a preview component
 * @param previewRef Reference to the component to convert to PDF
 * @param filename Base name for the PDF file
 * @param documentType Type of document (invoice, quote, receipt)
 * @param documentNumber Document number to include in filename
 */
export const downloadPDF = async (
  previewRef: React.RefObject<HTMLDivElement>,
  filename: string,
  documentType?: "invoice" | "quote" | "receipt",
  documentNumber?: string
): Promise<void> => {
  if (!previewRef.current) {
    throw new Error("Preview element not found");
  }

  try {
    // Create a temporary copy of the element to modify for PDF
    const tempElement = previewRef.current.cloneNode(true) as HTMLDivElement;
    tempElement.style.width = "800px"; // Fixed width for PDF
    tempElement.style.padding = "20px";
    tempElement.style.backgroundColor = "#ffffff";
    document.body.appendChild(tempElement);

    // Generate PDF from the temporary element
    let finalFilename = filename;
    if (documentType && documentNumber) {
      finalFilename = `${filename}-${documentType}-${documentNumber}`;
    }

    await generatePDF(tempElement, finalFilename);

    // Remove the temporary element
    document.body.removeChild(tempElement);
  } catch (error) {
    console.error(`Error downloading PDF:`, error);
    throw error;
  }
};
