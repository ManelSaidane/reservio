import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './prof.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faUser,
	faEnvelope,
	faPhone,
	faCalendarAlt,
	faUpload,
	faTrash,
	faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';
import Statistics from './Statistics';
import ProviderPayment from './ProviderPayment';

const ProviderProfile = () => {
	const { userId } = useParams();
	const [user, setUser] = useState(null);
	const [editing, setEditing] = useState(false);
	const [editedUser, setEditedUser] = useState({});
	const [imageFile, setImageFile] = useState(null);

	useEffect(() => {
		fetchUserData();
	}, [userId]);

	const fetchUserData = async () => {
		try {
			const token = localStorage.getItem('jwt');
			const response = await axios.get('http://localhost:3000/users/profile', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setUser(response.data);
			setEditedUser(response.data);
		} catch (error) {
			console.error('Error fetching user data:', error);
		}
	};

	const handleEdit = () => {
		setEditing(true);
	};

	const handleCancelEdit = () => {
		setEditing(false);
		setEditedUser(user);
	};

	const handleChange = e => {
		const { name, value } = e.target;
		const newValue = name === 'Num' ? parseInt(value, 10) : value;
		setEditedUser({
			...editedUser,
			[name]: newValue,
		});
	};

	const handleImageChange = e => {
		const file = e.target.files[0];
		setImageFile(file);
	};

	const handleImageUpload = async () => {
		try {
			const formData = new FormData();
			formData.append('image', imageFile);

			const token = localStorage.getItem('jwt');
			const response = await axios.post(
				`http://localhost:3000/users/${userId}/image`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'multipart/form-data',
					},
				},
			);
			setUser(response.data);
			alert('Image de profil mise à jour avec succès !');
		} catch (error) {
			console.error('Error uploading profile image:', error);
		}
	};

	const handleImageDelete = async () => {
		try {
			const token = localStorage.getItem('jwt');
			const response = await axios.delete(
				`http://localhost:3000/users/${userId}/image`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			setUser(response.data);
			alert('Image de profil supprimée avec succès !');
		} catch (error) {
			console.error('Error deleting profile image:', error);
		}
	};

	const formatDate = dateString => {
		const date = new Date(dateString);
		return date.toLocaleDateString('fr-FR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			const token = localStorage.getItem('jwt');
			const response = await axios.put(
				`http://localhost:3000/users/${userId}`,
				editedUser,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			setUser(response.data);
			setEditing(false);
			alert('Profil mis à jour avec succès !');
		} catch (error) {
			console.error('Error updating user profile:', error);
		}
	};

	return (
		<div className='profile-container'>
			<h1 className='profile-title'>Mon Profil</h1>
			{user && (
				<div className='profile-content'>
					<div className='profile-left'>
						{user.image ? (
							<img
								src={`http://localhost:3000/uploads/${user.image}`}
								alt='User'
								className='profile-image'
							/>
						) : (
							<FontAwesomeIcon icon={faUserCircle} className='profile-icon2' />
						)}
						{editing && (
							<div className='image-actions'>
								<input
									type='file'
									accept='image/*'
									onChange={handleImageChange}
								/>
								<button onClick={handleImageUpload}>
									<FontAwesomeIcon icon={faUpload} /> Télécharger
								</button>
								<button onClick={handleImageDelete}>
									<FontAwesomeIcon icon={faTrash} /> Supprimer
								</button>
							</div>
						)}
					</div>
					<div className='profile-right'>
						{editing ? (
							<form onSubmit={handleSubmit} className='profile-form'>
								<label>
									Nom:
									<input
										type='text'
										name='Nom'
										value={editedUser.Nom || ''}
										onChange={handleChange}
										required
									/>
								</label>
								<label>
									Prénom:
									<input
										type='text'
										name='Prenom'
										value={editedUser.Prenom || ''}
										onChange={handleChange}
										required
									/>
								</label>
								<label>
									Email:
									<input
										type='email'
										name='Email'
										value={editedUser.Email || ''}
										onChange={handleChange}
										required
									/>
								</label>
								<label>
									Numéro:
									<input
										type='number'
										name='Num'
										value={editedUser.Num || ''}
										onChange={handleChange}
										required
									/>
								</label>
								<label>
									Date de Naissance:
									<input
										type='date'
										name='DateNaissance'
										value={editedUser.DateNaissance || ''}
										onChange={handleChange}
									/>
								</label>
								<label>
									Bio:
									<textarea
										name='Bio'
										value={editedUser.Bio || ''}
										onChange={handleChange}
									/>
								</label>
								<button type='submit' className='save-button'>
									Enregistrer
								</button>
								<button
									type='button'
									onClick={handleCancelEdit}
									className='cancel-button'>
									Annuler
								</button>
							</form>
						) : (
							<div className='profile-info'>
								<p>
									<FontAwesomeIcon icon={faUser} /> <strong>Nom:</strong>{' '}
									{user.Nom}
								</p>
								<p>
									<FontAwesomeIcon icon={faEnvelope} /> <strong>Email:</strong>{' '}
									{user.Email}
								</p>
								<p>
									<FontAwesomeIcon icon={faPhone} /> <strong>Numéro:</strong>{' '}
									{user.Num}
								</p>
								<p className='bio'>
									<FontAwesomeIcon icon={faCalendarAlt} /> <strong>BIO:</strong>{' '}
									{user.Bio}
								</p>
								<p className='date'>
									<FontAwesomeIcon icon={faCalendarAlt} />{' '}
									<strong>Date de Naissance:</strong>{' '}
									{formatDate(user.DateNaissance)}
								</p>
								<button onClick={handleEdit} className='edit-button'>
									Modifier
								</button>
							</div>
						)}
					</div>
				</div>
			)}

		
			<div className='additional-content'>
				<div className='promotion-section'>
					<ProviderPayment /> 
				</div>

				<div className='dashboard-section'>
					<h2>Mon Tableau de Bord</h2>
					<Statistics />
				</div>
			</div>
		</div>
	);
};

export default ProviderProfile;
