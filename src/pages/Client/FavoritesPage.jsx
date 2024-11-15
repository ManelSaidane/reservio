import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './FavoritePage.css';

const FavoritesPage = () => {
	const [favorites, setFavorites] = useState([]);

	useEffect(() => {
		fetchFavorites();
	}, []);

	const fetchFavorites = async () => {
		try {
			const token = localStorage.getItem('jwt');
			console.log('Fetching favorites with token:', token);
			const response = await axios.get('http://localhost:3000/favorites', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			console.log('Favorites fetched:', response.data);
			setFavorites(response.data);
		} catch (error) {
			console.error('Error fetching favorites:', error);
		}
	};

	const handleDeleteFavorite = async favoriteId => {
		try {
			const token = localStorage.getItem('jwt');
			console.log('Deleting favorite with ID:', favoriteId);
			await axios.delete(`http://localhost:3000/favorites/${favoriteId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			// Mettre à jour l'état local après suppression
			setFavorites(favorites.filter(favorite => favorite.ID !== favoriteId));
		} catch (error) {
			console.error('Error deleting favorite:', error);
		}
	};

	return (
		<div className='favorites-container'>
			<h1>Mes Favoris</h1>
			{favorites.length > 0 ? (
				<ul className='favorites-list'>
					{favorites.map(favorite => (
						<li key={favorite.ID} className='favorite-item'>
							<img
								src={`http://localhost:3000/uploads/${favorite.service.Image}`}
								alt={favorite.service.Titre}
								className='favorite-image'
							/>

							<Link to={`/services/${favorite.serviceId}`}>
								<div className='service-details'>
									<h2>{favorite.service.Titre}</h2>
									<p>{favorite.service.Place}</p>
									<p>Prix: {favorite.service.Prix} Dt</p>
									<p>Description: {favorite.service.Description}</p>
								</div>
							</Link>
							<button
								onClick={() => handleDeleteFavorite(favorite.ID)}
								className='delete-button'>
								<FontAwesomeIcon icon={faTrash} />
							</button>
						</li>
					))}
				</ul>
			) : (
				<p>Aucun service favori</p>
			)}
		</div>
	);
};

export default FavoritesPage;
