using BCrypt.Net;
using BloodLinkLK.API.Data;
using BloodLinkLK.API.DTOs;
using BloodLinkLK.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BloodLinkLK.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    // POST: api/Auth/register
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(
        RegisterDto dto)
    {
        // Validate role
        var validRoles = new[] { "Donor", "Requester" };

        if (!validRoles.Contains(dto.Role))
        {
            return BadRequest(new
            {
                message = "Role must be either Donor or Requester."
            });
        }

        // Check email
        var normalizedEmail = dto.Email.Trim().ToLower();

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == normalizedEmail);

        if (existingUser != null)
        {
            return Conflict(new
            {
                message = "An account with this email already exists."
            });
        }

        // Extra validation for donor
        if (dto.Role == "Donor")
        {
            if (string.IsNullOrWhiteSpace(dto.BloodGroup))
            {
                return BadRequest(new
                {
                    message = "Blood group is required for donors."
                });
            }

            if (string.IsNullOrWhiteSpace(dto.Location))
            {
                return BadRequest(new
                {
                    message = "Location is required for donors."
                });
            }

            var validBloodGroups = new[]
            {
                "A+", "A-",
                "B+", "B-",
                "AB+", "AB-",
                "O+", "O-"
            };

            if (!validBloodGroups.Contains(dto.BloodGroup))
            {
                return BadRequest(new
                {
                    message = "Invalid blood group."
                });
            }
        }

        // Hash password
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var user = new User
        {
            FullName = dto.FullName.Trim(),
            Email = normalizedEmail,
            PasswordHash = passwordHash,
            ContactNumber = dto.ContactNumber.Trim(),
            Role = dto.Role,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        // Automatically create donor profile
        if (dto.Role == "Donor")
        {
            var donorProfile = new DonorAvailability
            {
                UserId = user.Id,
                Name = user.FullName,
                BloodGroup = dto.BloodGroup!,
                Location = dto.Location!,
                ContactNumber = user.ContactNumber,
                Description = dto.Description,
                IsAvailable = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.DonorAvailabilities.Add(donorProfile);

            await _context.SaveChangesAsync();
        }

        var response = new AuthResponseDto
        {
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role,
            ContactNumber = user.ContactNumber,
            Message = "Registration successful."
        };

        return CreatedAtAction(
            nameof(Register),
            response
        );
    }

    // POST: api/Auth/login
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(
        LoginDto dto)
    {
        var normalizedEmail = dto.Email.Trim().ToLower();

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == normalizedEmail);

        if (user == null)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        var passwordValid = BCrypt.Net.BCrypt.Verify(
            dto.Password,
            user.PasswordHash
        );

        if (!passwordValid)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        var response = new AuthResponseDto
        {
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role,
            ContactNumber = user.ContactNumber,
            Message = "Login successful."
        };

        return Ok(response);
    }
}