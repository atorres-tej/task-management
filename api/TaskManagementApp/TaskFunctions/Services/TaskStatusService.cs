using AutoMapper;
using TaskFunctions.DTOs;
using TaskFunctions.RepositoryContracts;
using TaskFunctions.ServiceContracts;

namespace TaskFunctions.Services;

/// <summary>
/// Provides services for retrieving task status information.
/// </summary>
internal class TaskStatusService : ITaskStatusService
{
    private readonly ITaskStatusRepository _taskStatusRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="TaskStatusService"/> class.
    /// </summary>
    /// <param name="taskStatusRepository">The repository for accessing task status data.</param>
    /// <param name="mapper">The mapper for converting entities to DTOs.</param>
    public TaskStatusService(ITaskStatusRepository taskStatusRepository, IMapper mapper)
    {
        _taskStatusRepository = taskStatusRepository;
        _mapper = mapper;
    }

    /// <summary>
    /// Asynchronously retrieves all available task statuses.
    /// </summary>
    /// <returns>
    /// A <see cref="BaseResponse{T}"/> containing a list of <see cref="TaskItemStatusResponse"/> objects representing task statuses.
    /// </returns>
    public async Task<BaseResponse<List<TaskItemStatusResponse?>>> GetAllTaskStatusesAsync()
    {
        var taskStatuses = await _taskStatusRepository.GetAllTaskStatusesAsync();
        var responseList = taskStatuses
            .Select(ts => _mapper.Map<TaskItemStatusResponse?>(ts))
            .ToList();
        return BaseResponse<List<TaskItemStatusResponse?>>.Success(responseList);
    }
}
