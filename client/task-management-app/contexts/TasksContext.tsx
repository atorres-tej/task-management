"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { Task, TaskFormData, User, TaskStatus, TaskFilters, ApiResponse } from "@/types/task"
import { taskService } from "@/services/taskService"
import { useAuth } from "@/contexts/AuthContext"

/**
 * Global state management for tasks, users, and task statuses
 * Provides centralized data fetching and CRUD operations
 */

interface TasksContextType {
  // State
  tasks: Task[]
  users: User[]
  taskStatuses: TaskStatus[]
  filters: TaskFilters
  loading: boolean
  error: string | null

  // Actions
  fetchTasks: () => Promise<void>
  createTask: (data: TaskFormData) => Promise<ApiResponse<Task>>
  updateTask: (id: number, data: TaskFormData) => Promise<ApiResponse<Task>>
  deleteTask: (id: number) => Promise<ApiResponse<null>>
  setFilters: (filters: TaskFilters) => void
  clearError: () => void
  resetContext: () => void
  
  // Data loading flags
  usersLoading: boolean
  statusesLoading: boolean
}

const TasksContext = createContext<TasksContextType | undefined>(undefined)

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  
  // State management
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [taskStatuses, setTaskStatuses] = useState<TaskStatus[]>([])
  const [filters, setFiltersState] = useState<TaskFilters>({
    orderBy: 'DueDate',
    orderDir: 'asc'
  })
  const [loading, setLoading] = useState(false)
  const [usersLoading, setUsersLoading] = useState(false)
  const [statusesLoading, setStatusesLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load users once when context mounts
  const loadUsers = useCallback(async (force = false) => {
    if (users.length > 0 && !force) return // Already loaded unless forced
    
    setUsersLoading(true)
    try {
      const response = await taskService.getUsers()
      if (response.IsSuccess) {
        setUsers(response.Data)
      } else {
        console.error("Failed to load users:", response.Message)
        setError(response.Message)
      }
    } catch (error) {
      console.error("Error loading users:", error)
      setError("Failed to load users")
    } finally {
      setUsersLoading(false)
    }
  }, [users.length])

  // Load task statuses once when needed
  const loadTaskStatuses = useCallback(async (force = false) => {
    if (taskStatuses.length > 0 && !force) return // Already loaded unless forced
    
    setStatusesLoading(true)
    try {
      const response = await taskService.getTaskStatuses()
      if (response.IsSuccess) {
        setTaskStatuses(response.Data)
      } else {
        console.error("Failed to load task statuses:", response.Message)
        setError(response.Message)
      }
    } catch (error) {
      console.error("Error loading task statuses:", error)
      setError("Failed to load task statuses")
    } finally {
      setStatusesLoading(false)
    }
  }, [taskStatuses.length])

  // Task CRUD operations
  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await taskService.getAllTasks(filters)
      if (response.IsSuccess) {
        setTasks(response.Data)
      } else {
        setError(response.Message)
      }
    } catch (err) {
      setError("Failed to fetch tasks. Please try again.")
    } finally {
      setLoading(false)
    }
  }, []) // Removed filters dependency to prevent infinite loops

  // Internal function that uses current filters
  const fetchTasksWithCurrentFilters = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await taskService.getAllTasks(filters)
      if (response.IsSuccess) {
        setTasks(response.Data)
      } else {
        setError(response.Message)
      }
    } catch (err) {
      setError("Failed to fetch tasks. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [filters])

  // Create a new task
  const createTask = useCallback(async (taskData: TaskFormData): Promise<ApiResponse<Task>> => {
    try {
      const response = await taskService.createTask(taskData)
      if (response.IsSuccess) {
        // Refresh tasks after successful creation
        await fetchTasksWithCurrentFilters()
      }
      return response
    } catch (error) {
      const errorResponse: ApiResponse<Task> = {
        StatusCode: 500,
        Data: {} as Task,
        Message: "Failed to create task",
        IsSuccess: false,
      }
      return errorResponse
    }
  }, [fetchTasksWithCurrentFilters])

  // Update an existing task
  const updateTask = useCallback(async (id: number, taskData: TaskFormData): Promise<ApiResponse<Task>> => {
    try {
      const response = await taskService.updateTask(id, taskData)
      if (response.IsSuccess) {
        // Refresh tasks after successful update
        await fetchTasksWithCurrentFilters()
      }
      return response
    } catch (error) {
      const errorResponse: ApiResponse<Task> = {
        StatusCode: 500,
        Data: {} as Task,
        Message: "Failed to update task",
        IsSuccess: false,
      }
      return errorResponse
    }
  }, [fetchTasksWithCurrentFilters])

  // Delete a task
  const deleteTask = useCallback(async (id: number): Promise<ApiResponse<null>> => {
    try {
      const response = await taskService.deleteTask(id)
      if (response.IsSuccess) {
        // Refresh tasks after successful deletion
        await fetchTasksWithCurrentFilters()
      }
      return response
    } catch (error) {
      const errorResponse: ApiResponse<null> = {
        StatusCode: 500,
        Data: null,
        Message: "Failed to delete task",
        IsSuccess: false,
      }
      return errorResponse
    }
  }, [fetchTasksWithCurrentFilters])

  // Update filters and fetch tasks
  const setFilters = useCallback((newFilters: TaskFilters) => {
    setFiltersState(newFilters)
  }, [])

  // Clear error message
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Reset context state (useful when logging out/in)
  const resetContext = useCallback(() => {
    setTasks([])
    setUsers([])
    setTaskStatuses([])
    setFiltersState({
      orderBy: 'DueDate',
      orderDir: 'asc'
    })
    setLoading(false)
    setUsersLoading(false)
    setStatusesLoading(false)
    setError(null)
  }, [])

  // Load initial data when context mounts
  useEffect(() => {
    if (isAuthenticated) {
      loadUsers()
    }
  }, [isAuthenticated]) // Load users when authentication status changes

  // Fetch tasks when filters change and user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasksWithCurrentFilters()
    }
  }, [fetchTasksWithCurrentFilters, isAuthenticated])

  // Reset context when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      resetContext()
    }
  }, [isAuthenticated, resetContext])

  const contextValue: TasksContextType = {
    // State
    tasks,
    users,
    taskStatuses,
    filters,
    loading,
    error,
    usersLoading,
    statusesLoading,

    // Actions
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    setFilters,
    clearError,
    resetContext,
  }

  // Provide a method to load task statuses when needed
  const contextValueWithStatuses = {
    ...contextValue,
    loadTaskStatuses
  }

  return (
    <TasksContext.Provider value={contextValueWithStatuses as TasksContextType & { loadTaskStatuses: (force?: boolean) => Promise<void> }}>
      {children}
    </TasksContext.Provider>
  )
}

// Custom hook to use TasksContext
export function useTasks() {
  const context = useContext(TasksContext)
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider")
  }
  return context
}

// Extended hook for components that need task statuses
export function useTasksWithStatuses() {
  const context = useContext(TasksContext) as TasksContextType & { loadTaskStatuses: (force?: boolean) => Promise<void> }
  const { isAuthenticated } = useAuth()
  
  if (context === undefined) {
    throw new Error("useTasksWithStatuses must be used within a TasksProvider")
  }
  
  // Ensure task statuses are loaded when authenticated
  useEffect(() => {
    if (isAuthenticated && context.loadTaskStatuses) {
      context.loadTaskStatuses()
    }
  }, [context, isAuthenticated])

  return context
}
