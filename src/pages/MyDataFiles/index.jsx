import React, { useState } from 'react';
import './styles.css';
import { DataFilesTable, DataFilesUploader } from './components';

const DataFiles = ({ token }) => {
	const [refreshData, setRefreshData] = useState(0);
	return (
		<div className="my-datafiles">
			<DataFilesUploader token={token} setRefreshData={setRefreshData} />
			<DataFilesTable refreshData={refreshData} setRefreshData={setRefreshData} />
		</div>
	);
};

export default DataFiles;
