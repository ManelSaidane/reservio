import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AccueilPage.css';

const AccueilPage = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('DateFin');
  const [order, setOrder] = useState('asc');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [isUserValidated, setIsUserValidated] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories :', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // If a category is selected, fetch by category
        if (selectedCategory) {
          const response = await axios.get(
            `http://localhost:3000/services/category/${selectedCategory}`
          );
          if (Array.isArray(response.data)) {
            const servicesWithUsers = await fetchServicesWithUsers(response.data);
            setServices(servicesWithUsers);
          } else {
            console.error(
              'Réponse API non valide : le tableau de services est introuvable.'
            );
          }
        } else {
          // If no category is selected, fetch by sort order and field
          const params = new URLSearchParams();
          if (sortBy) params.append('sortBy', sortBy);
          if (order) params.append('order', order);

          const response = await axios.get(
            `http://localhost:3000/services/tri?${params.toString()}`
          );
          if (Array.isArray(response.data)) {
            const servicesWithUsers = await fetchServicesWithUsers(response.data);
            setServices(servicesWithUsers);
          } else {
            console.error(
              'Réponse API non valide : le tableau de services est introuvable.'
            );
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des services :', error);
      }
    };

    fetchServices();
  }, [sortBy, order, selectedCategory]);

  const fetchServicesWithUsers = async (services) => {
    return await Promise.all(
      services.map(async (service) => {
        try {
          const userResponse = await axios.get(
            `http://localhost:3000/users/${service.userId}`
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
        } catch (error) {
          console.error(`Erreur lors de la récupération de l'utilisateur :`, error);
          return service; // return the service without user info on error
        }
      })
    );
  };
  const fetchUserValidation = async () => {
		try {
			const token = localStorage.getItem('jwt');
			const response = await axios.get(
				'http://localhost:3000/reservation/user/validation-status',
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			return response.data.isValidated;
		} catch (error) {
			console.error('Error fetching user validation status', error);
			return false;
		}
	};
  useEffect(() => {
    const checkUserValidation = async () => {
      const isValidated = await fetchUserValidation();
      setIsUserValidated(isValidated);
    };
  
    checkUserValidation();
  }, []);
  
  const filteredServices = services.filter((service) =>
    service.Titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="accueil-services-container">
      <h1>
        Liste des Services{' '}
        <Link to="/provider/publication" className="accueil-publish-link">
          Publier ici
        </Link>
      </h1>
      <div className="filters">
        <input
          type="text"
          placeholder="Rechercher un service..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="DateFin">Date de fin</option>
          <option value="Prix">Prix</option>
        </select>
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="filter-select"
        >
          <option value="asc">Ascendant</option>
          <option value="desc">Descendant</option>
        </select>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="filter-select"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((category) => (
            <option key={category.ID} value={category.ID}>
              {category.Nom}
            </option>
          ))}
        </select>
      </div>
      {!isUserValidated && (
				<div className='account-blocked-message'>
					Votre compte est bloqué. Veuillez effectuer le paiement pour activer
					votre compte. Il sera réactivé après 24 heures.
				</div>
			)}
      {filteredServices.length === 0 ? (
        <p>Aucun service trouvé.</p>
      ) : (
        <div className="accueil-services-list">
          {filteredServices.map((service) => (
            <div key={service.ID} className="accueil-service-item">
              <img
                src={`http://localhost:3000/uploads/${service.Image}`}
                alt={service.Titre}
                className="accueil-service-image"
              />
              <div className="accueil-service-details">
                <h2>{service.Titre}</h2>
                <p>Description: {service.Description}</p>
                <p>Prix: {service.Prix} Dt</p>
                <p>
                  Date de début: {new Date(service.DateDebut).toLocaleDateString()}
                </p>
                <p>
                  Date de fin: {new Date(service.DateFin).toLocaleDateString()}
                </p>
                {service.user && (
                  <div className="accueil-user-info">
                    <h3>Fournisseur :</h3>
                    <p>Nom: {service.user.Nom}</p>
                    <p>Email: {service.user.Email}</p>
                    <p>Numéro: {service.user.Num}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccueilPage;
