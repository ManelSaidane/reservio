import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/Action/Auth';
import './AuthPage.css';

const RegisterClient = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    num: '',
    motDePasse: '',
    confirmerMotDePasse: '',
    dateNaissance: '', // Ajout du champ dateNaissance
  });
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.motDePasse !== formData.confirmerMotDePasse) {
      setMessage('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/signup/client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          num: formData.num,
          motDePasse: formData.motDePasse,
          dateNaissance: formData.dateNaissance, // Inclure la date de naissance dans la requête
        }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setUser({ type: 'client', token: data.token }));
        setMessage('Inscription réussie!');
      } else {
        const errorData = await response.json();
        if (errorData.error === 'Email déjà utilisé') {
          setMessage('L\'email est déjà utilisé. Veuillez en choisir un autre.');
        } else {
          setMessage('Erreur lors de l\'inscription');
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Erreur inattendue lors de l\'inscription');
    }
  };

  return (
    <div>
      <div className="auth-page-container">
        <div className="auth-page">
          <h2>Inscription Client</h2>
          {message && <p>{message}</p>}
          <form onSubmit={handleSubmit}>
            <input type="text" name="nom" placeholder="Nom" onChange={handleChange} />
            <input type="text" name="prenom" placeholder="Prénom" onChange={handleChange} />
            <input type="tel" name="num" placeholder="Numéro de téléphone" onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} />
            <input type="password" name="motDePasse" placeholder="Mot de passe" onChange={handleChange} />
            <input type="password" name="confirmerMotDePasse" placeholder="Confirmer le mot de passe" onChange={handleChange} />
            <input type="date" name="dateNaissance" placeholder="Date de naissance" onChange={handleChange} />
            <button type="submit">Confirmer</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterClient;
