"use client"

import type { Task } from "@/types/task"
import StatusBadge from "./ui/status-badge"
import { Calendar, User, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { isTaskCompleted } from "@/lib/constants"

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const isOverdue = () => {
    const dueDate = new Date(task.DueDate)
    const today = new Date()
    
    // Check if task is overdue and not completed
    if (dueDate < today) {
      return !isTaskCompleted(task.StatusId, task.StatusName)
    }
    return false
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 md:p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">{task.Title}</h3>
        <StatusBadge status={task.StatusName} statusId={task.StatusId} />
      </div>

      <p className="text-gray-600 mb-4 line-clamp-3 text-sm md:text-base">{task.Description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className={isOverdue() ? "text-red-600 font-medium" : ""}>
            Due: {formatDate(task.DueDate)}
            {isOverdue() && " (Overdue)"}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <User className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{task.AssignedToName || "Unassigned"}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-2 sm:gap-0">
        <Button variant="outline" size="sm" onClick={() => onEdit(task)} className="flex items-center justify-center w-full sm:w-auto">
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(task.Id)}
          className="flex items-center justify-center w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  )
}
