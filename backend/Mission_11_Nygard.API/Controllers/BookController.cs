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
        public IActionResult GetBooks(int pageHowMany = 10, int pageNum = 1, [FromQuery] List<string>? bookTypes = null) // defulat value of 5 if there is nothing in there 
        {
            var query = _bookContext.Books.AsQueryable(); // Cast to IQueryable<Book>

            if (bookTypes != null && bookTypes.Any())
            {
                query = query.Where(x => bookTypes.Contains(x.Category));
            }

            var totalNumBooks = query.Count(); // counts the number of books in the database

            var something = query.Skip((pageNum - 1) * pageHowMany).Take(pageHowMany).ToList();

          

            var someObject = new
            {
                Books = something,
                TotalNumBooks = totalNumBooks
            }; 

            return Ok(someObject); // new way to return information that allow us to pass through 2 returns essentially through an object
        }

        // This will grab and put together a list of category types of books to be passed to the frontend
        [HttpGet("GetCategoryTypes")]
        public IActionResult GetCategoryTypes()
        {
            var categoryTypes = _bookContext.Books.Select(x => x.Category).Distinct().ToList();

            return Ok(categoryTypes);
        }

    }
}
