import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import DatapoolService from '../../../../../../../../services/httpService/datapoolService';
import DatafileService from '../../../../../../../../services/httpService/datafileService';
import './styles.css';

const GenerateDP = ({ location, codebook, validationStatus, selectedFile, templateUrl }) => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	
	const handleGenerateVersion = () => {
		DatafileService.generateVersion(location.state.userId, location.state.datapoolId, location.state.version, location.state.datapool, selectedFile, codebook, templateUrl.key)
			.then((r) => {
				setLoading(false);
				navigate('../Home');
			});
	};

	const renderContent = () => {
		if (validationStatus === 'valid') {
			return (
				<>
					<p>Codebook validated!</p>
					<Button className="bottom-button" label="Generate Datapool Version" onClick={handleGenerateVersion} loading={loading} />
				</>
			);
		} if (validationStatus === 'invalid') {
			return (
				<>
					<p>Validation issues.</p>
					<Button label="Correct Codebook" icon="fa-solid fa-arrow-left" onClick={handleGenerateVersion} loading={loading} />
				</>
			);
		}
		return null;
	};

	return (
		renderContent()
	);
};

export default GenerateDP;
