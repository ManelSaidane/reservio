import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './List.css';

const ProviderServices = () => {
	const [services, setServices] = useState([]);
	const [editMode, setEditMode] = useState(false);
	const [editedService, setEditedService] = useState({
		ID: null,
		Description: '',
		Prix: 0,
		DateDebut: '',
		DateFin: '',
		Titre: '',
		Image: null,
		Place: '',
		categorieId: null,
	});
	const [editedImage, setEditedImage] = useState(null);
	const [categories, setCategories] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [isValidated, setIsValidated] = useState(true);
	const [isBlocked, setIsBlocked] = useState(true);
	const [validationError, setValidationError] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		const fetchData = async () => {
			try {
				await fetchServices();
				await fetchCategories();
				await checkUserValidation();
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const fetchServices = async () => {
		try {
			const token = localStorage.getItem('jwt');
			const decodedToken = JSON.parse(atob(token.split('.')[1]));
			const userId = decodedToken.id;
			const response = await axios.get(
				`http://localhost:3000/services/user/${userId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);
			setServices(response.data);
		} catch (error) {
			console.error('Error fetching services:', error);
		}
	};

	const fetchCategories = async () => {
		try {
			const response = await axios.get('http://localhost:3000/categories');
			setCategories(response.data);
		} catch (error) {
			console.error('Error fetching categories:', error);
		}
	};

	const checkUserValidation = async () => {
		try {
			const token = localStorage.getItem('jwt');
			if (!token) throw new Error('No token found');
			const response = await axios.get(
				'http://localhost:3000/reservation/user/validation-status',
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);
			setIsValidated(response.data.isValidated);
			setIsBlocked(!response.data.isValidated);
		} catch (error) {
			console.error('Error checking user status:', error);
			setIsBlocked(true);
		}
	};

	const handleEdit = service => {
		setEditedService({
			ID: service.ID,
			Description: service.Description,
			Prix: service.Prix,
			DateDebut: service.DateDebut,
			DateFin: service.DateFin,
			Titre: service.Titre,
			Image: service.Image,
			Place: service.Place,
			categorieId: service.categorieId,
		});
		setEditMode(true);
	};

	const handleUpdate = async () => {
		try {
			const token = localStorage.getItem('jwt');
			const authAxios = axios.create({
				baseURL: 'http://localhost:3000',
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${token}`,
				},
			});

			const formData = new FormData();
			formData.append('Description', editedService.Description);
			formData.append('Prix', editedService.Prix);
			formData.append('DateDebut', editedService.DateDebut || '');
			formData.append('DateFin', editedService.DateFin || '');
			formData.append('Titre', editedService.Titre);
			formData.append('Place', editedService.Place);
			formData.append('categorieId', editedService.categorieId);

			if (editedImage) {
				formData.append('image', editedImage);
			}

			await authAxios.put(`/services/${editedService.ID}`, formData);
			fetchServices();
			setEditMode(false);
			resetEditedService();
		} catch (error) {
			console.error('Error updating service:', error);
		}
	};

	const handleCancelEdit = () => {
		setEditMode(false);
		resetEditedService();
	};

	const handleDelete = async id => {
		try {
			const token = localStorage.getItem('jwt');
			const authAxios = axios.create({
				baseURL: 'http://localhost:3000',
				headers: { Authorization: `Bearer ${token}` },
			});

			await authAxios.delete(`/services/${id}`);
			fetchServices();
		} catch (error) {
			console.error('Error deleting service:', error);
		}
	};

	const handleInputChange = e => {
		const { name, value } = e.target;
		if (name === 'DateDebut' || name === 'DateFin') {
			if (Date.parse(value)) {
				setEditedService({
					...editedService,
					[name]: new Date(value).toISOString(),
				});
			}
		} else {
			setEditedService({
				...editedService,
				[name]: value,
			});
		}
	};

	const handleImageChange = e => {
		setEditedImage(e.target.files[0]);
	};

	const resetEditedService = () => {
		setEditedService({
			ID: null,
			Description: '',
			Prix: 0,
			DateDebut: '',
			DateFin: '',
			Titre: '',
			Image: null,
			Place: '',
			categorieId: null,
		});
		setEditedImage(null);
	};

	const filteredServices = services.filter(service =>
		service.Titre.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div className='provider-services'>
			<h2>Vos Services</h2>
			<input
				type='text'
				placeholder='Rechercher un service...'
				value={searchTerm}
				onChange={e => setSearchTerm(e.target.value)}
				className='search-bar'
			/>
			{isBlocked && (
				<div className='account-blocked-messagee'>
					Votre compte est bloqué. Veuillez effectuer le paiement pour activer
					votre compte. Il sera réactivé après 24 heures.
				</div>
			)}
			{loading ? (
				<p>Chargement...</p>
			) : (
				<ul>
					{filteredServices.map(service => (
						<li key={service.ID}>
							{editMode && editedService.ID === service.ID ? (
								<div>
									<input
										type='text'
										name='Titre'
										value={editedService.Titre}
										onChange={handleInputChange}
									/>
									<textarea
										name='Description'
										value={editedService.Description}
										onChange={handleInputChange}></textarea>
									<input
										type='number'
										name='Prix'
										value={editedService.Prix}
										onChange={handleInputChange}
									/>
									<input
										type='date'
										name='DateDebut'
										value={editedService.DateDebut.slice(0, 10)}
										onChange={handleInputChange}
									/>
									<input
										type='date'
										name='DateFin'
										value={editedService.DateFin.slice(0, 10)}
										onChange={handleInputChange}
									/>
									<input
										type='text'
										name='Place'
										value={editedService.Place}
										onChange={handleInputChange}
									/>
									<select
										name='categorieId'
										value={editedService.categorieId}
										onChange={handleInputChange}>
										<option value=''>Sélectionner une catégorie</option>
										{categories.map(category => (
											<option key={category.ID} value={category.ID}>
												{category.name}
											</option>
										))}
									</select>
									<input
										type='file'
										accept='image/*'
										onChange={handleImageChange}
									/>
									<button onClick={handleUpdate}>Sauvegarder</button>
									<button onClick={handleCancelEdit}>Annuler</button>
								</div>
							) : (
								<div>
									<h3>Titre : {service.Titre}</h3>
									<p>Description : {service.Description}</p>
									<p>Prix : {service.Prix} Dt</p>
									<p>Date de Debut :  
										{service.DateDebut &&
											new Date(service.DateDebut).toLocaleDateString()}
										
									</p>
									<p> Date de Fin :
										{service.DateFin &&
											new Date(service.DateFin).toLocaleDateString()}
									</p>
									<p>Ta Place : {service.Place}</p>
									{service.Image && (
										<img
											src={`http://localhost:3000/uploads/${service.Image}`}
											alt={service.Titre}
											className='service-image'
										/>
									)}
									{isValidated && !isBlocked && (
										<div className='test-button-group'>
											<button onClick={() => handleEdit(service)}>
												Modifier
											</button>
											<button onClick={() => handleDelete(service.ID)}>
												Supprimer
											</button>
										</div>
									)}
								</div>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default ProviderServices;
