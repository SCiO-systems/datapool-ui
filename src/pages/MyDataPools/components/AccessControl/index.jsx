import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useCallback, useEffect, useState } from 'react';
import DatapoolService from '../../../../services/httpService/datapoolService';
import { AddUserDialog, RoleDialog } from './components';
import './styles.css';

const AccessControl = ({ location }) => {
	const [datapoolUsers, setDatapoolUsers] = useState([]);
	const [dialogVisibility, setDialogVisibility] = useState(false);
	const [roleDialogVisibility, setRoleDialogVisibility] = useState(false);
	const [currentRow, setCurrentRow] = useState({});

	const fetchData = useCallback(() => {
		DatapoolService.getDatapoolUsers(location.state.userId, location.state.datapoolId)
			.then((res) => {
				setDatapoolUsers(res);
			});
	}, [location.state]);

	useEffect(() => {
		if (location.state && !dialogVisibility) {
			fetchData();
		}
	}, [location.state, dialogVisibility, roleDialogVisibility]);

	const handleRemoveUser = (data) => {
		DatapoolService.removeUserFromDatapool(location.state.userId, location.state.datapoolId, data.identity_provider_id, data.role_name)
			.then((res) => {
				fetchData();
			});
	};

	const handleEditRole = (data) => {
		setRoleDialogVisibility(true);
		setCurrentRow(data);
	};

	const actionsTemplate = (data) => {
		const isSelf = data.identity_provider_id === location.state.userId;
		return (
			<div style={{ display: 'flex', gap: '8px' }}>
				<Button icon="fa-solid fa-user-gear" rounded outlined tooltip="Change user role" disabled={isSelf} onClick={() => handleEditRole(data)} />
				<Button icon="fa-solid fa-user-minus" rounded outlined tooltip="Remove user" disabled={isSelf} onClick={() => handleRemoveUser(data)} />
			</div>
		);
	};

	const userTemplate = (data) => {
		return `${data.name} ${data.surname}`;
	};

	const roleTemplate = (data) => {
		if (data.role_name === 'administrator') {
			return 'Administrator';
		} if (data.role_name === 'viewer') {
			return 'Viewer';
		} if (data.role_name === 'data_curator') {
			return 'Data Curator';
		}
		return '';
	};

	return (
		<div className="access-control">
			<div className="users-table">
				<div className="buttons-container">
					<Button label="Add User" icon="fa-solid fa-user-plus" onClick={() => setDialogVisibility(true)} />
				</div>
				<div className="users-table-table-container">
					<p className="title">List of Users with Access</p>
					<DataTable value={datapoolUsers} showGridlines stripedRows>
						{/* <Column body={checkBox} /> */}
						<Column body={userTemplate} header="User" />
						<Column field="email" header="Email" />
						<Column body={roleTemplate} header="Access Level" />
						<Column body={actionsTemplate} header="Actions" />
						{/* <Column body={projectsTemplate} header="Project" /> */}
					</DataTable>
				</div>
				<AddUserDialog dialogVisibility={dialogVisibility} setDialogVisibility={setDialogVisibility} location={location} />
				<RoleDialog dialogVisibility={roleDialogVisibility} setDialogVisibility={setRoleDialogVisibility} location={location} rowData={currentRow} />
			</div>
		</div>
	);
};

export default AccessControl;
