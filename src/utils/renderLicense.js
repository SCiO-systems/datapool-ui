import React from 'react';

const renderLicences = (license) => {
	switch (license) {
	case 'CC0': return (
		<>
			<i className="fa-brands fa-creative-commons" />
			<i className="fa-brands fa-creative-commons-zero" />
		</>
	);
	case 'CC BY': return (
		<>
			<i className="fa-brands fa-creative-commons" />
			<i className="fa-brands fa-creative-commons-by" />
		</>
	);
	case 'CC BY-SA': return (
		<>
			<i className="fa-brands fa-creative-commons" />
			<i className="fa-brands fa-creative-commons-by" />
			<i className="fa-brands fa-creative-commons-sa" />
		</>
	);
	case 'CC BY-ND': return (
		<>
			<i className="fa-brands fa-creative-commons" />
			<i className="fa-brands fa-creative-commons-by" />
			<i className="fa-brands fa-creative-commons-nd" />
		</>
	);
	case 'CC BY-NC': return (
		<>
			<i className="fa-brands fa-creative-commons" />
			<i className="fa-brands fa-creative-commons-by" />
			<i className="fa-brands fa-creative-commons-nc" />
		</>
	);
	case 'CC BY-NC-SA': return (
		<>
			<i className="fa-brands fa-creative-commons" />
			<i className="fa-brands fa-creative-commons-by" />
			<i className="fa-brands fa-creative-commons-nc" />
			<i className="fa-brands fa-creative-commons-sa" />
		</>
	);
	case 'CC BY-NC-ND': return (
		<>
			<i className="fa-brands fa-creative-commons" />
			<i className="fa-brands fa-creative-commons-by" />
			<i className="fa-brands fa-creative-commons-nc" />
			<i className="fa-brands fa-creative-commons-nd" />
		</>
	);
	default: return null;
	}
};

// eslint-disable-next-line import/prefer-default-export
export { renderLicences };
