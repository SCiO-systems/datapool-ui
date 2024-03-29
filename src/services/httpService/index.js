import axios from 'axios';
import axiosRetry from 'axios-retry';

export const BACKEND = process.env.REACT_APP_BACKEND_URL;

export const http = axios.create({
	timeout: 30000,
	baseURL: `${BACKEND}/api`,
	// withCredentials: true,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
});

export const httpUnintercepted = axios.create({
	timeout: 30000,
	baseURL: `${BACKEND}/api`,
	// withCredentials: true,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
});

axiosRetry(http, {
	retries: 3, // number of retries
	retryDelay: (retryCount) => {
		console.log(`retry attempt: ${retryCount}`);
		return retryCount * 10000; // time interval between retries
	},
});

// http.interceptors.request.use(
//     (config) =>{
//
//     },
//     (error) => {
//
//     }
// );
//
// http.interceptors.response.use(
// 	(response) => {
// 		console.log(response);
// 		return response;
// 	},
// 	(error) => {
// 		console.log(error);
// 		return Promise.reject(error);
// 	}
// );
