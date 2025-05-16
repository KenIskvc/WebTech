using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwiftTask.Backend.DTOs;
using SwiftTask.Backend.Infrastructure;
using SwiftTask.Backend.Models;

namespace SwiftTask.Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TopicController : ControllerBase {
    private readonly SwiftTaskDbContext _context;

    public TopicController(SwiftTaskDbContext context) => _context = context;

    // GET: api/Topic
    // Retrieves all topics that belong to the given user ID, including their associated tasks.
    // Returns a list of TopicDto objects
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TopicDto>>> GetTopics(string userId) {
        //var topics = await _context.Topics.WInclude(t => t.Tasks).ToListAsync();
        var topics = await _context.Topics.Where(t => t.SwiftTaskUserId.Equals(userId))
            .Include(t => t.Tasks).ToListAsync();


        var topicDtos = topics.Select(topic => new TopicDto {
            Id = topic.Id,
            Name = topic.Name,
            Tasks = topic.Tasks.Select(task => new TaskDto {
                Id = task.Id,
                Description = task.Description
            }).ToList()
        }).ToList();

        return topicDtos;
    }

    // GET: api/Topic/5
    // Retrieves a single topic by its ID.
    // Returns 404 Not Found if the topic doesn't exist.
    [HttpGet("{id}")]
    public async Task<ActionResult<Topic>> GetTopic(int id) {
        var topic = await _context.Topics.FindAsync(id);

        return topic == null ? (ActionResult<Topic>) NotFound() : (ActionResult<Topic>) topic;
    }

    // PUT: api/Topic/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    // Updates an existing topic. Returns 400 if the ID in the URL doesn't match the topic ID in the body.
    // Returns 404 if the topic does not exist.
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTopic(int id, Topic topic) {
        if(id != topic.Id) {
            return BadRequest();
        }

        _context.Entry(topic).State = EntityState.Modified;

        try {
            await _context.SaveChangesAsync();
        } catch(DbUpdateConcurrencyException) {
            if(!TopicExists(id)) {
                return NotFound();
            } else {
                throw;
            }
        }

        return NoContent();
    }

    // POST: api/Topic
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    // Creates a new topic and returns it with a 201 Created response.
    [HttpPost]
    public async Task<ActionResult<Topic>> PostTopic(Topic topic) {
        _context.Topics.Add(topic);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetTopic", new { id = topic.Id }, topic);
    }

    // DELETE: api/Topic/5
    // Deletes a topic by its ID. Returns 404 if the topic is not found.
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTopic(int id) {
        var topic = await _context.Topics.FindAsync(id);
        if(topic == null) {
            return NotFound();
        }

        _context.Topics.Remove(topic);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Checks whether a topic with the specified ID exists in the database.
    private bool TopicExists(int id) => _context.Topics.Any(e => e.Id == id);
}
