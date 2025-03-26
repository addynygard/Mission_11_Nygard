import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';
import { Toast } from 'react-bootstrap';

function DisplayCartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [removedItem, setRemovedItem] = useState<CartItem | null>(null);

  // Function to remove item and show toast
  const handleRemoveFromCart = (itemID: number, itemName: string) => {
    removeFromCart(itemID);
    setRemovedItem({ bookName: itemName, bookID: itemID, price: 0 }); // Set removed item for toast
    setShowToast(true);

    // Hide toast after 3 seconds
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div>
      <h2>Your Cart</h2>
      <div>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <ul>
            {cart.map((item: CartItem) => (
              <li key={item.bookID}>
                {item.bookName}: ${item.price.toFixed(2)}
                <button
                  onClick={() =>
                    handleRemoveFromCart(item.bookID, item.bookName)
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <h3>
        Total: ${cart.reduce((total, item) => total + item.price, 0).toFixed(2)}
      </h3>

      <button>Checkout</button>
      <button onClick={() => navigate('/projects')}>Continue Browsing</button>

      {/* Toast Notification */}
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
      >
        <Toast.Body>
          {removedItem ? `${removedItem.bookName} removed from cart!` : ''}
        </Toast.Body>
      </Toast>
    </div>
  );
}

export default DisplayCartPage;
