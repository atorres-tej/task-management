namespace TaskFunctions.Entities
{
    /// <summary>
    /// Represents a task item with details such as title, description, due date, status, creator, and assignee.
    /// </summary>
    public class TaskItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = default!;
        public string? Description { get; set; }
        public DateTime DueDate { get; set; }
        public int StatusId { get; set; }
        public int? AssignedTo { get; set; }
        public int CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
