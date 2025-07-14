import { getStatusStyleById, getStatusStyleByName } from '@/lib/constants'

interface StatusBadgeProps {
  status?: string
  statusId?: number
}

export default function StatusBadge({ status, statusId }: StatusBadgeProps) {
  const getStatusStyles = (status: string, statusId?: number) => {
    // Use statusId for more reliable styling if available
    if (statusId) {
      return getStatusStyleById(statusId)
    }
    
    // Fallback to name-based logic for backward compatibility
    return getStatusStyleByName(status)
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(status || "", statusId)}`}
    >
      {status || "Unknown"}
    </span>
  )
}
