namespace TaskFunctions.Entities;

/// <summary>
/// Represents a user entity in the system.
/// </summary>
public class User
{
    public int Id { get; set; }
    public string ExternalId { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
