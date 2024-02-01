import { Button } from 'primereact/button';
import React from 'react';

const SoftwareLicense = ({ license, closeDialog, setLicense }) => (
	<div className="p-grid p-mt-4">
		<div className="p-col-12">
			<div className="p-d-flex p-jc-between p-ai-center">
				<h4 className="p-text-bold">{license.name}</h4>
				<span>
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
		<div className="p-col-12 p-mt-5">
			<div className="p-grid">
				<div className="p-col-4">
					<div className="p-text-bold">Permissions</div>
					<ul className="permissions p-pl-4">
						{license.permissions.map((p) => (
							<li>{p}</li>
						))}
					</ul>
				</div>
				<div className="p-col-4">
					<div className="p-text-bold">Conditions</div>
					<ul className="conditions p-pl-4">
						{license.conditions.map((c) => (
							<li>{c}</li>
						))}
					</ul>
				</div>
				<div className="p-col-4">
					<div className="p-text-bold">Limitations</div>
					<ul className="limitations p-pl-4">
						{license.limitations.map((l) => (
							<li>{l}</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	</div>
);

export default SoftwareLicense;
