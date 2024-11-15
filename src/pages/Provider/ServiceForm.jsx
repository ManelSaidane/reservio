import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ServiceForm.css';

const ServiceForm = () => {
	const navigate = useNavigate();
	const [serviceData, setServiceData] = useState({
		Titre: '',
		Description: '',
		Prix: 0,
		DateDebut: '',
		DateFin: '',
		Place: '',
		categorieId: '',
		image: null,
	});
	const [categories, setCategories] = useState([]);
	const [isBlocked, setIsBlocked] = useState(true); // Utilisé pour vérifier si le compte est bloqué
	const [validationError, setValidationError] = useState(false);

	useEffect(() => {
		fetchCategories();
		checkUserStatus();
	}, []);

	const fetchCategories = async () => {
		try {
			const response = await axios.get('http://localhost:3000/categories');
			setCategories(response.data);
		} catch (error) {
			console.error('Error fetching categories:', error);
		}
	};

	const checkUserStatus = async () => {
		try {
			const token = localStorage.getItem('jwt');
			if (!token) throw new Error('No token found');

			const response = await axios.get(
				'http://localhost:3000/reservation/user/validation-status',
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (response.data.isValidated) {
				setIsBlocked(false);
			} else {
				setIsBlocked(true);
			}
		} catch (error) {
			console.error('Error checking user status:', error);
			setIsBlocked(true); // En cas d'erreur, bloquer par défaut
		}
	};

	const handleInputChange = e => {
		const { name, value } = e.target;
		setServiceData({ ...serviceData, [name]: value });
	};

	const handleCategoryChange = e => {
		const selectedcategorieId = parseInt(e.target.value); // Convertir en nombre entier
		setServiceData({ ...serviceData, categorieId: selectedcategorieId });
	};

	const handleImageChange = e => {
		const file = e.target.files[0];
		setServiceData({ ...serviceData, image: file });
	};

	const validateForm = () => {
		// Vérifie si tous les champs requis sont remplis
		return (
			serviceData.Titre &&
			serviceData.Description &&
			serviceData.Prix > 0 &&
			serviceData.DateDebut &&
			serviceData.DateFin &&
			serviceData.Place &&
			serviceData.categorieId
		);
	};

	const handleSubmit = async e => {
		e.preventDefault();

		if (!validateForm()) {
			setValidationError(true);
			return;
		}

		setValidationError(false);

		try {
			const token = localStorage.getItem('jwt');
			if (!token) throw new Error('No token found');

			const formData = new FormData();
			formData.append('Titre', serviceData.Titre);
			formData.append('Description', serviceData.Description);
			formData.append('Prix', serviceData.Prix);
			formData.append(
				'DateDebut',
				new Date(serviceData.DateDebut).toISOString(),
			);
			formData.append('DateFin', new Date(serviceData.DateFin).toISOString());
			formData.append('Place', serviceData.Place);
			formData.append('categorieId', serviceData.categorieId);

			if (serviceData.image instanceof File) {
				formData.append('image', serviceData.image);
			}

			const response = await axios.post(
				'http://localhost:3000/services',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${token}`,
					},
				},
			);

			console.log('Service created successfully:', response.data);
			navigate('/provider/dashboard');
		} catch (error) {
			console.error(
				'Error creating service:',
				error.response ? error.response.data : error.message,
			);
		}
	};

	return (
		<div className='service-form-container'>
			
			<div className='service-form'>
			{isBlocked && (
				<div className='account-blocked-message'>
					Votre compte est bloqué. Veuillez effectuer le paiement pour activer
					votre compte. Il sera réactivé après 24 heures.
				</div>
			)}
				<h2>Create a New Service</h2>
				{isBlocked && (
					<p className='notification-message'>
						Your account is blocked. You cannot submit this form.
					</p>
				)}
				{validationError && !isBlocked && (
					<p className='error-message'>
						Please fill in all required fields correctly.
					</p>
				)}
				<div className='service-info'>
					<h3>Comment publier un service :</h3>
					<p>
						Remplissez le formulaire à gauche pour publier un service.
						Assurez-vous de fournir des informations précises et complètes.
					</p>
					<ul>
						<li>
							<strong>Titre :</strong> Donnez un titre clair et descriptif.
						</li>
						<br />
						<li>
							<strong>Description :</strong> Fournissez une description
							détaillée de votre service.
						</li>
						<br />
						<li>
							<strong>Localisation :</strong> Indiquez l'endroit où le service
							est disponible.
						</li>
						<br />
						<li>
							<strong>Image :</strong> Ajoutez une image représentative de votre
							service.
						</li>
						<br />
						<li>
							<strong>Date de disponibilité :</strong> Sélectionnez les dates de
							début et de fin de disponibilité de votre service.
						</li>
						<br />
						<li>
							<strong>Prix :</strong> Indiquez le prix de votre service.
						</li>
						<br />
						<li>
							<strong>Catégorie :</strong> Choisissez la catégorie qui décrit le
							mieux votre service.
						</li>
						<br />
					</ul>
				</div>
			</div>
			<form className='service-form' onSubmit={handleSubmit}>
				<div>
					<label htmlFor='Titre'>Title:</label>
					<input
						type='text'
						id='Titre'
						name='Titre'
						value={serviceData.Titre}
						onChange={handleInputChange}
						required
						disabled={isBlocked}
					/>
				</div>
				<div>
					<label htmlFor='Description'>Description:</label>
					<textarea
						id='Description'
						name='Description'
						value={serviceData.Description}
						onChange={handleInputChange}
						required
						disabled={isBlocked}
					/>
				</div>
				<div>
					<label htmlFor='Prix'>Price:</label>
					<input
						type='number'
						id='Prix'
						name='Prix'
						value={serviceData.Prix}
						onChange={handleInputChange}
						required
						disabled={isBlocked}
					/>
				</div>
				<div>
					<label htmlFor='DateDebut'>Date de Debut:</label>
					<input
						type='date'
						id='DateDebut'
						name='DateDebut'
						value={serviceData.DateDebut}
						onChange={handleInputChange}
						required
						disabled={isBlocked}
					/>
				</div>
				<div>
					<label htmlFor='DateFin'>Date de Fin:</label>
					<input
						type='date'
						id='DateFin'
						name='DateFin'
						value={serviceData.DateFin}
						onChange={handleInputChange}
						required
						disabled={isBlocked}
					/>
				</div>
				<div>
					<label htmlFor='Place'>Place:</label>
					<input
						type='text'
						id='Place'
						name='Place'
						value={serviceData.Place}
						onChange={handleInputChange}
						required
						disabled={isBlocked}
					/>
				</div>
				<div>
					<label htmlFor='categorieId'>Category:</label>
					<select
						id='categorieId'
						name='categorieId'
						value={serviceData.categorieId}
						onChange={handleCategoryChange}
						required
						disabled={isBlocked}>
						<option value=''>Select a category</option>
						{categories.map(category => (
							<option key={category.ID} value={category.ID}>
								{category.Nom}
							</option>
						))}
					</select>
				</div>
				<div>
					<label htmlFor='image'>Image:</label>
					<input
						type='file'
						id='image'
						name='image'
						onChange={handleImageChange}
						accept='image/*'
						disabled={isBlocked}
					/>
				</div>
				<button type='submit' disabled={isBlocked}>
					Create Service
				</button>
			</form>
		</div>
	);
};

export default ServiceForm;
