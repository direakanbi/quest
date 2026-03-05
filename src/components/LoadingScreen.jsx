import React from 'react';

function LoadingScreen() {
    return (
        <div className="loading-overlay">
            <div className="hud-container">
                <div className="ring ring-outer"></div>
                <div className="ring ring-middle"></div>
                <div className="ring ring-inner"></div>
                <div className="ring ring-inner"></div>
                <div className="loading-logo-container">
                    <img
                        src="https://quest-society-clothing.myshopify.com/cdn/shop/files/3dgifmaker30117.gif?v=1761708744"
                        alt="Loading..."
                        className="loading-logo"
                    />
                </div>
            </div>
        </div>
    );
}

export default LoadingScreen;
