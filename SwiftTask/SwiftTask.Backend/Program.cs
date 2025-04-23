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

builder.Services.AddIdentityApiEndpoints<SwiftTaskUser>()
    .AddEntityFrameworkStores<SwiftTaskDbContext>();

var app = builder.Build();

using( var scope = app.Services.CreateScope() )
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<SwiftTaskDbContext>();
    var userManager = services.GetRequiredService<UserManager<SwiftTaskUser>>();

    context.Database.EnsureDeleted();
    context.Database.EnsureCreated();
    context.Seed( userManager );
}
// Configure the HTTP request pipeline.
if( app.Environment.IsDevelopment() )
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();
app.MapIdentityApi<SwiftTaskUser>();
app.MapControllers();

app.Run();
