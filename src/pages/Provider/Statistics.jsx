import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './Statistics.css';

const Statistics = () => {
  const [stats, setStats] = useState({
    totalDemands: 0,
    acceptedDemands: 0,
    rejectedDemands: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    axios.get('http://localhost:3000/reservation/statistics', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`, // Assuming you store your token in localStorage
      },
    })
      .then(response => setStats(response.data))
      .catch(error => console.error('Erreur de chargement des statistiques:', error));
  }, []);

  const totalDemands = stats.totalDemands;
  const acceptedPercentage = (stats.acceptedDemands / totalDemands) * 100;
  const rejectedPercentage = (stats.rejectedDemands / totalDemands) * 100;
  const pendingPercentage = 100 - acceptedPercentage - rejectedPercentage;

  const data = {
    labels: ['Accepted', 'Rejected', 'Pending'],
    datasets: [
      {
        data: [acceptedPercentage, rejectedPercentage, pendingPercentage],
        backgroundColor: ['#4CAF50', '#F44336', '#FF9800'],
        hoverBackgroundColor: ['#45a049', '#e53935', '#fb8c00'],
      },
    ],
  };

  return (
    <div className="dashboard">
      {/* <h2 className="dashboard-title">Tableau de Bord</h2> */}
      <div className="stats-container">
        <div className="stat-item">
          <h3>Total des Demandes</h3>
          <p>{stats.totalDemands}</p>
        </div>
        <div className="stat-item">
          <h3>Revenus Totaux</h3>
          <p>{stats.totalRevenue}Dt</p>
        </div>
        <div className="chart-container">
          <Pie data={data} />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
