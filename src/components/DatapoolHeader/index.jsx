import React, { useState, useRef } from 'react';
import './styles.css';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { Toast } from 'primereact/toast';
import DatapoolService from '../../services/httpService/datapoolService';
import NameDialog from './components/NameDialog';
import { renderLicences } from '../../utils/renderLicense';
import ApiService from '../../services/httpService/apiService';

const DatapoolHeader = ({ datapool, headerState, version, viewApi }) => {
	const navigate = useNavigate();
	const [dialogVisibility, setDialogVisibility] = useState(false);
	const toast = useRef(null);

	const { user } = useAuth0();
	const handleCodebookDownload = () => {
		DatapoolService.getCurrentCodebookPresigned(datapool.identity_provider_id, datapool.mongo_id)
			.then((res) => {
				axios({
					url: res.url, // your url
					method: 'GET',
					responseType: 'blob', // important
				}).then((response) => {
					const url = window.URL.createObjectURL(new Blob([response.data]));
					const link = document.createElement('a');
					link.href = url;
					link.setAttribute('download', 'codebook.xlsx'); // or any other extension
					document.body.appendChild(link);
					link.click();
					link.remove();
				});
			});
	};

	const handleLock = () => {
		DatapoolService.lockDatapool(datapool.identity_provider_id, datapool.mongo_id)
			.then((res) => {
				// eslint-disable-next-line no-param-reassign
				datapool.status = 'private';
			});
	};

	return (
		<>
			<div className="header-card" style={{ display: 'flex', flexDirection: 'row' }}>
				<Toast ref={toast} />
				<div className="header-item left-item">
					<div className="content">
						<p className="id">{datapool.mongo_id || 'Datapool ID'}</p>
						<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
							{/* {datapool.status === 'public' ? <p className="name">{datapool.name || ''}</p> : <p className="name">{datapool.datapool_name || ''}</p>} */}
							<p className="name">{datapool.datapool_name || datapool.name || ''}</p>
							{headerState?.editName ? <Button text icon="fa-solid fa-pen-to-square" onClick={() => setDialogVisibility(true)} /> : null}
						</div>
						<p className="records">{datapool.records ? `[${datapool.records}]` : '[0]'}</p>
						<p className="description">{datapool.description || ''}</p>
						<div className="licenses">
							{renderLicences(datapool.license)}
						</div>
						{datapool.citation ? <p className="citation"><span>How to cite: </span>{datapool.citation}</p> : null}
						{headerState?.codebook ? <Button icon="fa-solid fa-download" label="Codebook" style={{ width: '150px', marginTop: 'auto' }} onClick={handleCodebookDownload} /> : null}
					</div>
				</div>
				<div className="header-item" style={{ marginLeft: 'auto' }}>
					<div className="content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
						{headerState?.api
							? (
								<Button
									icon="fa-solid fa-webhook"
									text
									tooltip="Create API"
									style={{ fontSize: '30px', marginLeft: 'auto' }}
									onClick={() => ApiService.createApi(user.sub, datapool.datapool_id)
										.then((res) => {
											toast.current.show({ severity: 'success', summary: 'Success!', detail: 'The Api was created successfully' });
										})
										.catch((e) => {
											toast.current.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
										})
									}
								/>
							) : null}
						{headerState?.viewApi
							? (
								<Button
									icon="fa-duotone fa-eye"
									text
									tooltip="API Call"
									style={{ fontSize: '30px', marginLeft: 'auto' }}
									onClick={() => viewApi()}
								/>
							)
							: null}
						{version ? <p className="name" style={{ marginLeft: 'auto' }}>ver {version}.0</p> : null}
						{headerState?.metadata ? <Button icon="fa-solid fa-pen-to-square" label="Metadata" onClick={() => navigate('/MyDataPools/EditData/Metadata', { state: { datapool, version } })} /> : null}
						{headerState?.publish ? <Button icon="fa-solid fa-lock-open" label="Publish" onClick={() => navigate('/MyDataPools/EditData/Metadata', { state: { datapool, version } })} /> : null}
						{headerState?.lock ? <Button icon="fa-solid fa-lock" severity="danger" label="Lock" onClick={handleLock} /> : null}
					</div>
				</div>
			</div>
			<NameDialog datapool={datapool} dialogVisibility={dialogVisibility} setDialogVisibility={setDialogVisibility} />
		</>
	);
};

export default DatapoolHeader;
