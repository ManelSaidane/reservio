import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';  // Make sure you import jwtDecode correctly
import './ProviderPayment.css';

const stripePromise = loadStripe(
  'pk_test_51PhWseRrsan0srWKcctzRYFAEQEYfNWpG5jXmyuXBu2aOwerNACFStXOAhKAt1ku8wYw6YU95e8EcuT0ufQwG15W00TbjOfE7o'
);

const ProviderPayment = () => {
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const decodedToken = jwtDecode(token);
      const email = decodedToken.email; // Extraire l'email du token décodé

      const response = await axios.post(
        'http://localhost:3000/stripe/create-checkout-session',
        { email }, // Envoyer l'email dans la requête
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { id } = response.data;
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId: id });

      if (error) {
        console.error('Stripe Checkout Error:', error);
      }
    } catch (error) {
      console.error('Error during payment process:', error);
    }
  };

  return (
    <div className='payment-container'>
      <h1 className='payment-title'>Complete Your Payment</h1>
      <p className='payment-description'>
        To proceed with your subscription, please click the button below to pay with Stripe.
      </p>
      <button onClick={handlePayment} className='payment-button'>
        Pay with Stripe
      </button>
    </div>
  );
};

export default ProviderPayment;
