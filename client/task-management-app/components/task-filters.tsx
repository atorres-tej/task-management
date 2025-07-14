"use client"

import { useState } from "react"
import type { TaskFilters } from "@/types/task"
import { useTasksWithStatuses } from "@/contexts/TasksContext"
import { Button } from "@/components/ui/button"
import { Filter, X } from "lucide-react"

export default function TaskFiltersComponent() {
  // Use TasksContext for global state
  const { users, taskStatuses, filters, setFilters } = useTasksWithStatuses()
  
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key: keyof TaskFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
  }

  const clearFilters = () => {
    const defaultFilters = { orderBy: 'DueDate', orderDir: 'asc' } as TaskFilters
    setFilters(defaultFilters)
  }

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'orderBy' && value === 'DueDate') return false
    if (key === 'orderDir' && value === 'asc') return false
    return value !== undefined && value !== null
  })

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Hide' : 'Show'} Filters
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.statusId === null ? "null" : filters.statusId?.toString() || "all"}
              onChange={(e) => {
                const value = e.target.value
                if (value === 'all') {
                  handleFilterChange('statusId', undefined)
                } else if (value === 'null') {
                  handleFilterChange('statusId', null)
                } else {
                  handleFilterChange('statusId', Number(value))
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All statuses</option>
              {taskStatuses.map((status) => (
                <option key={status.Id} value={status.Id.toString()}>
                  {status.Name}
                </option>
              ))}
            </select>
          </div>

          {/* Assigned To Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
            <select
              value={filters.assignedTo?.toString() || "all"}
              onChange={(e) => {
                const value = e.target.value
                if (value === 'all') {
                  handleFilterChange('assignedTo', undefined)
                } else {
                  handleFilterChange('assignedTo', Number(value))
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All users</option>
              {users.map((user) => (
                <option key={user.Id} value={user.Id.toString()}>
                  {user.DisplayName}
                </option>
              ))}
            </select>
          </div>

          {/* Order By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={filters.orderBy || "DueDate"}
              onChange={(e) => handleFilterChange('orderBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DueDate">Due Date</option>
              <option value="Title">Title</option>
              <option value="Status">Status</option>
            </select>
          </div>

          {/* Order Direction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
            <select
              value={filters.orderDir || "asc"}
              onChange={(e) => handleFilterChange('orderDir', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
