namespace TaskFunctions.DTOs;

/// <summary>
/// Base class for API responses.
/// </summary>
/// <typeparam name="T">Type of the response data.</typeparam>
public class BaseResponse<T>
{
    public int StatusCode { get; set; }
    public T? Data { get; set; }
    public string? Message { get; set; }
    public bool IsSuccess { get; set; }

    /// <summary>
    /// Constructor method for successful responses.
    /// </summary>
    /// <param name="data">Response data.</param>
    /// <param name="message">Response message.</param>
    /// <param name="statusCode">HTTP status code.</param>
    /// <returns>An instance of <see cref="BaseResponse{T}"/> with success data.</returns>
    public static BaseResponse<T> Success(T data, string message = "Action completed successfully.", int statusCode = 200)
    {
        return new BaseResponse<T> { Data = data, IsSuccess = true, Message = message, StatusCode = statusCode };
    }

    /// <summary>
    /// Constructor method for error responses.
    /// </summary>
    /// <param name="message">Error message.</param>
    /// <param name="statusCode">HTTP status code.</param>
    /// <returns>An instance of <see cref="BaseResponse{T}"/> with error data.</returns>
    public static BaseResponse<T> Fail(string message, int statusCode = 400)
    {
        return new BaseResponse<T> { Data = default, IsSuccess = false, Message = message, StatusCode = statusCode };
    }

}
