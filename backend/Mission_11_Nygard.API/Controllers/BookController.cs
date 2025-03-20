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

        //[HttpGet("AllProjects")] Way of routing so that you can have multiple different apis on the same data (functional vs non functional for the next one)
        public IEnumerable<Book> GetBooks()
        {
            return _bookContext.Books.ToList();
        }


    }
}
