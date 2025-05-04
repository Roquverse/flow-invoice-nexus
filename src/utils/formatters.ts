/**
 * Formats a number as currency with the given currency code
 */
export function formatCurrency(
  amount: number,
  currencyCode: string = "USD"
): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(amount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
}

/**
 * Formats a date string to a readable format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}
