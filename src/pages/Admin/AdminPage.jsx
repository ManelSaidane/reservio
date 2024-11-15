import React, { useState, useEffect } from 'react';
import axios from 'axios';
import avatar from '../../assets/utilisateur.png';
import './AdminPage.css'; // Updated CSS file name

const AdminPage = () => {
  const [serviceProviders, setServiceProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchServiceProviders();
  }, []);

  const fetchServiceProviders = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await axios.get('http://localhost:3000/users/service-providers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setServiceProviders(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des fournisseurs de services :', error);
    }
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleBlockToggle = async (id, isBlocked) => {
    try {
      const token = localStorage.getItem('jwt');
      const updatedProvider = await axios.patch(
        `http://localhost:3000/users/${id}/validation`,
        { Validation: !isBlocked },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setServiceProviders(serviceProviders.map(provider =>
        provider.ID === id ? { ...provider, Validation: updatedProvider.data.Validation } : provider
      ));
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la validation du fournisseur ${id} :`, error);
    }
  };

  const filteredProviders = serviceProviders.filter(provider =>
    provider.Email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <div className="dashboard-content">
        <h1>Tableau de bord Admin</h1>
        <section className="main-content">
          <div className="providers-section box">
            {/* <h2>Fournisseurs de Services</h2> */}
            <div className="search-bar">
              <input
                type="text"
                placeholder="Rechercher par email..."
                value={searchTerm}
                onChange={handleInputChange}
              />
            </div>
            <table className="providers-table">
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Numéro</th>
                  <th>Créé le</th>
                  <th>Mis à jour le</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProviders.map(provider => (
                  <tr key={provider.ID}>
                    <td><img src={avatar} alt="Avatar" className="provider-avatar" /></td>
                    <td>{provider.Nom}</td>
                    <td>{provider.Email}</td>
                    <td>{provider.Num}</td>
                    <td>{new Date(provider.createdAt).toLocaleDateString()}</td> 
                    <td>{new Date(provider.updatedAt).toLocaleDateString()}</td> 
                    <td>
                      <button
                        className={`button ${provider.Validation ? 'unblocked' : 'blocked'}`}
                        onClick={() => handleBlockToggle(provider.ID, provider.Validation)}
                      >
                        {provider.Validation ? 'Débloquer' : 'Bloquer'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPage;
