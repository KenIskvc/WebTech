using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SwiftTask.Backend.Models;

namespace SwiftTask.Backend.Infrastructure
{
    public class SwiftTaskDbContext : IdentityDbContext<IdentityUser>
    {

        public DbSet<Topic> Topics { get; set; }
        public DbSet<Models.Task> Tasks { get; set; }

        public SwiftTaskDbContext(DbContextOptions<SwiftTaskDbContext> options) :
        base(options)
        { 

        }
    }
}
