import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AccueillllllPage.css';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { FaHeart, FaStar, FaEnvelope } from 'react-icons/fa';

const ServiceCard = () => {
	const [services, setServices] = useState([]);
	const [filteredServices, setFilteredServices] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [favorites, setFavorites] = useState([]);
	const [selectedDates, setSelectedDates] = useState({});
	const [sortBy, setSortBy] = useState('DateFin');
	const [order, setOrder] = useState('asc');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [categories, setCategories] = useState([]);
	const [selectedStars, setSelectedStars] = useState({});
	const [showPromotions, setShowPromotions] = useState(false);

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

	// 	useEffect(() => {
	// 		fetchServices();
	//   }, [sortBy, order, selectedCategory]);

	const token = localStorage.getItem('jwt');

	
	// 	try {
	// 		// If a category is selected, fetch by category
	// 		if (selectedCategory) {
	// 			const response = await axios.get(
	// 				`http://localhost:3000/services/category/${selectedCategory}`,
	// 			);
	// 			if (Array.isArray(response.data)) {
	// 				const servicesWithUsers = await fetchServicesWithUsers(response.data);
	// 				setServices(servicesWithUsers);
	// 			} else {
	// 				console.error(
	// 					'Réponse API non valide : le tableau de services est introuvable.',
	// 				);
	// 			}
	// 		} else {
	// 			// If no category is selected, fetch by sort order and field
	// 			const params = new URLSearchParams();
	// 			if (sortBy) params.append('sortBy', sortBy);
	// 			if (order) params.append('order', order);

	// 			const response = await axios.get(
	// 				`http://localhost:3000/services/tri?${params.toString()}`,
	// 			);
	// 			if (Array.isArray(response.data)) {
	// 				const servicesWithUsers = await fetchServicesWithUsers(response.data);
	// 				setServices(servicesWithUsers);
	// 			} else {
	// 				console.error(
	// 					'Réponse API non valide : le tableau de services est introuvable.',
	// 				);
	// 			}
	// 		}
	// 		const response = await axios.get('http://localhost:3000/services');
	// 		if (Array.isArray(response.data)) {
	// 			const servicesWithDetails = await Promise.all(
	// 				response.data.map(async service => {
	// 					const userResponse = await axios.get(
	// 						`http://localhost:3000/users/${service.userId}`,
	// 					);
	// 					const user = userResponse.data;
	// 					const reviewsResponse = await axios.get(
	// 						`http://localhost:3000/reviews/service/${service.ID}`,
	// 					);
	// 					const reviews = reviewsResponse.data;
	// 					const averageRating =
	// 						reviews.length > 0
	// 							? reviews.reduce((acc, review) => acc + review.stars, 0) /
	// 								reviews.length
	// 							: 0;
	// 					return {
	// 						...service,
	// 						user: {
	// 							id: user.id,
	// 							Nom: user.Nom,
	// 							Email: user.Email,
	// 							Num: user.Num,
	// 						},
	// 						reviews: reviews,
	// 						averageRating: averageRating,
	// 						isFavorite: favorites.includes(service.ID),
	// 					};
	// 				}),
	// 			);
	// 			setServices(servicesWithDetails);
	// 			setFilteredServices(servicesWithDetails); // Initialiser filteredServices avec tous les services au chargement
	// 		} else {
	// 			console.error(
	// 				'Réponse API non valide : le tableau de services est introuvable.',
	// 			);
	// 		}
	// 	} catch (error) {
	// 		console.error('Erreur lors de la récupération des services :', error);
	// 	}
	// };
	useEffect(() => {
		fetchServices();
	}, [sortBy, order, selectedCategory]);

	// const fetchServices = async () => {
	// 	try {
	// 		let url = `http://localhost:3000/services/tri?sortBy=${sortBy}&order=${order}`;
	// 		if (selectedCategory) {
	// 			url = `http://localhost:3000/services/category/${selectedCategory}`;
	// 		}
	// 		if (showPromotions) {
	// 			url = 'http://localhost:3000/services/with-promotions';
	// 		  }
	// 		const response = await axios.get(url);
	// 		console.log('Services response:', response.data); // Ajoutez cette ligne pour vérifier les données
	// 		if (Array.isArray(response.data)) {
	// 			const servicesWithDetails = await Promise.all(
	// 				response.data.map(async service => {
	// 					const userResponse = await axios.get(
	// 						`http://localhost:3000/users/${service.userId}`,
	// 					);
	// 					const user = userResponse.data;
	// 					const reviewsResponse = await axios.get(
	// 						`http://localhost:3000/reviews/service/${service.ID}`,
	// 					);
	// 					const reviews = reviewsResponse.data;
	// 					const averageRating =
	// 						reviews.length > 0
	// 							? reviews.reduce((acc, review) => acc + review.stars, 0) /
	// 								reviews.length
	// 							: 0;
	// 					return {
	// 						...service,
	// 						user: {
	// 							id: user.id,
	// 							Nom: user.Nom,
	// 							Email: user.Email,
	// 							Num: user.Num,
	// 						},
	// 						reviews: reviews,
	// 						averageRating: averageRating,
	// 						isFavorite: favorites.includes(service.ID),
	// 					};
	// 				}),
	// 			);
	// 			setServices(servicesWithDetails);
	// 			setFilteredServices(servicesWithDetails); // Initialiser filteredServices avec tous les services au chargement
	// 		} else {
	// 			console.error(
	// 				'Réponse API non valide : le tableau de services est introuvable.',
	// 			);
	// 		}
	// 	} catch (error) {
	// 		console.error('Erreur lors de la récupération des services :', error);
	// 	}
	// };
	// const applyFilters = () => {
	//     console.log('Services before filtering:', services); // Ajoutez cette ligne pour vérifier les services avant le filtrage

	//     let filtered = services;

	//     // Filtrage par terme de recherche
	//     if (searchTerm) {
	//         filtered = filtered.filter(service =>
	//             service.Titre.toLowerCase().includes(searchTerm.toLowerCase())
	//         );
	//     }

	//     // Filtrage par dates
	//     if (Object.keys(selectedDates).length) {
	//         filtered = filtered.filter(service => {
	//             const { dateDebut, dateFin } = selectedDates[service.ID] || {};
	//             if (dateDebut && dateFin) {
	//                 const selectedDateObj = new Date(dateDebut);
	//                 const serviceDateDebut = new Date(service.DateDebut);
	//                 const serviceDateFin = new Date(service.DateFin);
	//                 return selectedDateObj >= serviceDateDebut && selectedDateObj <= serviceDateFin;
	//             }
	//             return true;
	//         });
	//     }

	//     // Filtrage par catégorie
	//     if (selectedCategory) {
	//         filtered = filtered.filter(service => service.categoryId === selectedCategory);
	//     }

	//     // Tri par prix ou date
	//     filtered.sort((a, b) => {
	//         if (sortBy === 'Prix') {
	//             return order === 'asc' ? a.Prix - b.Prix : b.Prix - a.Prix;
	//         } else if (sortBy === 'DateFin') {
	//             return order === 'asc'
	//                 ? new Date(a.DateFin) - new Date(b.DateFin)
	//                 : new Date(b.DateFin) - new Date(a.DateFin);
	//         }
	//         return 0;
	//     });

	//     console.log('Filtered services:', filtered); // Ajoutez cette ligne pour vérifier les services après filtrage

	//     setFilteredServices(filtered);
	// };
	useEffect(() => {
		fetchServices();
	}, [sortBy, order, selectedCategory, showPromotions]); // Ajoutez showPromotions ici pour déclencher fetchServices
	
	const fetchServices = async () => {
		try {
			let url = `http://localhost:3000/services/tri?sortBy=${sortBy}&order=${order}`;
			if (selectedCategory) {
				url = `http://localhost:3000/services/category/${selectedCategory}`;
			}
			if (showPromotions) {
				url = 'http://localhost:3000/services/with-promotions';
			}
			console.log('Fetching services from:', url); // Ajoutez cette ligne pour vérifier l'URL
			const response = await axios.get(url);
			console.log('Services response:', response.data); // Vérifiez les données reçues
			if (Array.isArray(response.data)) {
				const servicesWithDetails = await Promise.all(
					response.data.map(async service => {
						const userResponse = await axios.get(`http://localhost:3000/users/${service.userId}`);
						const user = userResponse.data;
						const reviewsResponse = await axios.get(`http://localhost:3000/reviews/service/${service.ID}`);
						const reviews = reviewsResponse.data;
						const averageRating = reviews.length > 0
							? reviews.reduce((acc, review) => acc + review.stars, 0) / reviews.length
							: 0;
						return {
							...service,
							user: {
								id: user.id,
								Nom: user.Nom,
								Email: user.Email,
								Num: user.Num,
							},
							reviews: reviews,
							averageRating: averageRating,
							isFavorite: favorites.includes(service.ID),
						};
					}),
				);
				setServices(servicesWithDetails);
				setFilteredServices(servicesWithDetails); // Initialiser filteredServices avec tous les services au chargement
			} else {
				console.error('Réponse API non valide : le tableau de services est introuvable.');
			}
		} catch (error) {
			console.error('Erreur lors de la récupération des services :', error);
		}
	};
	
	const applyFilters = () => {
		let filteredServices = services;

		if (searchTerm) {
			filteredServices = filteredServices.filter(service =>
				service.title.toLowerCase().includes(searchTerm.toLowerCase()),
			);
		}

		if (selectedDates) {
			filteredServices = filteredServices.filter(service => {
				const serviceDates = selectedDates[service.ID] || {};
				return (
					(!serviceDates.startDate ||
						new Date(serviceDates.startDate) <= new Date()) &&
					(!serviceDates.endDate ||
						new Date(serviceDates.endDate) >= new Date())
				);
			});
		}

		if (selectedCategory) {
			filteredServices = filteredServices.filter(
				service => service.category === selectedCategory,
			);
		}

		if (showPromotions) {
			filteredServices = filteredServices.filter(
				service => service.promotions && service.promotions.length > 0,
			);
		}

		filteredServices.sort((a, b) => {
			if (sortBy === 'price') {
				return order === 'asc' ? a.price - b.price : b.price - a.price;
			} else if (sortBy === 'rating') {
				return order === 'asc'
					? a.averageRating - b.averageRating
					: b.averageRating - a.averageRating;
			}
			return 0;
		});

		setFilteredServices(filteredServices);
	};

	const toggleFavorite = async serviceId => {
		try {
			const isCurrentlyFavorite = favorites.includes(serviceId);
			let updatedFavorites = [...favorites];

			if (isCurrentlyFavorite) {
				updatedFavorites = updatedFavorites.filter(id => id !== serviceId);
				await axios.delete(`http://localhost:3000/favorites/${serviceId}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
			} else {
				updatedFavorites.push(serviceId);
				await axios.post(
					'http://localhost:3000/favorites',
					{ serviceId },
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				);
			}
			setFavorites(updatedFavorites);
			setSuccessMessage(
				isCurrentlyFavorite
					? 'Service retiré des favoris.'
					: 'Service ajouté aux favoris.',
			);
			setTimeout(() => setSuccessMessage(''), 3000);
		} catch (error) {
			console.error('Erreur lors de la gestion des favoris :', error);
			setErrorMessage('Erreur lors de la gestion des favoris.');
			setTimeout(() => setErrorMessage(''), 3000);
		}
	};

	const handleReview = async (serviceId, stars) => {
		try {
			const token = localStorage.getItem('jwt');
			const userId = JSON.parse(atob(token.split('.')[1])).id;

			// Vérifier si l'utilisateur a déjà laissé un avis
			const existingReview = services
				.find(service => service.ID === serviceId)
				.reviews.find(review => review.userId === userId);

			if (existingReview) {
				// Mise à jour de l'avis existant
				await axios.put(
					`http://localhost:3000/reviews/${existingReview.id}`,
					{ stars },
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				);
			} else {
				// Ajout d'un nouvel avis
				await axios.post(
					'http://localhost:3000/reviews',
					{
						serviceId: serviceId,
						stars: stars,
						userId: userId,
					},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				);
			}

			setSuccessMessage('Avis ajouté avec succès !');
			setSelectedStars(prevStars => ({
				...prevStars,
				[serviceId]: stars,
			}));
			fetchServices();
			setTimeout(() => setSuccessMessage(''), 3000);
		} catch (error) {
			console.error("Erreur lors de l'ajout d'avis :", error);
			setErrorMessage("Erreur lors de l'ajout d'avis.");
			setTimeout(() => setErrorMessage(''), 3000);
		}
	};

	const handleSearch = searchTerm => {
		setSearchTerm(searchTerm);
		const filtered = services.filter(service =>
			service.Titre.toLowerCase().includes(searchTerm.toLowerCase()),
		);
		setFilteredServices(filtered);
	};

	const handleReservation = async serviceId => {
		try {
			const { dateDebut, dateFin } = selectedDates[serviceId] || {};
			if (!dateDebut || !dateFin) {
				setErrorMessage(
					'Veuillez sélectionner une date de début et une date de fin.',
				);
				setTimeout(() => setErrorMessage(''), 3000);
				return;
			}

			const service = services.find(s => s.ID === serviceId);
			if (!service) {
				setErrorMessage('Service introuvable.');
				setTimeout(() => setErrorMessage(''), 3000);
				return;
			}

			const selectedDateObj = new Date(dateDebut);
			const dateDebutObj = new Date(service.DateDebut);
			const dateFinObj = new Date(service.DateFin) < dateDebutObj;

			if (selectedDateObj <= dateDebutObj || selectedDateObj >= dateFinObj) {
				setErrorMessage(
					'La date choisie doit être entre la date de début et la date de fin.',
				);
				setTimeout(() => setErrorMessage(''), 3000);
				return;
			}

			const userId = JSON.parse(atob(token.split('.')[1])).id;

			await axios.post(
				'http://localhost:3000/reservation',
				{
					serviceId: serviceId,
					DateDebut: dateDebut,
					DateFin: dateFin,
					userId: userId,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			setSuccessMessage('Réservation effectuée avec succès !');
			setTimeout(() => setSuccessMessage(''), 3000);
		} catch (error) {
			console.error('Erreur lors de la réservation :', error);
			setErrorMessage('Erreur lors de la réservation.');
			setTimeout(() => setErrorMessage(''), 3000);
		}
	};

	return (
		<div className='services-container'>
			<h1>Liste des Services</h1>

			<input
				type='text'
				placeholder='Rechercher un service...'
				value={searchTerm}
				onChange={e => handleSearch(e.target.value)}
				className='search-bar'
			/>
			<div className='filters-container'>
				<select
					value={sortBy}
					onChange={e => setSortBy(e.target.value)}
					className='filter-select'>
					<option value='DateFin'>Date de fin</option>
					<option value='Prix'>Prix</option>
				</select>
				<select
					value={order}
					onChange={e => setOrder(e.target.value)}
					className='filter-select'>
					<option value='asc'>Ascendant</option>
					<option value='desc'>Descendant</option>
				</select>
				<select
					value={selectedCategory}
					onChange={e => setSelectedCategory(e.target.value)}
					className='filter-select'>
					<option value=''>Toutes les catégories</option>
					{categories.map(category => (
						<option key={category.ID} value={category.ID}>
							{category.Nom}
						</option>
					))}
				</select>
				<label>
					<input
						type='checkbox'
						checked={showPromotions}
						onChange={() => setShowPromotions(prev => !prev)}
					/>
					Afficher uniquement les promotions
				</label>
			</div>
			{successMessage && (
        <div  key={services.ID} className="message-container success-message1">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div key={services.ID} className="message-container error-message1">
          {errorMessage}
        </div>
      )}
			{filteredServices.length === 0 ? (
				<p>Aucun service trouvé.</p>
			) : (
				<div className='services-list'>
					{filteredServices.map(service => (
						<div key={service.ID} className='service-item'>
							<div className='service-header'>
								<img
									src={`http://localhost:3000/uploads/${service.Image}`}
									alt={service.Titre}
									className='service-image'
								/>
								<button
									className={`favorite-button ${favorites.includes(service.ID) ? 'favorited' : ''}`}
									onClick={() => toggleFavorite(service.ID)}>
									<FaHeart
										style={{
											color: favorites.includes(service.ID) ? 'red' : 'gray',
										}}
									/>
								</button>
							</div>
							<div className='service-details'>
								<h1>{service.Titre}</h1>
								<p>Description: {service.Description}</p>
								<p>Prix: {service.Prix} Dt</p>
								<p>
									Offre valable du{' '}
									{moment(service.DateDebut).format('DD/MM/YYYY')} au{' '}
									{moment(service.DateFin).format('DD/MM/YYYY')}
								</p>
								<div>
								<p>Choisir vos dates :</p>
								<input
									type='datetime-local'
									onChange={e => {
										setSelectedDates(prev => ({
											...prev,
											[service.ID]: {
												...prev[service.ID],
												dateDebut: e.target.value,
											},
										}));
									}}
								/>
								<p> jusqu'à </p>
								<input
									type='datetime-local'
									onChange={e => {
										setSelectedDates(prev => ({
											...prev,
											[service.ID]: {
												...prev[service.ID],
												dateFin: e.target.value,
											},
										}));
									}}
								/>
								</div>
								<p></p>
								<button
									className='reserve-button'
									onClick={() => handleReservation(service.ID)}>
									Réserver
								</button>
								{service.user && (
									<div className='accueil-user-info'>
										<h3>Fournisseur :</h3>
										{/* <p>Nom: {service.user.Nom}</p> */}
										<p>
											Email:
											<a href={`mailto:${service.user.Email}`}>
												<FaEnvelope className='email-icon' />
												{service.user.Email}
											</a>
										</p>
										<p>Numéro: {service.user.Num}</p>
									</div>
								)}
								<div className='review-section'>
									<h2>Évaluer ce service</h2>
									<div className='rating'>
										{[1, 2, 3, 4, 5].map(star => (
											<FaStar
												key={star}
												className={`star ${service.reviews.some(review => review.stars === star) ? 'selected' : ''}`}
												onClick={() => handleReview(service.ID, star)}
											/>
										))}
									</div>
									<p>Note moyenne : {service.averageRating.toFixed(1)} / 5</p>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ServiceCard;
