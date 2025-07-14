using AutoMapper;
using TaskFunctions.DTOs;
using TaskFunctions.Entities;

namespace TaskFunctions.Mappers;

public class TaskItemCreateMapping : Profile
{
    public TaskItemCreateMapping()
    {
        CreateMap<TaskItemCreate, TaskItem>()
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
            .ForMember(dest => dest.DueDate, opt => opt.MapFrom(src => src.DueDate))
            .ForMember(dest => dest.AssignedTo, opt => opt.MapFrom(src => src.AssignedTo))
            ;
    }
}
