/** Groups a raw card number into 4-digit blocks for display, e.g. "6037991234567890" -> "6037 9912 3456 7890" */
export function formatCardNumber(number: string): string {
  const digitsOnly = number.replace(/\s+/g, "");
  return digitsOnly.replace(/(.{4})/g, "$1 ").trim();
}