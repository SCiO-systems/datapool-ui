import React, { useEffect, useState } from 'react';
import './styles.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { useAuth0 } from '@auth0/auth0-react';
import { InputText } from 'primereact/inputtext';
import { ApiCodeGenerator } from '../../components';
import ApiService from '../../services/httpService/apiService';
import DatapoolService from '../../services/httpService/datapoolService';

const MyApis = () => {
	const { user } = useAuth0();
	const [loadingSecret, setLoadingSecret] = useState({});
	const [myApis, setMyApis] = useState([]);
	const [triggerReload, setTriggerReload] = useState(0);
	const [toggleCreateApiDialog, setToggleCreateApiDialog] = useState(false);
	const [userDatapools, setUserDatapools] = useState([]);
	const [publicDatapools, setPublicDatapools] = useState([]);
	const [selectedDatapool, setSelectedDatapool] = useState(null);
	const [loading, setLoading] = useState(false);
	const [selectedApi, setSelectedApi] = useState(null);

	useEffect(
		() => {
			ApiService.getAllUserApis(user.sub)
				.then((res) => {
					setMyApis(res.apis);
				});
		}, [triggerReload]
	);

	const updateLoading = (key, bool) => {
		const newLoading = { ...loadingSecret };
		newLoading[key] = bool;
		setLoadingSecret(newLoading);
	};

	const updateSecret = (key, clientSecret) => {
		const newApis = [...myApis];
		const ind = myApis.findIndex((a) => a.api_id === key);
		newApis[ind].clientSecret = clientSecret;
	};

	const handleGetSecret = (data) => {
		updateLoading(data.api_id, true);
		ApiService.getApiSecret(user.sub, data.datapool_id, data.auth_zero_id)
			.then((res) => {
				updateSecret(data.api_id, res.client_secret);
			})
			.finally(() => {
				updateLoading(data.api_id, false);
			});
	};

	const handleCopyText = (data) => {
		navigator.clipboard.writeText(data);
	};

	const datapoolTemplate = (rowData) => {
		return (
			<div>
				<p>{rowData.mongo_id}</p>
				<h5>{rowData.name}</h5>
			</div>
		);
	};

	const handleShowDetails = (data) => {
		if (data.clientSecret) {
			setSelectedApi({ datapool: data.mongo_id, secret: data.clientSecret, id: data.auth_zero_id });
		} else {
			ApiService.getApiSecret(user.sub, data.datapool_id, data.auth_zero_id)
				.then((res) => {
					setSelectedApi({ datapool: data.mongo_id, secret: res.client_secret, id: data.auth_zero_id });
				});
		}
	};

	const actionsTemplate = (rowData) => {
		return (
			<div className="actions">
				{/* <Button rounded text icon="fa-solid fa-eye" /> */}
				<Button
					rounded
					text
					icon="fa-duotone fa-trash-can"
					onClick={() => {
						ApiService.deleteApi(user.sub, rowData.datapool_id, rowData.auth_zero_id)
							.then((res) => {
								setTriggerReload(triggerReload + 1);
							});
					}}
				/>
				<Button
					rounded
					text
					icon="fa-duotone fa-eye"
					onClick={() => handleShowDetails(rowData)}
				/>
			</div>
		);
	};

	const clientIdTemplate = (data) => {
		return (
			<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
				<p>{data.auth_zero_id}</p>
				<Button text rounded icon="fa-solid fa-copy" onClick={() => handleCopyText(data.auth_zero_id)} />
			</div>

		);
	};

	const clientSecretTemplate = (data) => {
		if (data.clientSecret) {
			return (
				<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
					<p>{data.clientSecret}</p>
					<Button text rounded icon="fa-solid fa-copy" onClick={() => handleCopyText(data.clientSecret)} />
				</div>

			);
		}
		const rowStatus = loadingSecret[data.api_id];

		return (
			<button
				aria-label="Get client secret"
				type="button"
				style={{ background: 'unset', border: 'unset', cursor: 'pointer', height: '2rem' }}
				onClick={() => handleGetSecret(data)}
			>
				<Skeleton width="330px" height="2rem" className="mb-2" animation={rowStatus ? 'wave' : 'none'}>
					<p>
						Click to View Client Secret
					</p>
				</Skeleton>
			</button>
		);
	};

	const headerTemplate = () => {
		return (
			<Button
				label="Create Api"
				onClick={() => {
					DatapoolService.getUserPrivateDatapools(user.sub)
						.then((res) => {
							setUserDatapools(res.datapools);
						});
					DatapoolService.getPublicDatapools()
						.then((res) => {
							setPublicDatapools(res.datapools);
						});
					setToggleCreateApiDialog(true);
				}}
			/>
		);
	};

	const handleCreate = () => {
		setLoading(true);

		ApiService.createApi(user.sub, selectedDatapool.datapool_id)
			.then((r) => {
				console.log(r);
			})
			.catch((e) => {
				console.log(e);
			})
			.finally(() => {
				setLoading(false);
				setTriggerReload(triggerReload + 1);
				setToggleCreateApiDialog(false);
			});
	};

	return (
		<div className="my-apis">
			<div className="my-apis-table">
				<h3>My APIs</h3>
				<DataTable
					value={myApis}
					showGridlines
					stripedRows
					paginator
					rows={5}
					rowsPerPageOptions={[5, 10, 25, 50]}
					header={headerTemplate}
					// paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					// currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
				>
					<Column header="Datapool" body={datapoolTemplate} />
					<Column field="auth_zero_id" header="Client Id" body={clientIdTemplate} style={{ width: '350px' }} />
					<Column field="clientSecret" header="Client Secret" body={clientSecretTemplate} style={{ width: '350px' }} />
					<Column header="Action" body={actionsTemplate} />
				</DataTable>
			</div>
			{selectedApi ? (
				<ApiCodeGenerator
					datapool={selectedApi.datapool}
					requestBody={{
						mode: 'raw',
						raw: JSON.stringify({
							client_id: selectedApi.id,
							client_secret: selectedApi.secret,
							audience: 'https://datapool.scio.services',
							grant_type: 'client_credentials',
						}),
					}}
					requestConfiguration={{
						url: 'https://sciosystems.eu.auth0.com/oauth/token',
						method: 'POST',
						header: 'content-type: application/json',
					}}
				/>
			) : null}
			<Dialog header="Create Api" visible={toggleCreateApiDialog} style={{ width: '50vw' }} onHide={() => setToggleCreateApiDialog(false)}>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px' }}>
					<div className="flex flex-column gap-2">
						<label htmlFor="username">Select a Private Datapool</label>
						<Dropdown
							value={selectedDatapool}
							onChange={(e) => setSelectedDatapool(e.value)}
							options={userDatapools}
							optionLabel="datapool_name"
							placeholder="Select a Datapool"
							className="w-full md:w-14rem"
						/>
					</div>
					<div className="flex flex-column gap-2">
						<label htmlFor="username">Select a Public Datapool</label>
						<Dropdown
							value={selectedDatapool}
							onChange={(e) => setSelectedDatapool(e.value)}
							options={publicDatapools}
							optionLabel={publicDatapools[0]?.datapool_name ? 'datapool_name' : 'name'}
							placeholder="Select a Datapool"
							className="w-full md:w-14rem"
						/>
					</div>
					<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
						<Button label="Create" onClick={handleCreate} disabled={loading || !selectedDatapool} loading={loading} />
					</div>
				</div>
			</Dialog>
		</div>
	);
};

export default MyApis;
