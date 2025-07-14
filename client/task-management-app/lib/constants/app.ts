// API related constants
export const API_CONSTANTS = {
  // API URLs
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7236',
  
  // Proxy endpoints
  ENDPOINTS: {
    TASKS: '/api/proxy/tasks',
    USERS: '/api/proxy/users', 
    TASK_STATUSES: '/api/proxy/task-statuses',
  },
  
  // HTTP Status codes
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },
  
  // Response messages
  MESSAGES: {
    SUCCESS: 'Action completed successfully.',
    NETWORK_ERROR: 'Network error occurred',
    UNKNOWN_ERROR: 'Unknown error occurred',
  }
} as const

// Toast configuration
export const TOAST_CONSTANTS = {
  LIMIT: 1,
  REMOVE_DELAY: 1000000, // 1000 seconds for demo purposes
  
  // Toast types
  TYPES: {
    SUCCESS: 'success',
    ERROR: 'error', 
    WARNING: 'warning',
    INFO: 'info',
  }
} as const

// UI configuration constants
export const UI_CONSTANTS = {
  // Timeouts and delays
  TIMEOUTS: {
    REDIRECT_DELAY: 3000, // 3 seconds
    AUTO_DISMISS: 5000,   // 5 seconds
    LOADING_TIMEOUT: 30000, // 30 seconds
  },
  
  // Limits
  LIMITS: {
    MAX_TITLE_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 500,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  },
  
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  }
} as const
