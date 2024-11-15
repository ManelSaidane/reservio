import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './PasswordReset.css';

const PasswordReset = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas.');
      return;
    }
    try {
      await axios.post(`http://localhost:3000/reservation/reset-password/${token}`, { newPassword });
      setMessage('Le mot de passe a été réinitialisé.');
      navigate('/login'); // Utilisation de navigate au lieu de useHistory().push
    } catch (error) {
      setMessage('Erreur lors de la réinitialisation du mot de passe.');
    }
  };

  return (
    <div className="password-reset-container">
      <h2 className="password-reset-title">Réinitialisation du Mot de Passe</h2>
      <form className="password-reset-form" onSubmit={handleSubmit}>
        <div>
          <label>Nouveau Mot de Passe :</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirmer le Mot de Passe :</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Réinitialiser le Mot de Passe</button>
      </form>
      {message && <p className="password-reset-message">{message}</p>}
    </div>
  );
};

export default PasswordReset;
