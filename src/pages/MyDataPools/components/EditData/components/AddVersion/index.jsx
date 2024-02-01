import React, { useEffect, useMemo, useState } from 'react';
import { Steps } from 'primereact/steps';
import { useLocation } from 'react-router-dom';
import { SelectDataFile, EditCodebook, GenerateDP } from './components';
import DatapoolHeader from '../../../../../../components/DatapoolHeader';
import './styles.css';

const AddVersion = ({ token }) => {
	const location = useLocation();
	const [activeStep, setActiveStep] = useState(0);
	const [selectedFile, setSelectedFile] = useState('');
	const [codebook, setCodebook] = useState('');
	const [templateUrl, setTemplateUrl] = useState('');
	const [validationStatus, setValidationStatus] = useState();

	const steps = [
		{ label: 'Select Data File' },
		{ label: 'Edit/Review Codebook' },
		{ label: 'Generate DP' },
	];

	const renderStep = () => {
		switch (activeStep) {
		case 0:
			return <SelectDataFile location={location} setActiveStep={setActiveStep} setTemplateUrl={setTemplateUrl} targetVersion={location.state.version + 1} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />;
		case 1:
			return <EditCodebook location={location} setActiveStep={setActiveStep} codebook={codebook} setCodebook={setCodebook} templateUrl={templateUrl} token={token} setValidationStatus={setValidationStatus} />;
		case 2:
			return <GenerateDP location={location} codebook={codebook} selectedFile={selectedFile} validationStatus={validationStatus} templateUrl={templateUrl} version={location.state.version + 1} />;
		default:
			return null;
		}
	};
	return (
		<div className="add-version">
			<DatapoolHeader datapool={location.state.datapool} version={location.state.version} />
			<div className="steps-container">
				<Steps model={steps} activeIndex={activeStep} onSelect={(e) => setActiveStep(e.index)} readOnly={false} />
				{renderStep()}
			</div>
		</div>
	);
};

export default AddVersion;
