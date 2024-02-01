/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import datapool from '../../assets/images/Menu/datapool.png';
import datapoolAlpha from '../../assets/images/Menu/datapool_alpha_2.png';
import './styles.css';
import { http } from '../../services/httpService';

const HeaderBar = ({ token }) => {
	const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

	const navigate = useNavigate();

	const handleLogout = () => {
		http.defaults.headers.common.Authorization = `Bearer`;
		logout({ logoutParams: { returnTo: process.env.REACT_APP_URL } });
	};

	const menuItemsPublic = [
		{
			label: 'About',
			command: () => navigate('/About'),
		},
		{
			label: 'Login',
			className: 'login-item',
			command: () => loginWithRedirect(),
		},
	];

	const menuItemsValidated = [
		{
			label: 'Tools',
			items: [
				{
					label: 'Survey Data Cleaner',
					command: () => navigate('/Tools/DataCleaner', { state: { token } }),
				},
				{
					label: 'Crop Model Data Transformer',
					command: () => navigate('/Tools/CropModel', { state: { token } }),
				},
			],
		},
		{
			label: 'About',
			command: () => navigate('/About'),
		},
		{
			label: 'My Data Files',
			command: () => navigate('/MyDataFiles'),
		},
		{
			label: 'My APIs',
			command: () => navigate('/MyApis'),
			// template: <Button className="my-apis" text label="My APIs" tooltip="Coming Soon" />,
			// disabled: true,
		},
		{
			icon: 'pi pi-user',
			className: 'profile-item',
			items: [
				{
					label: 'Profile',
					icon: 'fa-solid fa-user',
				},
				{
					label: 'Logout',
					icon: 'fa-solid fa-right-from-bracket',
					command: handleLogout,
				},
			],
		},
	];

	const menuItems = useMemo(() => {
		if (isAuthenticated) {
			return menuItemsValidated;
		}
		return menuItemsPublic;
	}, []);

	const startTemplate = () => {
		return (
			<Button rounded text onClick={() => navigate('/Home')}>
				<img src={datapoolAlpha} alt="logo" style={{ height: '70px' }} />
			</Button>
		);
	};

	return (
		<div className="menu-bar">
			<Menubar model={menuItems} start={startTemplate} style={{ width: '100%' }} />
		</div>
	);
};

export default HeaderBar;
