import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/services');
        setServices(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des services :', error);
      }
    };

    fetchServices();
  }, []);

  const handleDeleteService = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/services/${id}`);
      setServices(services.filter(service => service.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression du service :', error);
    }
  };

  return (
    <div className="services">
      <h2>Mes Services</h2>
      <ul>
        {services.map(service => (
          <li key={service.id}>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <button onClick={() => handleDeleteService(service.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Services;
