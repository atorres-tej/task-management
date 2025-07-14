using Dapper;
using TaskFunctions.DbContexts;
using TaskFunctions.DTOs;
using TaskFunctions.Entities;
using TaskFunctions.RepositoryContracts;
using System.Data;

namespace TaskFunctions.Repositories;

/// <summary>
/// Repository implementation for managing task items using Dapper and stored procedures.
/// </summary>
internal class TaskRepository : ITaskRepository
{
    private readonly TaskDbContext _dbContext;

    /// <summary>
    /// Initializes a new instance of the <see cref="TaskRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context for task operations.</param>
    public TaskRepository(TaskDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Retrieves all tasks, optionally filtered by status, assignee, and ordered by specified fields.
    /// </summary>
    /// <param name="statusId">Optional status ID to filter tasks.</param>
    /// <param name="assignedTo">Optional user ID to filter tasks assigned to a specific user.</param>
    /// <param name="orderBy">Optional field name to order the results by.</param>
    /// <param name="orderDir">Optional direction for ordering ("asc" or "desc").</param>
    /// <returns>A collection of <see cref="TaskItemDto"/> matching the criteria.</returns>
    public async Task<IEnumerable<TaskItemDto>> GetAllTasksAsync(
        int? statusId = null,
        int? assignedTo = null,
        string? orderBy = null,
        string? orderDir = null)
    {
        using (var connection = await _dbContext.GetOpenConnectionAsync())
        {
            var parameters = new
            {
                StatusId = statusId,
                AssignedTo = assignedTo,
                OrderBy = orderBy ?? "DueDate",
                OrderDir = orderDir ?? "ASC"
            };

            var tasks = await connection.QueryAsync<TaskItemDto>(
                "GetTasks",
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return tasks;
        }
    }

    /// <summary>
    /// Retrieves a single task by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the task.</param>
    /// <returns>The <see cref="TaskItemDto"/> if found; otherwise, <c>null</c>.</returns>
    public async Task<TaskItemDto?> GetTaskByIdAsync(int id)
    {
        using (var connection = await _dbContext.GetOpenConnectionAsync())
        {
            var parameters = new { Id = id };
            var task = await connection.QueryFirstOrDefaultAsync<TaskItemDto>(
                "GetTaskById",
                parameters,
                commandType: System.Data.CommandType.StoredProcedure
            );
            return task;
        }
    }

    /// <summary>
    /// Creates a new task item.
    /// </summary>
    /// <param name="task">The <see cref="TaskItem"/> to create.</param>
    /// <returns>The created <see cref="TaskItem"/> with updated properties.</returns>
    public async Task<int> CreateTaskAsync(TaskItem task)
    {
        using (var connection = await _dbContext.GetOpenConnectionAsync())
        {
            var parameters = new
            {
                Title = task.Title,
                Description = task.Description,
                DueDate = task.DueDate,
                StatusId = task.StatusId,
                CreatedBy = task.CreatedBy,
                AssignedTo = task.AssignedTo
            };

            var newId = await connection.ExecuteScalarAsync<int>(
                "CreateTask",
                parameters,
                commandType: System.Data.CommandType.StoredProcedure
            );

            return newId;
        }
    }

    /// <summary>
    /// Updates an existing task item.
    /// </summary>
    /// <param name="task">The <see cref="TaskItem"/> with updated values.</param>
    /// <returns><c>true</c> if the update was successful; otherwise, <c>false</c>.</returns>
    public async Task<bool> UpdateTaskAsync(TaskItem task)
    {
        using (var connection = await _dbContext.GetOpenConnectionAsync())
        {
            var parameters = new
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                DueDate = task.DueDate,
                StatusId = task.StatusId,
                UpdatedBy = task.UpdatedBy,
                AssignedTo = task.AssignedTo
            };

            var affectedRows = await connection.ExecuteAsync(
                "UpdateTask",
                parameters,
                commandType: System.Data.CommandType.StoredProcedure
            );

            return affectedRows > 0;
        }
    }

    /// <summary>
    /// Deletes a task item by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the task to delete.</param>
    /// <returns><c>true</c> if the deletion was successful; otherwise, <c>false</c>.</returns>
    public async Task<bool> DeleteTaskAsync(int id)
    {
        using (var connection = await _dbContext.GetOpenConnectionAsync())
        {
            var parameters = new { Id = id };
            var affectedRows = await connection.ExecuteAsync(
                "DeleteTask",
                parameters,
                commandType: System.Data.CommandType.StoredProcedure
            );
            return affectedRows > 0;
        }
    }
}