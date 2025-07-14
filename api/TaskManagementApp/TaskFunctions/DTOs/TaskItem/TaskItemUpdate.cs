namespace TaskFunctions.DTOs;

/// <summary>
/// Represents the data required to update a task item.
/// </summary>
public class TaskItemUpdate
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime? DueDate { get; set; }
    public int? StatusId { get; set; }
    public int? AssignedTo { get; set; }
}
