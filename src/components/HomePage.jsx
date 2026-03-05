import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="homepage-container">
            <div className="hero-content">
                <div className="logo-large">
                    <img src="https://quest-society-clothing.myshopify.com/cdn/shop/files/3dgifmaker30117.gif?v=1761708744" alt="Quest Society Logo" />
                </div>

                <div className="clock-display">
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                    <div className="date-display">
                        {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                <nav className="home-nav fade-in-delayed">
                    <Link to="/collections/all" className="home-link">COME SHOP</Link>
                    <Link to="/contact" className="home-link">CONTACT</Link>
                </nav>
            </div>
        </div>
    );
}

export default HomePage;
