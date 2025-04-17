using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace SwiftTask.Backend.Infrastructure
{
    public class SwiftTaskDbContext : IdentityDbContext<IdentityUser>
    {
        public SwiftTaskDbContext(DbContextOptions<SwiftTaskDbContext> options) :
        base(options)
        { 

        }
    }
}
