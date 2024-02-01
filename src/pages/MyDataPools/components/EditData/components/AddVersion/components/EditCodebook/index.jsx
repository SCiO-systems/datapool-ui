import React, { useEffect, useState } from 'react';
import UploadComponent from '@scioservices/upload-component';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from 'primereact/button';
import axios from 'axios';
import DatafileService from '../../../../../../../../services/httpService/datafileService';
import './styles.css';

const EditCodebook = ({ location, token, setActiveStep, setCodebook, codebook, templateUrl, setValidationStatus }) => {
	const [completedUploads, setCompletedUploads] = useState([]);

	useEffect(() => {
		if (completedUploads.length > 0) {
			setCodebook(completedUploads[0]);
		}
	}, [completedUploads]);

	const handleValidate = () => {
		if (codebook) {
			DatafileService.validateCodebook(location.state.userId, location.state.datapoolId, codebook)
				.then((r) => {
					setValidationStatus('valid');
				})
				.finally(() => {
					setActiveStep(2);
				});
		}
	};

	const handleDownloadTemplate = () => {
		axios({
			url: templateUrl.url, // your url
			method: 'GET',
			responseType: 'blob', // important
		}).then((response) => {
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', templateUrl.key.split('/')[1]); // or any other extension
			document.body.appendChild(link);
			link.click();
			link.remove();
		});
	};

	return (
		<div className="edit-codebook" style={{ padding: '0 5%' }}>
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '2%' }}>
				<Button label="Codebook Template" icon="fa-solid fa-download" onClick={handleDownloadTemplate} />
				<Button label="Codebook Guide" icon="fa-solid fa-book" onClick={() => window.open('/assets/datapool-codebook-guide.pdf', '_blank')} />
			</div>
			<UploadComponent completedUploads={completedUploads} setCompletedUploads={setCompletedUploads} devUrl={process.env.REACT_APP_BACKEND_URL} accessToken={token} uppyType="dragdrop" restrictions={{ maxNumberOfFiles: 1, allowedFileTypes: ['.xlsx'] }} />
			<Button className="codebook-validation" label="Codebook Validation" icon="fa-solid fa-arrow-right" iconPos="right" onClick={handleValidate} disabled={!codebook} />
		</div>
	);
};

export default EditCodebook;
