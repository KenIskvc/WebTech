using Microsoft.AspNetCore.Identity;
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
        private readonly UserManager<SwiftTaskUser> _userManager;

        public TopicController(SwiftTaskDbContext context, UserManager<SwiftTaskUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }
        // GET: api/Topic ; mit UserId und UserManager
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TopicDto>>> GetTopics([FromQuery] string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest("Missing userId");

            var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
                return NotFound("User not found");

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
                return NotFound("Topic not found");

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

            if (string.IsNullOrWhiteSpace(dto.UserId))
                return BadRequest("User ID is required.");

            var user = await _userManager.FindByIdAsync(dto.UserId);
            if (user == null)
                return NotFound("User not found");

            var topic = new Topic
            {
                Name = dto.Name,
                SwiftTaskUserId = dto.UserId,
                User = user,
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

            var topic = await _context.Topics
                .Include(t => t.Tasks)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (topic == null)
                return NotFound("Topic not found");

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
                return NotFound("Topic not found");

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