import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProviderRouter = ({ user, children }) => {
  const location = useLocation();

  if (!user.isConnected) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  } else if (user.role !== 'SERVICE_PROVIDER') {
    return <Navigate to='/' replace />;
  }

  return children;
};

export default ProviderRouter;
