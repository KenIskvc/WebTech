using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwiftTask.Backend.Infrastructure;
using SwiftTask.Backend.Models;
using Task = SwiftTask.Backend.Models.Task;
using SwiftTask.Backend.DTOs;
using System.Runtime.CompilerServices;

namespace SwiftTask.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly SwiftTaskDbContext _context;

        public TaskController(SwiftTaskDbContext context)
        {
            _context = context;
        }

        /*// GET: api/Task
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Task>>> GetTasks()
        {
            //return await _context.Tasks.Include(t => t.Topic).ToListAsync();
            return await _context.Tasks.ToListAsync();
        }

        // GET: api/Task/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Task>> GetTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);

            if (task == null)
            {
                return NotFound();
            }

            return task;
        }*/


        // GET: api/Task -all tasks
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskDto>>> GetAllTasks()
        {
            var list = await _context.Tasks
                .Include(t => t.Topic)
                .Select(t => new TaskDto
{
    Id = t.Id,
    Description = t.Description,
    IsDone = t.IsDone,
    TopicName = t.Topic.Name
               })
               .ToListAsync();
            return Ok(list);
       }

       // GET: api/Task/topic/{topicName}- return tasks regarding one topic
      
       [HttpGet("topic/{topicName}")]
       public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasksByTopic(string topicName)
        {
            var list = await _context.Tasks
               .Include(t => t.Topic)
                .Where(t => t.Topic.Name == topicName)
               .Select(t => new TaskDto
{
    Id = t.Id,
    Description = t.Description,
    IsDone = t.IsDone,
    TopicName = t.Topic.Name
               })
               .ToListAsync();

           return Ok(list);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<TaskDto>> GetTask(int id)
        {
            var t = await _context.Tasks
                .Include(x => x.Topic)
                .SingleOrDefaultAsync(x => x.Id == id);
            if (t == null)
                return NotFound();

            var dto = new TaskDto
            {
                Id = t.Id,
                Description = t.Description,
                IsDone = t.IsDone,
                TopicName = t.Topic.Name
            };
            return Ok(dto);
        }


        /*// PUT: api/Task/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
                public async Task<IActionResult> PutTask(int id, Task task)
                {
                    if (id != task.Id)
                    {
                        return BadRequest();
                    }

                    _context.Entry(task).State = EntityState.Modified;

                    try
                    {
                        await _context.SaveChangesAsync();
                    }
                    catch (DbUpdateConcurrencyException)
                    {
                        if (!TaskExists(id))
                        {
                            return NotFound();
                        }
                        else
                        {
                            throw;
                        }
                    }

                    return NoContent();
                }*/


        public record UpdateTaskDto(string Description, bool IsDone, string TopicName);

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTask(int id, [FromBody] UpdateTaskDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
                return NotFound();

            var topic = await _context.Topics
                .SingleOrDefaultAsync(t => t.Name == dto.TopicName);
            if (topic == null)
                return BadRequest($"Topic '{dto.TopicName}' not found");

            task.Description = dto.Description;
            task.IsDone = dto.IsDone;
            task.TopicId = topic.Id;

            await _context.SaveChangesAsync();
            return NoContent();
        }


        /*// POST: api/Task
         // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
         [HttpPost]
         public async Task<ActionResult<Task>> PostTask(Task task)
         {
             _context.Tasks.Add(task);
             await _context.SaveChangesAsync();

             return CreatedAtAction("GetTask", new { id = task.Id }, task);
         }*/

        public record CreateTaskDto(string Description, string TopicName);

        [HttpPost]
        public async Task<ActionResult<TaskDto>> PostTask([FromBody] CreateTaskDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var topic = await _context.Topics
                .SingleOrDefaultAsync(t => t.Name == dto.TopicName);
            if (topic == null)
                return BadRequest($"Topic '{dto.TopicName}' not found");

            var entity = new Models.Task
            {
                Description = dto.Description,
                TopicId = topic.Id,
                IsDone = false
            };

            _context.Tasks.Add(entity);
            await _context.SaveChangesAsync();

            var result = new TaskDto
            {
                Id = entity.Id,
                Description = entity.Description,
                IsDone = entity.IsDone,
                TopicName = dto.TopicName
            };

            return CreatedAtAction(nameof(GetTask), new { id = result.Id }, result);
        }




        // DELETE: api/Task/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task == null)
            {
                return NotFound();
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TaskExists(int id)
        {
            return _context.Tasks.Any(e => e.Id == id);
        }
    }
}
