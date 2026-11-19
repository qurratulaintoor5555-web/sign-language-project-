using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text.Json;
using PSL.Api.Data;
using PSL.Api.Models;

namespace PSL.Api.Controllers;

[ApiController]
[Route("api/v1/signs")]
public class SignsController(IHttpClientFactory clients, AppDbContext db, ILogger<SignsController> logger) : ControllerBase
{
    private record PredictionResponse(
        string? status,
        string? label,
        string? englishText,
        double confidence,
        bool needsRepeat,
        string? modelVersion
    );

    [HttpPost("predict-video")]
    [RequestSizeLimit(32 * 1024 * 1024)]
    public async Task<IActionResult> PredictVideo(IFormFile video, CancellationToken cancellationToken)
    {
        if (video is null || video.Length == 0)
        {
            return BadRequest(new { code = "video_required", message = "Please record a short sign clip." });
        }
        if (video.Length > 30 * 1024 * 1024)
        {
            return StatusCode(413, new { code = "video_too_large" });
        }

        using var content = new MultipartFormDataContent();
        await using var stream = video.OpenReadStream();
        using var fileContent = new StreamContent(stream);
        fileContent.Headers.ContentType = new MediaTypeHeaderValue(
            video.ContentType is { Length: > 0 } ? video.ContentType : "video/webm");
        content.Add(fileContent, "video", Path.GetFileName(video.FileName));

        var client = clients.CreateClient("AI");
        using var response = await client.PostAsync("v1/signs/predict-video", content, cancellationToken);
        var body = await response.Content.ReadAsStringAsync(cancellationToken);

        // If prediction succeeded, persist the translation record into SQL Server via EF Core
        if (response.IsSuccessStatusCode)
        {
            try
            {
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var pred = JsonSerializer.Deserialize<PredictionResponse>(body, options);
                if (pred is not null && !pred.needsRepeat && !string.IsNullOrWhiteSpace(pred.englishText))
                {
                    var record = new TranslationRecord
                    {
                        Id = Guid.NewGuid(),
                        SenderRole = "DeafMute",
                        RecognizedGloss = pred.label ?? string.Empty,
                        EnglishText = pred.englishText,
                        Confidence = pred.confidence,
                        ModelVersion = pred.modelVersion ?? "psl-lstm-v1",
                        CreatedAtUtc = DateTime.UtcNow
                    };
                    db.TranslationRecords.Add(record);
                    await db.SaveChangesAsync(cancellationToken);
                }
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Failed to persist translation log to SQL Server; continuing with response.");
            }
        }

        return new ContentResult
        {
            StatusCode = (int)response.StatusCode,
            Content = body,
            ContentType = "application/json"
        };
    }

    [HttpGet("media")]
    public IActionResult GetSignMedia([FromQuery] string gloss)
        => NotFound(new { code = "verified_media_not_available", message = "No expert-verified PSL media is registered for this gloss yet." });
}
