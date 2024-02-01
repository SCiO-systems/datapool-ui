import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import DatapoolService from '../../../../../../../../services/httpService/datapoolService';
import { renderLicences } from '../../../../../../../../utils/renderLicense';
import AdvancedSearchService from '../../../../../../../../services/httpService/advancedSearchService';

const ItemCard = (props) => {
	const { itemData, pinnedDatapools, layout, tab, setPinned } = props;

	const navigate = useNavigate();

	const { user, isAuthenticated } = useAuth0();

	const [expandCountries, setExpandCountries] = useState(false);
	const [expandCrops, setExpandCrops] = useState(false);

	const pinned = pinnedDatapools.find((item) => item.datapool_id === itemData.datapool_id);
	const dpCountries = itemData.tags.filter((item) => item.type === 'country');
	const dpCrops = itemData.tags.filter((item) => item.type === 'crop');

	const pinDatapool = () => {
		return (
			<Button
				icon={pinned ? 'fa-solid fa-star' : 'fa-regular fa-star'}
				rounded
				text
				style={pinned ? { color: '#ffb116' } : { color: 'gray' }}
				tooltip={pinned ? 'Unpin Datapool' : 'Pin Datapool'}
				onClick={() => {
					if (pinned) {
						DatapoolService.unpinDatapool(user.sub, itemData.datapool_id)
							.then((res) => {
								setPinned(pinnedDatapools.filter((item) => item.datapool_id !== itemData.datapool_id));
							});
					} else {
						DatapoolService.pinDatapool(user.sub, itemData.datapool_id)
							.then((res) => {
								setPinned([...pinnedDatapools, { datapool_id: itemData.datapool_id }]);
							});
					}
				}}
			/>
		);
	};
	const renderTopRightButton = () => {
		if (tab === 'private') {
			if (itemData.status === 'public') {
				return <i className="fa-regular fa-lock-open" />;
			}
			return <i className="fa-light fa-lock" />;
		}
		return pinDatapool(pinned, itemData);
	};

	const renderChips = (items, instance) => {
		if (items instanceof Array) {
			if (instance === 'countries' ? expandCountries : expandCrops) {
				return items.map((item) => {
					return (
						<div className="chip">
							<p>{item.tag}</p>
						</div>
					);
				});
			}
			let firstItems = items.filter((item, index) => index < 5);
			firstItems = firstItems.map((item) => {
				return (
					<div className="chip">
						<p>{item.tag}</p>
					</div>
				);
			});
			if (items.length > 5) {
				firstItems.push(
					<Button
						onClick={() => (instance === 'countries' ? setExpandCountries(true) : setExpandCrops(true))}
						style={{ padding: 0, minWidth: '0px' }}
					>
						<div className="chip">
							+ {items.length - 5}
						</div>
					</Button>
				);
			}
			return firstItems;
		}
		return null;
	};

	const displayButtonsPerRole = () => {
		const accessControlButton = () => {
			return (
				<Button
					icon="fa-duotone fa-user-gear"
					rounded
					outlined
					tooltip="Access Control"
					onClick={() => navigate('../MyDataPools/AccessControl', { state: { userId: itemData.identity_provider_id, datapoolId: itemData.mongo_id, datapool: itemData } })}
				/>
			);
		};
		const editButton = () => {
			return (
				<Button
					icon="fa-duotone fa-pen-to-square"
					rounded
					outlined
					tooltip="Edit Datapool"
					onClick={() => navigate('../MyDataPools/EditData', { state: { userId: itemData.identity_provider_id, datapoolId: itemData.mongo_id, datapool: itemData } })}
				/>
			);
		};
		switch (itemData.role_name) {
		case 'viewer': {
			return null;
		}
		case 'administrator': {
			return (
				<>
					{accessControlButton()}
					{editButton()}
				</>
			);
		}
		case 'data_curator': {
			return (
				<>
					{editButton()}
				</>
			);
		}
		default: return null;
		}
	};

	const renderButtons = () => {
		const renderAdvancedSearchButton = () => {
			if (itemData.records) {
				return (
					<Button
						icon="fa-duotone fa-box-open-full"
						rounded
						outlined
						tooltip="Advanced Search"
						onClick={() => {
							AdvancedSearchService.getDatapoolById(itemData.mongo_id, itemData.status === 'public', user?.sub)
								.then((res) => {
									navigate('/AdvancedSearch', { state: { selectedDatapool: { ...res, alias: itemData.alias, metadata: itemData }, publicDatapool: itemData.status, datapool: itemData } });
								});
						}}
					/>
				);
			}
			return null;
		};
		return (
			<div className="action">
				{renderAdvancedSearchButton()}
				{tab === 'private'
					? <>{displayButtonsPerRole(itemData)}</>
					: null}
			</div>
		);
	};

	return (
		<div className={layout === 'grid' ? 'card-item' : 'list-item'}>
			<div className="content">
				<div className="id-pin-container">
					<p className="id">{itemData.mongo_id}</p>
					{isAuthenticated ? renderTopRightButton(pinned, itemData) : null}
				</div>
				<p className="name">{tab === 'private' ? itemData.datapool_name : itemData.name}</p>
				<p className="records">{itemData.records ? `[${itemData.records}]` : '[0]'}</p>
				<p className="description">{itemData.description}</p>
				<div className="licenses">
					{renderLicences(itemData.license)}
				</div>
				<div className="card-bottom">
					<div className="chips">
						<div className="countries">
							<p className="category">Country</p>
							{renderChips(dpCountries, 'countries')}
						</div>
						<div className="crops">
							<p className="category">Crop</p>
							{renderChips(dpCrops, 'crops')}
						</div>
					</div>
					{renderButtons(itemData)}
				</div>
			</div>
		</div>
	);
};

export default ItemCard;
