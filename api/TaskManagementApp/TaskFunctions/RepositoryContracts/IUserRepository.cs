using TaskFunctions.Entities;

namespace TaskFunctions.RepositoryContracts;

/// <summary>
/// Defines contract for user repository operations.
/// </summary>
public interface IUserRepository
{
    /// <summary>
    /// Asynchronously retrieves all users from the repository.
    /// </summary>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains an enumerable collection of <see cref="User"/> entities.
    /// </returns>
    Task<IEnumerable<User>> GetAllUsersAsync();

    /// <summary>
    /// Asynchronously retrieves a user by their external identifier.
    /// </summary>
    /// <param name="externalId">The external identifier of the user.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains the <see cref="User"/> entity if found; otherwise, <c>null</c>.
    /// </returns>
    Task<User?> GetUserByExternalIdAsync(string externalId);

    /// <summary>
    /// Asynchronously creates a new user in the repository.
    /// </summary>
    /// <param name="user">The <see cref="User"/> entity to create.</param>
    /// <returns>
    /// A task that represents the asynchronous operation.
    /// </returns>
    Task CreateUserAsync(User user);

    /// <summary>
    /// Asynchronously updates an existing user in the repository.
    /// </summary>
    /// <param name="user">The <see cref="User"/> entity to update.</param>
    /// <returns>
    /// A task that represents the asynchronous operation.
    /// </returns>
    Task UpdateUserAsync(User user);
}
