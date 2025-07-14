using AutoMapper;
using TaskFunctions.DTOs;
using TaskFunctions.RepositoryContracts;
using TaskFunctions.ServiceContracts;

namespace TaskFunctions.Services;

/// <summary>
/// Service implementation for user-related operations.
/// </summary>
internal class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="UserService"/> class.
    /// </summary>
    /// <param name="userRepository">The user repository instance.</param>
    /// <param name="mapper">The AutoMapper instance for mapping objects.</param>
    public UserService(IUserRepository userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }

    /// <summary>
    /// Asynchronously retrieves all users and maps them to response objects.
    /// </summary>
    /// <returns>
    /// A <see cref="Task"/> representing the asynchronous operation, 
    /// containing a <see cref="BaseResponse{T}"/> with a list of <see cref="UserResponse"/> objects.
    /// </returns>
    public async Task<BaseResponse<List<UserResponse?>>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllUsersAsync();
        var responseList = users
            .Select(u => _mapper.Map<UserResponse?>(u))
            .ToList();
        return BaseResponse<List<UserResponse?>>.Success(responseList);
    }
}
