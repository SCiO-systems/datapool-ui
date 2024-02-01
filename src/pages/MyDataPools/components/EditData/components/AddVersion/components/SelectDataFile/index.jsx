import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import DatafileService from '../../../../../../../../services/httpService/datafileService';
import DatapoolService from '../../../../../../../../services/httpService/datapoolService';

const SelectDataFile = ({ location, setActiveStep, setTemplateUrl, targetVersion, selectedFile, setSelectedFile }) => {
	const [datafiles, setDatafiles] = useState([]);
	const [loading, setLoading] = useState(false);
	const populateTable = () => {
		DatafileService.getDatapoolDatafilesInverse(location.state.userId, location.state.datapoolId)
			.then((res) => {
				setDatafiles(res);
			});
	};

	useEffect(() => {
		if (location.state) {
			populateTable();
		}
	}, [location.state]);

	useEffect(() => {
	}, [selectedFile]);

	// const handleAddDatafiles = () => {
	// 	console.log(selectedDatafiles);
	// 	DatafileService.addDatafilesToDatapool(location.state.userId, location.state.datapoolId, selectedDatafiles)
	// 		.then((res) => {
	// 			console.log(res);
	// 		}).finally(() => {
	// 			setSelectedDatafiles([]);
	// 			populateTable();
	// 		});
	// };

	const handleGenerate = () => {
		setLoading(true);
		const s3Location = `codebooks/cb_template_${location.state.datapool.alias}_${1}.xlsx`;
		DatafileService.generateCodebook(location.state.userId, location.state.datapoolId, selectedFile.key, targetVersion, s3Location)
			.then((r) => {
				setLoading(false);
				setTemplateUrl(r);
				setActiveStep(1);
			});
	};

	return (
		<>
			<div className="users-table-table-container">
				<p className="title">List of Datafiles not associated with current Datapool</p>
				<DataTable
					value={datafiles}
					showGridlines
					stripedRows
					selectionMode="single"
					selection={selectedFile}
					onSelectionChange={(e) => setSelectedFile(e.value)}
					metaKeySelection={false}
					paginator
					rows={5}
					rowsPerPageOptions={[5, 10, 25, 50]}
				>
					<Column selectionMode="single" headerStyle={{ width: '3rem' }} />
					<Column field="filename" header="File Name" />
				</DataTable>
			</div>
			<Button className="generate-template" label="Generate Codebook Template" icon="fa-solid fa-arrow-right" iconPos="right" onClick={handleGenerate} disabled={!selectedFile} loading={loading} />;
		</>

	);
};

export default SelectDataFile;
