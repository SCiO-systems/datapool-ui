/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from 'primereact/button';
import { http } from '../../services/httpService';

const LoginButton = () => {
	const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
	const [subMenuState, setSubMenuState] = useState(false);

	const subMenu = () => {
		return (
			<div className="profile-menu">
				<ul className="p-submenu-list" role="menu" data-pc-section="submenu" style={{ display: 'block' }}>
					<li id="pr_id_4_0_0" role="none" className="p-menuitem p-menuitem-active" data-p-disabled="false" data-pc-section="menuitem">
						<a href="#" role="menuitem" className="p-menuitem-link" aria-haspopup="false" data-pc-section="action">
							<span className="p-menuitem-text" data-pc-section="label">
								Profile
							</span>
						</a>
					</li>
					<li id="pr_id_4_0_0" role="none" className="p-menuitem p-menuitem-active" data-p-disabled="false" data-pc-section="menuitem">
						<a
							href="#"
							role="menuitem"
							className="p-menuitem-link"
							aria-haspopup="false"
							data-pc-section="action"
							onClick={() => {
								localStorage.removeItem('validationStatus');
								http.defaults.headers.common.Authorization = `Bearer`;
								logout({ logoutParams: { returnTo: process.env.REACT_APP_URL } });
							}}
						>
							<span className="p-menuitem-text" data-pc-section="label">
								Logout
							</span>
						</a>
					</li>
				</ul>
			</div>
		);
	};

	if (isAuthenticated) {
		return (
			<>
				<Button icon="pi pi-user" rounded severity="info" aria-label="User" onClick={() => setSubMenuState(true)} />
				{subMenuState ? subMenu() : null}
			</>
			// <div className="profile" id="login">
			// 	<i className="fas fa-user-circle" />
			//
			// </div>
		);
	}
	return (
		<div
			className="cell"
			id="login"
			onClick={() => {
				loginWithRedirect();
			}}
		>
			<p>Login</p>
		</div>
	);
};

export default LoginButton;
