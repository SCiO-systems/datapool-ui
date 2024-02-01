/* eslint-disable */
import React, {createContext, useState} from 'react';

const initialState = {
	selectedDatapool: null,
	publicDatapool: false,
	activeIndex: 0,
};

export const GeneralContext = createContext(initialState);

export const GeneralContextProvider = ({ children }) => {
	const [generalState, setGeneralState] = useState(initialState);

	return (
		<GeneralContext.Provider
			value={{
				...generalState,
				setSelectedDatapool: (payload) => {
					setGeneralState({...generalState, selectedDatapool: payload})
				},
				setPublicDatapool: (payload) => {
					setGeneralState({...generalState, publicDatapool: payload})
				},
				setActiveIndex: (payload) => {
					setGeneralState({...generalState, activeIndex: payload})
				},
				setGeneral: (payload) => {
					setGeneralState({...generalState, ...payload})
				}
			}}
		>
			{children}
		</GeneralContext.Provider>
	);
};
