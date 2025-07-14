using Dapper;
using TaskFunctions.DbContexts;
using TaskFunctions.Entities;
using TaskFunctions.RepositoryContracts;
using System.Data;

namespace TaskFunctions.Repositories;

/// <summary>
/// Provides repository operations for <see cref="User"/> entities using Dapper and stored procedures.
/// </summary>
internal class UserRepository : IUserRepository
{
    private readonly TaskDbContext _dbContext;

    /// <summary>
    /// Initializes a new instance of the <see cref="UserRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context used for connection management.</param>
    public UserRepository(TaskDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Asynchronously retrieves all users from the database using the "GetUsers" stored procedure.
    /// </summary>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains an enumerable collection of <see cref="User"/> entities.
    /// </returns>
    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
        using (var connection = await _dbContext.GetOpenConnectionAsync())
        {
            var users = await connection.QueryAsync<User>(
                "GetUsers",
                commandType: CommandType.StoredProcedure
            );

            return users;
        }
    }

    /// <summary>
    /// Asynchronously retrieves a user by their external identifier using the "GetUserByExternalId" stored procedure.
    /// </summary>
    /// <param name="externalId">The external identifier of the user.</param>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains the <see cref="User"/> entity if found; otherwise, <c>null</c>.
    /// </returns>
    public async Task<User?> GetUserByExternalIdAsync(string externalId)
    {
        using (var connection = await _dbContext.GetOpenConnectionAsync())
        {
            var parameters = new { ExternalId = externalId };
            var user = await connection.QueryFirstOrDefaultAsync<User>(
                "GetUserByExternalId",
                parameters,
                commandType: CommandType.StoredProcedure
            );
            return user;
        }
    }

    /// <summary>
    /// Asynchronously creates a new user in the database using the "CreateUser" stored procedure.
    /// </summary>
    /// <param name="user">The <see cref="User"/> entity to create.</param>
    /// <returns>
    /// A task that represents the asynchronous operation.
    /// </returns>
    public async Task CreateUserAsync(User user)
    {
        using (var connection = await _dbContext.GetOpenConnectionAsync())
        {
            var parameters = new
            {
                ExternalId = user.ExternalId,
                DisplayName = user.DisplayName,
                Email = user.Email
            };

            await connection.ExecuteScalarAsync<int>(
                "CreateUser",
                parameters,
                commandType: CommandType.StoredProcedure
            );
        }
    }

    /// <summary>
    /// Asynchronously updates an existing user in the database using the "UpdateUser" stored procedure.
    /// </summary>
    /// <param name="user">The <see cref="User"/> entity to update.</param>
    /// <returns>
    /// A task that represents the asynchronous operation.
    /// </returns>
    public async Task UpdateUserAsync(User user)
    {
        using (var connection = await _dbContext.GetOpenConnectionAsync())
        {
            var parameters = new
            {
                Id = user.Id,
                ExternalId = user.ExternalId,
                DisplayName = user.DisplayName,
                Email = user.Email
            };

            await connection.ExecuteAsync(
                "UpdateUser",
                parameters,
                commandType: CommandType.StoredProcedure
            );
        }
    }
}
