export function formatCurrency(value: number | null, currency = "BRL"): string {
  if (value === null || value === undefined) return "-"
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
