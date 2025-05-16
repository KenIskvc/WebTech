using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwiftTask.Backend.Infrastructure;
using Task = SwiftTask.Backend.Models.Task;

namespace SwiftTask.Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TaskController : ControllerBase {
    private readonly SwiftTaskDbContext _context;

    public TaskController(SwiftTaskDbContext context) => _context = context;

    // GET: api/Task
    // Retrieves a list of all tasks from the database.
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Task>>> GetTasks() =>
        //return await _context.Tasks.Include(t => t.Topic).ToListAsync();
        await _context.Tasks.ToListAsync();

    // GET: api/Task/5
    // Retrieves a single task by its ID. Returns 404 if not found.
    [HttpGet("{id}")]
    public async Task<ActionResult<Task>> GetTask(int id) {
        var task = await _context.Tasks.FindAsync(id);

        return task == null ? (ActionResult<Task>) NotFound() : (ActionResult<Task>) task;
    }

    // PUT: api/Task/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    // Updates an existing task. Returns 400 if ID in URL doesn't match task ID in body.
    // Returns 404 if task doesn't exist.
    [HttpPut("{id}")]
    public async Task<IActionResult> PutTask(int id, Task task) {
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
    }

    // POST: api/Task
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    // Creates a new task and returns the created task with a 201 response.
    [HttpPost]
    public async Task<ActionResult<Task>> PostTask(Task task) {
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetTask", new { id = task.Id }, task);
    }

    // DELETE: api/Task/5
    // Deletes a task by its ID. Returns 404 if task not found.
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id) {
        var task = await _context.Tasks.FindAsync(id);
        if(task == null) {
            return NotFound();
        }

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // Checks if a task with the specified ID exists in the database.
    private bool TaskExists(int id) => _context.Tasks.Any(e => e.Id == id);
}
