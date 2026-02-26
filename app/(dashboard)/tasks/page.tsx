"use client"

import { useState } from "react"
import { TasksList } from "@/components/tasks/TasksList"
import { AddTaskModal } from "@/components/tasks/AddTaskModal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { TaskWithRelations } from "@/types"

export default function TasksPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskWithRelations | null>(null)

  function handleEdit(task: TaskWithRelations) {
    setEditingTask(task)
    setModalOpen(true)
  }

  function handleClose() {
    setModalOpen(false)
    setEditingTask(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tarefas</h1>
          <p className="text-muted-foreground">Gerencie seus follow-ups e atividades.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      <TasksList onEdit={handleEdit} />

      <AddTaskModal
        open={modalOpen}
        onClose={handleClose}
        task={editingTask}
      />
    </div>
  )
}
