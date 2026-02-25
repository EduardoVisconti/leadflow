"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ContactsTable } from "@/components/contacts/ContactsTable"
import { AddContactModal } from "@/components/contacts/AddContactModal"
import { Button } from "@/components/ui/button"
import { Plus, Download } from "lucide-react"
import { useContacts } from "@/lib/hooks/useContacts"
import { exportContactsToCSV } from "@/lib/utils/export"
import type { Contact } from "@/types"

export default function ContactsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const router = useRouter()
  const { data: contacts } = useContacts()

  function handleEdit(contact: Contact) {
    setEditingContact(contact)
    setModalOpen(true)
  }

  function handleClose() {
    setModalOpen(false)
    setEditingContact(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contacts</h1>
          <p className="text-muted-foreground">Manage your contacts and relationships.</p>
        </div>
        <div className="flex gap-2">
          {contacts && contacts.length > 0 && (
            <Button variant="outline" onClick={() => exportContactsToCSV(contacts)}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          )}
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Contact
          </Button>
        </div>
      </div>

      <ContactsTable
        onEdit={handleEdit}
        onView={(id) => router.push(`/contacts/${id}`)}
      />

      <AddContactModal
        open={modalOpen}
        onClose={handleClose}
        contact={editingContact}
      />
    </div>
  )
}
