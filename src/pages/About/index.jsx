import React from 'react';
import './styles.css';

const About = () => {
	return (
		<div className="about">
			<div className="header">
				<h3>The Agronomy Datapool is a schemaless database built on knowledge graph technology. It provides access
					to aggregated, thematic collections of data that are dynamically created based on user searches.
					The resulting datasets can be visualized and downloaded in a variety of formats, including for input
					to crop models (DSSAT and APSIM), proprietary statistical packages (STATA and SPSS), and analysis via
					R (e.g., Carob).
				</h3>
			</div>
			<div className="features">
				<p>Main features:</p>
				<ul>
					<li>Search-based access to standardized data, and the ability to log in and upload data</li>
					<li>Ability to create and download thematic data collections (e.g., on use of fertilizer applications in particular regions or countries)</li>
					<li>Public and private data pools, to enable users to upload and restrict rights to data with personally-identifiable information (PII) before this is removed and the data moved to the public pool</li>
					<li>Special services for data cleaning and translation into crop model or statistical package-ready formats</li>
					<li>Features to visualize summary data on parameters within an aggregated dataset</li>
				</ul>
			</div>
		</div>
	);
};

export default About;
