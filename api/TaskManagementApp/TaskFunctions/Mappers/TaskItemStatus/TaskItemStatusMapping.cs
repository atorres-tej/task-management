using AutoMapper;
using TaskFunctions.DTOs;
using TaskFunctions.Entities;

namespace TaskFunctions.Mappers;

public class TaskItemStatusMapping : Profile
{
    public TaskItemStatusMapping()
    {
        CreateMap<TaskItemStatus, TaskItemStatusResponse>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            ;
    }
}
