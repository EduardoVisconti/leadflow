"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Kanban,
  Handshake,
  Package,
  Users,
  Building2,
  CheckSquare,
  ClipboardList,
  BarChart3,
  Settings,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navGroups = [
  {
    label: "PRINCIPAL",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "VENDAS",
    items: [
      { name: "Pipeline", href: "/pipeline", icon: Kanban },
      { name: "Deals", href: "/deals", icon: Handshake },
      { name: "Produtos", href: "/products", icon: Package },
    ],
  },
  {
    label: "CLIENTES",
    items: [
      { name: "Contatos", href: "/contacts", icon: Users },
      { name: "Empresas", href: "/companies", icon: Building2 },
    ],
  },
  {
    label: "ATIVIDADES",
    items: [
      { name: "Tarefas", href: "/tasks", icon: CheckSquare },
      { name: "Histórico", href: "/activities", icon: ClipboardList },
    ],
  },
  {
    label: "RELATÓRIOS",
    items: [
      { name: "Performance", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    label: "CONFIGURAÇÕES",
    items: [
      { name: "Configurações", href: "/settings", icon: Settings },
    ],
  },
]

export function MobileSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 px-6 border-b border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <TrendingUp className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold text-white">LeadFlow</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href))

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-slate-800 text-white"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  )
}
