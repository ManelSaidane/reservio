import React from 'react';
import './Cancel.css';

const Cancel = () => {
  return (
    <div className="cancel-container">
      <div className="cancel-message">
        <h1>Payment Canceled</h1>
        <p>Your payment has been canceled. If you have any questions, please contact our support.</p>
        <a href="/">Go to Home</a>
      </div>
    </div>
  );
};

export default Cancel;
