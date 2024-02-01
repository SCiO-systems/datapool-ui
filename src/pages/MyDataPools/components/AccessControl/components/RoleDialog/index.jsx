import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import DatapoolService from '../../../../../../services/httpService/datapoolService';

const RoleDialog = ({ dialogVisibility, setDialogVisibility, location, rowData }) => {
	const [loading, setLoading] = useState(false);
	const roles = [
		{ id: 0, role_name: 'viewer', label: 'Viewer' },
		{ id: 1, role_name: 'administrator', label: 'Administrator' },
		{ id: 2, role_name: 'data_curator', label: 'Data Curator' },
	];

	const [selectedRole, setSelectedRole] = useState({});

	useEffect(() => {
		const currentRole = roles.find((r) => r.role_name === rowData?.role_name);
		setSelectedRole(currentRole);
	}, [dialogVisibility]);
	const handleChangeRole = () => {
		setLoading(true);
		DatapoolService.updateUserRole(location.state.userId, location.state.datapoolId, rowData.identity_provider_id, selectedRole.id)
			.then((res) => {
				setLoading(false);
				setDialogVisibility(false);
				setSelectedRole({});
			});
	};

	const handleClose = () => {
		setSelectedRole({});
		setDialogVisibility(false);
	};

	return (
		<Dialog header="Update User Role" visible={dialogVisibility} style={{ width: '20vw' }} onHide={handleClose} contentStyle={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px 20px' }}>
			<div className="users-table-table-container">
				<div className="flex flex-column gap-2" style={{ display: 'flex', flexDirection: 'column', paddingBottom: '20px' }}>
					<label htmlFor="username">User Role</label>
					<Dropdown value={selectedRole} onChange={(e) => setSelectedRole(e.value)} options={roles} optionLabel="label" />
				</div>
				<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
					<Button label="Update" onClick={handleChangeRole} disabled={loading} loading={loading} />
					<Button label="Close" onClick={handleClose} disabled={loading} />
				</div>
			</div>
		</Dialog>
	);
};

export default RoleDialog;
