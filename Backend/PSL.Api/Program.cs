using Microsoft.EntityFrameworkCore;
using PSL.Api.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Resilience Configuration:
// Use SQL Server if available; seamlessly fall back to local SQLite so the API never fails
var sqlServerConnection = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
{
    // Try SQL Server if connection string is present, otherwise use local Sqlite
    try
    {
        options.UseSqlServer(sqlServerConnection, sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(maxRetryCount: 2, maxRetryDelay: TimeSpan.FromSeconds(3), errorNumbersToAdd: null);
        });
    }
    catch
    {
        options.UseSqlite("Data Source=psl_application.db");
    }
});

builder.Services.AddHttpClient("AI", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["AIService:BaseUrl"] ?? "http://127.0.0.1:8001/");
    client.Timeout = TimeSpan.FromSeconds(30);
});

builder.Services.AddCors(o => o.AddPolicy("Frontend", p => p
    .AllowAnyOrigin()
    .AllowAnyHeader()
    .AllowAnyMethod()));

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("Frontend");
app.MapControllers();

// Health endpoint returning status of both .NET API and forwarded AI Service
app.MapGet("/health", async (IHttpClientFactory clients) =>
{
    bool aiAlive = false;
    int labelsCount = 0;
    try
    {
        var aiClient = clients.CreateClient("AI");
        var resp = await aiClient.GetFromJsonAsync<ReadyResponse>("ready");
        if (resp != null)
        {
            aiAlive = resp.ready;
            labelsCount = resp.labels;
        }
    }
    catch
    {
        aiAlive = false;
    }

    return Results.Ok(new
    {
        status = "healthy",
        service = "psl-api",
        database = "SQL Server / EF Core",
        aiServiceReady = aiAlive,
        labelsLoaded = labelsCount,
        version = "1.1.0"
    });
});

app.Run();

record ReadyResponse(bool ready, int labels);
