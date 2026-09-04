using BloodLinkLK.API.Data;
using BloodLinkLK.API.DTOs;
using BloodLinkLK.API.Models;
using BloodLinkLK.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BloodLinkLK.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BloodRequestsController : ControllerBase
{
    private readonly AppDbContext _context;

    public BloodRequestsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/BloodRequests
    // View current blood requests
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BloodRequest>>> GetBloodRequests()
    {
        var requests = await _context.BloodRequests
            .OrderByDescending(r => r.IsEmergency)
            .ThenBy(r => r.Deadline)
            .ToListAsync();

        return Ok(requests);
    }

    // GET: api/BloodRequests/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<BloodRequest>> GetBloodRequest(int id)
    {
        var request = await _context.BloodRequests
            .FirstOrDefaultAsync(r => r.Id == id);

        if (request == null)
        {
            return NotFound(new
            {
                message = "Blood request not found."
            });
        }

        return Ok(request);
    }

    // POST: api/BloodRequests
    // Registered requester creates a blood request
    [HttpPost]
    public async Task<ActionResult<BloodRequest>> CreateBloodRequest(
        CreateBloodRequestDto dto)
    {
        if (dto.IsEmergency)
        {
            return BadRequest(new
            {
                message = "Use /api/BloodRequests/emergency for emergency requests."
            });
        }

        if (dto.Deadline <= DateTime.UtcNow)
        {
            return BadRequest(new
            {
                message = "Deadline must be in the future."
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

        var validUrgency = new[]
        {
            "Normal",
            "High",
            "Emergency"
        };

        if (!validUrgency.Contains(dto.Urgency))
        {
            return BadRequest(new
            {
                message = "Invalid urgency level."
            });
        }

        var request = new BloodRequest
        {
            RequestNumber = GenerateRequestNumber(),
            RequesterId = null,
            RequesterName = dto.RequesterName?.Trim() ?? string.Empty,
            ContactNumber = dto.ContactNumber.Trim(),
            BloodGroup = dto.BloodGroup,
            Location = dto.Location.Trim(),
            Deadline = dto.Deadline,
            Urgency = dto.Urgency,
            Description = dto.Description?.Trim(),
            Status = "Active",
            IsEmergency = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.BloodRequests.Add(request);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetBloodRequest),
            new { id = request.Id },
            request
        );
    }

    // POST: api/BloodRequests/emergency
    // Emergency request without login
    [HttpPost("emergency")]
    public async Task<ActionResult<BloodRequest>> CreateEmergencyRequest(
        CreateBloodRequestDto dto)
    {
        if (!dto.IsEmergency)
        {
            return BadRequest(new
            {
                message = "This endpoint is only for emergency requests."
            });
        }

        if (string.IsNullOrWhiteSpace(dto.RequesterName))
        {
            return BadRequest(new
            {
                message = "Requester name is required."
            });
        }

        if (dto.Deadline <= DateTime.UtcNow)
        {
            return BadRequest(new
            {
                message = "Deadline must be in the future."
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

        var request = new BloodRequest
        {
            RequestNumber = GenerateRequestNumber(),
            RequesterId = null,
            RequesterName = dto.RequesterName.Trim(),
            ContactNumber = dto.ContactNumber.Trim(),
            BloodGroup = dto.BloodGroup,
            Location = dto.Location.Trim(),
            Deadline = dto.Deadline,
            Urgency = "Emergency",
            Description = dto.Description?.Trim(),
            Status = "Active",
            IsEmergency = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.BloodRequests.Add(request);

        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetBloodRequest),
            new { id = request.Id },
            request
        );
    }

    // GET:
    // api/BloodRequests/5/compatible-donors
    [HttpGet("{id:int}/compatible-donors")]
    public async Task<IActionResult> GetCompatibleDonors(int id)
    {
        var request = await _context.BloodRequests
            .FirstOrDefaultAsync(r => r.Id == id);

        if (request == null)
        {
            return NotFound(new
            {
                message = "Blood request not found."
            });
        }

        var compatibleGroups =
            BloodCompatibilityService.GetCompatibleDonorGroups(
                request.BloodGroup);

        var donors = await _context.DonorAvailabilities
            .Where(d =>
                d.IsAvailable &&
                compatibleGroups.Contains(d.BloodGroup) &&
                d.Location.ToLower() == request.Location.ToLower())
            .OrderBy(d => d.BloodGroup)
            .ToListAsync();

        return Ok(new
        {
            request = new
            {
                request.Id,
                request.RequestNumber,
                request.BloodGroup,
                request.Location,
                request.Deadline,
                request.Urgency,
                request.Status,
                request.IsEmergency
            },
            compatibleBloodGroups = compatibleGroups,
            donors
        });
    }

    // GET:
    // api/BloodRequests/5/compatible-donors/all-locations
    [HttpGet("{id:int}/compatible-donors/all-locations")]
    public async Task<IActionResult> GetCompatibleDonorsAllLocations(int id)
    {
        var request = await _context.BloodRequests
            .FirstOrDefaultAsync(r => r.Id == id);

        if (request == null)
        {
            return NotFound(new
            {
                message = "Blood request not found."
            });
        }

        var compatibleGroups =
            BloodCompatibilityService.GetCompatibleDonorGroups(
                request.BloodGroup);

        var donors = await _context.DonorAvailabilities
            .Where(d =>
                d.IsAvailable &&
                compatibleGroups.Contains(d.BloodGroup))
            .OrderBy(d => d.Location)
            .ThenBy(d => d.BloodGroup)
            .ToListAsync();

        return Ok(new
        {
            request = new
            {
                request.Id,
                request.RequestNumber,
                request.BloodGroup,
                request.Location,
                request.Deadline,
                request.Urgency,
                request.Status
            },
            compatibleBloodGroups = compatibleGroups,
            donors
        });
    }

    // PUT: api/BloodRequests/5/status
    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(
        int id,
        UpdateRequestStatusDto dto)
    {
        var request = await _context.BloodRequests
            .FirstOrDefaultAsync(r => r.Id == id);

        if (request == null)
        {
            return NotFound(new
            {
                message = "Blood request not found."
            });
        }

        var validStatuses = new[]
        {
            "Active",
            "Matched",
            "Fulfilled",
            "Cancelled"
        };

        if (!validStatuses.Contains(dto.Status))
        {
            return BadRequest(new
            {
                message = "Invalid request status."
            });
        }

        request.Status = dto.Status;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Blood request status updated successfully.",
            request
        });
    }

    private static string GenerateRequestNumber()
    {
        return $"BL-{DateTime.UtcNow:yyyyMMddHHmmssfff}";
    }
}