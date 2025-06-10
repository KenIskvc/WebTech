using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwiftTask.Backend.DTOs;
using SwiftTask.Backend.Infrastructure;
using SwiftTask.Backend.Models;
using Task = SwiftTask.Backend.Models.Task;


namespace SwiftTask.Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TaskController : ControllerBase {
    private readonly SwiftTaskDbContext _context;

    public TaskController(SwiftTaskDbContext context) => _context = context;

    public record UpdateTaskDto(string Description, bool IsDone, DateTime? DueDate, string TopicName);
    public record CreateTaskDto( string? Description, DateTime? DueDate, string TopicName);


    // GET: api/Task

    /// <summary>
    /// Retrieves a list of all tasks.
    /// </summary>
    /// <returns>A list of tasks</returns>
    [HttpGet]

    public async Task<ActionResult<IEnumerable<TaskDto>>> GetAllTasks()
    {
        var list = await _context.Tasks
            .Include(t => t.Topic)
            .Select(t => new TaskDto
            {
                Id = t.Id,
                Description = t.Description,
                DueDate = t.DueDate ?? DateTime.UtcNow,
                IsDone = t.IsDone,
                TopicName = t.Topic.Name
            })
            .ToListAsync();
        return Ok(list);

    }
    /// <summary>
    /// Retrieves all tasks by a specific topic name.
    /// </summary>
    /// <param name="topicName">The name of the topic.</param>
    /// <returns>A list of tasks matching the topic name.</returns>
    

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
                    DueDate = t.DueDate ?? DateTime.UtcNow,
                    IsDone = t.IsDone,
                    TopicName = t.Topic.Name
                })
                .ToListAsync();
            return Ok(list);
        }

        // GET: api/Task/5
        // Retrieves a single task by its ID. Returns 404 if not found.

        /// <summary>
        /// Retrieves a task by its ID.
        /// </summary>
        /// <param name="id">Task ID</param>
        /// <returns>The task or 404 Not Found</returns>

        [HttpGet("{id}")]
    public async Task<ActionResult<TaskDto>> GetTask(int id)
    {
        var t = await _context.Tasks
            .Include(x => x.Topic)
            .SingleOrDefaultAsync(x => x.Id == id);
        if (t == null) return NotFound();

        var dto = new TaskDto
        {
            Id = t.Id,
          
            Description = t.Description,
            DueDate = t.DueDate ?? DateTime.UtcNow,
            IsDone = t.IsDone,
            TopicName = t.Topic.Name
        };
        return Ok(dto);
    }

    // PUT: api/Task/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    // Updates an existing task. Returns 400 if ID in URL doesn't match task ID in body.
    // Returns 404 if task doesn't exist.

    /// <summary>
    /// Updates a task by its ID.
    /// </summary>
    /// <param name="id">Task ID</param>
    /// <param name="dto">Updated task data</param>  
    /// <returns>204 No Content, 400 Bad Request, or 404 Not Found</returns>



    [HttpPut("{id}")]

    public async Task<IActionResult> PutTask(int id, [FromBody] UpdateTaskDto dto)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound();

        var topic = await _context.Topics.SingleOrDefaultAsync(t => t.Name == dto.TopicName);
        if (topic == null) return BadRequest($"Topic '{dto.TopicName}' not found");

       
        task.Description = dto.Description;
        task.DueDate = dto.DueDate ?? DateTime.UtcNow.AddDays(7);
        task.IsDone = dto.IsDone;
        task.TopicId = topic.Id;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    /*public async Task<IActionResult> PutTask(int id, Task task) {
        if(id != task.Id) {
            return BadRequest();
        }

        _context.Entry(task).State = EntityState.Modified;

        try {
            await _context.SaveChangesAsync();
        } catch(DbUpdateConcurrencyException) {
            if(!TaskExists(id)) {
                return NotFound();
            } else {
                throw;
            }
        }

        return NoContent();
    }*/

    // POST: api/Task
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    // Creates a new task and returns the created task with a 201 response.

    /// <summary>
    /// Creates a new task.
    /// </summary>
    /// <param name="dto">Task data</param>
    /// <returns>The created task with its ID</returns>



    [HttpPost]

    public async Task<ActionResult<TaskDto>> PostTask([FromBody] CreateTaskDto dto)
    {

        if (string.IsNullOrWhiteSpace(dto.TopicName))
            return BadRequest("Topic is required.");

        var topic = await _context.Topics.SingleOrDefaultAsync(t => t.Name == dto.TopicName);
        if (topic == null)
            return BadRequest($"Topic '{dto.TopicName}' not found");

        var entity = new Task
        {
          
            Description = dto.Description ?? "",
            DueDate = dto.DueDate ?? DateTime.UtcNow.AddDays(7),
            TopicId = topic.Id,
            IsDone = false
        };

        _context.Tasks.Add(entity);
        await _context.SaveChangesAsync();

        var result = new TaskDto
        {
            Id = entity.Id,
            Description = entity.Description,
            DueDate = entity.DueDate ?? DateTime.UtcNow,
            IsDone = entity.IsDone,
            TopicName = topic.Name
        };

        return CreatedAtAction(nameof(GetTask), new { id = result.Id }, result);
    }

    /*public async Task<ActionResult<Task>> PostTask(Task task) {
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetTask", new { id = task.Id }, task);
    }
    */
    // DELETE: api/Task/5
    // Deletes a task by its ID. Returns 404 if task not found.

    /// <summary>
    /// Deletes a task by its ID.
    /// </summary>
    /// <param name="id">Task ID</param>
    /// <returns>204 No Content or 404 Not Found</returns>

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

    // Checks if a task with the specified ID exists in the database.

    /// <summary>
    /// Checks if a task with the given ID exists.
    /// </summary>
    /// <param name="id">Task ID</param>
    /// <returns>true if the task exists; otherwise, false</returns>
    private bool TaskExists(int id) => _context.Tasks.Any(e => e.Id == id);
    
}
