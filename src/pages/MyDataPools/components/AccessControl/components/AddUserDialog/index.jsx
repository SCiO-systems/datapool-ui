import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import DatapoolService from '../../../../../../services/httpService/datapoolService';
import './styles.css';

const AddUserDialog = ({ dialogVisibility, setDialogVisibility, location }) => {
	const [users, setUsers] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState([]);

	const populateTable = () => {
		DatapoolService.getDatapoolInverseUsers(location.state.userId, location.state.datapoolId)
			.then((res) => {
				setUsers(res);
			});
	};
	useEffect(() => {
		if (location.state && dialogVisibility) {
			populateTable();
		}
	}, [location.state, dialogVisibility]);

	const userTemplate = (data) => {
		return `${data.name} ${data.surname}`;
	};

	const handleAddUsers = () => {
		DatapoolService.addUsersToDatapool(location.state.userId, location.state.datapoolId, selectedUsers)
			.then((res) => {
			}).finally(() => {
				setSelectedUsers([]);
				populateTable();
			});
	};

	const handleClose = () => {
		setDialogVisibility(false);
		setSelectedUsers([]);
	};

	return (
		<Dialog className="add-user" header="Add Users" visible={dialogVisibility} style={{ width: '50vw' }} onHide={handleClose} contentStyle={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px 20px' }}>
			<div className="buttons-container">
				{selectedUsers.length > 0
					? <p>You have selected {selectedUsers.length} users.</p>
					: <p>Please select users to add to datapool.</p>
				}
				
				<Button label="Add Users to Datapool" onClick={handleAddUsers} disabled={selectedUsers.length === 0} />
			</div>
			<div className="users-table-table-container">
				<DataTable
					value={users}
					showGridlines
					stripedRows
					selectionMode="multiple"
					selection={selectedUsers}
					onSelectionChange={(e) => setSelectedUsers(e.value)}
					metaKeySelection={false}
					paginator
					rows={20}
				>
					<Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
					<Column body={userTemplate} header="User" />
					<Column field="email" header="User e-mail" />
					{/* <Column body={checkBox} /> */}
					{/* <Column body={userTemplate} header="User" /> */}
					{/* <Column body={roleTemplate} header="Access Level" /> */}
					{/* <Column body={actionsTemplate} header="Actions" /> */}
					{/* <Column body={projectsTemplate} header="Project" /> */}
				</DataTable>
			</div>
		</Dialog>
	);
};

export default AddUserDialog;
