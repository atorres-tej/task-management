using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TaskFunctions.DbContexts;
using TaskFunctions.Filters;
using TaskFunctions.Mappers;
using TaskFunctions.Middlewares;
using TaskFunctions.Repositories;
using TaskFunctions.RepositoryContracts;
using TaskFunctions.ServiceContracts;
using TaskFunctions.Services;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication(builder =>
    {
        // Middleware de validación de token Microsoft
        builder.UseMiddleware<MicrosoftTokenValidationMiddleware>();

        // Register the global exception handling filter as middleware
        builder.UseMiddleware<ExceptionHandlingFilter>();

        // Add CORS middleware
        builder.UseMiddleware<CorsMiddleware>();
    })
    .ConfigureServices(services =>
    {
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();

        // Registro del validador y el middleware
        services.AddHttpClient<MicrosoftTokenValidator>();
        services.AddSingleton<MicrosoftTokenValidationMiddleware>();

        // Register the exception handling filter for dependency injection
        services.AddSingleton<ExceptionHandlingFilter>();

        // Register DbContext
        services.AddTransient<TaskDbContext>();

        // Register custom dependencies (Repositories)
        services.AddTransient<ITaskRepository, TaskRepository>();
        services.AddTransient<IUserRepository, UserRepository>();
        services.AddTransient<ITaskStatusRepository, TaskStatusRepository>();

        // Register custom dependencies (Services)
        services.AddTransient<ITaskService, TaskService>();
        services.AddTransient<IUserService, UserService>();
        services.AddTransient<ITaskStatusService, TaskStatusService>();

        // Register AutoMapper
        services.AddAutoMapper(cfg => cfg.AddMaps(typeof(TaskItemDtoMapping).Assembly));        
    })
    .Build();

host.Run();
