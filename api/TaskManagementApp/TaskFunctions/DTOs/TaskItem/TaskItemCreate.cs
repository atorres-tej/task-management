namespace TaskFunctions.DTOs;

/// <summary>
/// Represents the data required to create a new task item.
/// </summary>
public class TaskItemCreate
{
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public DateTime DueDate { get; set; }
    public int? AssignedTo { get; set; }
}
