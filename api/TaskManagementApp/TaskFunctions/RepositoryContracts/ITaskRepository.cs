using TaskFunctions.DTOs;
using TaskFunctions.Entities;

namespace TaskFunctions.RepositoryContracts;

/// <summary>
/// Defines repository operations for managing task items.
/// </summary>
public interface ITaskRepository
{
    /// <summary>
    /// Retrieves all tasks, optionally filtered by status, assignee, and ordered by specified fields.
    /// </summary>
    /// <param name="statusId">Optional status ID to filter tasks.</param>
    /// <param name="assignedTo">Optional user ID to filter tasks assigned to a specific user.</param>
    /// <param name="orderBy">Optional field name to order the results by.</param>
    /// <param name="orderDir">Optional direction for ordering ("asc" or "desc").</param>
    /// <returns>A collection of <see cref="TaskItemDto"/> matching the criteria.</returns>
    Task<IEnumerable<TaskItemDto>> GetAllTasksAsync(
        int? statusId = null,
        int? assignedTo = null,
        string? orderBy = null,
        string? orderDir = null
    );

    /// <summary>
    /// Retrieves a single task by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the task.</param>
    /// <returns>The <see cref="TaskItemDto"/> if found; otherwise, <c>null</c>.</returns>
    Task<TaskItemDto?> GetTaskByIdAsync(int id);

    /// <summary>
    /// Creates a new task item.
    /// </summary>
    /// <param name="task">The <see cref="TaskItem"/> to create.</param>
    /// <returns>The created <see cref="TaskItem"/> with updated properties.</returns>
    Task<int> CreateTaskAsync(TaskItem task);

    /// <summary>
    /// Updates an existing task item.
    /// </summary>
    /// <param name="task">The <see cref="TaskItem"/> with updated values.</param>
    /// <returns><c>true</c> if the update was successful; otherwise, <c>false</c>.</returns>
    Task<bool> UpdateTaskAsync(TaskItem task);

    /// <summary>
    /// Deletes a task item by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the task to delete.</param>
    /// <returns><c>true</c> if the deletion was successful; otherwise, <c>false</c>.</returns>
    Task<bool> DeleteTaskAsync(int id);
}
