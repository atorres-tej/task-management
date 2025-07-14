using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using TaskFunctions.ServiceContracts;

namespace TaskFunctions.Functions;

/// <summary>
/// Azure Function endpoints for retrieving task status information.
/// </summary>
public class TaskStatusEndpoints
{
    private readonly ILogger<TaskStatusEndpoints> _logger;
    private readonly ITaskStatusService _taskStatusService;

    /// <summary>
    /// Initializes a new instance of the <see cref="TaskStatusEndpoints"/> class.
    /// </summary>
    /// <param name="logger">Logger instance for logging information and errors.</param>
    /// <param name="taskStatusService">Service for retrieving task status data.</param>
    public TaskStatusEndpoints(
        ILogger<TaskStatusEndpoints> logger,
        ITaskStatusService taskStatusService)
    {
        _logger = logger;
        _taskStatusService = taskStatusService;
    }

    /// <summary>
    /// HTTP GET endpoint for retrieving all available task statuses.
    /// </summary>
    /// <param name="req">The HTTP request data.</param>
    /// <returns>
    /// An <see cref="HttpResponseData"/> containing a <see cref="BaseResponse{T}"/> with a list of <see cref="TaskItemStatusResponse"/> objects.
    /// </returns>
    [Function("GetTaskStatuses")]
    public async Task<HttpResponseData> GetAllTaskStatusesAsync(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "task-statuses")] HttpRequestData req)
    {
        _logger.LogInformation("HTTP GET /task-statuses called");

        var statusesResponse = await _taskStatusService.GetAllTaskStatusesAsync();

        var response = req.CreateResponse((System.Net.HttpStatusCode)statusesResponse.StatusCode);
        await response.WriteAsJsonAsync(statusesResponse);
        return response;
    }
}