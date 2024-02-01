import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { http, httpUnintercepted } from '../services/httpService';

const useGetToken = (setToken, setInit) => {
	const { getAccessTokenSilently, isLoading, isAuthenticated, user } = useAuth0();
	useEffect(() => {
		const getAccessToken = async () => {
			return getAccessTokenSilently({
				audience: process.env.REACT_APP_AUTH0_API_ID,
				scope: process.env.REACT_APP_AUTH0_SCOPE,
				responseType: 'token id_token',
				grant_type: 'client_credentials',
			});
		};
		if (!isLoading) {
			if (isAuthenticated) {
				getAccessToken().then((r) => {
					http.defaults.headers.common.Authorization = `Bearer ${r}`;
					httpUnintercepted.defaults.headers.common.Authorization = `Bearer ${r}`;
					setToken(r);
				});
			}
		}
	}, [isLoading, isAuthenticated]);
};

export default useGetToken;
