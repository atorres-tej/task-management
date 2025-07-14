using TaskFunctions.DTOs;

namespace TaskFunctions.ServiceContracts;

/// <summary>
/// Service contract for managing task items.
/// </summary>
public interface ITaskService
{
    /// <summary>
    /// Retrieves all tasks with optional filtering and ordering.
    /// </summary>
    /// <param name="statusId">Optional status ID to filter tasks.</param>
    /// <param name="assignedTo">Optional user ID to filter tasks assigned to a specific user.</param>
    /// <param name="orderBy">Optional field name to order the results by.</param>
    /// <param name="orderDir">Optional direction for ordering ("asc" or "desc").</param>
    /// <returns>
    /// A <see cref="BaseResponse{T}"/> containing a list of <see cref="TaskItemResponse"/> objects.
    /// </returns>
    Task<BaseResponse<List<TaskItemResponse?>>> GetAllTasksAsync(
        int? statusId = null,
        int? assignedTo = null,
        string? orderBy = null,
        string? orderDir = null
    );

    /// <summary>
    /// Retrieves the details of a specific task by its ID.
    /// </summary>
    /// <param name="id">The unique identifier of the task.</param>
    /// <returns>
    /// A <see cref="BaseResponse{T}"/> containing a <see cref="TaskItemDetailResponse"/> object.
    /// </returns>
    Task<BaseResponse<TaskItemDetailResponse?>> GetTaskByIdAsync(int id);

    /// <summary>
    /// Creates a new task item.
    /// </summary>
    /// <param name="task">The data required to create the task.</param>
    /// <param name="createdByUserId">The user ID of the creator.</param>
    /// <returns>
    /// A <see cref="BaseResponse{T}"/> indicating success or failure.
    /// </returns>
    Task<BaseResponse<bool?>> CreateTaskAsync(TaskItemCreate task, int createdByUserId);

    /// <summary>
    /// Updates an existing task item.
    /// </summary>
    /// <param name="id">The unique identifier of the task to update.</param>
    /// <param name="task">The data to update the task with.</param>
    /// <param name="updatedByUserId">The user ID of the person performing the update.</param>
    /// <returns>
    /// A <see cref="BaseResponse{T}"/> indicating success or failure.
    /// </returns>
    Task<BaseResponse<bool?>> UpdateTaskAsync(int id, TaskItemUpdate task, int updatedByUserId);

    /// <summary>
    /// Deletes a task item by its ID.
    /// </summary>
    /// <param name="id">The unique identifier of the task to delete.</param>
    /// <returns>
    /// A <see cref="BaseResponse{T}"/> indicating success or failure.
    /// </returns>
    Task<BaseResponse<bool?>> DeleteTaskAsync(int id);
}
