import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import './styles.css';
import UserStatsChart from './UserStatsChart'; // Assurez-vous que le chemin soit correct
import LatestSignups from './LatestSignups';
import Statics2 from './Statics2';

const StatisticsPage = () => {
  const [userCount, setUserCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [reservationCount, setReservationCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [
        userCountResponse,
        serviceCountResponse,
        reservationCountResponse,
      ] = await Promise.all([
        axios.get('http://localhost:3000/services/userCount'),
        axios.get('http://localhost:3000/services/serviceCount'),
        axios.get('http://localhost:3000/services/reservationCount'),
      ]);

      setUserCount(userCountResponse.data);
      setServiceCount(serviceCountResponse.data);
      setReservationCount(reservationCountResponse.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Gérer l'erreur de manière appropriée (par exemple, afficher un message d'erreur)
    }
  };

  // Données d'exemple pour les graphiques (remplacer par les données réelles)
  const userChartData = {
    labels: ['Utilisateurs'],
    datasets: [
      {
        label: 'Nombre d\'utilisateurs',
        data: [userCount],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ],
      },
    ],
  };

  const serviceChartData = {
    labels: ['Services'],
    datasets: [
      {
        label: 'Nombre de services',
        data: [serviceCount],
        backgroundColor: [
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ],
      },
    ],
  };

  const reservationChartData = {
    labels: ['Réservations'],
    datasets: [
      {
        label: 'Nombre de réservations',
        data: [reservationCount],
        backgroundColor: [
          'rgba(255, 159, 64, 0.6)'
        ],
      },
    ],
  };

  return (
    <div className="statistics-page">
      <h1>Statistiques</h1>

      <div className="charts-container">
        <div className="chart">
          <h2>Utilisateurs</h2>
          <Statics2/>
        </div>
        <div className="chart">
          <h2>Services</h2>
          <Bar data={serviceChartData} />
        </div>
        <div className="chart">
          <h2>Réservations</h2>
          <Bar data={reservationChartData} />
        </div>
      </div>
      <div className="centered-chart">
        <UserStatsChart />
      </div>
    </div>
  );
};

export default StatisticsPage;



