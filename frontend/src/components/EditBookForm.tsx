import React, { useState } from 'react';
import { Book } from '../types/Book';
import { updateBook } from '../api/BooksAPI';

interface EditBookFormProps {
  book: Book; // The book object to be edited
  onSuccess: () => void; // Callback function to be called on successful book addition
  onCancel: () => void; // Callback function to be called on cancel
}

const EditBookForm = ({ book, onSuccess, onCancel }: EditBookFormProps) => {
  const [formData, setFormData] = useState<Book>({ ...book });

  // e.target name and target value refer to the form label and input value
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    await updateBook(formData.bookID, formData); // Call the addBook function with the form data
    onSuccess(); // Call the success to let us know it worked
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Book</h2>
      <label>
        Title:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </label>
      <label>
        Author:
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
        />
      </label>
      <label>
        Publisher:
        <input
          type="text"
          name="publisher"
          value={formData.publisher}
          onChange={handleChange}
        />
      </label>
      <label>
        ISBN:
        <input
          type="text"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
        />
      </label>
      <label>
        Classification:
        <input
          type="text"
          name="classification"
          value={formData.classification}
          onChange={handleChange}
        />
      </label>
      <label>
        Category:
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
      </label>
      <label>
        Page Count:
        <input
          type="number"
          name="pageCount"
          value={formData.pageCount}
          onChange={handleChange}
        />
      </label>
      <label>
        Price:
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Update Book</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default EditBookForm;
