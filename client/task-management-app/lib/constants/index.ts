// Re-export all constants from a single location
export * from './taskStatus'
export * from './app'

// Combined exports for easier importing
export { 
  TASK_STATUS_IDS, 
  TASK_STATUS_NAMES, 
  STATUS_STYLES,
  getStatusStyleById,
  getStatusStyleByName,
  isTaskCompleted 
} from './taskStatus'

export {
  API_CONSTANTS,
  TOAST_CONSTANTS,
  UI_CONSTANTS
} from './app'
