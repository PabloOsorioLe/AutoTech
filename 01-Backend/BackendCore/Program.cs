using AspNetCore.Reporting;
using BackendCore.Data;
using BackendCore.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;
using QuestPDF.Drawing;
using QuestPDF.Infrastructure;
using System.IO;

QuestPDF.Settings.License = LicenseType.Community;

// Registrar fuente personalizada SIN alias
var fontPath = Path.Combine(AppContext.BaseDirectory, "Fonts", "OpenSans-Regular.ttf");

if (!File.Exists(fontPath))
{
    Console.WriteLine($"❌ Fuente NO encontrada: {fontPath}");
}
else
{
    Console.WriteLine($"✅ Fuente encontrada: {fontPath}");
    FontManager.RegisterFont(File.OpenRead(fontPath));
}

var builder = WebApplication.CreateBuilder(args);
// Soporte para páginas de código extendidas (necesario para RDLC)
Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

// Configurar Kestrel para aceptar cuerpos de petición grandes (hasta 20 MB)
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.Limits.MaxRequestBodySize = 20 * 1024 * 1024;
});

// Configurar DbContext con SQL Server
builder.Services.AddDbContext<BackendCoreContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Controllers + JSON internacional
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Encoder =
            System.Text.Encodings.Web.JavaScriptEncoder.Create(System.Text.Unicode.UnicodeRanges.All);
    });

// Swagger para desarrollo
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ CORS para desarrollo y producción
var corsPolicyName = "AllowFrontend";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: corsPolicyName, policy =>
    {
        policy.WithOrigins(
                 "http://localhost:4200",
                 "https://fullpega.cl",
                 "https://www.fullpega.cl",
                 "https://inventorycloud.onrender.com", // ✅ Backend
                 "https://inventory-cloud.vercel.app"   // ✅ Frontend
             )
             .AllowAnyHeader()
             .AllowAnyMethod();
        // Si vas a usar cookies/sesiones en futuro: .AllowCredentials();
    });
});

var app = builder.Build();

// ✅ Swagger solo en desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ✅ Middlewares en orden correcto
app.UseRouting();

// Aplicar CORS antes de MapControllers()
app.UseCors(corsPolicyName);

// Redirigir HTTPS solo en producción
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
