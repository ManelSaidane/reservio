import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Logout } from '../redux/Action/Auth';
import { jwtDecode } from 'jwt-decode';
import './NavBar.css';
import Logo from '../assets/logo-no-background.png';
import { FaUser } from 'react-icons/fa';

const Navbar = () => {
	const dispatch = useDispatch();
	const auth = useSelector(state => state.auth);
	const [userName, setUserName] = useState('');

	useEffect(() => {
		const token = localStorage.getItem('jwt'); // Récupérer le token depuis le localStorage
		console.log('Token récupéré:', token); // Debug: Afficher le token dans la console
		if (token) {
			try {
				const decodedToken = jwtDecode(token);
				console.log('Token décodé:', decodedToken); // Debug: Afficher le token décodé dans la console
				setUserName(decodedToken.nom || ''); // Assurez-vous que `nom` est défini dans le token
			} catch (error) {
				console.error('Erreur de décodage du token:', error);
			}
		}
	}, []);

	const [activeItem, setActiveItem] = useState('');
	const [searchQuery, setSearchQuery] = useState('');

	const handleSearchChange = event => {
		setSearchQuery(event.target.value);
	};

	const handleSearchSubmit = event => {
		event.preventDefault();
		// Vous pouvez ajouter la logique pour gérer la recherche ici
		console.log('Recherche:', searchQuery);
	};

	const handleClick = itemName => {
		setActiveItem(itemName);
	};

	const handleLogout = () => {
		dispatch(Logout());
	};

	return (
		<nav className='navbar'>
			<div className='container'>
				<div className='logo-container'>
					<img src={Logo} alt='Logo' className='logo' />
				</div>
				<div className='center-items'>
					<ul className='nav-links'>
						{!(
							auth.user &&
							(auth.user.role === 'ADMIN' ||
								auth.user.role === 'CLIENT' ||
								auth.user.role === 'SERVICE_PROVIDER')
						) && (
							<>
								<li
									className={`nav-item ${activeItem === 'Accueil' ? 'active' : ''}`}>
									<a href='/' onClick={() => handleClick('Accueil')}>
										Accueil
									</a>
								</li>
								<li
									className={`nav-item ${activeItem === 'our-users' ? 'active' : ''}`}>
									<a
										href='/#our-users'
										onClick={() => handleClick('our-users')}>
										Communauté
									</a>
								</li>
								<li
									className={`nav-item ${activeItem === 'why-choose-us' ? 'active' : ''}`}>
									<a
										href='/#why-choose-us'
										onClick={() => handleClick('why-choose-us')}>
										À propos
									</a>
								</li>
								<li
									className={`nav-item dropdown ${activeItem === 'Catégories' ? 'active' : ''}`}>
									<Link to='#'>Catégories</Link>
									<ul className='dropdown-content'>
										<li>
											<Link to='/services'>Hébergement</Link>
										</li>
										<li>
											<Link to='/services'>Restauration</Link>
										</li>
										<li>
											<Link to='/services'>Transport</Link>
										</li>
										<li>
											<Link to='/services'>Activités</Link>
										</li>
										<li>
											<Link to='/services'>Soins et bien-être</Link>
										</li>
										<li>
											<Link to='/services'>Événements spéciaux</Link>
										</li>
									</ul>
								</li>
							</>
						)}
						{auth.user && auth.user.role === 'SERVICE_PROVIDER' && (
							<>
								<li
									className={`nav-item ${activeItem === 'Accueil' ? 'active' : ''}`}>
									<Link
										to='/provider/acceuil'
										onClick={() => handleClick('Accueil')}>
										Accueil
									</Link>
								</li>
								<li
									className={`nav-item ${activeItem === 'Paiement' ? 'active' : ''}`}>
									<Link
										to='/provider/promotion'
										onClick={() => handleClick('Paiement')}>
										Promotions
									</Link>
								</li>
								<li
									className={`nav-item ${activeItem === 'Publication' ? 'active' : ''}`}>
									<Link
										to='/provider/publication'
										onClick={() => handleClick('Publication')}>
										Publication
									</Link>
								</li>
								<li
									className={`nav-item ${activeItem === 'Services' ? 'active' : ''}`}>
									<Link
										to='/provider/services'
										onClick={() => handleClick('Services')}>
										Services
									</Link>
								</li>
								<li
									className={`nav-item ${activeItem === 'Demandes' ? 'active' : ''}`}>
									<Link
										to='/provider/demandes'
										onClick={() => handleClick('Demandes')}>
										Demandes
									</Link>
								</li>
								{/* <li
									className={`nav-item ${activeItem === 'Demandes' ? 'active' : ''}`}>
									<Link
										to='/provider/promotion'
										onClick={() => handleClick('Promotion')}>
										Promotion
									</Link>
								</li> */}
							</>
						)}
						{auth.user && auth.user.role === 'CLIENT' && (
							<>
								<li
									className={`nav-item ${activeItem === 'Accueil' ? 'active' : ''}`}>
									<Link to='/*' onClick={() => handleClick('Accueil')}>
										Accueil
									</Link>
								</li>
								<li
									className={`nav-item ${activeItem === 'Services' ? 'active' : ''}`}>
									<Link
										to='/client/Fav'
										onClick={() => handleClick('Services')}>
										Favorites
									</Link>
								</li>
								<li
									className={`nav-item ${activeItem === 'Mes Demandes' ? 'active' : ''}`}>
									<Link
										to='/client/notification'
										onClick={() => handleClick('Mes Demandes')}>
										Notification
									</Link>
								</li>
								<li
									className={`nav-item ${activeItem === 'Support' ? 'active' : ''}`}>
									<Link
										to='/client/pending'
										onClick={() => handleClick('Support')}>
										Demandes en attentes
									</Link>
								</li>
							</>
						)}
						{auth.user && auth.user.role === 'ADMIN' && (
							<>
								<li
									className={`nav-item ${activeItem === 'Accueil' ? 'active' : ''}`}>
									<Link
										to='/admin/acceuil'
										onClick={() => handleClick('Accueil')}>
										Accueil
									</Link>
								</li>
								<li
									className={`nav-item ${activeItem === 'Catégories' ? 'active' : ''}`}>
									<Link
										to='/admin/categorie'
										onClick={() => handleClick('Catégories')}>
										Catégories
									</Link>
								</li>
								<li
									className={`nav-item ${activeItem === 'Services' ? 'active' : ''}`}>
									<Link
										to='/admin/services'
										onClick={() => handleClick('Statistiques')}>
										Services
									</Link>
								</li>
							</>
						)}
					</ul>
				</div>
				<div className='right-items'>
					{auth.user &&
						(auth.user.role === 'ADMIN' ||
							auth.user.role === 'CLIENT' ||
							auth.user.role === 'SERVICE_PROVIDER') && (
							<>
								<ul className='nav-links'>
									{auth.user.role === 'ADMIN' ? (
										<>
											<li
												className={`nav-item ${activeItem === 'Statistiques' ? 'active' : ''}`}>
												<NavLink to='/admin/statics' activeClassName='active'>
													Statistiques
												</NavLink>
											</li>
										</>
									) : auth.user.role === 'SERVICE_PROVIDER' ? (
										<>
											<li
												className={`nav-item ${activeItem === 'Mon Profil' ? 'active' : ''}`}>
												<NavLink
													to='/provider/profile'
													activeClassName='active'>
													<FaUser className='profile-icon' /> Mon Profil
												</NavLink>
											</li>
										</>
									) : (
										auth.user.role === 'CLIENT' && (
											<>
												<li
													className={`nav-item ${activeItem === 'Mon Profil' ? 'active' : ''}`}>
													<NavLink
														to='/client/profile'
														activeClassName='active'>
														<FaUser className='profile-icon' /> Mon Profil
													</NavLink>
												</li>
											</>
										)
									)}
									<li
										className={`nav-item ${activeItem === 'Se Déconnecter' ? 'active' : ''}`}>
										<Link to='/logout' onClick={handleLogout}>
											Se Déconnecter
										</Link>
									</li>
								</ul>
								<div className='welcome-message'>
									{userName ? (
										<span>Bienvenue, {userName}!</span>
									) : (
										<span>Bienvenue, {userName}!</span>
									)}
								</div>
							</>
						)}
					{!(
						auth.user &&
						(auth.user.role === 'ADMIN' ||
							auth.user.role === 'CLIENT' ||
							auth.user.role === 'SERVICE_PROVIDER')
					) && (
						<div className='right-items'>
							<ul className='nav-links'>
								<li className='nav-item dropdown'>
									<Link to='#'>S'inscrire</Link>
									<ul className='dropdown-content'>
										<li>
											<Link to='/register/client'>Client</Link>
										</li>
										<li>
											<Link to='/register/provider'>Fournisseur</Link>
										</li>
									</ul>
								</li>
								<li className='nav-item'>
									<Link to='/login'>Se connecter</Link>
								</li>
							</ul>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
