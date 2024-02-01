import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import DatapoolService from '../../../../services/httpService/datapoolService';

const NameDialog = ({ dialogVisibility, setDialogVisibility, datapool }) => {
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState('');

	useEffect(() => {
		setName(datapool.datapool_name);
	}, [dialogVisibility]);

	const handleChangeName = () => {
		setLoading(true);
		DatapoolService.renameDatapool(datapool.userId, datapool.datapool_id, name)
			.then((res) => {
				setLoading(false);
				setDialogVisibility(false);
				setName('');
			});
	};

	const handleClose = () => {
		setName('');
		setDialogVisibility(false);
	};

	return (
		<Dialog header="Update Datapool Name" visible={dialogVisibility} style={{ width: '20vw' }} onHide={handleClose} contentStyle={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px 20px' }}>
			<div className="users-table-table-container">
				<div className="flex flex-column gap-2" style={{ display: 'flex', flexDirection: 'column', paddingBottom: '20px' }}>
					<label htmlFor="username">Datapool Name</label>
					<InputText value={name} onChange={(e) => setName(e.target.value)} />
				</div>
				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
					<Button label="Update" onClick={handleChangeName} disabled={loading} loading={loading} />
					<Button label="Close" onClick={handleClose} disabled={loading} />
				</div>
			</div>
		</Dialog>
	);
};

export default NameDialog;
