import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import './styles.css';
import UserStatsChart from './UserStatsChart';

const Statics2 = () => {
  const [userCount, setUserCount] = useState(0);
  const [serviceProviderCount, setServiceProviderCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [
        userCountResponse,
        serviceProviderCountResponse,
        clientCountResponse
      ] = await Promise.all([
        axios.get('http://localhost:3000/services/userCount'),
        axios.get('http://localhost:3000/services/service-provider-count'),
        axios.get('http://localhost:3000/services/client-count'),
      ]);

      setUserCount(userCountResponse.data.userCount || 0);
      setServiceProviderCount(serviceProviderCountResponse.data.serviceProviderCount || 0);
      setClientCount(clientCountResponse.data.clientCount || 0);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError('Failed to fetch statistics.');
    }
  };

  // Données pour les graphiques
  const userChartData = {
    labels: ['Clients', 'Fournisseurs'],
    datasets: [
      {
        label: 'Nombre d\'utilisateurs',
        data: [clientCount, serviceProviderCount],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ],
      },
    ],
  };


  
  return (
    <div >

      <div >
        <div>
          <Pie data={userChartData} />
        </div>
    </div>
    </div>
  );
};

export default Statics2;
