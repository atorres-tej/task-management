import type { Task, ApiResponse, TaskFormData, User, TaskStatus, TaskFilters } from "@/types/task"
import { authService } from "./authService"
import { API_CONSTANTS } from "@/lib/constants"

/**
 * Task management service
 * Handles all API communication through Next.js proxy routes
 */

// API endpoints using Next.js proxy to avoid CORS issues
const API_BASE_URL = API_CONSTANTS.ENDPOINTS.TASKS
const USERS_API_BASE_URL = API_CONSTANTS.ENDPOINTS.USERS
const TASK_STATUSES_API_BASE_URL = API_CONSTANTS.ENDPOINTS.TASK_STATUSES

const getAuthHeaders = (): Record<string, string> => {
  const tokens = authService.getStoredTokens()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  
  if (tokens) {
    headers.Authorization = `Bearer ${tokens.accessToken}`
  }
  
  return headers
}

export const taskService = {
  async getAllTasks(filters?: TaskFilters): Promise<ApiResponse<Task[]>> {
    try {
      // Build query parameters for filtering and sorting
      const params = new URLSearchParams()
      
      if (filters) {
        if (filters.statusId !== undefined) {
          if (filters.statusId === null) {
            params.append('statusId', 'null')
          } else {
            params.append('statusId', filters.statusId.toString())
          }
        }
        if (filters.assignedTo !== undefined) {
          if (filters.assignedTo === null) {
            params.append('assignedTo', 'null')
          } else {
            params.append('assignedTo', filters.assignedTo.toString())
          }
        }
        if (filters.orderBy) {
          params.append('orderBy', filters.orderBy)
        }
        if (filters.orderDir) {
          params.append('orderDir', filters.orderDir)
        }
      }

      const queryString = params.toString()
      const url = queryString ? `${API_BASE_URL}?${queryString}` : API_BASE_URL
      
      console.log("Fetching tasks from:", url)
      console.log("Query parameters:", Object.fromEntries(params))
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      })
      
      console.log("Response status:", response.status)
      
      if (!response.ok) {
        console.error("API response not ok:", response.status, response.statusText)
        return {
          StatusCode: response.status,
          Data: [],
          Message: `API request failed: ${response.status} ${response.statusText}`,
          IsSuccess: false,
        }
      }
      
      const data = await response.json()
      console.log("Tasks fetched successfully:", data)
      return data
    } catch (error) {
      console.error("Error fetching tasks:", error)
      return {
        StatusCode: 500,
        Data: [],
        Message: "Failed to fetch tasks - Network error",
        IsSuccess: false,
      }
    }
  },

  async getTaskById(id: number): Promise<ApiResponse<Task>> {
    try {
      console.log("Fetching task by ID from:", `${API_BASE_URL}/${id}`)
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        headers: getAuthHeaders(),
      })
      
      if (!response.ok) {
        console.error("API response not ok:", response.status, response.statusText)
        return {
          StatusCode: response.status,
          Data: {} as Task,
          Message: `API request failed: ${response.status} ${response.statusText}`,
          IsSuccess: false,
        }
      }
      
      const data = await response.json()
      console.log("Task fetched successfully:", data)
      return data
    } catch (error) {
      console.error("Error fetching task:", error)
      return {
        StatusCode: 500,
        Data: {} as Task,
        Message: "Failed to fetch task - Network error",
        IsSuccess: false,
      }
    }
  },

  async getUsers(): Promise<ApiResponse<User[]>> {
    try {
      console.log("Fetching users from:", USERS_API_BASE_URL)
      const response = await fetch(USERS_API_BASE_URL, {
        headers: getAuthHeaders(),
      })
      
      if (!response.ok) {
        console.error("API response not ok:", response.status, response.statusText)
        return {
          StatusCode: response.status,
          Data: [],
          Message: `API request failed: ${response.status} ${response.statusText}`,
          IsSuccess: false,
        }
      }
      
      const data = await response.json()
      console.log("Users fetched successfully:", data)
      return data
    } catch (error) {
      console.error("Error fetching users:", error)
      return {
        StatusCode: 500,
        Data: [],
        Message: "Failed to fetch users - Network error",
        IsSuccess: false,
      }
    }
  },

  async getTaskStatuses(): Promise<ApiResponse<TaskStatus[]>> {
    try {
      console.log("Fetching task statuses from:", TASK_STATUSES_API_BASE_URL)
      const response = await fetch(TASK_STATUSES_API_BASE_URL, {
        headers: getAuthHeaders(),
      })
      
      if (!response.ok) {
        console.error("API response not ok:", response.status, response.statusText)
        return {
          StatusCode: response.status,
          Data: [],
          Message: `API request failed: ${response.status} ${response.statusText}`,
          IsSuccess: false,
        }
      }
      
      const data = await response.json()
      console.log("Task statuses fetched successfully:", data)
      return data
    } catch (error) {
      console.error("Error fetching task statuses:", error)
      return {
        StatusCode: 500,
        Data: [],
        Message: "Failed to fetch task statuses - Network error",
        IsSuccess: false,
      }
    }
  },

  async createTask(taskData: TaskFormData): Promise<ApiResponse<Task>> {
    try {
      // For creating tasks, only send required fields (no statusId)
      const apiData: any = {
        title: taskData.title,
        description: taskData.description,
        dueDate: new Date(taskData.dueDate + 'T00:00:00Z').toISOString()
      }

      // Only include assignedTo if it's provided
      if (taskData.assignedTo !== undefined) {
        apiData.assignedTo = taskData.assignedTo
      }

      console.log("Creating task with data:", apiData)
      
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(apiData),
      })
      return await response.json()
    } catch (error) {
      return {
        StatusCode: 500,
        Data: {} as Task,
        Message: "Failed to create task",
        IsSuccess: false,
      }
    }
  },

  async updateTask(id: number, taskData: TaskFormData): Promise<ApiResponse<Task>> {
    try {
      // Convert date to ISO format for API and only send fields that should be updated
      const apiData: any = {
        title: taskData.title,
        description: taskData.description,
        dueDate: new Date(taskData.dueDate + 'T00:00:00Z').toISOString()
      }

      // Only include statusId if it's provided (for editing)
      if (taskData.statusId !== undefined) {
        apiData.statusId = taskData.statusId
      }

      // Only include assignedTo if it's provided
      if (taskData.assignedTo !== undefined) {
        apiData.assignedTo = taskData.assignedTo
      }

      console.log("Updating task with data:", apiData)

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(apiData),
      })
      return await response.json()
    } catch (error) {
      return {
        StatusCode: 500,
        Data: {} as Task,
        Message: "Failed to update task",
        IsSuccess: false,
      }
    }
  },

  async deleteTask(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })
      return await response.json()
    } catch (error) {
      return {
        StatusCode: 500,
        Data: null,
        Message: "Failed to delete task",
        IsSuccess: false,
      }
    }
  },
}
