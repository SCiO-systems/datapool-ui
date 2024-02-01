/* eslint-disable */
import React, {createContext, useState} from 'react';

const initialState = {
	access_token: null,
};

export const UserContext = createContext(initialState);

export const UserProvider = ({ children }) => {
	const [userData, setUserData] = useState(initialState);

	return (
		<UserContext.Provider
			value={{
				...userData,
				setAccessToken: (token) => {
					setUserData({...userData, access_token: token})
				},
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
