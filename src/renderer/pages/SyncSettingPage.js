import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
import PhoneIcon from '../assets/images/phone.png';
import CheckIcon from '../assets/images/check.png';

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBmnSQQTFCuGrpSwiZnfAv6cK_ze064gFY",
  authDomain: "c-rm-temp-bh4lzc.firebaseapp.com",
  databaseURL: "https://c-rm-temp-bh4lzc-default-rtdb.firebaseio.com",
  projectId: "c-rm-temp-bh4lzc",
  storageBucket: "c-rm-temp-bh4lzc.appspot.com",
  messagingSenderId: "857371922312",
  appId: "1:857371922312:web:7726aed70b7b37d9d0743d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const SyncSettingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log("No user signed in.");
        navigate('/login');
      }
    });

    return () => unsubscribe(); // Cleanup the subscription on unmount
  }, [navigate]);
    
    // const { setAuthToken } = useAuth();
  const nextHandle = () => {
    navigate('/sync');
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // User is now signed out and session is removed
      // Navigation to '/' is handled by onAuthStateChanged
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col h-screen justify-between bg-background">
    <h1 className='text-center font-bold text-xl mt-20'>Call and Text Sync</h1>
      <div className="text-center p-4">
        <div className="mb-6">
          {/* Replace with an actual icon or image */}
          <img src={PhoneIcon} alt="PhoneIcon" className="w-24 h-24 text-blue-500 mx-auto" />
        </div>
        <h1 className="text-xl font-bold mb-4">Sync Your iPhone</h1>
        <p className="mb-6">
          Only information you select will be
          <br />
          logged to your Lucent account, and it
          <br />
          will be private to you.
        </p>
        <div className="text-left max-w-[400px] m-auto">
          <div className="flex p-1 items-center cursor-pointer border">
            <div className='w-4/5'>
                <p className="ml-2">Call Basics</p>
                <p className="text-gray-400 ml-2">Date, time, and number</p>
            </div>
            <div className='w-1/5'>
                <img src={CheckIcon} alt="CheckIcon" className="w-5 h-4 text-green-500 m-auto" />
            </div>
          </div>
          <div className="flex p-1 items-center cursor-pointer border">
            <div className='w-4/5'>
                <p className="ml-2">Message Basics</p>
                <p className="text-gray-400 ml-2">Date, time, and number</p>
            </div>
            <div className='w-1/5'>
                <img src={CheckIcon} alt="CheckIcon" className="w-5 h-4 text-green-500 m-auto" />
            </div>
          </div>
          <div className="flex p-1 items-center cursor-pointer border">
            <div className='w-4/5'>
                <p className="ml-2">Message Text</p>
                <p className="text-gray-400 ml-2">Text of messages (no images)</p>
            </div>
            <div className='w-1/5'>
                <img src={CheckIcon} alt="CheckIcon" className="w-5 h-4 text-green-500 m-auto" />
            </div>
          </div>
          <div className="text-gray-500 text-sm ml-7 mb-2 mt-6">
            Messages include iMessages, texts, and WhatsApp
          </div>
        </div>
      </div>
      <div className="flex justify-evenly items-center p-4">
        <button className="bg-blue-500 text-white w-full py-2 rounded-full mb-2 max-w-[200px]" onClick={handleSignOut}>
          <p>Log Out</p>
        </button>
        <button className="bg-red-500 text-white w-full py-2 rounded-full max-w-[200px]" onClick={nextHandle}>
          Next
        </button>
      </div>
    </div>
  );
};

export default SyncSettingPage;
