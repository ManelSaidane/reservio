import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Publications = () => {
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    axios.get('/api/publications')
      .then(response => setPublications(response.data))
      .catch(error => console.error('Erreur de chargement des publications:', error));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestion des Publications</h2>
      <button className="bg-blue-500 text-white px-4 py-2 mb-4">Ajouter une Publication</button>
      <ul>
        {publications.map(pub => (
          <li key={pub.id} className="mb-4 p-4 border rounded shadow">
            <h3 className="font-bold">{pub.title}</h3>
            <p>{pub.description}</p>
            <button className="bg-green-500 text-white px-4 py-2 mt-2">Modifier</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Publications;
