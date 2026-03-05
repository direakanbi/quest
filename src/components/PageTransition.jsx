import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

function PageTransition({ children }) {
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Trigger loading on route change
        setIsLoading(true);

        // "Warp" duration
        const timer = setTimeout(() => {
            setIsLoading(false);
            window.scrollTo(0, 0); // Ensure we start at top of new page
        }, 1200); // 1.2s warp duration

        return () => clearTimeout(timer);
    }, [location.pathname]); // Only trigger when path changes

    return (
        <>
            {isLoading && <LoadingScreen />}
            <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s ease-in' }}>
                {children}
            </div>
        </>
    );
}

export default PageTransition;
