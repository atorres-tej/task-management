using AutoMapper;
using TaskFunctions.DTOs;
using TaskFunctions.Entities;
using TaskFunctions.Enums;
using TaskFunctions.RepositoryContracts;
using TaskFunctions.ServiceContracts;

namespace TaskFunctions.Services;

/// <summary>
/// Service implementation for managing task items.
/// </summary>
internal class TaskService : ITaskService
{
    /// <summary>
    /// Repository for task data access.
    /// </summary>
    private readonly ITaskRepository _taskRepository;

    /// <summary>
    /// Mapper for converting between entities and DTOs.
    /// </summary>
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="TaskService"/> class.
    /// </summary>
    /// <param name="taskRepository">The repository for task data access.</param>
    /// <param name="mapper">The mapper for DTO/entity conversion.</param>
    public TaskService(ITaskRepository taskRepository, IMapper mapper)
    {
        _taskRepository = taskRepository;
        _mapper = mapper;
    }

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
    public async Task<BaseResponse<List<TaskItemResponse?>>> GetAllTasksAsync(
        int? statusId = null,
        int? assignedTo = null,
        string? orderBy = null,
        string? orderDir = null)
    {
        var tasks = await _taskRepository.GetAllTasksAsync(statusId, assignedTo, orderBy, orderDir);
        var responseList = tasks
            .Select(t => _mapper.Map<TaskItemResponse?>(t))
            .ToList();
        return BaseResponse<List<TaskItemResponse?>>.Success(responseList);
    }

    /// <summary>
    /// Retrieves the details of a specific task by its ID.
    /// </summary>
    /// <param name="id">The unique identifier of the task.</param>
    /// <returns>
    /// A <see cref="BaseResponse{T}"/> containing a <see cref="TaskItemDetailResponse"/> object.
    /// </returns>
    public async Task<BaseResponse<TaskItemDetailResponse?>> GetTaskByIdAsync(int id)
    {
        var task = await _taskRepository.GetTaskByIdAsync(id);
        if (task == null)
            return BaseResponse<TaskItemDetailResponse?>.Fail("Task not found.", 404);

        var response = _mapper.Map<TaskItemDetailResponse?>(task);
        return BaseResponse<TaskItemDetailResponse?>.Success(response);
    }

    /// <summary>
    /// Creates a new task item.
    /// </summary>
    /// <param name="task">The data required to create the task.</param>
    /// <param name="createdByUserId">The user ID of the creator.</param>
    /// <returns>
    /// A <see cref="BaseResponse{T}"/> indicating success or failure.
    /// </returns>
    public async Task<BaseResponse<bool?>> CreateTaskAsync(TaskItemCreate task, int createdByUserId)
    {
        // Map TaskItemCreate to TaskItem
        var entity = _mapper.Map<TaskItem>(task);

        entity.StatusId = (int)TaskItemStatusEnum.Pending;
        entity.CreatedBy = createdByUserId;

        var newId = await _taskRepository.CreateTaskAsync(entity);
        var createdTask = await _taskRepository.GetTaskByIdAsync(newId);

        if (createdTask == null)
            return BaseResponse<bool?>.Fail("Task creation failed.", 400);

        return BaseResponse<bool?>.Success(true, "Task created successfully.", 201);
    }

    /// <summary>
    /// Updates an existing task item.
    /// </summary>
    /// <param name="id">The unique identifier of the task to update.</param>
    /// <param name="task">The data to update the task with.</param>
    /// <param name="updatedByUserId">The user ID of the person performing the update.</param>
    /// <returns>
    /// A <see cref="BaseResponse{T}"/> indicating success or failure.
    /// </returns>
    public async Task<BaseResponse<bool?>> UpdateTaskAsync(int id, TaskItemUpdate task, int updatedByUserId)
    {
        var existingTask = await _taskRepository.GetTaskByIdAsync(id);
        if (existingTask == null)
            return BaseResponse<bool?>.Fail("Task not found.", 404);

        // Map updates
        if (!string.IsNullOrEmpty(task.Title))
            existingTask.Title = task.Title;
        if (!string.IsNullOrEmpty(task.Description))
            existingTask.Description = task.Description;
        if (task.DueDate.HasValue)
            existingTask.DueDate = task.DueDate.Value;
        if (task.StatusId.HasValue)
            existingTask.StatusId = task.StatusId.Value;
        if (task.AssignedTo.HasValue)
            existingTask.AssignedTo = task.AssignedTo.Value;

        existingTask.UpdatedBy = updatedByUserId;

        var result = await _taskRepository.UpdateTaskAsync(_mapper.Map<TaskItem>(existingTask));
        if (!result)
            return BaseResponse<bool?>.Fail("Task update failed.", 400);

        return BaseResponse<bool?>.Success(true, "Task updated successfully.", 200);
    }

    /// <summary>
    /// Deletes a task item by its ID.
    /// </summary>
    /// <param name="id">The unique identifier of the task to delete.</param>
    /// <returns>
    /// A <see cref="BaseResponse{T}"/> indicating success or failure.
    /// </returns>
    public async Task<BaseResponse<bool?>> DeleteTaskAsync(int id)
    {
        var existingTask = await _taskRepository.GetTaskByIdAsync(id);
        if (existingTask == null)
            return BaseResponse<bool?>.Fail("Task not found.", 404);

        var result = await _taskRepository.DeleteTaskAsync(id);
        if (!result)
            return BaseResponse<bool?>.Fail("Task deletion failed.", 400);

        return BaseResponse<bool?>.Success(true, "Task deleted successfully.", 200);
    }
}