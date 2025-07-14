using Dapper;
using System.Data;
using TaskFunctions.DbContexts;
using TaskFunctions.Entities;
using TaskFunctions.RepositoryContracts;

namespace TaskFunctions.Repositories;

/// <summary>
/// Repository for accessing task status data from the database.
/// </summary>
internal class TaskStatusRepository : ITaskStatusRepository
{
    private readonly TaskDbContext _dbContext;

    /// <summary>
    /// Initializes a new instance of the <see cref="TaskStatusRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context used for data access.</param>
    public TaskStatusRepository(TaskDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Asynchronously retrieves all available task statuses from the database.
    /// </summary>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains a collection of <see cref="TaskItemStatus"/> objects.
    /// </returns>
    public async Task<IEnumerable<TaskItemStatus>> GetAllTaskStatusesAsync()
    {
        using (var connection = await _dbContext.GetOpenConnectionAsync())
        {
            var statuses = await connection.QueryAsync<TaskItemStatus>(
                "GetTaskStatuses",
                commandType: CommandType.StoredProcedure
            );

            return statuses;
        }
    }
}
