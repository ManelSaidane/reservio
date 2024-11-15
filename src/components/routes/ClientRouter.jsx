import React from 'react';
import { Navigate } from 'react-router-dom';

const ClientRouter = ({ user, children }) => {
	console.log(user.role);
	if (!user.isConnected) {
		return <Navigate to='/login' replace />;
	} else {
		console.log(user.role);
		if (user.role !== 'CLIENT') {
			return <Navigate to='/noaccess' replace />;
		}
	}
	return children;
};

export default ClientRouter;
