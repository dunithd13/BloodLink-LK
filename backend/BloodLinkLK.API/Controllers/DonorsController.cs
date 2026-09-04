using BloodLinkLK.API.Data;
using BloodLinkLK.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BloodLinkLK.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DonorsController : ControllerBase
{
    private readonly AppDbContext _context;

    public DonorsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Donors
    // Search available donors
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DonorAvailability>>> GetDonors(
        [FromQuery] string? bloodGroup,
        [FromQuery] string? location)
    {
        var query = _context.DonorAvailabilities
            .Where(d => d.IsAvailable)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(bloodGroup))
        {
            query = query.Where(d =>
                d.BloodGroup == bloodGroup);
        }

        if (!string.IsNullOrWhiteSpace(location))
        {
            var searchLocation = location.Trim().ToLower();

            query = query.Where(d =>
                d.Location.ToLower().Contains(searchLocation));
        }

        var donors = await query
            .OrderBy(d => d.Location)
            .ThenBy(d => d.BloodGroup)
            .ToListAsync();

        return Ok(donors);
    }

    // GET: api/Donors/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<DonorAvailability>> GetDonor(int id)
    {
        var donor = await _context.DonorAvailabilities
            .FirstOrDefaultAsync(d => d.Id == id);

        if (donor == null)
        {
            return NotFound(new
            {
                message = "Donor not found."
            });
        }

        return Ok(donor);
    }

    // PUT: api/Donors/5/availability
    [HttpPut("{id:int}/availability")]
    public async Task<IActionResult> UpdateAvailability(
        int id,
        [FromBody] bool isAvailable)
    {
        var donor = await _context.DonorAvailabilities
            .FirstOrDefaultAsync(d => d.Id == id);

        if (donor == null)
        {
            return NotFound(new
            {
                message = "Donor not found."
            });
        }

        donor.IsAvailable = isAvailable;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Donor availability updated successfully.",
            donor
        });
    }

    // DELETE: api/Donors/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteDonor(int id)
    {
        var donor = await _context.DonorAvailabilities
            .FirstOrDefaultAsync(d => d.Id == id);

        if (donor == null)
        {
            return NotFound(new
            {
                message = "Donor not found."
            });
        }

        _context.DonorAvailabilities.Remove(donor);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Donor deleted successfully."
        });
    }
}