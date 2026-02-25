import type { Contact } from "@/types"

export function exportContactsToCSV(contacts: Contact[]) {
  const headers = ["First Name", "Last Name", "Email", "Phone", "Role"]
  const rows = contacts.map((c) => [
    c.first_name,
    c.last_name,
    c.email ?? "",
    c.phone ?? "",
    c.role ?? "",
  ])

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n")

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `leadflow-contacts-${new Date().toISOString().split("T")[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
