import { Dialog } from 'primereact/dialog';
import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Chips } from 'primereact/chips';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import DatapoolService from '../../../../../../services/httpService/datapoolService';

const NewDataPoolDialog = ({ dialogStatus, setDialogStatus, user, setRefreshData, refreshData }) => {
	const [name, setName] = useState('');
	const [tags, setTags] = useState([]);
	const [projects, setProjects] = useState([]);
	const [loading, setLoading] = useState(false);
	const [messageContent, setMessageContent] = useState({ severity: 'info', message: 'Please enter values in all three fields.' });

	const isFilledIn = () => {
		return name;
		// return name && tags.length > 0 && projects.length > 0;
	};

	const handleCreate = () => {
		setLoading(true);
		setMessageContent({ severity: 'info', message: 'dataPOOL creation in progress.' });
        
		const data = {
			name,
			// tags,
			// projects,
			userId: user.sub,
		};

		DatapoolService.createDatapool(user.sub, data)
			.then((r) => {
				setMessageContent({ severity: 'success', message: 'dataPOOL created successfully.' });
			})
			.catch((e) => {
				setMessageContent({ severity: 'error', message: e.message });
			})
			.finally(() => {
				setLoading(false);
				setRefreshData(refreshData + 1);
				setDialogStatus(false);
			});
	};

	const handleCancel = () => {
		setDialogStatus(false);
		setTimeout(() => {
			setName('');
			setTags([]);
			setProjects([]);
			setMessageContent({ severity: 'info', message: 'Please enter values in all three fields.' });
		}, [300]);
	};
    
	return (
		<Dialog header="New Datapool" visible={dialogStatus} style={{ width: '25vw' }} onHide={handleCancel} contentStyle={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px 20px' }}>
			{/* {messageContent ? <Message severity={messageContent.severity} text={messageContent.message} /> : null} */}
			<div className="flex flex-column gap-2">
				<label htmlFor="username">Name</label>
				<InputText value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%' }} placeholder="Enter Datapool name" />
			</div>
			{/* <div className="flex flex-column gap-2"> */}
			{/*	<label htmlFor="username">Tags</label> */}
			{/*	<Chips value={tags} onChange={(e) => setTags(e.value)} style={{ width: '100%' }} separator="," /> */}
			{/*	<small id="username-help"> */}
			{/*		Enter dataPOOL tags. Press enter after each tag or separate by commas. */}
			{/*	</small> */}
			{/* </div> */}
			{/* <div className="flex flex-column gap-2"> */}
			{/*	<label htmlFor="username">Projects</label> */}
			{/*	<Chips label="Projects" value={projects} onChange={(e) => setProjects(e.value)} style={{ width: '100%' }} separator="," /> */}
			{/*	<small id="username-help"> */}
			{/*		Enter dataPOOL projects. Press enter after each projects or separate by commas. */}
			{/*	</small> */}
			{/* </div> */}
			<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
				<Button label="Create" onClick={handleCreate} disabled={loading || !isFilledIn() || messageContent.severity === 'success'} loading={loading} />
			</div>
		</Dialog>
	);
};

export default NewDataPoolDialog;
