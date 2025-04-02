// function AdminProjectsPage () {
// } return ();

// Does the same thing as the code above

import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { deleteBook, fetchBooks } from '../api/BooksAPI';
import Pagination from '../components/Pagination';
import NewBookForm from '../components/NewBookForm';
import EditBookForm from '../components/EditBookForm';

const AdminProjectsPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null); // if there is not an error, it is null
  const [loading, setLoading] = useState(true); // if it is loading, it is true
  const [pageSize, setpageSize] = useState<number>(10);
  const [pageNum, setpageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [showForm, setShowForm] = useState(false); // this is to show the form when we click the button add/edot
  const [editingBook, seteditingBook] = useState<Book | null>(null); // this is to show the book we are editing

  // just watches to see if there is something we need to look at and change, or not
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const data = await fetchBooks(pageSize, pageNum, []); // fetchBooks is a function that gets the books from the API
        // pageSize, pageNum, selectedCategories -> we just hard coded them first
        setBooks(data.books); // set the books to the data that we got from the API
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize)); // set the total pages to the total number of books divided by the page size
      } catch (error) {
        setError((error as Error).message); // if there is an error, set the error to the message of the error
      } finally {
        setLoading(false);
      }
    };

    loadBooks(); // Call the loadProjects function
  }, [pageSize, pageNum]); // Add an empty dependency array to run useEffect only once

  const handleDelete = async (bookID: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this books?',
    );
    if (!confirmDelete) return; // if the user does not confirm, do not delete the book

    try {
      await deleteBook(bookID); // Call the deleteBook function with the bookID
      setBooks(books.filter((b) => b.bookID !== bookID)); // Filter out the deleted book from the books array
    } catch {
      alert('Failed to delete project. Please try again.');
    }
  };

  if (loading) return <p>Loading projects .... </p>;
  if (error) return <p className="text-red-500">Error: {error} </p>;

  return (
    <div>
      <h1>Admin - Books </h1>

      {/* If you click on that button, you will see the form; 
      Then you can allow it to pop into the form and submit it */}
      {!showForm && (
        <button
          className="btn btn-success mb-3"
          onClick={() => setShowForm(true)}
        >
          Add Project
        </button>
      )}

      {/* FIGURE OUT WHAT THIS MEANS!!! */}
      {/* Do this stuff below, if the form is true -> basically show it; then onSuccess, 
      do this stuff; onCancel, hide the form by setting 
      it to false */}
      {showForm && (
        <NewBookForm
          onSuccess={() => {
            setShowForm(false);
            fetchBooks(pageSize, pageNum, []).then((data) =>
              setBooks(data.books),
            );
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingBook && (
        <EditBookForm
          book={editingBook}
          onSuccess={() => {
            seteditingBook(null);
            fetchBooks(pageSize, pageNum, []).then((data) =>
              setBooks(data.books),
            );
          }}
          onCancel={() => seteditingBook(null)}
        />
      )}

      <table className="table table-boardered table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Classification</th>
            <th>Category</th>
            <th>Page Count</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.bookID}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.publisher}</td>
              <td>{b.isbn}</td>
              <td>{b.classification}</td>
              <td>{b.category}</td>
              <td>{b.pageCount}</td>
              <td>{b.price}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm w-100 mb-1"
                  onClick={() => seteditingBook(b)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm w-100 mb-1"
                  onClick={() => handleDelete(b.bookID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
    </div>
  );
};

export default AdminProjectsPage;
