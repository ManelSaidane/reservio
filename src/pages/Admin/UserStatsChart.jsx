import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import './user-stats-chart.css'; // Assurez-vous que le chemin soit correct
import { jwtDecode } from 'jwt-decode';

const UserStatsChart = () => {
  const [stats, setStats] = useState({ clientsCount: 0, providersCount: 0 });
  const [labels, setLabels] = useState([]);
  const [clientsData, setClientsData] = useState([]);
  const [providersData, setProvidersData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;

          // Récupérer les fournisseurs de services
          const providersResponse = await axios.get('http://localhost:3000/users/service-providers', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              userId: userId,
            },
          });

          // Récupérer les clients
          const clientsResponse = await axios.get('http://localhost:3000/users/client', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              userId: userId,
            },
          });

          const providersCount = providersResponse.data.length;
          const clientsCount = clientsResponse.data.length;

          setStats({ clientsCount, providersCount });

          // Créer les labels et données pour le graphique
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth() + 1;

          const labels = [];
          const clientsData = [];
          const providersData = [];

          for (let i = 0; i < 6; i++) {
            labels.unshift(currentMonth - i <= 0 ? currentMonth - i + 12 : currentMonth - i);
            clientsData.unshift(Math.floor(Math.random() * 10) + 5); // Exemple : données aléatoires pour les clients
            providersData.unshift(Math.floor(Math.random() * 10) + 5); // Exemple : données aléatoires pour les fournisseurs
          }

          setLabels(labels);
          setClientsData(clientsData);
          setProvidersData(providersData);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques :', error);
      }
    };

    fetchStats();
  }, []);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Clients',
        data: clientsData,
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
      {
        label: 'Fournisseurs de Services',
        data: providersData,
        fill: false,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Mois',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nombre d\'utilisateurs',
        },
      },
    },
  };

  return (
    <div className="stats-container-user">
      <h2>Statistiques Utilisateurs</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default UserStatsChart;
