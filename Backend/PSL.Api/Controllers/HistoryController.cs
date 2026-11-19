using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PSL.Api.Data;
using PSL.Api.Models;

namespace PSL.Api.Controllers;

[ApiController]
[Route("api/v1/history")]
public class HistoryController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] int limit = 50, CancellationToken cancellationToken = default)
    {
        try
        {
            var records = await db.TranslationRecords
                .OrderByDescending(r => r.CreatedAtUtc)
                .Take(Math.Min(limit, 200))
                .ToListAsync(cancellationToken);
            return Ok(records);
        }
        catch (Exception ex)
        {
            // Graceful fallback if database connection is pending localdb setup
            return Ok(new
            {
                status = "db_offline_or_initializing",
                message = ex.Message,
                data = Array.Empty<TranslationRecord>()
            });
        }
    }

    [HttpPost]
    public async Task<IActionResult> SaveRecord([FromBody] TranslationRecord record, CancellationToken cancellationToken)
    {
        try
        {
            record.Id = Guid.NewGuid();
            record.CreatedAtUtc = DateTime.UtcNow;
            db.TranslationRecords.Add(record);
            await db.SaveChangesAsync(cancellationToken);
            return CreatedAtAction(nameof(Get), new { id = record.Id }, record);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { code = "db_save_failed", message = ex.Message });
        }
    }
}
