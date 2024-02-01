import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import {
	Home,
	AdvancedSearchPage,
	MyDataPools,
	MyDataFiles,
	AddVersion,
	EditMetadata,
	DataCleaner,
	CropModel,
	About,
	MyApis,
} from './pages';
import { MenuBar, Footer, UserValidation, Loader, PrivateOrStateDependantRoute } from './components';
import { UserProvider, GeneralContextProvider } from './store';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '@fortawesome/fontawesome-pro/css/all.css';
import '@fortawesome/fontawesome-pro/css/fontawesome.css';
import './App.css';
import { useGetToken, useValidate } from './hooks';
import { http } from './services/httpService';

const App = () => {
	const [token, setToken] = useState(false);
	const [init, setInit] = useState(false);
	const [counter, setCounter] = useState(0);

	useGetToken(setToken, setInit);
	useValidate(token, setInit);

	useEffect(() => {
		const reqInterceptor = http.interceptors.request.use(
			(config) => {
				setCounter((prevState) => prevState + 1);
				return config;
			},
			(error) => {
				setCounter((prevState) => prevState - 1);
				// console.log(error);
				return Promise.reject(error);
			}
		);
		const resInterceptor = http.interceptors.response.use(
			(response) => {
				setCounter((prevState) => prevState - 1);
				return response;
			},
			(error) => {
				setCounter((prevState) => prevState - 1);
				// console.log(error);
				return Promise.reject(error);
			}
		);
		return () => {
			http.interceptors.request.eject(reqInterceptor);
			http.interceptors.response.eject(resInterceptor);
		};
	}, []);

	return (
		init
			? (
				<div className="app">
					{counter ? <Loader /> : null}
					<UserProvider>
						<GeneralContextProvider>
							<Router>
								<MenuBar token={token} />
								<Routes>
									<Route exact path="/" element={<Navigate replace to="/Home" />} />
									<Route path="/Home" element={<Home />} />
									<Route path="/AdvancedSearch" element={<PrivateOrStateDependantRoute stateDependentRoute><AdvancedSearchPage /></PrivateOrStateDependantRoute>} />
									<Route path="/About" element={<About />} />
									<Route path="/MyDataPools" element={<PrivateOrStateDependantRoute privateRoute><MyDataPools /></PrivateOrStateDependantRoute>} />
									<Route path="/Tools/DataCleaner" element={<PrivateOrStateDependantRoute privateRoute><DataCleaner /></PrivateOrStateDependantRoute>} />
									<Route path="/Tools/CropModel" element={<PrivateOrStateDependantRoute privateRoute><CropModel /></PrivateOrStateDependantRoute>} />
									<Route path="/MyDataPools/AccessControl" element={<PrivateOrStateDependantRoute privateRoute stateDependentRoute><MyDataPools tab={{ name: 'AccessControl', index: 0 }} /></PrivateOrStateDependantRoute>} />
									<Route path="/MyDataPools/EditData" element={<PrivateOrStateDependantRoute privateRoute stateDependentRoute><MyDataPools tab={{ name: 'EditData', index: 1 }} /></PrivateOrStateDependantRoute>} />
									<Route path="/MyDataPools/EditData/AddVersion" element={<PrivateOrStateDependantRoute privateRoute stateDependentRoute><AddVersion token={token} /></PrivateOrStateDependantRoute>} />
									<Route path="/MyDataPools/EditData/Metadata" element={<PrivateOrStateDependantRoute privateRoute stateDependentRoute><EditMetadata /></PrivateOrStateDependantRoute>} />
									<Route path="/MyDataFiles" element={<PrivateOrStateDependantRoute privateRoute><MyDataFiles token={token} /></PrivateOrStateDependantRoute>} />
									<Route path="/Home/Landing" element={<PrivateOrStateDependantRoute privateRoute><UserValidation /></PrivateOrStateDependantRoute>} />
									<Route path="/MyApis" element={<PrivateOrStateDependantRoute privateRoute><MyApis /></PrivateOrStateDependantRoute>} />
								</Routes>
								<Footer />
							</Router>
						</GeneralContextProvider>
					</UserProvider>
				</div>
			)
			: null
	);
};

export default App;
