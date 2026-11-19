using System;

namespace PSL.Api.Models;

public class TranslationRecord
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string SenderRole { get; set; } = "DeafMute"; // "DeafMute" or "Hearing"
    public string RecognizedGloss { get; set; } = string.Empty;
    public string EnglishText { get; set; } = string.Empty;
    public string? UrduText { get; set; }
    public double Confidence { get; set; }
    public string ModelVersion { get; set; } = "psl-lstm-v1";
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}

public class CommunicationSession
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string SessionTitle { get; set; } = "Bilateral Dialogue Session";
    public DateTime StartedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? EndedAtUtc { get; set; }
    public int TotalExchanges { get; set; }
}
