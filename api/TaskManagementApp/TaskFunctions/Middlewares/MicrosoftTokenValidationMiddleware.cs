using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker.Middleware;
using Microsoft.Extensions.Caching.Memory;
using System.Threading.Tasks;
using TaskFunctions.Entities;
using TaskFunctions.RepositoryContracts;
using TaskFunctions.Services;

public class MicrosoftTokenValidationMiddleware : IFunctionsWorkerMiddleware
{
    private readonly MicrosoftTokenValidator _validator;
    private readonly IUserRepository _userRepository;
    private readonly IMemoryCache _cache;

    public MicrosoftTokenValidationMiddleware(
        MicrosoftTokenValidator validator,
        IUserRepository userRepository,
        IMemoryCache cache)
    {
        _validator = validator;
        _userRepository = userRepository;
        _cache = cache;
    }

    public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        var req = await context.GetHttpRequestDataAsync();
        var authHeader = req?.Headers.GetValues("Authorization").FirstOrDefault();

        if (authHeader == null || !authHeader.StartsWith("Bearer "))
        {
            var res = req?.CreateResponse(System.Net.HttpStatusCode.Unauthorized);
            context.GetInvocationResult().Value = res;
            return;
        }

        var token = authHeader.Substring("Bearer ".Length);

        if (_cache.TryGetValue(token, out User? cachedUser) && cachedUser != null)
        {
            context.Items["CurrentUser"] = cachedUser;
            await next(context);
            return;
        }

        var (isValid, externalId, displayName, email) = await _validator.ValidateAndGetUserAsync(token);

        if (!isValid || string.IsNullOrEmpty(externalId) || string.IsNullOrEmpty(email))
        {
            var res = req?.CreateResponse(System.Net.HttpStatusCode.Unauthorized);
            context.GetInvocationResult().Value = res;
            return;
        }

        var user = await _userRepository.GetUserByExternalIdAsync(externalId);
        if (user == null)
        {
            user = new User
            {
                ExternalId = externalId,
                DisplayName = displayName ?? string.Empty,
                Email = email,
                CreatedAt = DateTime.UtcNow
            };
            await _userRepository.CreateUserAsync(user);
        }
        else
        {
            bool updated = false;
            if (user.DisplayName != displayName)
            {
                user.DisplayName = displayName ?? string.Empty;
                updated = true;
            }
            if (user.Email != email)
            {
                user.Email = email;
                updated = true;
            }
            if (updated)
            {
                await _userRepository.UpdateUserAsync(user);
            }
        }
        
        // Guarda el usuario en el cache por 5 minutos
        _cache.Set(token, user, TimeSpan.FromMinutes(5));
        context.Items["CurrentUser"] = user;

        await next(context);
    }
}