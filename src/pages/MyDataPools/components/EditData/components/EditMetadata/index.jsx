import React, { useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useLocation, useNavigate } from 'react-router-dom';
import DatapoolHeader from '../../../../../../components/DatapoolHeader';
import { LicenseWizardDialog } from './components';
import DatapoolService from '../../../../../../services/httpService/datapoolService';
import './styles.css';

const EditMetadata = () => {
	const location = useLocation();

	const navigate = useNavigate();

	const [descrition, setDescription] = useState('');
	const [citation, setCitation] = useState('');
	const [license, setLicense] = useState('');
	const [licenseWizardDialog, setLicenseWizardDialog] = useState(false);

	const licenses = ['CC0', 'CC BY', 'CC BY-SA', 'CC BY-ND', 'CC BY-NC', 'CC BY-NC-SA', 'CC BY-NC-ND'];

	const handleClick = () => {
		if (location.state.datapool.status === 'public') {
			DatapoolService.editDatapoolMetadata(location.state.datapool.identity_provider_id, location.state.datapool.mongo_id, descrition, citation, license)
				.then((res) => {
					navigate('/Home', { state: { ...location.state } });
				});
		} else {
			DatapoolService.addDatapoolMetadataAndPublish(location.state.datapool.identity_provider_id, location.state.datapool.mongo_id, descrition, citation, license)
				.then((res) => {
					navigate('/Home', { state: { ...location.state } });
				});
		}
	};

	return (
		<div className="edit-metadata">
			<DatapoolHeader datapool={location.state.datapool} version={location.state.version} />
			<div className="metadata">
				<div className="">
					<div className="input">
						<p><span style={{ color: 'red' }}>*</span> Description</p>
						<InputTextarea value={descrition} onChange={(e) => setDescription(e.target.value)} />
					</div>
					<div className="input">
						<p><span style={{ color: 'red' }}>*</span> How to cite</p>
						<InputTextarea value={citation} onChange={(e) => setCitation(e.target.value)} />
					</div>
					<div className="input">
						<p><span style={{ color: 'red' }}>*</span> License</p>
						<Dropdown value={license} options={licenses} onChange={(e) => setLicense(e.value)} />
						<Button className="license-wizard-button" label="License Wizard" onClick={() => setLicenseWizardDialog(true)} />
					</div>
				</div>
				<LicenseWizardDialog
					setDialogOpen={setLicenseWizardDialog}
					dialogOpen={licenseWizardDialog}
					setLicense={setLicense}
				/>
			</div>
			<Button className="publish-save" label={location.state.datapool.status === 'public' ? 'Save' : 'Publish'} onClick={() => handleClick()} />
		</div>
	);
};

export default EditMetadata;
