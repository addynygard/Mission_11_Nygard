using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mission_11_Nygard.API.Data;

namespace Mission_11_Nygard.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {

        private BookDbContext _bookContext;
        public BookController(BookDbContext temp)
        {
            _bookContext = temp;
        }

        //[HttpGet("AllProjects")] // Way of routing so that you can have multiple different apis on the same data (functional vs non functional for the next one)
        public IActionResult GetBooks(int pageHowMany = 10, int pageNum = 1) // defulat value of 5 if there is nothing in there 
        {
            var something = _bookContext.Books.Skip((pageNum - 1) * pageHowMany).Take(pageHowMany).ToList();

            var totalNumBooks = _bookContext.Books.Count(); // counts the number of books in the database

            var someObject = new
            {
                Books = something,
                TotalNumBooks = totalNumBooks
            }; 

            return Ok(someObject); // new way to return information that allow us to pass through 2 returns essentially through an object
        }


    }
}
