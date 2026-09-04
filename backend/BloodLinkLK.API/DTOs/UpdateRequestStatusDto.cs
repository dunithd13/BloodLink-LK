using System.ComponentModel.DataAnnotations;

namespace BloodLinkLK.API.DTOs;

public class UpdateRequestStatusDto
{
    [Required]
    public string Status { get; set; } = string.Empty;
}