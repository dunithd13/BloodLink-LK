using System.ComponentModel.DataAnnotations;

namespace BloodLinkLK.API.DTOs;

public class CreateBloodRequestDto
{
    [Required]
    public string BloodGroup { get; set; } = string.Empty;

    [Required]
    public string Location { get; set; } = string.Empty;

    [Required]
    public DateTime Deadline { get; set; }

    [Required]
    public string Urgency { get; set; } = "Normal";

    [Required]
    [Phone]
    public string ContactNumber { get; set; } = string.Empty;

    public string? Description { get; set; }

    public bool IsEmergency { get; set; }

    public string? RequesterName { get; set; }
}