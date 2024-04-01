import React, { useEffect, useState } from 'react';

const MessageViewer = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    window.electron.fetchMessages().then(setMessages);

    // setMessages([
    //   { id: 1, text: 'Hello, how are you?', timestamp: 'Today, 12:18', isSender: false },
    //   { id: 2, text: 'I am fine, thanks!', timestamp: 'Today, 12:19', isSender: true },
    //   // ...other messages
    // ]);

  }, []);

  return (
    <div className="p-4 bg-gray-100 h-screen">
      <div className="text-center font-semibold text-lg mb-4">Messages</div>
      <div className="mx-auto max-w-md">
        {messages.map((msg) => (
          <div key={msg.text} className={`flex ${msg.isSender ? 'justify-start' : 'justify-end'}`}>
            <div className="flex flex-col">
              <span className={`my-4 mx-2 px-4 py-2 rounded-lg inline-block rounded-br-none ${msg.isSender ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
                {msg.text}
              </span>
              <span className={`text-xs ${msg.isSender ? 'text-right' : 'text-left'}`}>
                {/* {msg.timestamp} */}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageViewer;
