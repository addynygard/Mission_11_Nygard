import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import { fetchBooks } from '../api/BooksAPI';
import Pagination from '../components/Pagination';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);

  const [sortedBooks, setSortedBooks] = useState<Book[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [pageSize, setpageSize] = useState<number>(10);

  const [pageNum, setpageNum] = useState<number>(1);

  const [totalPages, setTotalPages] = useState<number>(0);

  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null); // if there is not an error, it is null
  const [loading, setLoading] = useState(true); // if it is loading, it is true

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks(pageSize, pageNum, selectedCategories); // fetchBooks is a function that gets the books from the API

        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        // forces the stuff to load lol
        setLoading(false); // loading is false when the books are loaded
      }
    };

    loadBooks();
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

  if (loading) return <p>Loading projects .... </p>;
  if (error) return <p className="text-red-500">Error: {error} </p>;

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

      {/* put the pagination component back in - we just made it a component, and then gave it the dynamic values*/}
      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setpageNum}
        onPageSizeChange={(newSize) => {
          setpageSize(newSize);
          setpageNum(1);
        }}
      />
    </>
  );
}

export default BookList;
