export function formatCurrency(value: number | null, currency = "USD"): string {
  if (value === null || value === undefined) return "-"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
