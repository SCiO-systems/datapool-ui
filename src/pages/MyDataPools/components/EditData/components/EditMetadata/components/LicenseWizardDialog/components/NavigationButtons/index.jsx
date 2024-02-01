import { Button } from 'primereact/button';
import React from 'react';

const NavigationButtons = (props) => {
	const { nextHidden, setStep, step, setActiveIndex, activeIndex } = props;

	return (
		<div className="p-mt-4 p-d-flex p-jc-between navigation-buttons">
			<Button
				label="Previous"
				onClick={() => {
					setStep(step - 1);
					setActiveIndex(activeIndex - 1);
				}}
				style={{ width: '125px' }}
			/>
			{!nextHidden && (
				<Button
					label="Next"
					onClick={() => {
						setStep(step + 1);
						setActiveIndex(activeIndex + 1);
					}}
					style={{ width: '125px' }}
				/>
			)}
		</div>
	);
};

export default NavigationButtons;
