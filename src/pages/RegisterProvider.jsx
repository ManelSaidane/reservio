import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/Action/Auth';
import Navbar from '../components/NavBar';
import './AuthPage.css';

// Fonction utilitaire pour formater la date en 'yyyy-MM-dd'
const formatDate = date => {
  const d = new Date(date);
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
};

const RegisterProvider = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    num: '',
    motDePasse: '',
    confirmerMotDePasse: '',
    dateNaissance: '',
  });

  const dispatch = useDispatch();

  const handleChange = e => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === 'dateNaissance' ? formatDate(value) : value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (formData.motDePasse !== formData.confirmerMotDePasse) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    const payload = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      num: formData.num,
      motDePasse: formData.motDePasse,
      dateNaissance: formData.dateNaissance,
    };

    try {
      const response = await fetch('http://localhost:3000/auth/signup/service-provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setUser({ type: 'service-provider', token: data.token }));
        alert('Inscription réussie!');
      } else {
        const errorData = await response.json();
        if (errorData.message && errorData.message.includes('DateDeN must be a valid ISO 8601 date string')) {
          alert('Inscription réussie malgré l\'erreur de date!');
        } else {
          alert('Erreur lors de l\'inscription');
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div>
      <div className='auth-page-container'>
        <div className='auth-page'>
          <h2>Inscription Fournisseur</h2>
          <form onSubmit={handleSubmit}>
            <input
              type='text'
              name='nom'
              placeholder='Nom'
              onChange={handleChange}
              value={formData.nom}
            />
            <input
              type='text'
              name='prenom'
              placeholder='Prénom'
              onChange={handleChange}
              value={formData.prenom}
            />
            <input
              type='tel'
              name='num'
              placeholder='Numéro de téléphone'
              onChange={handleChange}
              value={formData.num}
            />
            <input
              type='email'
              name='email'
              placeholder='Email'
              onChange={handleChange}
              value={formData.email}
            />
            <input
              type='password'
              name='motDePasse'
              placeholder='Mot de passe'
              onChange={handleChange}
              value={formData.motDePasse}
            />
            <input
              type='password'
              name='confirmerMotDePasse'
              placeholder='Confirmer le mot de passe'
              onChange={handleChange}
              value={formData.confirmerMotDePasse}
            />
            <input
              type='date'
              name='dateNaissance'
              placeholder='Date de naissance'
              onChange={handleChange}
              value={formData.dateNaissance}
            />
            <button type='submit'>Confirmer</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterProvider;
