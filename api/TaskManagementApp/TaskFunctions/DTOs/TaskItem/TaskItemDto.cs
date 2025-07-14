namespace TaskFunctions.DTOs;

/// <summary>
/// Data Transfer Object for task items, including additional fields from the stored procedure.
/// </summary>
public class TaskItemDto
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public DateTime DueDate { get; set; }
    public int StatusId { get; set; }
    public string StatusName { get; set; } = default!;
    public int? AssignedTo { get; set; }
    public string? AssignedToName { get; set; }
    public int CreatedBy { get; set; }
    public int? UpdatedBy { get; set; }        
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
