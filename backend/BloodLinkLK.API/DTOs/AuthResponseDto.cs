namespace BloodLinkLK.API.DTOs;

public class AuthResponseDto
{
    public int UserId { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Role { get; set; } = string.Empty;

    public string ContactNumber { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;
}