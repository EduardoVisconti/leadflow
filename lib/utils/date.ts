import { formatDistanceToNow, isPast, parseISO, format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function timeAgo(date: string): string {
  return formatDistanceToNow(parseISO(date), { addSuffix: true, locale: ptBR })
}

export function isOverdue(date: string | null): boolean {
  if (!date) return false
  return isPast(parseISO(date))
}

export function formatDate(date: string | null): string {
  if (!date) return "-"
  return format(parseISO(date), "dd/MM/yyyy")
}

export function daysSince(date: string): number {
  const diff = Date.now() - parseISO(date).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}
