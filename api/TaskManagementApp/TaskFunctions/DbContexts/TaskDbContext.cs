using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;

namespace TaskFunctions.DbContexts;

/// <summary>
/// Provides database context functionality for tasks, including connection management.
/// </summary>
public class TaskDbContext
{
    private readonly IConfiguration _configuration;

    /// <summary>
    /// Initializes a new instance of the <see cref="TaskDbContext"/> class.
    /// </summary>
    /// <param name="configuration">The application configuration containing connection strings.</param>
    public TaskDbContext(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    /// <summary>
    /// Asynchronously creates and opens a database connection using the "TaskConnection" connection string.
    /// </summary>
    /// <returns>
    /// A task that represents the asynchronous operation. The task result contains an open <see cref="IDbConnection"/>.
    /// </returns>
    public async Task<IDbConnection> GetOpenConnectionAsync()
    {
        var connectionString = _configuration.GetConnectionString("TaskConnection");
        var connection = new SqlConnection(connectionString);

        await connection.OpenAsync();
        return connection;
    }
}
