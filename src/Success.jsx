import React, { useEffect } from 'react';
import axios from 'axios';
import './Success.css'; // Importez le CSS pour la page de succès

const SuccessPage = () => {
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const sessionId = queryParams.get('session_id');
      const token = localStorage.getItem('jwt'); // Récupérer le token JWT

      if (sessionId && token) {
        try {
          // Assurez-vous que le chemin correspond à votre endpoint
          await axios.post(
            'http://localhost:3000/stripe/handle-payment-success',
            { sessionId },
            {
              headers: {
                Authorization: `Bearer ${token}`, // Envoyer le token JWT
              },
            },
          );
        } catch (error) {
          console.error('Error handling payment success:', error);
        }
      }
    };

    fetchPaymentDetails();
  }, []);

  return (
    <div className='success-container'>
      <div className='success-message'>
        <h1>Payment Successful!</h1>
        <p>Your payment has been processed successfully. Thank you for your purchase!</p>
        <a href="/" className='success-button'>Return to Home</a>
      </div>
    </div>
  );
};

export default SuccessPage;
