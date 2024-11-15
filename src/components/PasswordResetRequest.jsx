import React, { useState } from 'react';
import axios from 'axios';
import './PasswordResetRequest.css';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/reservation/forgot-password', { email });
      setMessage('Un email de réinitialisation a été envoyé.');
    } catch (error) {
      setMessage('Erreur lors de la demande de réinitialisation.');
    }
  };

  return (
    <div className="password-reset-request-container">
      <h2 className="password-reset-request-title">Réinitialiser le Mot de Passe</h2>
      <form className="password-reset-request-form" onSubmit={handleSubmit}>
        <div>
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Envoyer</button>
      </form>
      {message && <p className="password-reset-request-message">{message}</p>}
    </div>
  );
};

export default PasswordResetRequest;
