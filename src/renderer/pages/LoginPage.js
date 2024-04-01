// pages/LoginPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '../assets/images/google-icon.jpg';
import EmailIcon from '../assets/images/email.svg';

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

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User signed in: ", user);
        navigate('/syncsetting');
      } else {
        console.log("No user signed in.");
        navigate('/login');
      }
    });

    return () => unsubscribe(); // Cleanup the subscription on unmount
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Navigation is handled by onAuthStateChanged
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEmailSignIn = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setError('Please enter all fields');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigation is handled by onAuthStateChanged
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background p-4">
      <div className="bg-background p-8 rounded w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Welcome to Lucent!</h2>
        <button
          className="flex items-center justify-center w-full p-3 bg-white rounded-full mb-3"
          onClick={handleGoogleSignIn}
        >
          <img src={GoogleIcon} alt="Google" className="w-5 h-5 mr-2" />
          Continue with Google
        </button>
        <div className="flex items-center my-3">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-2 text-gray-500">OR</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>
        <form onSubmit={handleEmailSignIn}>
          <input
              type="email"
              placeholder="Your email address"
              className="w-full p-3 border rounded-full mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Your password"
              className="w-full p-3 border rounded-full mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          <button
            type="submit"
            className="flex items-center justify-center w-full p-3 bg-red-500 text-white rounded-full"
          >
            <img src={EmailIcon} alt="Email" className="w-10 mr-2" />
            Continue with Email
          </button>
        </form>
        <p className="text-xs text-center text-gray-500 mt-4">
          By continuing, I accept Lucent's
          <a href="/" onClick={(e) => e.preventDefault()} className="text-blue-500"> Terms of Service </a>and
          <a href="/" onClick={(e) => e.preventDefault()} className="text-blue-500"> Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
