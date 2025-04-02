import './App.css';
import ProjectsPage from './pages/ProjectsPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CartPage from './pages/CartPage';
import DisplayCartPage from './pages/DisplayCartPage';
import { CartProvider } from './context/CartContext';
import AdminProjectsPage from './pages/AdminBooksPage';

function App() {
  return (
    <>
      {/* comes from CartContext.tsx file */}
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<ProjectsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/cart/:bookName/:bookID" element={<CartPage />} />
            <Route path="/cart" element={<DisplayCartPage />} />
            <Route path="/adminbooks" element={<AdminProjectsPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </>
  );
}

export default App;
