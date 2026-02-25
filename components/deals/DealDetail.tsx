"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/utils/currency"
import { formatDate, isOverdue, timeAgo } from "@/lib/utils/date"
import { PRIORITY_CONFIG } from "@/lib/constants/pipeline"
import type { DealWithRelations, DealPriority } from "@/types"
import { Calendar, DollarSign, User, Building2, Clock } from "lucide-react"

interface DealDetailProps {
  deal: DealWithRelations
}

export function DealDetail({ deal }: DealDetailProps) {
  const priority = PRIORITY_CONFIG[deal.priority as DealPriority]
  const overdue = isOverdue(deal.expected_close_date)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{deal.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              {deal.stage && (
                <Badge
                  variant="secondary"
                  style={{ borderLeftColor: deal.stage.color, borderLeftWidth: 3 }}
                >
                  {deal.stage.name}
                </Badge>
              )}
              {priority && (
                <Badge variant="secondary" className={priority.color}>
                  {priority.label}
                </Badge>
              )}
              {overdue && (
                <Badge variant="destructive">Overdue</Badge>
              )}
            </div>
          </div>
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(deal.value, deal.currency)}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Expected Close</p>
              <p className="font-medium text-foreground">{formatDate(deal.expected_close_date)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="font-medium text-foreground">{timeAgo(deal.created_at)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Currency</p>
              <p className="font-medium text-foreground">{deal.currency}</p>
            </div>
          </div>
        </div>

        <Separator />

        {deal.contact && (
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Contact</p>
              <Link href={`/contacts/${deal.contact.id}`} className="text-sm font-medium text-primary hover:underline">
                {deal.contact.first_name} {deal.contact.last_name}
              </Link>
            </div>
          </div>
        )}

        {deal.company && (
          <div className="flex items-center gap-3">
            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Company</p>
              <Link href={`/companies/${deal.company.id}`} className="text-sm font-medium text-primary hover:underline">
                {deal.company.name}
              </Link>
            </div>
          </div>
        )}

        {deal.notes && (
          <>
            <Separator />
            <div>
              <p className="text-xs text-muted-foreground mb-1">Notes</p>
              <p className="text-sm whitespace-pre-wrap">{deal.notes}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
