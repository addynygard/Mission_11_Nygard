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

        [HttpGet("AllProjects")] // Way of routing so that you can have multiple different apis on the same data (functional vs non functional for the next one)
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


        [HttpPost("AddBook")]
        // we need an api action to add a book to the list/database
        public IActionResult AddBook([FromBody] Book newBook)
        {
            _bookContext.Books.Add(newBook); // add the new book to the database
            _bookContext.SaveChanges(); // save the changes to the database
            return Ok(newBook); // return the new book that was added to the database
        }

        // This will get a specific book from the database
        [HttpPut("UpdateBook/{BookID}")]
        public IActionResult UpdateBook(int BookID, [FromBody] Book updatedBook)
        {
            var existingBook = _bookContext.Books.Find(BookID); // find the book in the database

            // update the book information
            existingBook.Title = updatedBook.Title; 
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Classification = updatedBook.Classification;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;

            _bookContext.Books.Update(existingBook); // update the book in the database
            _bookContext.SaveChanges(); // save the changes to the database

            return Ok(existingBook); // return the updated book
        }

        // This will delete a book from the database
        [HttpDelete("DeleteBook/{BookID}")]
        public IActionResult DeleteBook(int BookID)
        {
            var book = _bookContext.Books.Find(BookID); // find the book in the database

            if (book == null) // if the book does not exist in the database
            {
                return NotFound(new {message = "Book not found"}); // return a 404 error
            }

            _bookContext.Books.Remove(book); // remove the book from the database
            _bookContext.SaveChanges(); // save the changes to the database

            return Ok(book); // return the deleted book
        }

    }
}
