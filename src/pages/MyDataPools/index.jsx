import React, { useEffect, useState } from 'react';
import './styles.css';
import { useLocation } from 'react-router-dom';
import { TabPanel, TabView } from 'primereact/tabview';
import { AccessControl, EditData } from './components';
import DatafileService from '../../services/httpService/datafileService';
import DatapoolHeader from '../../components/DatapoolHeader';

const MyDataPools = ({ tab }) => {
	const location = useLocation();
	const [activeIndex, setActiveIndex] = useState(tab.index);
	const [datapoolDatafiles, setDatapoolDatafiles] = useState([]);
	const [version, setVersion] = useState(0);

	useEffect(() => {
		if (location.state) {
			DatafileService.getDatapoolDatafiles(location.state.userId, location.state.datapoolId)
				.then((res) => {
					setDatapoolDatafiles(res);
					let newVersion = 0;
					if (res instanceof Array) {
						res.forEach((item) => {
							if (item.version > newVersion) {
								newVersion = item.version;
							}
						});
						setVersion(newVersion);
					}
				});
		}
	}, [location.state]);

	const headerStatePerScreen = () => {
		const { datapool } = location.state;
		let screen = '';
		if (!version) {
			screen = 'add-version';
		} else if (datapool.status === 'public') {
			screen = 'metadata-lock';
		} else if (datapool.description || datapool.citation || datapool.license) {
			screen = 'metadata-publish';
		} else {
			screen = 'publish';
		}
		switch (screen) {
		case 'add-version': return { codebook: false, api: false, metadata: false, publish: false, lock: false, editName: true };
		case 'metadata-lock': return { codebook: true, api: false, metadata: true, publish: false, lock: true, editName: true };
		case 'metadata-publish': return { codebook: true, api: false, metadata: true, publish: true, lock: false, editName: true };
		case 'publish': return { codebook: true, api: false, metadata: false, publish: true, lock: false, editName: true };
		default: return null;
		}
	};

	return (
		<div className="my-datapool">
			<DatapoolHeader datapool={location.state.datapool} headerState={headerStatePerScreen()} version={version} />
			<TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
				<TabPanel header="Access Control">
					<AccessControl location={location} />
				</TabPanel>
				<TabPanel header="Edit Data">
					<EditData location={location} datapoolDatafiles={datapoolDatafiles} version={version} />
				</TabPanel>
			</TabView>
		</div>
	);
};

export default MyDataPools;
