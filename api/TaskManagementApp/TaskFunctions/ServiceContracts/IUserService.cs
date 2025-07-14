using TaskFunctions.DTOs;

namespace TaskFunctions.ServiceContracts;

/// <summary>
/// Defines contract for user-related operations.
/// </summary>
public interface IUserService
{
    /// <summary>
    /// Asynchronously retrieves all users.
    /// </summary>
    /// <returns>
    /// A <see cref="Task"/> representing the asynchronous operation, 
    /// containing a <see cref="BaseResponse{T}"/> with a list of <see cref="UserResponse"/> objects.
    /// </returns>
    Task<BaseResponse<List<UserResponse?>>> GetAllUsersAsync();
}
