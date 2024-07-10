using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using ToDoAPI.Data;

namespace ToDoAPI.Models
{
    public class ToDoItem
    {
        public long Id { get; set; }

        [Required]
        public string Name { get; set; }

        public bool IsComplete { get; set; }
    }


}
