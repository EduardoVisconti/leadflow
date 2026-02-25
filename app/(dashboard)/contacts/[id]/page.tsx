"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useContact } from "@/lib/hooks/useContacts"
import { useDeals } from "@/lib/hooks/useDeals"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Mail, Phone, Building2, Briefcase, Handshake } from "lucide-react"
import { formatCurrency } from "@/lib/utils/currency"
import { timeAgo } from "@/lib/utils/date"

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: contact, isLoading } = useContact(id)
  const { data: allDeals } = useDeals()

  const contactDeals = allDeals?.filter((d) => d.contact_id === id) ?? []

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  if (!contact) {
    return <p className="text-muted-foreground">Contact not found.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {contact.first_name} {contact.last_name}
          </h1>
          {contact.role && (
            <p className="text-sm text-muted-foreground">{contact.role}</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {contact.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <a href={`mailto:${contact.email}`} className="text-sm text-primary hover:underline">
                  {contact.email}
                </a>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm">{contact.phone}</span>
              </div>
            )}
            {contact.role && (
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm">{contact.role}</span>
              </div>
            )}
            {contact.company && (
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                <Link href={`/companies/${contact.company.id}`} className="text-sm text-primary hover:underline">
                  {contact.company.name}
                </Link>
              </div>
            )}
            {contact.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm whitespace-pre-wrap">{contact.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Handshake className="h-4 w-4" />
              Deals ({contactDeals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!contactDeals.length ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No deals linked to this contact.
              </p>
            ) : (
              <div className="space-y-3">
                {contactDeals.map((deal) => (
                  <Link
                    key={deal.id}
                    href={`/deals/${deal.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium">{deal.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {deal.stage && (
                          <Badge variant="secondary" className="text-[10px]">
                            {deal.stage.name}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">{timeAgo(deal.created_at)}</span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">{formatCurrency(deal.value, deal.currency)}</span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
