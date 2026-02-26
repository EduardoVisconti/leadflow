"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Calendar, User, Package, MessageCircle, Instagram, Users, Globe, HelpCircle, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils/currency"
import { isOverdue, formatDate, daysSince } from "@/lib/utils/date"
import { PRIORITY_CONFIG } from "@/lib/constants/pipeline"
import type { DealWithRelations, DealPriority, DealSource } from "@/types"

const SOURCE_ICONS: Record<string, typeof MessageCircle> = {
  whatsapp: MessageCircle,
  instagram: Instagram,
  indicacao: Users,
  site: Globe,
  outro: HelpCircle,
}

interface DealCardProps {
  deal: DealWithRelations
  onClick?: () => void
}

export function DealCard({ deal, onClick }: DealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const priority = PRIORITY_CONFIG[deal.priority as DealPriority]
  const overdue = isOverdue(deal.expected_close_date)
  const daysWithoutActivity = daysSince(deal.updated_at)
  const SourceIcon = deal.source ? SOURCE_ICONS[deal.source] : null

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md cursor-pointer ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        <button
          className="mt-0.5 cursor-grab touch-none text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-medium text-sm truncate flex-1">{deal.title}</p>
            {SourceIcon && (
              <SourceIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            )}
          </div>
          {deal.value !== null && (
            <p className="text-sm font-semibold text-primary mt-1">
              {formatCurrency(deal.value, deal.currency)}
            </p>
          )}
          {deal.product && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 truncate">
              <Package className="h-3 w-3 shrink-0" />
              {deal.product.name}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {priority && (
              <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${priority.color}`}>
                {priority.label}
              </Badge>
            )}
            {overdue && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                Atrasado
              </Badge>
            )}
            {daysWithoutActivity > 7 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-orange-600 border-orange-300">
                <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                {daysWithoutActivity}d sem contato
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            {deal.contact && (
              <span className="flex items-center gap-1 truncate">
                <User className="h-3 w-3 shrink-0" />
                {deal.contact.first_name} {deal.contact.last_name}
              </span>
            )}
            {deal.expected_close_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3 shrink-0" />
                {formatDate(deal.expected_close_date)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
