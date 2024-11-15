import React from 'react';
import './payment.css';
import SecurePaymentIcon from '../assets/bank-card-discount-svgrepo-com.svg';
import InvoiceGenerationIcon from '../assets/letter-from-santa-claus-svgrepo-com.svg';
import ReliableGatewaysIcon from '../assets/security-protection-cog-lock-svgrepo-com.svg';
import PaymentTrackingIcon from '../assets/search-alt-2-svgrepo-com.svg';

const PaymentOptions = () => {
  return (
    <div className="payments-section">
      <h2>Paiements et Gestion des Encaissements</h2>
      {/* <p>Notre plateforme vous offre une solution simple et sécurisée pour gérer les paiements. Offrez à vos clients la possibilité de payer en ligne via des options sécurisées, et suivez l’état et l’historique des paiements en toute transparence.</p>
      <p>Les fournisseurs reçoivent une confirmation par email pour chaque paiement effectué, ce qui simplifie la gestion des transactions et garantit une communication claire sur les paiements reçus chaque mois.</p>
       */}
      <div className="payment-options">
        {/* <div className="payment-option">
  <img src={SecurePaymentIcon} alt="Paiement sécurisé" className="payment-icon" />
  <h3>Paiement sur Place et Gestion Sécurisée</h3>
  <p>Les paiements se font directement sur place lors de la réservation. Pour les réservations réalisées hors ligne, vous pouvez facilement envoyer un lien de paiement sécurisé aux clients si nécessaire. Notre système assure une gestion efficace et sécurisée de tous vos paiements.</p>
 </div> */}

        <div className="payment-option">
          <img src={InvoiceGenerationIcon} alt="Confirmation de paiement" className="payment-icon" />
          <h3>Confirmation de Paiement</h3>
          <p>Les fournisseurs reçoivent un email de confirmation chaque mois, détaillant le montant payé et les informations de la transaction. Cela assure une transparence totale sur les paiements effectués.</p>
        </div>

        <div className="payment-option">
          <img src={PaymentTrackingIcon} alt="Suivi des paiements" className="payment-icon" />
          <h3>Suivi des Paiements</h3>
          <p>Suivez les paiements reçus et en attente facilement. Vous pouvez gérer les rappels et envoyer des liens de paiement si nécessaire pour assurer une gestion efficace des encaissements.</p>
        </div>

        <div className="payment-option">
          <img src={ReliableGatewaysIcon} alt="Passerelles fiables" className="payment-icon" />
          <h3>Passerelles Fiables</h3>
          <p>Nous utilisons des solutions de paiement reconnues telles que Stripe et PayPal pour garantir la sécurité des transactions. Les frais de transaction sont spécifiques à chaque passerelle et sont facturés séparément.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;
