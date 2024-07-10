using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ToDoAPI.Data;
using ToDoAPI.Models;

namespace ToDoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ToDoController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ToDoController(AppDbContext db)
        {
            _db = db;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ToDoItem>>> GetAll()
        {
            return await _db.ToDoItems.ToListAsync();
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ToDoItem>> GetById(long id )
        {
            var todoItem = await _db.ToDoItems.FindAsync(id);
            if (todoItem == null)
            {
                return NotFound();
            }
            return Ok(todoItem);
        }
        [HttpPost]
        public async  Task<ActionResult<ToDoItem>> Add(ToDoItem item)
        {
            _db.ToDoItems.Add(item);
            await _db.SaveChangesAsync();
            return  CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
            
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTodoItem(long id, ToDoItem item)
        {
            if (id != item.Id)
            {
                return BadRequest();
            }

            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/TodoItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoItem(long id)
        {
            var todoItem = await _db.ToDoItems.FindAsync(id);

            if (todoItem == null)
            {
                return NotFound();
            }

            _db.ToDoItems.Remove(todoItem);
            await _db.SaveChangesAsync();

            return NoContent();
        }
    }

}

