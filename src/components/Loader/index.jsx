import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import './styles.css';

const Loader = () => {
	return (
		<div className="loader">
			<ProgressSpinner />
		</div>
	);
};

export default Loader;
