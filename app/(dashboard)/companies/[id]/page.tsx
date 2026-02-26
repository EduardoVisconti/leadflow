"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useCompany } from "@/lib/hooks/useCompanies"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Globe, Users, Handshake } from "lucide-react"
import { formatCurrency } from "@/lib/utils/currency"
import { timeAgo } from "@/lib/utils/date"

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data, isLoading } = useCompany(id)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    )
  }

  if (!data) {
    return <p className="text-muted-foreground">Empresa não encontrada.</p>
  }

  const { company, contacts, deals } = data

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{company.name}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
            {company.industry && <span>{company.industry}</span>}
            {company.size && <Badge variant="secondary">{company.size} funcionários</Badge>}
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <Globe className="h-3 w-3" />
                Website
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Contatos ({contacts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!contacts.length ? (
              <p className="text-sm text-muted-foreground">Nenhum contato vinculado a esta empresa.</p>
            ) : (
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <Link
                    key={contact.id}
                    href={`/contacts/${contact.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {contact.first_name[0]}{contact.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{contact.first_name} {contact.last_name}</p>
                      <p className="text-xs text-muted-foreground">{contact.role || contact.email || ""}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Handshake className="h-4 w-4" />
              Deals ({deals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!deals.length ? (
              <p className="text-sm text-muted-foreground">Nenhum deal vinculado a esta empresa.</p>
            ) : (
              <div className="space-y-3">
                {deals.map((deal) => (
                  <Link
                    key={deal.id}
                    href={`/deals/${deal.id}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium">{deal.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {(deal.stage as { name: string } | null)?.name} &middot; {timeAgo(deal.created_at)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatCurrency(deal.value, deal.currency)}
                    </span>
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
