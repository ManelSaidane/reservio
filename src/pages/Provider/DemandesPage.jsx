import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DemandesPage.css';

const DemandesPage = () => {
	const [activeTab, setActiveTab] = useState('PENDING');
	const [reservations, setReservations] = useState([]);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [isUserValidated, setIsUserValidated] = useState(true);

	useEffect(() => {
		const loadReservations = async () => {
			try {
				const validated = await fetchUserValidation();
				setIsUserValidated(validated);
				fetchReservations(activeTab);
			} catch (error) {
				setError('Error fetching user validation status.');
			}
		};

		loadReservations();
	}, [activeTab]);

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

	const fetchReservations = async status => {
		try {
			const token = localStorage.getItem('jwt');
			const response = await axios.get(
				`http://localhost:3000/reservation/status/${status}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			setReservations(response.data);
			setError(null);
		} catch (error) {
			setError(`Error fetching ${status} reservations: ${error.message}`);
		}
	};

	const handleAction = async (id, action) => {
		try {
			const token = localStorage.getItem('jwt');
			if (action === 'accept') {
				await axios.patch(
					`http://localhost:3000/reservation/${id}/accept`,
					{},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				);
			} else if (action === 'reject') {
				await axios.patch(
					`http://localhost:3000/reservation/${id}/reject`,
					{},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				);
			} else if (action === 'reminder') {
				const response = await axios.post(
					'http://localhost:3000/reservation/send-reminders',
					{},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				);
				setSuccess(response.data.message); // Utiliser la réponse du backend pour afficher le message de succès
			}
			fetchReservations(activeTab);
		} catch (error) {
			setError(`Error during ${action} action: ${error.message}`);
		}
	};

	const handleTabChange = tab => {
		setActiveTab(tab);
	};

	const renderReservations = () => {
		return reservations.map(reservation => (
			<li key={reservation.ID} className='demande-item'>
				<div className='demande-details'>
					<h3>
						Service:{' '}
						{reservation.service
							? reservation.service.Titre
							: 'Service non spécifié'}
					</h3>
					<p>
						Date de début:{' '}
						{reservation.DateDebut
							? new Date(reservation.DateDebut).toLocaleDateString()
							: 'Non spécifiée'}
					</p>
					<p>
						Date de fin:{' '}
						{reservation.DateFin
							? new Date(reservation.DateFin).toLocaleDateString()
							: 'Non spécifiée'}
					</p>
					<p>Statut: {reservation.statut}</p>
					<p>
						Utilisateur:{' '}
						{reservation.user
							? `${reservation.user.Nom} ${reservation.user.Prenom}`
							: 'Utilisateur non spécifié'}
					</p>
					<p>
						Email:{' '}
						{reservation.user ? reservation.user.Email : 'Email non spécifié'}
					</p>
					<p>
						Numéro:{' '}
						{reservation.user ? reservation.user.Num : 'Numéro non spécifié'}
					</p>
				</div>
				<div className='actions'>
					{activeTab === 'PENDING' && (
						<>
							<button
								onClick={() => handleAction(reservation.ID, 'accept')}
								disabled={!isUserValidated}>
								Accepter
							</button>
							<button
								onClick={() => handleAction(reservation.ID, 'reject')}
								disabled={!isUserValidated}>
								Refuser
							</button>
						</>
					)}
					{activeTab === 'ACCEPTED' && (
						<button onClick={() => handleAction(reservation.ID, 'reminder')}>
							Envoyer Rappel
						</button>
					)}
				</div>
			</li>
		));
	};

	return (
		<div className='demandes-page'>
			<h2>Demandes</h2>
			{!isUserValidated && (
				<div className='account-blocked-message'>
					Votre compte est bloqué. Veuillez effectuer le paiement pour activer
					votre compte. Il sera réactivé après 24 heures.
				</div>
			)}
			<div className='tabssss'>
				<button
					className={activeTab === 'PENDING' ? 'active' : ''}
					onClick={() => handleTabChange('PENDING')}
					disabled={!isUserValidated}>
					En attente
				</button>
				<button
					className={activeTab === 'ACCEPTED' ? 'active' : ''}
					onClick={() => handleTabChange('ACCEPTED')}
					disabled={!isUserValidated}>
					Acceptées
				</button>
				<button
					className={activeTab === 'REJECTED' ? 'active' : ''}
					onClick={() => handleTabChange('REJECTED')}
					disabled={!isUserValidated}>
					Rejetées
				</button>
			</div>
			{error && <div className='error-message'>{error}</div>}
			{success && <div className='success-message'>{success}</div>}
			<ul>{renderReservations()}</ul>
		</div>
	);
};

export default DemandesPage;
