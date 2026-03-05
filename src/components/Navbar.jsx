import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Navbar() {
    const { cartCount, toggleCart } = useCart();

    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                <img src="https://quest-society-clothing.myshopify.com/cdn/shop/files/3dgifmaker30117.gif?v=1761708744" alt="QS" />
            </Link>
            <div className="nav-links">
                <Link to="/collections/all" className="nav-link">CATALOG</Link>
            </div>
            <div className="cart-icon" onClick={toggleCart}>
                🛒 <span className="cart-count">{cartCount}</span>
            </div>
        </nav>
    );
}

export default Navbar;
