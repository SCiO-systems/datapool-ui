import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DatapoolService from '../../../../services/httpService/datapoolService';
import './styles.css';

const EditData = ({ location, datapoolDatafiles, version }) => {
	const navigate = useNavigate();

	const handleDeleteDP = () => {
		DatapoolService.deleteDatapool(location.state.userId, location.state.datapoolId)
			.then((res) => {
				navigate('../Home');
			});
	};

	const actionsTemplate = (data) => {
		return (
			<div style={{ display: 'flex', gap: '8px' }}>
				{/* <Button icon="fa-solid fa-user-minus" rounded outlined tooltip="Remove datafile" onClick={() => handleRemoveDatafile(data)} /> */}
			</div>
		);
	};

	return (
		<div className="edit-data">
			{version
				? (
					<div className="users-table">
						<div className="users-table-table-container">
							<p className="title">Edit Datapool Data</p>
							<DataTable value={datapoolDatafiles} showGridlines stripedRows>
								<Column field="version" header="Version" />
								<Column field="filename" header="Datafile" />
								<Column field="records" header="Datapoints" />
								<Column body={actionsTemplate} header="Actions" />
							</DataTable>
						</div>
					</div>
				)
				: null}
			<div className="buttons-container">
				<Button label="Delete DP" onClick={handleDeleteDP} severity="danger" />
				<Button label="Add Data File" onClick={() => navigate('./AddVersion', { state: { ...location.state, version } })} disabled={datapoolDatafiles.length > 0} />
			</div>
		</div>

	);
};

export default EditData;
