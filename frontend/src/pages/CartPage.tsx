import { useNavigate, useParams } from 'react-router-dom';
import WelcomeBand from '../components/WelcomeBand';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';
import { useState } from 'react';
import { Spinner } from 'react-bootstrap'; // Import Spinner from Bootstrap

function Cart() {
  const navigate = useNavigate();
  const { bookName, bookID: paramBookID } = useParams();
  const { addToCart } = useCart();
  const [price, setprice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false); // State to control spinner
  const bookID = paramBookID ? parseInt(paramBookID, 10) : 1;

  const handleAddToCart = async () => {
    setIsLoading(true); // Start spinner

    // Simulate an asynchronous task (e.g., saving to a server)
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate 1.5 sec async delay

    const newItem: CartItem = {
      bookID: Number(bookID),
      bookName: bookName || 'No Book Found',
      price,
    };

    addToCart(newItem); // Add item to cart
    setIsLoading(false); // Stop spinner

    navigate('/cart'); // Navigate to cart page
  };

  return (
    <>
      <WelcomeBand />
      <h2>Purchase the Book: {bookName} </h2>

      <div>
        <input
          type="number"
          placeholder="Enter price of book"
          value={price}
          onChange={(x) => setprice(Number(x.target.value))}
        />
        <button onClick={handleAddToCart} disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>

      {/* Show Spinner when adding to cart */}
      {isLoading && (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status" />
        </div>
      )}

      <button onClick={() => navigate(-1)}>Go Back</button>
    </>
  );
}

export default Cart;
