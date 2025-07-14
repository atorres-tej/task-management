// Task Status Constants
export const TASK_STATUS_IDS = {
  PENDING: 1,
  IN_PROGRESS: 2,
  DONE: 3,
} as const

// Task Status Names (for reference and validation)
export const TASK_STATUS_NAMES = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress', 
  DONE: 'Done',
} as const

// Status styling configuration
export const STATUS_STYLES = {
  [TASK_STATUS_IDS.PENDING]: {
    className: 'bg-red-100 text-red-800 border-red-200',
    keywords: ['pending', 'waiting', 'new'],
  },
  [TASK_STATUS_IDS.IN_PROGRESS]: {
    className: 'bg-blue-100 text-blue-800 border-blue-200',
    keywords: ['progress', 'active', 'working', 'started'],
  },
  [TASK_STATUS_IDS.DONE]: {
    className: 'bg-green-100 text-green-800 border-green-200',
    keywords: ['done', 'completed', 'finished', 'closed'],
  },
} as const

// Default style for unknown statuses
export const DEFAULT_STATUS_STYLE = 'bg-gray-100 text-gray-800 border-gray-200'

// Helper function to get status style by ID
export const getStatusStyleById = (statusId: number): string => {
  return STATUS_STYLES[statusId as keyof typeof STATUS_STYLES]?.className || DEFAULT_STATUS_STYLE
}

// Helper function to get status style by name (fallback)
export const getStatusStyleByName = (statusName: string): string => {
  const normalizedName = statusName?.toLowerCase() || ''
  
  for (const [statusId, config] of Object.entries(STATUS_STYLES)) {
    if (config.keywords.some(keyword => normalizedName.includes(keyword))) {
      return config.className
    }
  }
  
  return DEFAULT_STATUS_STYLE
}

// Helper function to check if task is completed
export const isTaskCompleted = (statusId?: number, statusName?: string): boolean => {
  if (statusId) {
    return statusId === TASK_STATUS_IDS.DONE
  }
  
  if (statusName) {
    const normalizedName = statusName.toLowerCase()
    return STATUS_STYLES[TASK_STATUS_IDS.DONE].keywords.some(keyword => 
      normalizedName.includes(keyword)
    )
  }
  
  return false
}
