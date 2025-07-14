using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker.Middleware;
using Microsoft.Extensions.Logging;
using System.Net;
using TaskFunctions.DTOs;

namespace TaskFunctions.Filters;

/// <summary>
/// Middleware for handling unhandled exceptions in Azure Functions.
/// Logs the exception and returns a standardized error response for HTTP triggers.
/// </summary>
public class ExceptionHandlingFilter : IFunctionsWorkerMiddleware
{
    private readonly ILogger<ExceptionHandlingFilter> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="ExceptionHandlingFilter"/> class.
    /// </summary>
    /// <param name="logger">The logger instance for logging errors.</param>
    public ExceptionHandlingFilter(ILogger<ExceptionHandlingFilter> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Invokes the middleware logic to handle exceptions during function execution.
    /// If an unhandled exception occurs, logs the error and returns a 500 response for HTTP requests.
    /// </summary>
    /// <param name="context">The function execution context.</param>
    /// <param name="next">The next delegate in the middleware pipeline.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception in Azure Function");

            var httpRequest = await context.GetHttpRequestDataAsync();
            if (httpRequest != null)
            {
                var response = httpRequest.CreateResponse(HttpStatusCode.InternalServerError);
                var error = BaseResponse<string>.Fail("An unexpected error occurred.", 500);
                await response.WriteAsJsonAsync(error);
                context.GetInvocationResult().Value = response;
            }
        }
    }
}
