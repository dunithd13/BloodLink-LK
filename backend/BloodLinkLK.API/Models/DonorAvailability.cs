namespace BloodLinkLK.API.Models;

public class DonorAvailability
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string BloodGroup { get; set; } = string.Empty;

    public string Location { get; set; } = string.Empty;

    public string ContactNumber { get; set; } = string.Empty;

    public string? Description { get; set; }

    public bool IsAvailable { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}