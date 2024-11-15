// src/components/Logout.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store';

const Logout = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2">Se Déconnecter</button>
  );
};

export default Logout;
