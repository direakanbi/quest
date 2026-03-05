import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Navbar from './Navbar';

function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        country: '',
        zip: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate processing
        setTimeout(() => {
            setIsSuccess(true);
            clearCart();
        }, 1500);
    };

    if (isSuccess) {
        return (
            <div className="checkout-success">
                <div className="success-content">
                    <CheckCircle size={64} color="#00ff00" />
                    <h1>Order Placed Successfully!</h1>
                    <p>Thank you for your purchase. You will receive an email confirmation shortly.</p>
                    <button onClick={() => navigate('/')} className="continue-btn">
                        CONTINUE SHOPPING
                    </button>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <>
                <Navbar />
                <div className="empty-checkout">
                    <h1>Your cart is empty</h1>
                    <button onClick={() => navigate('/collections/all')} className="continue-btn">
                        BROWSE CATALOG
                    </button>
                </div>
            </>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-header">
                <div className="logo-section">
                    <img src="https://quest-society-clothing.myshopify.com/cdn/shop/files/3dgifmaker30117.gif?v=1761708744" alt="QS" className="checkout-logo" />
                </div>
            </div>

            <div className="checkout-container">
                <div className="checkout-form-section">
                    <div className="breadcrumb">
                        <span onClick={() => navigate('/cart')} style={{ cursor: 'pointer' }}>Cart</span> &gt; <span>Information</span> &gt; <span>Payment</span>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <section className="form-section">
                            <h2>Contact</h2>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </section>

                        <section className="form-section">
                            <h2>Shipping Address</h2>
                            <div className="form-row">
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First name"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last name"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                            <input
                                type="text"
                                name="address"
                                placeholder="Address"
                                required
                                value={formData.address}
                                onChange={handleChange}
                            />
                            <div className="form-row">
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    name="zip"
                                    placeholder="ZIP code"
                                    required
                                    value={formData.zip}
                                    onChange={handleChange}
                                />
                            </div>
                            <input
                                type="text"
                                name="country"
                                placeholder="Country"
                                required
                                value={formData.country}
                                onChange={handleChange}
                            />
                        </section>

                        <section className="form-section">
                            <h2>Payment</h2>
                            <p className="payment-note">All transactions are secure and encrypted.</p>
                            <div className="credit-card-inputs">
                                <input
                                    type="text"
                                    name="cardNumber"
                                    placeholder="Card number"
                                    required
                                    value={formData.cardNumber}
                                    onChange={handleChange}
                                />
                                <div className="form-row">
                                    <input
                                        type="text"
                                        name="expiry"
                                        placeholder="Expiration (MM/YY)"
                                        required
                                        value={formData.expiry}
                                        onChange={handleChange}
                                    />
                                    <input
                                        type="text"
                                        name="cvc"
                                        placeholder="Security code"
                                        required
                                        value={formData.cvc}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </section>

                        <button type="submit" className="pay-now-btn">
                            PAY NOW
                        </button>
                    </form>
                </div>

                <div className="checkout-summary-section">
                    <div className="summary-items">
                        {cart.map((item) => (
                            <div key={`${item.id}-${item.size}`} className="summary-item">
                                <div className="summary-image-wrapper">
                                    <img src={item.image} alt={item.title} />
                                    <span className="summary-qty">{item.quantity}</span>
                                </div>
                                <div className="summary-details">
                                    <p className="summary-name">{item.title}</p>
                                    <p className="summary-variant">{item.size}</p>
                                </div>
                                <div className="summary-price">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="summary-totals">
                        <div className="total-row">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="total-row">
                            <span>Shipping</span>
                            <span>Calculated at next step</span>
                        </div>
                        <div className="total-row final">
                            <span>Total</span>
                            <span><span className="currency">USD</span> ${cartTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CheckoutPage;
