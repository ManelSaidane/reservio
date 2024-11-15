import React, { useState } from 'react';
import './MainSection.css';
import clientIcon from '../assets/8664831_user_icon.png';
import providerIcon from '../assets/8666755_users_group_icon.png';
import navphoto from '../assets/facilitenav-removebg.png';
import flamephoto from '../assets/flame-removebg-preview (1).png';
import largecatphoto from '../assets/largecat-removebg-preview.png';
import reservephoto from '../assets/reserve-removebg-preview.png';
import PaymentOptions from '../components/PaymentOptions';
import Myvideo from '../components/video';

const MainSection = () => {
	const [showNotification, setShowNotification] = useState(true);

	const handleCloseNotification = () => {
		setShowNotification(false);
	};
	return (
		<section className='main-section'>
			<Myvideo />
			<div className='main-content'>
				<h1>Explorez Notre Univers de Réservations Personnalisées</h1>
				<p>
					Bienvenue sur notre plateforme de réservation où la diversité des
					services est à portée de clic.
					<br />
					Du bien-être aux services spécialisés, chaque catégorie offre une
					multitude d'options que vous pouvez explorer et réserver selon vos
					besoins.
					<br />
					Que vous soyez un client cherchant le service parfait ou un
					prestataire souhaitant présenter vos offres, notre site vous permet de
					créer des réservations personnalisées.
				</p>
			</div>

			<section className='our-users' id='our-users'>
				<h2>Découvrez notre Communauté</h2>
				<div className='user-boxes'>
					<div className='user-box'>
						<h3>Client</h3>
						<img src={clientIcon} alt='Client Icon' />
						<p>
							⭐ Explorez notre large éventail de catégories de services, allant
							du bien-être aux services spécialisés, pour trouver exactement ce
							que vous cherchez.
						</p>
						<p>
							⭐ Explorez et réservez facilement les services qui répondent
							parfaitement à vos besoins et préférences.
						</p>
						<p>
							⭐ Attendez la confirmation de votre réservation de la part des
							prestataires de services, assurant une interaction fluide et une
							réponse rapide à vos demandes.
						</p>
						{showNotification && (
							<div className='notification'>
								<p>
									Nos clients bénéficient déjà de notre application mobile
									complète, tandis que nous travaillons actuellement à la
									finalisation de l'application pour nos fournisseurs, afin de
									leur offrir également une expérience optimisée.
								</p>
								<button
									className='close-notification'
									onClick={handleCloseNotification}>
									X
								</button>
							</div>
						)}
					</div>
					<div className='user-box'>
						<h3>Fournisseur</h3>
						<img src={providerIcon} alt='Provider Icon' />
						<p>
							⭐ Présentez vos offres au sein de catégories spécifiques,
							atteignant ainsi une audience ciblée et intéressée.
						</p>
						<p>
							⭐ Gérez vos réservations et répondez aux demandes des clients en
							temps réel, garantissant une interaction fluide et
							professionnelle.
						</p>
						<p>
							⭐ Maximisez votre visibilité grâce à nos options de promotion
							payante, assurant une meilleure mise en avant de vos services
							auprès des clients potentiels.
						</p>
						{showNotification && (
							<div className='notification'>
								<p>
									Les fournisseurs bénéficient d'un mois d'essai gratuit sur
									notre plateforme. Après cette période, un paiement de 100,00
									$US est requis chaque mois pour obtenir des droits d'accès complets.
									Veuillez nous contacter pour plus de détails sur les modalités
									de paiement.
								</p>
								<button
									className='close-notification'
									onClick={handleCloseNotification}>
									X
								</button>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* Actualités */}
			<section className='news-updates' id='news-updates'>
				<h2>Actualités</h2>
				<div className='news-boxes'>
					<div className='news-box'>
						<h3>Nouveaux Services Disponibles</h3>
						<p>
							Nous avons récemment ajouté de nouvelles catégories de services
							pour répondre à tous vos besoins. Découvrez-les dès aujourd'hui!
						</p>
					</div>
					<div className='news-box'>
						<h3>Promotion Spéciale</h3>
						<p>
							Profitez de notre promotion spéciale de lancement avec des
							réductions allant jusqu'à 50% sur certains services. Ne manquez
							pas cette opportunité!
						</p>
					</div>
				</div>
			</section>

			<section className='promotions' id='promotions'>
				<h2>Offres Spéciales et Promotions</h2>
				<div className='promotion-items'>
					<div className='promotion-item'>
						<h3>Offre d'Été</h3>
						<p>
							Profitez de 20% de réduction sur toutes les réservations
							effectuées avant la fin du mois !
						</p>
					</div>
					<div className='promotion-item'>
						<h3>Forfait Famille</h3>
						<p>
							Réservez pour toute la famille et bénéficiez d'une nuit gratuite
							pour une réservation de 4 nuits.
						</p>
					</div>
					<div className='promotion-item'>
						<h3>Réduction Étudiant</h3>
						<p>
							Les étudiants bénéficient d'une réduction de 15% sur présentation
							de leur carte étudiante.
						</p>
					</div>
				</div>
			</section>

			<section className='why-choose-us' id='why-choose-us'>
				<h2>À Propos de Nous</h2>
				<div className='features'>
					<div className='feature'>
						<img src={flamephoto} alt='Provider Icon' />
						<h3>Confirmation de Rendez-vous par Email</h3>
						<p>
							Recevez des confirmations de vos réservations directement par
							email. Cette fonctionnalité assure une communication claire et
							instantanée, vous tenant informé de l’état de vos demandes de
							rendez-vous et évitant toute confusion.
						</p>
					</div>
					<div className='feature'>
						<img src={largecatphoto} alt='Provider Icon' />
						<h3>Services Personnalisés et Large Gamme de Catégories</h3>
						<p>
							Explorez une multitude de catégories de services, du bien-être aux
							consultations spécialisées. Nos options personnalisées vous
							garantissent de trouver exactement ce que vous cherchez, adapté à
							vos besoins spécifiques et préférences individuelles.
						</p>
					</div>
					<div className='feature'>
						<img src={reservephoto} alt='Provider Icon' />
						<h3>
							Gestion Simplifiée de votre Planning avec les Rendez-vous en Ligne
						</h3>
						<p>
							Gérez vos rendez-vous facilement grâce à notre système de
							réservation en ligne. En quelques étapes simples, planifiez et
							organisez vos services, optimisant ainsi votre emploi du temps et
							réduisant les oublis.
						</p>
					</div>
					<div className='feature'>
						<img src={navphoto} alt='Provider Icon' />
						<h3>Navigation Simplifiée et Expérience Utilisateur Optimisée</h3>
						<p>
							Notre plateforme est conçue pour offrir une navigation fluide et
							intuitive. Chaque fonctionnalité est pensée pour faciliter votre
							parcours utilisateur, vous permettant de trouver et réserver les
							services dont vous avez besoin en quelques clics seulement.
						</p>
					</div>
					<PaymentOptions />
				</div>
			</section>

			<section className='faq' id='faq'>
				<h2>FAQ</h2>
				<div className='faq-items'>
					<div className='faq-item'>
						<h3>Comment puis-je réserver un service?</h3>
						<p>
							Vous pouvez réserver un service en parcourant notre catalogue, en
							sélectionnant le service souhaité, puis en cliquant sur
							"Réserver". Suivez les étapes simples pour finaliser votre
							réservation.
						</p>
					</div>
					<div className='faq-item'>
						<h3>Comment devenir prestataire?</h3>
						<p>
							Pour devenir prestataire, inscrivez-vous sur notre plateforme et
							complétez votre profil. Vous pourrez ensuite ajouter vos services
							et commencer à recevoir des réservations.
						</p>
						<button
							className='inscrire-button'
							onClick={() => (window.location.href = '/register/provider')}>
							S'inscrire
						</button>
					</div>
				</div>
			</section>
		</section>
	);
};

export default MainSection;
