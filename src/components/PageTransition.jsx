import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

function PageTransition({ children }) {
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        let timer;
        const startTransition = async () => {
            setIsLoading(true);
            timer = setTimeout(() => {
                setIsLoading(false);
                window.scrollTo(0, 0);
            }, 1200);
        };

        startTransition();

        return () => clearTimeout(timer);
    }, [location.pathname]);

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
