import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './promotion.css';

const Promotion = () => {
  const [services, setServices] = useState([]);
  const [promotion, setPromotion] = useState({
    discount: 0,
    startDate: '',
    endDate: '',
    isGlobal: false,
    serviceId: '', // Assurez-vous que ce champ est bien géré comme une chaîne de caractères pour l'instant
  });
  const [isValidated, setIsValidated] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) throw new Error('No token found');

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;

        // Vérifiez la validation de l'utilisateur avant de récupérer les services
        const validationResponse = await axios.get(
          'http://localhost:3000/reservation/user/validation-status',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsValidated(validationResponse.data.isValidated);
        setIsBlocked(!validationResponse.data.isValidated);

        if (!validationResponse.data.isValidated) return;

        // Récupération des services si l'utilisateur est validé
        const response = await axios.get(
          `http://localhost:3000/services/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services or validation status:', error);
      }
    };

    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPromotion(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifiez les données du formulaire avant l'envoi
    console.log('Promotion data before submission:', promotion);

    if (!promotion.serviceId) {
      alert('Please select a service');
      return;
    }

    if (isBlocked) {
      alert('Votre compte est bloqué. Veuillez effectuer le paiement pour activer votre compte.');
      return;
    }

    const promotionData = {
      ...promotion,
      discount: parseFloat(promotion.discount) || 0,
      serviceId: parseInt(promotion.serviceId, 10) || null,
    };

    console.log('Promotion data to be sent:', promotionData); // Afficher les données envoyées pour débogage

    try {
      const response = await axios.post('http://localhost:3000/promotions/promotion', promotionData);
      alert('Promotion added successfully');
      setPromotion({
        discount: 0,
        startDate: '',
        endDate: '',
        isGlobal: false,
        serviceId: ''
      });
    } catch (error) {
      console.error('Error adding promotion:', error);
    }
  };

  return (
    <div className='promotion-container'>
      <h1>Ajouter Votre Promotion :</h1>
      {isBlocked && (
        <div className='account-blocked-message'>
          Votre compte est bloqué. Veuillez effectuer le paiement pour activer
          votre compte. Il sera réactivé après 24 heures.
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Remise:</label>
          <input
            type="number"
            name="discount"
            value={promotion.discount}
            onChange={handleChange}
            required
            disabled={isBlocked}
          />
        </div>
        <div>
          <label>Date de Debut :</label>
          <input
            type="date"
            name="startDate"
            value={promotion.startDate}
            onChange={handleChange}
            required
            disabled={isBlocked}
          />
        </div>
        <div>
          <label>Date de Fin:</label>
          <input
            type="date"
            name="endDate"
            value={promotion.endDate}
            onChange={handleChange}
            required
            disabled={isBlocked}
          />
        </div>
        {/* <div>
          <label>Global Promotion:</label>
          <input
            type="checkbox"
            name="isGlobal"
            checked={promotion.isGlobal}
            onChange={handleChange}
            disabled={isBlocked}
          />
        </div> */}
        <div>
          <label>Service:</label>
          <select
            name="serviceId"
            value={promotion.serviceId}
            onChange={handleChange}
            required
            disabled={isBlocked}
          >
            <option value="">Select a service</option>
            {services.map(service => (
              <option key={service.ID} value={service.ID}>
                {service.Titre}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={isBlocked}>Add Promotion</button>
      </form>
    </div>
  );
};

export default Promotion;
