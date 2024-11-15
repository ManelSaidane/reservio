import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PendingReservations.css';

const PendingReservations = () => {
  const [pendingReservations, setPendingReservations] = useState([]);
  const token = localStorage.getItem('jwt');

  useEffect(() => {
    fetchPendingReservations();
  }, []);

  const fetchPendingReservations = async () => {
    try {
      const userId = JSON.parse(atob(token.split('.')[1])).id; // Extraire userId du token JWT
      const response = await axios.get(
        `http://localhost:3000/reservation/${userId}/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPendingReservations(response.data);
    } catch (error) {
      console.error('Error fetching pending reservations:', error);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      await axios.delete(`http://localhost:3000/reservation/${reservationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Mettre à jour la liste des réservations en attente après suppression
      setPendingReservations(prevReservations =>
        prevReservations.filter(reservation => reservation.ID !== reservationId)
      );
    } catch (error) {
      console.error('Error cancelling reservation:', error);
    }
  };

  const formatDate = dateString => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className='pending-reservations-container'>
      <h1>Reservations en Attente</h1>
      {pendingReservations.length === 0 ? (
        <p>Aucune réservation en attente trouvée.</p>
      ) : (
        <ul className='pending-reservations-list'>
          {pendingReservations.map(reservation => (
            <li key={reservation.ID} className='pending-reservation-item'>
            {/* <p>
                <strong>Date de réservation:</strong> 
              </p> */}
              <p>
                <strong>Date de début:</strong> {reservation.DateDebut ? formatDate(reservation.DateDebut) : 'Non spécifiée'}
              </p>
              <p>
                <strong>Date de fin:</strong> {reservation.DateFin ? formatDate(reservation.DateFin) : 'Non spécifiée'}
              </p>
              <p>
                <strong>Statut:</strong> {reservation.statut}
              </p>
              <p>
                <strong>Titre du Service:</strong> {reservation.service.Titre}
              </p>
              <p>
                <strong>Description du Service:</strong> {reservation.service.Description}
              </p>
              <button onClick={() => handleCancelReservation(reservation.ID)}>
                Annuler
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingReservations;
