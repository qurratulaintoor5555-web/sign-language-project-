using Microsoft.EntityFrameworkCore;
using PSL.Api.Models;

namespace PSL.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<TranslationRecord> TranslationRecords => Set<TranslationRecord>();
    public DbSet<CommunicationSession> CommunicationSessions => Set<CommunicationSession>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<TranslationRecord>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.SenderRole).IsRequired().HasMaxLength(50);
            entity.Property(e => e.RecognizedGloss).HasMaxLength(100);
            entity.Property(e => e.EnglishText).IsRequired().HasMaxLength(500);
            entity.Property(e => e.UrduText).HasMaxLength(500);
            entity.Property(e => e.ModelVersion).HasMaxLength(50);
            entity.HasIndex(e => e.CreatedAtUtc);
        });

        modelBuilder.Entity<CommunicationSession>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.SessionTitle).HasMaxLength(200);
            entity.HasIndex(e => e.StartedAtUtc);
        });
    }
}
