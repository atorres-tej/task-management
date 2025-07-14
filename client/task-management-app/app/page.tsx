"use client"

import { useState } from "react"
import type { Task, TaskFormData } from "@/types/task"
import { useTasks } from "@/contexts/TasksContext"
import { useAuth } from "@/contexts/AuthContext"
import { taskService } from "@/services/taskService"
import TaskCard from "@/components/task-card"
import TaskForm from "@/components/task-form"
import TaskFiltersComponent from "@/components/task-filters"
import ConfirmationDialog from "@/components/confirmation-dialog"
import Modal from "@/components/ui/modal"
import UserMenu from "@/components/user-menu"
import LoginScreen from "@/components/login-screen"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw, AlertCircle } from "lucide-react"

export default function TaskManager() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  
  const { 
    tasks, 
    loading, 
    error, 
    filters,
    fetchTasks, 
    createTask, 
    updateTask, 
    deleteTask,
    clearError 
  } = useTasks()

  // UI state management
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateTask = async (taskData: TaskFormData) => {
    setIsSubmitting(true)
    try {
      await createTask(taskData)
      setIsCreateModalOpen(false)
    } catch (err) {
      console.error("Failed to create task:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditTask = async (taskData: TaskFormData) => {
    if (!editingTask) return
    setIsSubmitting(true)
    try {
      await updateTask(editingTask.Id, taskData)
      setIsEditModalOpen(false)
      setEditingTask(null)
    } catch (err) {
      console.error("Failed to update task:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTask = async () => {
    if (!deletingTaskId) return
    setIsSubmitting(true)
    try {
      await deleteTask(deletingTaskId)
      setIsDeleteDialogOpen(false)
      setDeletingTaskId(null)
    } catch (err) {
      console.error("Failed to delete task:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditModal = async (task: Task) => {
    try {
      setIsSubmitting(true)
      
      // Fetch complete task data to ensure we have proper IDs for dropdowns
      const response = await taskService.getTaskById(task.Id)
      
      if (response.IsSuccess && response.Data) {
        setEditingTask(response.Data)
        setIsEditModalOpen(true)
      } else {
        setEditingTask(task)
        setIsEditModalOpen(true)
      }
    } catch (error) {
      console.error("Error fetching task for editing:", error)
      setEditingTask(task)
      setIsEditModalOpen(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const openDeleteDialog = (taskId: number) => {
    setDeletingTaskId(taskId)
    setIsDeleteDialogOpen(true)
  }

  const closeModals = () => {
    setIsCreateModalOpen(false)
    setIsEditModalOpen(false)
    setIsDeleteDialogOpen(false)
    setEditingTask(null)
    setDeletingTaskId(null)
  }

  // Render loading states and authentication guard
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          {/* Top row with title and user menu */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Task Manager</h1>
              <p className="text-gray-600 mt-1">Manage your tasks efficiently</p>
            </div>
            <UserMenu />
          </div>
          
          {/* Action buttons row */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <Button variant="outline" onClick={() => fetchTasks()} disabled={loading} className="w-full sm:w-auto">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create New Task
            </Button>
          </div>
        </div>

        {/* Filters */}
        <TaskFiltersComponent />

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clearError()}
              className="text-red-600 hover:text-red-700 ml-auto self-start sm:self-center"
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Task List */}
        {tasks.length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mx-auto max-w-md">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600 mb-4 text-sm md:text-base">Get started by creating your first task.</p>
              <Button onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Create New Task
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {tasks.map((task) => (
              <TaskCard key={task.Id} task={task} onEdit={openEditModal} onDelete={openDeleteDialog} />
            ))}
          </div>
        )}

        {/* Create Task Modal */}
        <Modal isOpen={isCreateModalOpen} onClose={closeModals} title="Create New Task">
          <TaskForm onSubmit={handleCreateTask} onCancel={closeModals} isLoading={isSubmitting} />
        </Modal>

        {/* Edit Task Modal */}
        <Modal isOpen={isEditModalOpen} onClose={closeModals} title="Edit Task">
          <TaskForm
            task={editingTask || undefined}
            onSubmit={handleEditTask}
            onCancel={closeModals}
            isLoading={isSubmitting}
          />
        </Modal>

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={closeModals}
          onConfirm={handleDeleteTask}
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          isLoading={isSubmitting}
        />
      </div>
    </div>
  )
}
