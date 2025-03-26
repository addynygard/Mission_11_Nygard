import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);

  const [sortedBooks, setSortedBooks] = useState<Book[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [pageSize, setpageSize] = useState<number>(10);

  const [pageNum, setpageNum] = useState<number>(1);

  const [totalItems, setTotalItems] = useState<number>(0);

  const [totalPages, setTotalPages] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      const categoryParams = selectedCategories
        .map((cat) => `bookTypes=${encodeURIComponent(cat)}`)
        .join('&');

      const response = await fetch(
        `http://localhost:5117/Book?pageHowMany=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}`,
      );
      const data = await response.json();
      setBooks(data.books);
      setTotalItems(data.totalNumBooks);
      setTotalPages(Math.ceil(totalItems / pageSize));
    };

    fetchBooks();
  }, [pageSize, pageNum, selectedCategories]); // if something changes, you want this function UseEffect to run again!

  // Sort books when books or sortOrder changes
  useEffect(() => {
    const sorted = [...books].sort((a, b) => {
      return sortOrder === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    });
    setSortedBooks(sorted);
  }, [books, sortOrder]);

  return (
    <>
      <h1>List of Hilton's Favorite Books</h1>
      <br />

      {/* Sort Buttons */}
      <button onClick={() => setSortOrder('asc')}>Sort A-Z</button>
      <button onClick={() => setSortOrder('desc')}>Sort Z-A</button>
      <br />

      {/* Show sorted books */}
      {sortedBooks.map((b) => (
        <div id="bookCard" className="card" key={b.bookID}>
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

            <button
              className="btn btn-success"
              onClick={() => navigate(`/cart/${b.title}/${b.bookID}`)}
            >
              Add Book to Cart
            </button>
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
