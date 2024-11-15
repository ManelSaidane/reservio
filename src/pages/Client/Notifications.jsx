import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('jwt');

  const fetchNotifications = useCallback(async () => {
    try {
      const userId = getUserIdFromToken(token);
      if (!userId) {
        throw new Error('ID utilisateur invalide.');
      }
      console.log(`Fetching notifications for user ID: ${userId}`);
      const response = await axios.get(
        `http://localhost:3000/reservation/${userId}/accepted-rejected`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error.response?.data || error.message);
      setError('Erreur lors de la récupération des notifications.');
    }
  }, [token]);

  const cancelReservation = useCallback(async (id) => {
    if (!id) {
      console.error('ID de réservation manquant.');
      setError('ID de réservation manquant.');
      return;
    }
    console.log(`Attempting to cancel reservation with ID: ${id}`);
    try {
      const response = await axios.patch(
        `http://localhost:3000/reservation/cancel/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Cancellation response:', response.data);
      fetchNotifications(); 
    } catch (error) {
      console.error('Error canceling reservation:', error.response?.data || error.message);
      setError('Erreur lors de l\'annulation de la réservation.');
    }
  }, [fetchNotifications, token]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getUserIdFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  return (
    <div className='notifications-container'>
      <h1>Notifications</h1>
      {error && <p className='error-message'>{error}</p>}
      {notifications.length === 0 ? (
        <p>Aucune notification trouvée.</p>
      ) : (
        <ul className='notifications-list'>
          {notifications.map((notification) => (
            <li key={notification.ID} className='notification-item'>
              <p>
                <strong>Statut:</strong> {notification.statut}
              </p>
              <p>
                <strong>Date de début:</strong> {notification.DateDebut ? new Date(notification.DateDebut).toLocaleDateString() : 'Non spécifiée'}
              </p>
              <p>
                <strong>Date de fin:</strong> {notification.DateFin ? new Date(notification.DateFin).toLocaleDateString() : 'Non spécifiée'}
              </p>
              <p>
                <strong>Titre du service:</strong> {notification.service.Titre}
              </p>
              <p>
                <strong>Description du service:</strong> {notification.service.Description}
              </p>
              <p>
                <strong>Nom du fournisseur:</strong> {notification.service.user?.Nom || 'Non disponible'}
              </p>
              <p>
                <strong>Numéro de téléphone du fournisseur:</strong> {notification.service.user?.Num || 'Non disponible'}
              </p>
              {/* <p>
                <strong>Message:</strong> {getMessageForStatus(notification.statut)}
              </p> */}
              {notification.statut === 'ACCEPTED' && (
                <button
                  className='cancel-button'
                  onClick={() => cancelReservation(notification.ID)}
                >
                  Annuler
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const getMessageForStatus = (statut) => {
  switch (statut) {
    case 'ACCEPTED':
      return 'Votre réservation a été acceptée.';
    case 'REJECTED':
      return 'Votre réservation a été rejetée.';
    default:
      return 'Statut de réservation inconnu.';
  }
};

export default Notifications;
