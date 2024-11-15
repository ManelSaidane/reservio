import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const token = window.localStorage.getItem('jwt'); // Récupérer le token depuis le localStorage

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('http://localhost:3000/reservation/fournisseur', {
          headers: {
            Authorization: `Bearer ${token}` // Ajouter le token à l'en-tête d'autorisation
          }
        });
        setReservations(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des réservations :', error);
      }
    };

    fetchReservations();
  }, [token]);

  const handleAcceptReservation = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/reservation/${id}/accept`, {}, {
        headers: {
          Authorization: `Bearer ${token}` // Ajouter le token à l'en-tête d'autorisation
        }
      });
      setReservations(reservations.map(reservation => {
        if (reservation.id === id) {
          reservation.status = 'ACCEPTED';
        }
        return reservation;
      }));
    } catch (error) {
      console.error('Erreur lors de l\'acceptation de la réservation :', error);
    }
  };

  const handleRejectReservation = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/reservation/${id}/reject`, {}, {
        headers: {
          Authorization: `Bearer ${token}` // Ajouter le token à l'en-tête d'autorisation
        }
      });
      setReservations(reservations.map(reservation => {
        if (reservation.id === id) {
          reservation.status = 'REJECTED';
        }
        return reservation;
      }));
    } catch (error) {
      console.error('Erreur lors du rejet de la réservation :', error);
    }
  };

  return (
    <div className="reservations">
      <h2>Demandes à traiter</h2>
      <ul>
        {reservations.map(reservation => (
          <li key={reservation.id}>
            <h3>Réservation #{reservation.id}</h3>
            <p>{reservation.details}</p>
            <button onClick={() => handleAcceptReservation(reservation.id)}>Accepter</button>
            <button onClick={() => handleRejectReservation(reservation.id)}>Rejeter</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reservations;
