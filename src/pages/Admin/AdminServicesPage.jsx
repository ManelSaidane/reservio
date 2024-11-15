import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Correction de l'import

const AdminServicesPage = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('DateFin'); // Valeur par défaut pour le tri
  const [order, setOrder] = useState('asc'); // Valeur par défaut pour l'ordre
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]); // État pour les catégories

  useEffect(() => {
    fetchCategories(); // Récupérer les catégories au chargement du composant
  }, []);

  useEffect(() => {
    fetchServices(); // Récupérer les services chaque fois que les filtres changent
  }, [sortBy, order, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/categories');
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error('Réponse API non valide : le tableau de catégories est introuvable.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories :', error);
    }
  };

  const fetchServices = async () => {
    try {
      const queryParams = new URLSearchParams({
        sortBy,
        order,
      }).toString();

      const url = selectedCategory
        ? `http://localhost:3000/services/category/${selectedCategory}`
        : `http://localhost:3000/services/tri?${queryParams}`;
        
      const response = await axios.get(url);
      if (Array.isArray(response.data)) {
        console.log("Réponse de l'API services :", response.data);

        const servicesWithUsers = await Promise.all(
          response.data.map(async (service) => {
            const userResponse = await axios.get(
              `http://localhost:3000/users/${service.userId}`,
            );
            const user = userResponse.data;

            return {
              ...service,
              user: {
                Nom: user.Nom,
                Email: user.Email,
                Num: user.Num,
              },
            };
          }),
        );

        console.log('Services avec utilisateurs enrichis :', servicesWithUsers);
        setServices(servicesWithUsers);
      } else {
        console.error('Réponse API non valide : le tableau de services est introuvable.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des services :', error);
    }
  };

  const deleteService = async (id) => {
    const token = localStorage.getItem('jwt'); // Retrieve the JWT token from local storage
    if (!token) {
      console.error('Token JWT non trouvé');
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/services/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(`Service with ID ${id} deleted successfully.`);
      fetchServices(); // Refresh the list after deletion
    } catch (error) {
      console.error('Échec de la suppression du service', error);
    }
  };

  const filteredServices = services.filter(service =>
    service.Titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='accueil-services-container'>
      <h1>Liste des Services</h1>
      <div className='filters'>
        <input
          type='text'
          placeholder='Rechercher un service...'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='search-bar'
        />
        <select onChange={e => setSortBy(e.target.value)} value={sortBy}>
          <option value='DateFin'>Date de fin</option>
          <option value='Prix'>Prix</option>
        </select>
        <select onChange={e => setOrder(e.target.value)} value={order}>
          <option value='asc'>Ascendant</option>
          <option value='desc'>Descendant</option>
        </select>
        <select onChange={e => setSelectedCategory(e.target.value)} value={selectedCategory}>
          <option value=''>Toutes les catégories</option>
          {categories.map(category => (
            <option key={category.ID} value={category.ID}>
              {category.Nom} {/* Assure-toi que tu as le nom de la catégorie ici */}
            </option>
          ))}
        </select>
      </div>
      {filteredServices.length === 0 ? (
        <p>Aucun service trouvé.</p>
      ) : (
        <div className='accueil-services-list'>
          {filteredServices.map(service => (
            <div key={service.ID} className='accueil-service-item'>
              <img
                src={`http://localhost:3000/uploads/${service.Image}`}
                alt={service.Titre}
                className='accueil-service-image'
              />
              <div className='accueil-service-details'>
                <h2>{service.Titre}</h2>
                <p>Description: {service.Description}</p>
                <p>Prix: {service.Prix} Dt</p>
                <p>Date de début: {new Date(service.DateDebut).toLocaleDateString()}</p>
                <p>Date de fin: {new Date(service.DateFin).toLocaleDateString()}</p>
                {service.user && (
                  <div className='accueil-user-info'>
                    <h3>Fournisseur :</h3>
                    <p>Nom: {service.user.Nom}</p>
                    <p>Email: {service.user.Email}</p>
                    <p>Numéro: {service.user.Num}</p>
                  </div>
                )}
                <button
                  onClick={() => deleteService(service.ID)}
                  className='delete-button'>
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminServicesPage;
