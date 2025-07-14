using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;
using TaskFunctions.ServiceContracts;
using TaskFunctions.DTOs;
using TaskFunctions.Entities;

namespace TaskFunctions.Functions;

/// <summary>
/// Azure Function endpoints for managing task items.
/// </summary>
public class TaskEndpoints
{
    private readonly ILogger<TaskEndpoints> _logger;
    private readonly ITaskService _taskService;

    /// <summary>
    /// Initializes a new instance of the <see cref="TaskEndpoints"/> class.
    /// </summary>
    /// <param name="logger">Logger instance for logging.</param>
    /// <param name="taskService">Service for task operations.</param>
    public TaskEndpoints(
        ILogger<TaskEndpoints> logger,
        ITaskService taskService)
    {
        _logger = logger;
        _taskService = taskService;
    }

    /// <summary>
    /// Retrieves all tasks, optionally filtered and ordered.
    /// </summary>
    /// <param name="req">HTTP request data.</param>
    /// <returns>HTTP response containing a list of tasks.</returns>
    [Function("GetTasks")]
    public async Task<HttpResponseData> GetAllTasks(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "tasks")] HttpRequestData req)
    {
        _logger.LogInformation("HTTP GET /tasks called");

        var query = System.Web.HttpUtility.ParseQueryString(req.Url.Query);
        int? statusId = int.TryParse(query.Get("statusId"), out var sId) ? sId : null;
        int? assignedTo = int.TryParse(query.Get("assignedTo"), out var aId) ? aId : null;
        string? orderBy = query.Get("orderBy");
        string? orderDir = query.Get("orderDir");

        var tasks = await _taskService.GetAllTasksAsync(statusId, assignedTo, orderBy, orderDir);

        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(tasks);
        return response;
    }

    /// <summary>
    /// Retrieves a task by its unique identifier.
    /// </summary>
    /// <param name="req">HTTP request data.</param>
    /// <param name="id">Task identifier.</param>
    /// <returns>HTTP response containing the task details.</returns>
    [Function("GetTaskById")]
    public async Task<HttpResponseData> GetTaskById(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "tasks/{id:int}")] HttpRequestData req,
        int id)
    {
        _logger.LogInformation($"HTTP GET /tasks/{id} called");

        var result = await _taskService.GetTaskByIdAsync(id);

        var response = req.CreateResponse((HttpStatusCode)result.StatusCode);
        await response.WriteAsJsonAsync(result);
        return response;
    }

    /// <summary>
    /// Creates a new task item.
    /// </summary>
    /// <param name="req">HTTP request data containing the task details.</param>
    /// <returns>HTTP response indicating the result of the creation operation.</returns>
    [Function("CreateTask")]
    public async Task<HttpResponseData> CreateTask(
    [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "tasks")] HttpRequestData req,
    FunctionContext context)
    {
        var user = context.Items["CurrentUser"] as User;
        if (user == null)
        {
            var res = req.CreateResponse(System.Net.HttpStatusCode.Unauthorized);
            await res.WriteStringAsync("Unauthorized");
            return res;
        }

        var taskCreateDto = await req.ReadFromJsonAsync<TaskItemCreate>();
        if (taskCreateDto == null)
        {
            var res = req.CreateResponse(System.Net.HttpStatusCode.BadRequest);
            await res.WriteStringAsync("Invalid task data");
            return res;
        }

        var result = await _taskService.CreateTaskAsync(taskCreateDto, user.Id);

        var response = req.CreateResponse((System.Net.HttpStatusCode)result.StatusCode);
        await response.WriteAsJsonAsync(result);
        return response;
    }

    /// <summary>
    /// Updates an existing task item.
    /// </summary>
    /// <param name="req">HTTP request data containing the updated task details.</param>
    /// <param name="id">Task identifier.</param>
    /// <returns>HTTP response indicating the result of the update operation.</returns>
    [Function("UpdateTask")]
    public async Task<HttpResponseData> UpdateTask(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "tasks/{id:int}")] HttpRequestData req,
        int id,
        FunctionContext context)
    {
        _logger.LogInformation($"HTTP PUT /tasks/{id} called");

        var user = context.Items["CurrentUser"] as User;
        if (user == null)
        {
            var res = req.CreateResponse(HttpStatusCode.Unauthorized);
            await res.WriteStringAsync("Unauthorized");
            return res;
        }

        var body = await req.ReadAsStringAsync();
        var taskUpdate = JsonSerializer.Deserialize<TaskItemUpdate>(body, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (taskUpdate == null)
        {
            var errorResponse = req.CreateResponse(HttpStatusCode.BadRequest);
            await errorResponse.WriteAsJsonAsync(BaseResponse<bool?>.Fail("Invalid request body.", 400));
            return errorResponse;
        }

        var result = await _taskService.UpdateTaskAsync(id, taskUpdate, user.Id);
        var response = req.CreateResponse((HttpStatusCode)result.StatusCode);
        await response.WriteAsJsonAsync(result);
        return response;
    }

    /// <summary>
    /// Deletes a task item by its unique identifier.
    /// </summary>
    /// <param name="req">HTTP request data.</param>
    /// <param name="id">Task identifier.</param>
    /// <returns>HTTP response indicating the result of the deletion operation.</returns>
    [Function("DeleteTask")]
    public async Task<HttpResponseData> DeleteTask(
        [HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "tasks/{id:int}")] HttpRequestData req,
        int id)
    {
        _logger.LogInformation($"HTTP DELETE /tasks/{id} called");

        var result = await _taskService.DeleteTaskAsync(id);
        var response = req.CreateResponse((HttpStatusCode)result.StatusCode);
        await response.WriteAsJsonAsync(result);
        return response;
    }
}
