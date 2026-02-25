import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/layout/Sidebar"
import { TopBar } from "@/components/layout/TopBar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="lg:pl-64">
        <TopBar userEmail={user?.email} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
