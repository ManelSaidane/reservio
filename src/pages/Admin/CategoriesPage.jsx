import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CategoriesPage.css';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/categories', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories :', error);
      setError('Erreur lors de la récupération des catégories');
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
      setCategories(categories.filter((category) => category.ID !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie :', error);
      setError('Erreur lors de la suppression de la catégorie');
    }
  };

  const addCategory = async () => {
    try {
      const response = await axios.post('http://localhost:3000/categories', {
        Nom: newCategoryName,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
      setCategories([...categories, response.data]);
      setNewCategoryName('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la catégorie :', error);
      setError('Erreur lors de l\'ajout de la catégorie');
    }
  };

  const startEditCategory = (id, name) => {
    setEditCategoryId(id);
    setEditCategoryName(name);
  };

  const cancelEditCategory = () => {
    setEditCategoryId(null);
    setEditCategoryName('');
  };

  const updateCategory = async () => {
    try {
      await axios.put(`http://localhost:3000/categories/${editCategoryId}`, {
        Nom: editCategoryName,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
      const updatedCategories = categories.map((category) => {
        if (category.ID === editCategoryId) {
          return { ...category, Nom: editCategoryName };
        }
        return category;
      });
      setCategories(updatedCategories);
      setEditCategoryId(null);
      setEditCategoryName('');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie :', error);
      setError('Erreur lors de la mise à jour de la catégorie');
    }
  };

  return (
    <div className="categories-container">
      <h1 className="categories-title">Liste des catégories</h1>
      {error && <p>{error}</p>}
      <ul className="categories-list">
        {categories.length > 0 ? (
          categories.map((category) => (
            <li key={category.ID} className="category-item">
              {editCategoryId === category.ID ? (
                <div className="edit-category-form">
                  <input
                    type="text"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                  />
                  <button onClick={updateCategory}>Enregistrer</button>
                  <button onClick={cancelEditCategory}>Annuler</button>
                </div>
              ) : (
                <>
                  <span className="category-name">{category.Nom}</span>
                  <div className="category-actions">
                    <button className="delete-button" onClick={() => deleteCategory(category.ID)}>Supprimer</button>
                    <button className="edit-button" onClick={() => startEditCategory(category.ID, category.Nom)}>Modifier</button>
                  </div>
                </>
              )}
            </li>
          ))
        ) : (
          <li>Aucune catégorie disponible</li>
        )}
      </ul>
      <div className="new-category-form">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Nouvelle catégorie"
        />
        <button onClick={addCategory}>Ajouter</button>
      </div>
    </div>
  );
};

export default CategoriesPage;
