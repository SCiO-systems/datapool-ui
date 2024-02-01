import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Auth0Provider } from '@auth0/auth0-react';
import Gleap from 'gleap';
import App from './App';

if (process.env.REACT_APP_URL !== 'http://localhost:3000') {
	Gleap.initialize('PXci16hQQKDCacdz0eIMzZ11IpKUNfiZ');
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<Auth0Provider
			domain={process.env.REACT_APP_AUTH0_DOMAIN}
			clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
			authorizationParams={{
				redirect_uri: process.env.REACT_APP_REDIRECT_URL,
				audience: process.env.REACT_APP_AUTH0_API_ID,
				scope: process.env.REACT_APP_AUTH0_SCOPE,
				responseType: 'token id_token',
			}}
			useRefreshTokensFallback
			useRefreshTokens
			cacheLocation={'localstorage'}
		>
			<App />
		</Auth0Provider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
