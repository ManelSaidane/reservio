import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './userprofile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false); // State to toggle editing mode
  const [editedUser, setEditedUser] = useState({
    Nom: '',
    Email: '',
    Num: '',
  }); // State to hold edited user data

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await axios.get('http://localhost:3000/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data); // Assuming response.data is an object with properties like Nom, Email, Num
      setEditedUser({
        ...response.data,
        Num: response.data.Num.toString(), // Convert Num to string for input field
      }); // Initialize editedUser with fetched data
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

	const handleCancelEdit = () => {
		setEditing(false);
		setEditedUser(user); // Reset editedUser to current user data
	};


  const handleChange = e => {
		const { name, value } = e.target;
		const newValue = name === 'Num' ? parseInt(value, 10) : value; // Transformation maintenue ici
		setEditedUser({
			...editedUser,
			[name]: newValue,
		});
	};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwt');
      const response = await axios.put(`http://localhost:3000/users/${user.ID}`, editedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      setEditing(false);
      alert('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  return (
    <div className="user-profile">
      <h2>Mon Profil</h2>
      <div className="user-info">
        {user && !editing ? (
          <>
            <p><FontAwesomeIcon icon={faUser} /> <strong>Nom:</strong> {user.Nom}</p>
            <p><FontAwesomeIcon icon={faEnvelope} /> <strong>Email:</strong> {user.Email}</p>
            <p><FontAwesomeIcon icon={faPhone} /> <strong>Numéro:</strong> {user.Num}</p>
            <button onClick={handleEdit}>Modifier</button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>
              Nom:
              <input
                type="text"
                name="Nom"
                value={editedUser.Nom}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="Email"
                value={editedUser.Email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Numéro:
              <input
                type="number"
                name="Num"
                value={editedUser.Num}
                onChange={handleChange}
                required
              />
            </label>
            <button type="submit">Enregistrer</button>
            <button type="button" onClick={handleCancelEdit}>Annuler</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
