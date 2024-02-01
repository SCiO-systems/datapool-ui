import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import React, { useEffect, useState } from 'react';
import ccLicenses from '../../../../../../../../assets/data/licenses/cc.json';
import softwareLicenses from '../../../../../../../../assets/data/licenses/software.json';
import { NavigationButtons, Choices, CreativeCommonsLicense, SoftwareLicense } from './components';
import './styles.css';

const findCCLicenseIndex = (attribution, commercial, derivative, sharing) => {
	if (attribution === false) {
		// CC0 1.0
		return 0;
	}

	if (commercial === true) {
		if (derivative === true && sharing === false) {
			// CC BY-SA 4.0
			return 2;
		}
		if (derivative === false) {
			// CC BY-ND 4.0
			return 3;
		}
		// CC BY 4.0
		return 1;
	}

	if (commercial === false) {
		if (derivative === false) {
			// CC BY-NC-ND 4.0
			return 6;
		}
		if (derivative === true && sharing === false) {
			// CC BY-NC-SA 4.0
			return 5;
		}
		if (derivative === true && sharing === true) {
			// CC BY-NC 4.0
			return 4;
		}
		// CC BY-NC 4.0
		return 4;
	}

	// CC BY 4.0
	return 1;
};

const LicenseWizardDialog = ({ dialogOpen, setDialogOpen, setLicense }) => {
	const [software, setSoftware] = useState(false);
	const [attribution, setAttribution] = useState(null);
	const [commercialUse, setCommercialUse] = useState(null);
	const [derivativeWorks, setDerivativeWorks] = useState(null);
	const [shareAdaptations, setShareAdaptations] = useState(null);
	const [step, setStep] = useState(1);
	const [activeIndex, setActiveIndex] = useState(1);
	const [nextButtonHidden, setNextButtonHidden] = useState(false);

	useEffect(() => {
		setNextButtonHidden(false);
		const flowEndIndexes = [0, 6, 3];
		const licenseIndex = findCCLicenseIndex(
			attribution,
			commercialUse,
			derivativeWorks,
			shareAdaptations
		);
		if (flowEndIndexes.indexOf(licenseIndex) > -1 || step === 4) {
			setNextButtonHidden(true);
		}
	}, [attribution, commercialUse, derivativeWorks, shareAdaptations, step]);

	const resetState = () => {
		setSoftware(null);
		setAttribution(null);
		setCommercialUse(null);
		setDerivativeWorks(null);
		setShareAdaptations(null);
		setStep(0);
		setActiveIndex(0);
	};

	const closeDialog = () => {
		resetState();
		setDialogOpen(false);
	};

	return (
		<Dialog
			className="license-wizard"
			header={'License Wizard'}
			visible={dialogOpen}
			style={{ width: '800px' }}
			draggable={false}
			modal
			onHide={closeDialog}
		>
			<div className="p-fluid p-formgrid p-grid p-pt-1">
				<div className="p-col-12">
					{(step === 0 || (step === 1 && !software) || step > 1) && (
						<Accordion
							onTabChange={(e) => setActiveIndex(step)}
							activeIndex={activeIndex}
						>
							{/* <AccordionTab */}
							{/*	disabled={activeIndex !== 0} */}
							{/*	header="What is the license about?" */}
							{/* > */}
							{/*	<Choices */}
							{/*		value={software} */}
							{/*		setValue={setSoftware} */}
							{/*		choice1Value */}
							{/*		choice2Value={false} */}
							{/*		choice1Text="Software" */}
							{/*		choice2Text="Non-software" */}
							{/*	/> */}
							{/*	<div className="p-mt-4 p-d-flex p-jc-end"> */}
							{/*		<Button */}
							{/*			label="Next" */}
							{/*			onClick={() => { */}
							{/*				setStep(1); */}
							{/*				if (!software) { */}
							{/*					setActiveIndex(activeIndex + 1); */}
							{/*				} */}
							{/*			}} */}
							{/*			style={{ width: '150px' }} */}
							{/*		/> */}
							{/*	</div> */}
							{/* </AccordionTab> */}
							<AccordionTab
								disabled={activeIndex !== 1}
								header="Do you want attribution for your work?"
							>
								<Choices
									value={attribution}
									setValue={setAttribution}
									choice1Value
									choice2Value={false}
									choice1Text="Yes. Anyone using my work must include proper attribution."
									choice2Text="No. Anyone can use my work, even without giving me
                  attribution."
								/>
								<NavigationButtons nextHidden={nextButtonHidden} setStep={setStep} step={step} setActiveIndex={setActiveIndex} activeIndex={activeIndex} />
							</AccordionTab>
							<AccordionTab
								disabled={activeIndex !== 2}
								header="Do you want to allow others to use your work commercially?"
							>
								<Choices
									value={commercialUse}
									setValue={setCommercialUse}
									choice1Value
									choice2Value={false}
									choice1Text="Yes. Others can use my work, even for commercial purposes."
									choice2Text="No. Others can not use my work for commercial purposes."
								/>
								<NavigationButtons nextHidden={nextButtonHidden} setStep={setStep} step={step} setActiveIndex={setActiveIndex} activeIndex={activeIndex} />
							</AccordionTab>
							<AccordionTab
								disabled={activeIndex !== 3}
								header="Do you want to allow others to remix, adapt, or build upon your work?"
							>
								<Choices
									value={derivativeWorks}
									setValue={setDerivativeWorks}
									choice1Value
									choice2Value={false}
									choice1Text="Yes. Others can remix, adapt, or build upon my work."
									choice2Text="No. Others may only use my work in unadapted form."
								/>
								<NavigationButtons nextHidden={nextButtonHidden} setStep={setStep} step={step} setActiveIndex={setActiveIndex} activeIndex={activeIndex} />
							</AccordionTab>
							<AccordionTab
								disabled={activeIndex !== 4}
								header="Do you want to allow others to share adaptations of your work under any terms?"
							>
								<Choices
									value={shareAdaptations}
									setValue={setShareAdaptations}
									choice1Value
									choice2Value={false}
									choice1Text="Yes. Others can share adaptations of my work under any terms."
									choice2Text="No. Others must use the same CC license if they adapt my work."
								/>
								<NavigationButtons nextHidden={nextButtonHidden} setStep={setStep} step={step} setActiveIndex={setActiveIndex} activeIndex={activeIndex} />
							</AccordionTab>
						</Accordion>
					)}
					{step === 1 && software && (
						<div>
							<div className="p-d-flex p-jc-start p-ai-center p-mb-5">
								<Button
									label="Go back"
									icon="pi pi-arrow-left"
									onClick={() => {
										resetState();
									}}
									style={{ width: '150px' }}
								/>
							</div>
							{softwareLicenses.map((l) => (
								<SoftwareLicense
									setLicense={setLicense}
									closeDialog={closeDialog}
									key={l.name}
									license={l}
								/>
							))}
						</div>
					)}
					<CreativeCommonsLicense
						setLicense={setLicense}
						closeDialog={closeDialog}
						license={
							ccLicenses[
								findCCLicenseIndex(
									attribution,
									commercialUse,
									derivativeWorks,
									shareAdaptations
								)
							]
						}
					/>
				</div>
			</div>
		</Dialog>
	);
};

export default LicenseWizardDialog;
