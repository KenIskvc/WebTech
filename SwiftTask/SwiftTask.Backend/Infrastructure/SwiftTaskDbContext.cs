using Bogus;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SwiftTask.Backend.Models;

namespace SwiftTask.Backend.Infrastructure;

public class SwiftTaskDbContext : IdentityDbContext<IdentityUser>
{

    public DbSet<Topic> Topics { get; set; }
    public DbSet<Models.Task> Tasks { get; set; }

    public SwiftTaskDbContext( DbContextOptions<SwiftTaskDbContext> options ) :
    base( options )
    {

    }

    public void Seed( UserManager<SwiftTaskUser> userManager )
    {
        var userList = new List<SwiftTaskUser>
        {
            new() {
                UserName = "user1@example.com", Email = "user1@example.com", EmailConfirmed = true
            },
            new() {
                UserName = "user2@example.com", Email = "user2@example.com", EmailConfirmed = true
            },
            new() { UserName = "user3@example.com", Email = "user3@example.com", EmailConfirmed = true }
        };

        foreach( var user in userList )
        {
            var result = userManager.CreateAsync( user, "Password123!" ).Result;
            if( !result.Succeeded )
            {
                throw new Exception( "Failed to create test user" );
            }
        }

        var topicFaker = new Faker<Topic>()
                         .RuleFor( t => t.Name, f => f.Commerce.Department() )
                         .RuleFor( t => t.SwiftTaskUserId, f => f.PickRandom( userList ).Id );

        var taskFaker = new Faker<SwiftTask.Backend.Models.Task>()
            .RuleFor( t => t.Description, f => f.Lorem.Sentence() );

        var topics = new List<Topic>();
        for( var i = 0; i < 10; i++ )
        {
            var topic = topicFaker.Generate();
            var tasks = taskFaker.Generate( 5 );
            foreach( var task in tasks )
            {
                task.Topic = topic;
            }

            topic.Tasks = tasks;
            topics.Add( topic );
        }

        Topics.AddRange( topics );
        SaveChanges();
    }
}
