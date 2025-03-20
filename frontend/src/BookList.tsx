import { useEffect, useState } from 'react';
import { Book } from './types/Book';

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);

  const [pageSize, setpageSize] = useState<number>(10);

  const [pageNum, setpageNum] = useState<number>(1);

  const [totalItems, setTotalItems] = useState<number>(0);

  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await fetch(
        `http://localhost:5117/Book?pageHowMany=${pageSize}&pageNum=${pageNum}`,
      );
      const data = await response.json();
      setBooks(data.books);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(totalItems / pageSize));
    };

    fetchBooks();
  }, [pageSize, pageNum]); // if something changes, you want this function UseEffect to run again!

  return (
    <>
      <h1>List of Hilton's Favorite Books</h1>
      <br />

      {/* shows each card with the book's information  */}
      {books.map((b) => (
        <div id="bookCard" className="card" key="b.bookID">
          <h3 className="card-title">{b.title}</h3>
          <div className="card-body">
            <ul className="list-unstyled">
              <li>Author: {b.author}</li>
              <li>Publisher: {b.publisher}</li>
              <li>ISBN: {b.isbn}</li>
              <li>Classification: {b.classification}</li>
              <li>Category: {b.category}</li>
              <li>Page Count: {b.pageCount}</li>
              <li>Price: ${b.price}</li>
            </ul>
          </div>
        </div>
      ))}

      <button disabled={pageNum === 1} onClick={() => setpageNum(pageNum - 1)}>
        Previous
      </button>

      {/* (index = i in a for each loop essentially) */}
      {/* take i + 1, ie 1, 2, 3, 4... */}
      {/* setting the page number you are on and setting it to that */}
      {/* cannot click on the button that they are already on (see disabled) */}
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => setpageNum(index + 1)}
          disabled={pageNum === index + 1}
        >
          {index + 1}
        </button>
      ))}

      {/* creates a next button */}
      <button
        disabled={pageNum === totalPages}
        onClick={() => setpageNum(pageNum + 1)}
      >
        Next
      </button>

      <br />
      <label>
        Results per page:
        <select
          value={pageSize}
          onChange={(b) => {
            setpageSize(Number(b.target.value));
            setpageNum(1);
          }}
        >
          {/* gives you a dropdown with these values */}
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </label>
    </>
  );
}

export default BookList;
