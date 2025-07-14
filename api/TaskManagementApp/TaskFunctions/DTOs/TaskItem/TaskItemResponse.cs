namespace TaskFunctions.DTOs;

/// <summary>
/// Represents the response data transfer object for a task item.
/// </summary>
public class TaskItemResponse
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public DateTime DueDate { get; set; }
    public string StatusName { get; set; } = default!;
    public string? AssignedToName { get; set; }
    public DateTime CreatedAt { get; set; }
}
