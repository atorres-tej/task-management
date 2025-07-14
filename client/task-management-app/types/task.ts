export interface Task {
  Id: number
  Title: string
  Description: string
  DueDate: string
  StatusId?: number
  StatusName?: string
  AssignedTo?: number
  AssignedToName?: string
  CreatedAt: string
}

export interface ApiResponse<T> {
  StatusCode: number
  Data: T
  Message: string
  IsSuccess: boolean
}

export interface TaskFormData {
  title: string
  description: string
  dueDate: string
  statusId?: number
  assignedTo?: number
}

export interface TaskFilters {
  statusId?: number | null
  assignedTo?: number | null
  orderBy?: 'DueDate' | 'Title' | 'CreatedAt'
  orderDir?: 'asc' | 'desc'
}

export interface User {
  Id: number
  DisplayName: string
}

export interface TaskStatus {
  Id: number
  Name: string
}
