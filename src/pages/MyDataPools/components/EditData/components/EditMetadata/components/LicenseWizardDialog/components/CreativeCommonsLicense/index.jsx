import { Button } from 'primereact/button';
import React from 'react';

const CreativeCommonsLicense = ({ license, closeDialog, setLicense }) => (
	<div className="p-grid p-mt-4 creative-commons-license">
		<div className="p-col-12">
			<div className="p-d-flex p-jc-between p-ai-center p-mb-2">
				<h2 className="p-text-bold">Recommended License</h2>
			</div>
			<div className="p-d-flex p-jc-between p-ai-center content">
				<h4 className="p-text-bold" style={{ width: '65%' }}>
					{license.name} ({license.full})
				</h4>
				<span className="buttons">
					<a
						href={license.link}
						className="p-button p-d-inline-block p-mr-2"
						style={{ width: '125px', maxWidth: '100%' }}
						target="_blank"
						rel="noreferrer"
					>
						View License
					</a>
					<Button
						label="Use License"
						onClick={() => {
							setLicense(license.dropdown_item);
							closeDialog();
						}}
						className="p-button-success"
						style={{ width: '125px', maxWidth: '100%' }}
					/>
				</span>
			</div>
		</div>
		<div className="p-col-12">
			<div className="p-text-bold p-mb-2">Description</div>
			<p>{license.description}</p>
		</div>
		<div className="p-col-12">
			<ul className="p-pl-4">
				{license.more.map((m) => (
					<li key={m}>{m}</li>
				))}
			</ul>
		</div>
	</div>
);

export default CreativeCommonsLicense;
