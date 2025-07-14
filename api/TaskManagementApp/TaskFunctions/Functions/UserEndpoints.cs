using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using TaskFunctions.ServiceContracts;

namespace TaskFunctions.Functions;

/// <summary>
/// Azure Function endpoints for user-related operations.
/// </summary>
public class UserEndpoints
{
    private readonly ILogger<UserEndpoints> _logger;
    private readonly IUserService _userService;

    /// <summary>
    /// Initializes a new instance of the <see cref="UserEndpoints"/> class.
    /// </summary>
    /// <param name="logger">Logger instance for logging information and errors.</param>
    /// <param name="userService">Service for user-related operations.</param>
    public UserEndpoints(
        ILogger<UserEndpoints> logger,
        IUserService userService)
    {
        _logger = logger;
        _userService = userService;
    }

    /// <summary>
    /// HTTP GET endpoint to retrieve all users.
    /// </summary>
    /// <param name="req">The HTTP request data.</param>
    /// <returns>
    /// An <see cref="HttpResponseData"/> containing a <see cref="BaseResponse{T}"/> 
    /// with a list of <see cref="UserResponse"/> objects.
    /// </returns>
    [Function("GetUsers")]
    public async Task<HttpResponseData> GetAllUsers(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "users")] HttpRequestData req)
    {
        _logger.LogInformation("HTTP GET /users called");

        var usersResponse = await _userService.GetAllUsersAsync();

        var response = req.CreateResponse((System.Net.HttpStatusCode)usersResponse.StatusCode);
        await response.WriteAsJsonAsync(usersResponse);
        return response;
    }
}