"use client"

import { useState } from "react"
import { useContacts, useDeleteContact } from "@/lib/hooks/useContacts"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Search, MessageCircle, Instagram, Phone, Mail } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Contact } from "@/types"

interface ContactsTableProps {
  onEdit: (contact: Contact) => void
  onView: (contactId: string) => void
}

export function ContactsTable({ onEdit, onView }: ContactsTableProps) {
  const { data: contacts, isLoading } = useContacts()
  const deleteContact = useDeleteContact()
  const { toast } = useToast()
  const [search, setSearch] = useState("")

  const filtered = contacts?.filter((c) => {
    const term = search.toLowerCase()
    return (
      c.first_name.toLowerCase().includes(term) ||
      c.last_name.toLowerCase().includes(term) ||
      (c.email?.toLowerCase().includes(term) ?? false) ||
      (c.company?.name?.toLowerCase().includes(term) ?? false)
    )
  })

  async function handleDelete(id: string) {
    try {
      await deleteContact.mutateAsync(id)
      toast({ title: "Contato excluído" })
    } catch {
      toast({ title: "Erro ao excluir contato", variant: "destructive" })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar contatos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {!filtered?.length ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {search ? "Nenhum contato encontrado na busca." : "Nenhum contato cadastrado. Adicione seu primeiro cliente!"}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((contact) => (
                <TableRow
                  key={contact.id}
                  className="cursor-pointer"
                  onClick={() => onView(contact.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {contact.first_name[0]}
                          {contact.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {contact.first_name} {contact.last_name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{contact.email || "-"}</TableCell>
                  <TableCell className="text-muted-foreground">{contact.phone || "-"}</TableCell>
                  <TableCell className="text-muted-foreground">{contact.company?.name || "-"}</TableCell>
                  <TableCell className="text-muted-foreground">{contact.role || "-"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {contact.channel === "whatsapp" && <MessageCircle className="h-4 w-4" />}
                    {contact.channel === "instagram" && <Instagram className="h-4 w-4" />}
                    {contact.channel === "telefone" && <Phone className="h-4 w-4" />}
                    {contact.channel === "email" && <Mail className="h-4 w-4" />}
                    {!contact.channel && "-"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(contact) }}>
                          <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={(e) => { e.stopPropagation(); handleDelete(contact.id) }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
