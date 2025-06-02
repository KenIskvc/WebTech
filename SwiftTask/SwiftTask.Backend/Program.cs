using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SwiftTask.Backend.Infrastructure;
using SwiftTask.Backend.Models;

var builder = WebApplication.CreateBuilder( args );

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<SwiftTaskDbContext>(
    options => options.UseSqlServer( "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=SwiftTask;Integrated Security=True;Trust Server Certificate=True;" ) );

builder.Services.AddAuthorization();

builder.Services
    .AddIdentityCore<SwiftTaskUser>(options =>
    {
        options.Password.RequireDigit = false;
        options.Password.RequiredLength = 5;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireLowercase = false;
        options.Password.RequiredUniqueChars = 0;
        options.SignIn.RequireConfirmedEmail = false;
        options.Lockout.AllowedForNewUsers = false;
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.Zero;
    })
    .AddEntityFrameworkStores<SwiftTaskDbContext>()
    .AddSignInManager();

builder.Services.AddIdentityApiEndpoints<SwiftTaskUser>();

/*builder.Services.AddIdentityApiEndpoints<SwiftTaskUser>()
    .AddEntityFrameworkStores<SwiftTaskDbContext>();*/

builder.Services.AddCors( options =>
{
    options.AddPolicy( "AllowFrontend", builder =>
    {
        builder.WithOrigins( "http://localhost:5173" )
            .AllowCredentials()
            .AllowAnyHeader()
            .AllowAnyMethod();
    } );
} );

builder.Services.AddSwaggerGen( options =>
{
    options.AddSecurityDefinition( "Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter your JWT token in the format: Bearer {token}"
    } );

    options.AddSecurityRequirement( new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            []
        }
    } );
} );

var app = builder.Build();

using( var scope = app.Services.CreateScope() )
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<SwiftTaskDbContext>();
    var userManager = services.GetRequiredService<UserManager<SwiftTaskUser>>();

    context.Database.EnsureDeleted();
    context.Database.EnsureCreated();
    context.Seed(userManager);
}
// Configure the HTTP request pipeline.
if ( app.Environment.IsDevelopment() )
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDefaultFiles();
app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseCors( "AllowFrontend" );
app.UseAuthorization();
app.MapIdentityApi<SwiftTaskUser>();
app.MapControllers();

app.MapGet( "api/helloWorld", () => "Hello World!" );
app.Run();
