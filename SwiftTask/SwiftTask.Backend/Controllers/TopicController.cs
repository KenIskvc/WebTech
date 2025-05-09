using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwiftTask.Backend.DTOs;
using SwiftTask.Backend.Infrastructure;
using SwiftTask.Backend.Models;

namespace SwiftTask.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TopicController : ControllerBase
    {
        private readonly SwiftTaskDbContext _context;

        public TopicController(SwiftTaskDbContext context)
        {
            _context = context;
        }

        // GET: api/Topic?userId=xyz
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TopicDto>>> GetTopics([FromQuery] string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("Missing userId");

            var topics = await _context.Topics
                .Where(t => t.SwiftTaskUserId == userId)
                .Include(t => t.Tasks)
                .ToListAsync();

            var topicDtos = topics.Select(t => new TopicDto
            {
                Id = t.Id,
                Name = t.Name,
                Tasks = t.Tasks.Select(task => new TaskDto
                {
                    Id = task.Id,
                    Description = task.Description
                }).ToList()
            }).ToList();

            return Ok(topicDtos);
        }

        // GET: api/Topic/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TopicDto>> GetTopic(int id)
        {
            var topic = await _context.Topics
                .Include(t => t.Tasks)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (topic == null)
                return NotFound();

            var dto = new TopicDto
            {
                Id = topic.Id,
                Name = topic.Name,
                Tasks = topic.Tasks.Select(task => new TaskDto
                {
                    Id = task.Id,
                    Description = task.Description
                }).ToList()
            };

            return Ok(dto);
        }

        // POST: api/Topic
        [HttpPost]
        public async Task<ActionResult<TopicDto>> PostTopic([FromBody] TopicCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Topic name is required.");

            if (string.IsNullOrWhiteSpace(dto.SwiftTaskUserId))
                return BadRequest("User ID is required.");

            var topic = new Topic
            {
                Name = dto.Name,
                SwiftTaskUserId = dto.SwiftTaskUserId,
                Tasks = new List<Models.Task>()
            };

            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();

            var result = new TopicDto
            {
                Id = topic.Id,
                Name = topic.Name,
                Tasks = new List<TaskDto>()
            };

            return CreatedAtAction(nameof(GetTopic), new { id = topic.Id }, result);
        }

        // PUT: api/Topic/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTopic(int id, [FromBody] TopicDto dto)
        {
            if (id != dto.Id)
                return BadRequest("ID mismatch.");

            var topic = await _context.Topics.FindAsync(id);
            if (topic == null)
                return NotFound();

            topic.Name = dto.Name;

            _context.Entry(topic).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Topic/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTopic(int id)
        {
            var topic = await _context.Topics
                .Include(t => t.Tasks)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (topic == null)
                return NotFound();

            _context.Topics.Remove(topic);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TopicExists(int id)
        {
            return _context.Topics.Any(e => e.Id == id);
        }
    }
}
