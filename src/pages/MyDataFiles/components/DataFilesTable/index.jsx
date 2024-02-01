import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import DatafileService from '../../../../services/httpService/datafileService';
import './styles.css';

const DataFilesTable = ({ refreshData, setRefreshData }) => {
	const { user, isLoading } = useAuth0();
	const [datafiles, setDatafiles] = useState([]);
	const [toggleRelatedDatapoolsDialog, setToggleRelatedDatapoolsDialog] = useState(false);
	const [relatedDatapools, setRelatedDatapools] = useState([]);

	useEffect(() => {
		if (!isLoading) {
			DatafileService.getUserDatafiles(user.sub)
				.then((res) => {
					setDatafiles(res);
				});
		}
	}, [isLoading, refreshData]);

	const handleDownload = (data) => {
		DatafileService.getPresignedUrl(user.sub, data.datafile_id)
			.then((res) => {
				axios({
					url: res.url, // your url
					method: 'GET',
					responseType: 'blob', // important
				}).then((response) => {
					const url = window.URL.createObjectURL(new Blob([response.data]));
					const link = document.createElement('a');
					link.href = url;
					link.setAttribute('download', data.filename); // or any other extension
					document.body.appendChild(link);
					link.click();
					link.remove();
				});
			});
	};

	const handleDelete = (data) => {
		DatafileService.deleteDatafile(user.sub, data.datafile_id)
			.then((res) => {
				setRefreshData(!refreshData);
			});
	};

	const actionsTemplate = (rowData) => {
		return (
			<div style={{ display: 'flex', gap: '8px' }}>
				<Button
					rounded
					outlined
					icon="fa-duotone fa-download"
					onClick={() => handleDownload(rowData)}
				/>
				<Button
					rounded
					outlined
					icon="fa-solid fa-file-xmark"
					style={{ color: 'red', backgroundColor: 'white' }}
					onClick={() => handleDelete(rowData)}
					disabled={rowData.has_datapool}
				/>
			</div>
		);
	};

	const datapoolsTemplate = (rowData) => {
		return (
			<Button
				className="chip"
				style={rowData.has_datapool ? { backgroundColor: '#d6fad4' } : { backgroundColor: '#ffb1b1' }}
				onClick={() => {
					if (rowData.has_datapool) {
						DatafileService.getRelatedDatapools(user.sub, rowData.datafile_id)
							.then((res) => {
								setToggleRelatedDatapoolsDialog(true);
								setRelatedDatapools(res);
							});
					}
				}}
			>
				<p
					style={{ color: rowData.has_datapool ? '#3b7935' : '#ab3030', fontWeight: 'bold' }}
				>
					{rowData.has_datapool ? 'View Related Datapools' : 'No Related Datapools'}
				</p>
			</Button>
		);
	};

	return (
		<div className="files">
			{/* <div className="buttons-container"> */}
			{/*	<Button label="Upload File" onClick={() => { setRenderUploader(true); }} /> */}
			{/* </div> */}
			<div className="data-files-table-container">
				<h1 className="title">My Files</h1>
				<DataTable value={datafiles} showGridlines stripedRows paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}>
					<Column field="filename" header="File Name" />
					<Column field="has_datapool" header="Datapools" body={datapoolsTemplate} />
					<Column field="creation_time" header="Uploaded" />
					<Column field="name" header="Actions" body={actionsTemplate} />
					{/* <Column body={tagTemplate} header="Tag" /> */}
					{/* <Column body={projectsTemplate} header="Project" /> */}
				</DataTable>
			</div>
			<Dialog header="Header" visible={toggleRelatedDatapoolsDialog} style={{ width: '50vw' }} onHide={() => setToggleRelatedDatapoolsDialog(false)}>
				<DataTable value={relatedDatapools} showGridlines stripedRows>
					<Column field="mongo_id" header="Datapool Id" />
				</DataTable>
			</Dialog>
		</div>
	);
};

export default DataFilesTable;
