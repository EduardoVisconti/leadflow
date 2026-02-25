"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useContacts } from "@/lib/hooks/useContacts"
import { useDeals } from "@/lib/hooks/useDeals"
import { useCompanies } from "@/lib/hooks/useCompanies"
import { Search, User, Handshake, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { data: contacts } = useContacts()
  const { data: deals } = useDeals()
  const { data: companies } = useCompanies()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === "f" && !e.metaKey && !e.ctrlKey && !isInputFocused()) {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  const navigate = useCallback(
    (path: string) => {
      setOpen(false)
      router.push(path)
    },
    [router]
  )

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex text-muted-foreground">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-[50%] -translate-y-[50%] hidden xl:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">Ctrl</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search contacts, deals, companies..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {deals && deals.length > 0 && (
            <CommandGroup heading="Deals">
              {deals.slice(0, 5).map((deal) => (
                <CommandItem
                  key={deal.id}
                  onSelect={() => navigate(`/deals/${deal.id}`)}
                  className="cursor-pointer"
                >
                  <Handshake className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{deal.title}</span>
                  {deal.stage && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {deal.stage.name}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {contacts && contacts.length > 0 && (
            <CommandGroup heading="Contacts">
              {contacts.slice(0, 5).map((contact) => (
                <CommandItem
                  key={contact.id}
                  onSelect={() => navigate(`/contacts/${contact.id}`)}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    {contact.first_name} {contact.last_name}
                  </span>
                  {contact.email && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {contact.email}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {companies && companies.length > 0 && (
            <CommandGroup heading="Companies">
              {companies.slice(0, 5).map((company) => (
                <CommandItem
                  key={company.id}
                  onSelect={() => navigate(`/companies/${company.id}`)}
                  className="cursor-pointer"
                >
                  <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{company.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}

function isInputFocused() {
  const el = document.activeElement
  return (
    el instanceof HTMLInputElement ||
    el instanceof HTMLTextAreaElement ||
    el?.getAttribute("contenteditable") === "true"
  )
}
