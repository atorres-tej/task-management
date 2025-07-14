using TaskFunctions.DTOs;

namespace TaskFunctions.ServiceContracts;

/// <summary>
/// Defines contract for retrieving task status information.
/// </summary>
public interface ITaskStatusService
{
    /// <summary>
    /// Asynchronously retrieves all available task statuses.
    /// </summary>
    /// <returns>
    /// A <see cref="BaseResponse{T}"/> containing a list of <see cref="TaskItemStatusResponse"/> objects representing task statuses.
    /// </returns>
    Task<BaseResponse<List<TaskItemStatusResponse?>>> GetAllTaskStatusesAsync();
}
