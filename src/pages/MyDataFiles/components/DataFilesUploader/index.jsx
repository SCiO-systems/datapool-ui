import React, { useEffect, useState } from 'react';
import UploadComponent from '@scioservices/upload-component';
import { useAuth0 } from '@auth0/auth0-react';
import DatafileService from '../../../../services/httpService/datafileService';
import './styles.css';

const DataFilesUploader = ({ token, setRefreshData }) => {
	const { user } = useAuth0();
	const [completedUploads, setCompletedUploads] = useState([]);

	useEffect(() => {
		if (completedUploads.length > 0) {
			DatafileService.confirmUpload(user.sub, completedUploads)
				.then((r) => {
				})
				.finally(() => {
					setCompletedUploads([]);
					setRefreshData((prev) => prev + 1);
				});
		}
	}, [completedUploads]);

	return (
		<div className="my-data-files-uploader">
			<UploadComponent completedUploads={completedUploads} setCompletedUploads={setCompletedUploads} devUrl={process.env.REACT_APP_BACKEND_URL} accessToken={token} uppyType="dashboard" />
		</div>

	);
};

export default DataFilesUploader;
