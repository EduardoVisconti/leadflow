export const DEFAULT_STAGES = [
  { name: "Lead", position: 1, color: "#94a3b8" },
  { name: "Qualified", position: 2, color: "#60a5fa" },
  { name: "Proposal", position: 3, color: "#f59e0b" },
  { name: "Negotiation", position: 4, color: "#a78bfa" },
  { name: "Closed Won", position: 5, color: "#22c55e" },
  { name: "Closed Lost", position: 6, color: "#f87171" },
] as const

export const PRIORITY_CONFIG = {
  low: { label: "Baixa", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
  medium: { label: "Média", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
  high: { label: "Alta", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
} as const

export const ACTIVITY_TYPES = {
  note: { label: "Nota", icon: "FileText" },
  call: { label: "Ligação", icon: "Phone" },
  email: { label: "Email", icon: "Mail" },
  meeting: { label: "Reunião", icon: "Calendar" },
  task: { label: "Tarefa", icon: "CheckSquare" },
} as const
