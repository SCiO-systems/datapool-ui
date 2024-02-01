import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const PrivateOrStateDependantRoute = (props) => {
	const { children, privateRoute, stateDependentRoute } = props;
	const { isLoading, isAuthenticated } = useAuth0();
	const navigate = useNavigate();

	const location = useLocation();

	useEffect(() => {
		if (privateRoute) {
			if (!isLoading && !isAuthenticated) {
				navigate('/Home');
			}
		}
		if (stateDependentRoute) {
			if (!location.state) {
				navigate('/Home');
			}
		}
	}, [location, isLoading, isAuthenticated]);

	if (privateRoute && stateDependentRoute) {
		if (!isLoading && isAuthenticated && location.state) {
			return children;
		}
	} else if (privateRoute && !stateDependentRoute) {
		if (!isLoading && isAuthenticated) {
			return children;
		}
	} else if (!privateRoute && stateDependentRoute) {
		if (location.state) {
			return children;
		}
	}
	return null;
};

export default PrivateOrStateDependantRoute;
