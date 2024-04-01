import React from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import LogoIcon from '../assets/images/logo.png'; // Make sure the path is correct

const LucentPage = () => {

  const navigate = useNavigate();
  // const { setAuthToken } = useAuth();

  const settings = {
    dots: true, // Enables the dot indicators
    infinite: true, // Infinite looping
    speed: 500, // Animation speed
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
    autoplay: true, // Enable automatic sliding
    autoplaySpeed: 3000, // Slide interval in milliseconds
    swipeToSlide: true, // Allow each slide to be swipeable
    arrows: false, // Hide arrows
    adaptiveHeight: true // Adjust height to the content of the slide
  };

  const getStart = () => {
    navigate('/login');
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background p-4">
      <div className="text-center w-full px-6">
        <div className="mb-4">
          <img src={LogoIcon} alt="Lucent Logo" width={200} className="mx-auto" />
        </div>
        <h1 className="text-xl font-bold mb-4">Call and Text Sync</h1>
        <p className='mt-12 text-xl'>See your calls and texts <br/> across all your devices</p>
        <div className="w-full max-w-md mx-auto mt-4"> {/* Adjust width as needed */}
          <Slider {...settings}>
            <div>
              <p className="text-sm">swipe to learn more</p>
            </div>
            {/* Repeat for as many slides as you need */}
            <div>
              <p className="text-sm">swipe to learn more</p>
            </div>
          </Slider>
        </div>
        <button className="bg-red-500 text-white w-full py-2 rounded-full mt-16 max-w-[200px]" onClick={getStart}>
          Get Started
        </button>

      </div>
    </div>
  );
};

export default LucentPage;
