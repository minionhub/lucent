// SplashScreen.js
import React from 'react';
import './SplashScreen.css'; // Import the CSS file for styles
import spinner from '../assets/images/spinner.svg'; // Replace with path to your spinner image

const SplashScreen = () => {
    return (
        <div className="splash-screen">
            <img src={spinner} width={100} alt="Loading..." className="spinner" />
        </div>
    );
};

export default SplashScreen;
