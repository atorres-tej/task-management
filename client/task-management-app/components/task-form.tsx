"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Task, TaskFormData } from "@/types/task"
import { useTasksWithStatuses } from "@/contexts/TasksContext"
import { taskFormSchema, editTaskFormSchema, type TaskFormSchema, type EditTaskFormSchema } from "@/lib/validations/task"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface TaskFormProps {
  task?: Task
  onSubmit: (data: TaskFormData) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

export default function TaskForm({ task, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const { users, taskStatuses, usersLoading, statusesLoading } = useTasksWithStatuses()
  
  // Use different validation schema based on create vs edit mode
  const schema = task ? editTaskFormSchema : taskFormSchema
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset
  } = useForm<TaskFormSchema | EditTaskFormSchema>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      statusId: undefined,
      assignedTo: undefined,
    }
  })

  const watchedValues = watch()

  // Populate form when editing an existing task
  useEffect(() => {
    if (task) {
      reset({
        title: task.Title,
        description: task.Description,
        dueDate: task.DueDate.split("T")[0], // Format for date input
        statusId: task.StatusId,
        assignedTo: task.AssignedTo,
      })
    } else {
      reset({
        title: "",
        description: "",
        dueDate: "",
        statusId: undefined,
        assignedTo: undefined,
      })
    }
  }, [task, reset])

  // Ensure dropdown values are set after data loads
  useEffect(() => {
    if (task && users.length > 0 && taskStatuses.length > 0) {
      setValue("statusId", task.StatusId, { shouldValidate: true })
      setValue("assignedTo", task.AssignedTo, { shouldValidate: true })
    }
  }, [task, users.length, taskStatuses.length, setValue])

  const onSubmitHandler = async (data: TaskFormSchema | EditTaskFormSchema) => {
    try {
      const taskData: TaskFormData = {
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        statusId: data.statusId || undefined,
        assignedTo: data.assignedTo || undefined,
      }
      
      await onSubmit(taskData)
    } catch (error) {
      // Error will be handled by the parent component
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          type="text"
          {...register("title")}
          className={errors.title ? "border-red-500" : ""}
          placeholder="Enter task title"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...register("description")}
          className={errors.description ? "border-red-500" : ""}
          placeholder="Enter task description"
          rows={3}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="dueDate">Due Date *</Label>
        <Input
          id="dueDate"
          type="date"
          {...register("dueDate")}
          className={errors.dueDate ? "border-red-500" : ""}
        />
        {errors.dueDate && (
          <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>
        )}
      </div>

      {/* Status dropdown only shown when editing (required field) */}
      {task && (
        <div>
          <Label htmlFor="statusId">Status *</Label>
          <select
            id="statusId"
            value={watchedValues.statusId ?? ""}
            onChange={(e) => {
              const value = e.target.value === "" ? undefined : Number(e.target.value)
              setValue("statusId", value, { shouldValidate: true })
            }}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.statusId ? "border-red-500" : "border-gray-300"
            }`}
            disabled={statusesLoading}
          >
            <option value="">Select a status</option>
            {taskStatuses.map((status) => (
              <option key={status.Id} value={status.Id}>
                {status.Name}
              </option>
            ))}
          </select>
          {errors.statusId && (
            <p className="text-red-500 text-sm mt-1">{errors.statusId.message}</p>
          )}
          {statusesLoading && <p className="text-gray-500 text-sm mt-1">Loading statuses...</p>}
        </div>
      )}

      <div>
        <Label htmlFor="assignedTo">Assigned To</Label>
        <select
          id="assignedTo"
          value={watchedValues.assignedTo ?? ""}
          onChange={(e) => {
            const value = e.target.value === "" ? undefined : Number(e.target.value)
            setValue("assignedTo", value, { shouldValidate: true })
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={usersLoading}
        >
          <option value="">Select a user (optional)</option>
          {users.map((user) => (
            <option key={user.Id} value={user.Id}>
              {user.DisplayName}
            </option>
          ))}
        </select>
        {usersLoading && <p className="text-gray-500 text-sm mt-1">Loading users...</p>}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !isValid}>
          {isLoading ? "Saving..." : task ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  )
}
