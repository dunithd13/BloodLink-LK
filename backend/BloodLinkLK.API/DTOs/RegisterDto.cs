using System.ComponentModel.DataAnnotations;

namespace BloodLinkLK.API.DTOs;

public class RegisterDto
{
    [Required]
    [StringLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [Phone]
    public string ContactNumber { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = string.Empty;

    // Required only when Role = Donor
    public string? BloodGroup { get; set; }

    public string? Location { get; set; }

    public string? Description { get; set; }
}