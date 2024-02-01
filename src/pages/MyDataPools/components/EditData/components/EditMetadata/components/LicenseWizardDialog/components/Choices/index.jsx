import React from 'react';
import { RadioButton } from 'primereact/radiobutton';

const Choices = (props) => {
	const { value, setValue, choice1Text, choice2Text, choice1Value, choice2Value } = props;
	return (
		<>
			<div className="p-my-3">
				<label htmlFor="choice1">
					<RadioButton
						name="choice1"
						onChange={() => setValue(choice1Value)}
						checked={value === choice1Value}
					/>
					<span className="p-ml-2">{choice1Text}</span>
				</label>
			</div>
			<div className="p-my-3">
				<label htmlFor="choice2">
					<RadioButton
						name="choice2"
						onChange={() => setValue(choice2Value)}
						checked={value === choice2Value}
					/>
					<span className="p-ml-2">{choice2Text}</span>
				</label>
			</div>
		</>
	);
};

export default Choices;
