import React from 'react';
import { Navigate } from 'react-router-dom';

const ForceRedirect = ({ user, children }) => {
  if (user.isConnected) {
    if (user.role === 'SERVICE_PROVIDER') {
      return <Navigate to="/provider/*" replace />;
    } else if (user.role === 'CLIENT') {
      return <Navigate to="/client/*" replace />;
    } else if (user.role === 'ADMIN') {
      return <Navigate to="/admin/*" replace />;
    }
  }

  return children;
};

export default ForceRedirect;
