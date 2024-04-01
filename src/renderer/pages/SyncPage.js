import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SplashScreen from '../utils/SplashScreen';
import PhoneIcon from '../assets/images/phone.png';
import firebase from 'firebase/app';
import 'firebase/firestore'; // Example for firestore

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { collection, getFirestore, doc, getDoc, setDoc, writeBatch, query, where, getDocs } from 'firebase/firestore';

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
export const db = getFirestore(app);

const SyncPage = () => {
  const navigate = useNavigate();
  const [syncStatus, setSyncStatus] = useState('starting'); // starting, inProgress, completed
  const [progress, setProgress] = useState(0); // Progress percentage
  const [callcount, setCallcount] = useState(0); // Number of calls synced
  const [messagecount, setMessagecount] = useState(0); // Number of messages synced
  
  const [messages, setMessages] = useState([]);
  const [calls, setCalls] = useState([]);

  const [messagesIsactive, setMessagesIsactive] = useState(true);
  const [callsIsactive, setCallsIsactive] = useState(true);

  // Memo hooks for data fetching
  const fetchMessages = useMemo(() => {
    window.electron.fetchMessages().then(data => {
      if (messagesIsactive) {
        setMessages(data);
        setMessagecount(data.length)
        setMessagesIsactive(false)
      }
    });
    return () => { setMessagesIsactive(false) }; // Cleanup function to prevent state update if component unmounts
  }, []); // Empty dependency array

  const fetchCalls = useMemo(() => {
    window.electron.fetchCalls().then(data => {
      if (callsIsactive) {
        setCalls(data);
        console.log("data: ", data);
        setCallcount(data.length);
        setCallsIsactive(false)
      }
    });
    return () => { setCallsIsactive(false) };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      }
    });

    return () => unsubscribe(); // Cleanup the subscription on unmount
  }, [navigate]);

  const disconnectHandler = async () => {
    try {
      await signOut(auth);
      // User is now signed out and session is removed
      // Navigation to '/' is handled by onAuthStateChanged
    } catch (error) {
      setError(error.message);
    }
  }

  const syncHanlder = async () => {
    setSyncStatus('inProgress');
    try {
      await Promise.all([
          uploadCallsToFirestore(calls),
          uploadMessagesbasicToFirestore(messages),
          uploadMessagesToFirestore(messages),
      ]);
      // After all uploads have finished, then set the status to 'completed'
      setSyncStatus('completed');
    } catch (error) {
        console.error("Error during sync: ", error);
        // Optionally, handle errors such as updating syncStatus to an 'error' state
    }
  }


  // Function to upload calls to Firestore
  const uploadCallsToFirestore = async (calls) => {
    const callsCollectionRef = collection(db, 'call_logs');
  
    for (const call of calls) {
      const uniqueId = `${call.stringDate}_${call.stringAddress}`;
      const callDocRef = doc(callsCollectionRef, uniqueId);
  
      try {
        const docSnap = await getDoc(callDocRef);
        if (!docSnap.exists()) {
          await setDoc(callDocRef, {
            dateTime: call.stringDate,
            phoneNumber: call.stringAddress,
          });
          console.log(`Call log added with ID: ${uniqueId}`);
        } else {
          console.log(`Call log with ID: ${uniqueId} already exists. Skipping...`);
        }
      } catch (error) {
        console.error(`Error adding call log with ID: ${uniqueId}`, error);
      }
    }
  };
  
  const uploadMessagesbasicToFirestore = async (messages) => {
    const smsbasicCollectionRef = collection(db, 'sms_basic_logs');
  
    for (const message of messages) {
      const uniqueId = `${message.stringDate}_${message.account}`;
      const messageDocRef = doc(smsbasicCollectionRef, uniqueId);
  
      try {
        const docSnap = await getDoc(messageDocRef);
        if (!docSnap.exists()) {
          await setDoc(messageDocRef, {
            dateTime: message.stringDate,
            phoneNumber: message.account,
          });
          console.log(`Message log added with ID: ${uniqueId}`);
        } else {
          console.log(`Message log with ID: ${uniqueId} already exists. Skipping...`);
        }
      } catch (error) {
        console.error(`Error adding message log with ID: ${uniqueId}`, error);
      }
    }
  };
  
  const uploadMessagesToFirestore = async (messages) => {
    const messagesCollectionRef = collection(db, 'sms_logs');
  
    for (const message of messages) {
      // This uniqueId generation is basic; adjust as needed to ensure uniqueness
      const uniqueId = `${message.stringDate}_${message.text.substring(0, 20)}`;
      const messageDocRef = doc(messagesCollectionRef, uniqueId);
  
      try {
        const docSnap = await getDoc(messageDocRef);
        if (!docSnap.exists()) {
          await setDoc(messageDocRef, {
            dateTime: message.stringDate,
            message: message.text,
          });
          console.log(`Full message log added with ID: ${uniqueId}`);
        } else {
          console.log(`Full message log with ID: ${uniqueId} already exists. Skipping...`);
        }
      } catch (error) {
        console.error(`Error adding full message log with ID: ${uniqueId}`, error);
      }
    }
  };


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background p-4">
      {(messagesIsactive || callsIsactive)  && <SplashScreen />}
      {syncStatus === 'inProgress'  && <SplashScreen />}
    <h1 className='text-center font-bold text-xl mt-20'>Call and Text Sync</h1>
      <div className="bg-background p-8 rounded w-full max-w-xs">
        <div className="mb-4 flex justify-center">
          {/* Replace with actual path to your icon */}
          <img src={PhoneIcon} alt="PhoneIcon" className="w-24 h-24 text-blue-500 mx-auto" />
        </div>

        <h2 className="text-xl text-center">
          {syncStatus === 'starting' && 'Your iPhone is Syncing'}
          {syncStatus === 'inProgress' && `Your iPhone is Syncing`}
          {syncStatus === 'completed' && 'Your iPhone is Ready'}
        </h2>

        <div className="flex mx-12 justify-between text-center my-8">
          <div>
            <div className="text-xl">{callcount}</div>
            <div className="text-[10px]">CALLS</div>
          </div>
          <div>
            <div className="text-xl">{messagecount}</div>
            <div className="text-[10px]">MESSAGES</div>
          </div>
        </div>
        <h2 className="text-lg font-bold text-center mb-2">
          {/* {syncStatus === 'starting' && 'Starting Backup ...'} */}
          {syncStatus === 'inProgress' && `Backup In Progress`}
          {syncStatus === 'starting' && ''}
        </h2>
        {syncStatus === 'starting' && (
          <div className="text-center text-sm mb-2">
            <p className='italic mb-4'>Last successful sync at 10:35 AM</p>
            <p className='mb-4'>New calls and messages will be synced to your Lucent account every 12 hours.</p>
            <p className='mb-4'>To sync your iPhone, you must be on the same Wi-Fi network as this computer.</p>
            <p className='mb-4'>For security, you may need to enter your passcode to sync.</p>
          </div>
        )}

        <div className="text-center mt-6">
          {syncStatus === 'starting' ? (
            <>
              <button className="bg-blue-500 text-white w-full py-2 rounded-full mb-2" onClick={() => syncHanlder()}>
                Sync Now
              </button>
              <button className="bg-red-500 text-white w-full py-2 rounded-full" onClick={() => disconnectHandler()}>
                Disconnect
              </button>
            </>
          ) : syncStatus === 'inProgress' ? (
            <></>
          ) : (<>
            <button className="bg-red-500 text-white w-full py-2 rounded-full" onClick={() => disconnectHandler()}>
                Disconnect
              </button>
          </>)}
        </div>
      </div>
    </div>
  );
};

export default SyncPage;
