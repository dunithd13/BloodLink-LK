namespace BloodLinkLK.API.Models;

public class BloodRequest
{
    public int Id { get; set; }

    public string RequestNumber { get; set; } = string.Empty;

    public int? RequesterId { get; set; }

    public string RequesterName { get; set; } = string.Empty;

    public string ContactNumber { get; set; } = string.Empty;

    public string BloodGroup { get; set; } = string.Empty;

    public string Location { get; set; } = string.Empty;

    public DateTime Deadline { get; set; }

    public string Urgency { get; set; } = "Normal";

    public string? Description { get; set; }

    public string Status { get; set; } = "Active";

    public bool IsEmergency { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}