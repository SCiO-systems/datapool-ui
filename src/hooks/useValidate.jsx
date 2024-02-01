import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import DbService from '../services/httpService/dbService';

const useValidate = (token, setInit) => {
	const { user, isAuthenticated, logout, isLoading } = useAuth0();

	useEffect(() => {
		if (!isLoading) {
			if (isAuthenticated && token) {
				const validationStatus = localStorage.getItem(`${user?.sub}`) || 'false';
				if (validationStatus === 'false') {
					DbService.addUser(user)
						.then((r1) => {
							localStorage.setItem(`${user?.sub}`, 'true');
						}).catch((e) => {
							if (e.response.status === 401) {
								localStorage.setItem(`${user?.sub}`, 'false');
								logout();
							}
						}).finally(() => {
							setInit(true);
						});
				} else {
					setInit(true);
				}
			} else if (!isAuthenticated) {
				setInit(true);
			}
		}
	}, [isLoading, isAuthenticated, token]);
};

export default useValidate;
