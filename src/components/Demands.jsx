import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Demands = () => {
  const [demands, setDemands] = useState([]);

  useEffect(() => {
    axios.get('/api/demands')
      .then(response => setDemands(response.data))
      .catch(error => console.error('Erreur de chargement des demandes:', error));
  }, []);

  const handleAccept = (id) => {
    // Logic to accept demand
  };

  const handleReject = (id) => {
    // Logic to reject demand
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestion des Demandes</h2>
      <ul>
        {demands.map(demand => (
          <li key={demand.id} className="mb-4 p-4 border rounded shadow">
            <h3 className="font-bold">{demand.title}</h3>
            <p>{demand.description}</p>
            <button 
              className="bg-green-500 text-white px-4 py-2 mt-2" 
              onClick={() => handleAccept(demand.id)}
            >
              Accepter
            </button>
            <button 
              className="bg-red-500 text-white px-4 py-2 mt-2 ml-2" 
              onClick={() => handleReject(demand.id)}
            >
              Refuser
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Demands;
