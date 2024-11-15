import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Messages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get('/api/messages')
      .then(response => setMessages(response.data))
      .catch(error => console.error('Erreur de chargement des messages:', error));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Messagerie</h2>
      <ul>
        {messages.map(message => (
          <li key={message.id} className="mb-4 p-4 border rounded shadow">
            <h3 className="font-bold">{message.sender}</h3>
            <p>{message.content}</p>
            <button className="bg-blue-500 text-white px-4 py-2 mt-2">Répondre</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Messages;
