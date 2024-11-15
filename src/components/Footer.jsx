import React from 'react';
import './Footer.css';
import facebookIcon from '../assets/facebook.png'; 
import githubIcon from '../assets/github.png';
import linkedinIcon from '../assets/linkedin.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Contacts</h4>
          <p>Zone-touristique, Kantaoui, Sousse</p>
          <p>Email: saidaneemanel@gmail.com</p>
          <p>Tel: +216 99 043 314</p>
        </div>
        
        <div className="footer-section">
          <h4>Réseaux Sociaux</h4>
          <ul className="social-icons">
            <li>
              <a href="https://www.facebook.com/manel.saidane.90/" target="_blank" rel="noopener noreferrer">
                <img src={facebookIcon} alt="Facebook" className="social-icon" style={{ width: '30px', height: '30px' }} />
              </a>
            </li>
            <li>
              <a href="https://github.com/ManelSaidane" target="_blank" rel="noopener noreferrer">
                <img src={githubIcon} alt="GitHub" className="social-icon" style={{ width: '30px', height: '30px' }} />
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/manel-saidane-07897b25b/" target="_blank" rel="noopener noreferrer">
                <img src={linkedinIcon} alt="LinkedIn" className="social-icon" style={{ width: '30px', height: '30px' }} />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          &copy; 2024 Reservio. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
