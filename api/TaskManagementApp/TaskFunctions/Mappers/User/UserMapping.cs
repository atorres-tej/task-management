using AutoMapper;
using TaskFunctions.DTOs;
using TaskFunctions.Entities;

namespace TaskFunctions.Mappers;

public class UserMapping : Profile
{
    public UserMapping()
    {
        CreateMap<User, UserResponse>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.DisplayName))
            ;
    }
}
