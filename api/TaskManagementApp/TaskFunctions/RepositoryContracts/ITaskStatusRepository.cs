using TaskFunctions.Entities;

namespace TaskFunctions.RepositoryContracts;

/// <summary>
/// Defines methods for accessing task status data.
/// </summary>
public interface ITaskStatusRepository
{
    /// <summary>
    /// Asynchronously retrieves all available task statuses.
    /// </summary>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains a collection of <see cref="TaskItemStatus"/> objects.
    /// </returns>
    Task<IEnumerable<TaskItemStatus>> GetAllTaskStatusesAsync();
}
