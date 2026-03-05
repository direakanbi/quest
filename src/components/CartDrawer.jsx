import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

function CartDrawer() {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate('/checkout');
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`cart-overlay ${isCartOpen ? 'open' : ''}`}
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2>YOUR CART</h2>
                    <button className="close-cart-btn" onClick={() => setIsCartOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <div className="cart-items">
                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <p>Your cart is empty.</p>
                            <button className="start-shopping-btn" onClick={() => setIsCartOpen(false)}>
                                START SHOPPING
                            </button>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={`${item.id}-${item.size}`} className="cart-item">
                                <div className="cart-item-image">
                                    <img src={item.image} alt={item.title} />
                                </div>
                                <div className="cart-item-details">
                                    <div className="item-header">
                                        <h3>{item.title}</h3>
                                        <button
                                            className="remove-btn"
                                            onClick={() => removeFromCart(item.id, item.size)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <p className="item-variant">Size: {item.size}</p>
                                    <div className="item-footer">
                                        <div className="quantity-controls">
                                            <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}>
                                                <Minus size={14} />
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}>
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <div className="item-price">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total">
                            <span>SUBTOTAL</span>
                            <span>${cartTotal.toFixed(2)} USD</span>
                        </div>
                        <p className="shipping-note">Shipping & taxes calculated at checkout</p>
                        <button className="checkout-btn" onClick={handleCheckout}>
                            CHECKOUT
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default CartDrawer;
