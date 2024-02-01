import React from 'react';
import { FiltersAndData } from './components';
import './styles.css';

const Home = () => {
	return (
		<div className="home">
			<div className="header">
				<h2>Use and share standardized agricultural data for faster and broader impact</h2>
			</div>
			<FiltersAndData />
		</div>

	);
};

export default Home;
