import React, { useEffect, useState, useContext } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { useAuth0 } from '@auth0/auth0-react';
import { DataPoolView, NewDataPoolDialog } from './components';
import './styles.css';
import DatapoolService from '../../../../services/httpService/datapoolService';
import { GeneralContext } from '../../../../store';

const FiltersAndData = () => {
	const [selectedCrops, setSelectedCrops] = useState([]);
	const [cropOptions, setCropOptions] = useState([]);
	const [selectedRegions, setSelectedRegions] = useState([]);
	const [regionOptions, setRegionOptions] = useState([]);
	const [selectedCountries, setSelectedCountries] = useState([]);
	const [countriesOptions, setCountriesOptions] = useState([]);
	const [publicDatapools, setPublicDatapools] = useState([]);
	const [pinnedDatapools, setPinnedDatapools] = useState([]);
	const [myDatapools, setMyDatapools] = useState([]);
	const [pinned, setPinned] = useState([]);
	const [filteredData, setFilteredData] = useState(null);
	const [dialogStatus, setDialogStatus] = useState(false);
	const [refreshData, setRefreshData] = useState(0);

	const { activeIndex, setActiveIndex } = useContext(GeneralContext);

	const { user, isAuthenticated } = useAuth0();

	const populateFilters = (data) => {
		if (data) {
			setCropOptions(data.crops);
			setRegionOptions(data.regions);
			setCountriesOptions(data.countries);
		}
	};

	useEffect(
		() => {
			switch (activeIndex) {
			case 0: {
				if (isAuthenticated) {
					DatapoolService.getUserPinnedDatapools(user.sub)
						.then((res) => {
							setPinned(res);
						});
				}
				DatapoolService.getPublicDatapools()
					.then((res) => {
						setPublicDatapools(res.datapools);
						populateFilters(res.filters);
					});
				break;
			}
			case 1: {
				DatapoolService.getPublicDatapools()
					.then((pub) => {
						DatapoolService.getUserPinnedDatapools(user.sub)
							.then((pin) => {
								setPinned(pin);
								const newData = pub.datapools.filter((item) => {
									if (pin.find((it) => it.datapool_id === item.datapool_id)) {
										return true;
									}
									return false;
								});
								setPinnedDatapools(newData);
								populateFilters(pub.filters);
							});
					});
				break;
			}
			case 2: {
				DatapoolService.getUserDatapools(user.sub)
					.then((res) => {
						setMyDatapools([...res.datapools]);
						populateFilters(res.filters);
					});
				break;
			}
			default: break;
			}
		}, [activeIndex, refreshData]
	);

	const assignTabData = () => {
		switch (activeIndex) {
		case 0: return publicDatapools;
		case 1: return pinnedDatapools;
		case 2: return myDatapools;
		default: return [];
		}
	};

	const filterDatapools = () => {
		const data = assignTabData();
		const newFilteredData = data.filter((dp) => {
			const foundCrop = dp.tags.find((item) => {
				if (selectedCrops.find((crop) => crop === item.tag)) {
					return true;
				}
				return false;
			});
			const foundRegion = dp.tags.find((item) => {
				if (selectedRegions.find((region) => region === item.tag)) {
					return true;
				}
				return false;
			});
			const foundCountry = dp.tags.find((item) => {
				if (selectedCountries.find((country) => country === item.tag)) {
					return true;
				}
				return false;
			});
			if ((foundCrop || !selectedCrops.length) && (foundRegion || !selectedRegions.length) && (foundCountry || !selectedCountries.length)) {
				return true;
			}
			return false;
		});
		setFilteredData(newFilteredData);
	};

	const renderUserTabs = () => {
		if (isAuthenticated) {
			return [
				<TabPanel header="Pinned Datapools">
					<div className="table-card">
						<DataPoolView
							tab="pinned"
							pinnedDatapools={pinned}
							filteredData={filteredData}
							data={pinnedDatapools}
							setPinned={setPinned}
						/>
					</div>
				</TabPanel>,
				<TabPanel header="My Datapools">
					<div className="table-card">
						<Button className="new-datapool-button" label="New Datapool" onClick={() => setDialogStatus(true)} />
						<DataPoolView
							tab="private"
							filteredData={filteredData}
							pinnedDatapools={pinned}
							data={myDatapools}
							setPinned={setPinned}
						/>
					</div>
				</TabPanel>,
			];
		}
		return null;
	};

	return (
		<div className="home-page">
			<div className="filters">
				<MultiSelect
					value={selectedCrops}
					onChange={(e) => setSelectedCrops(e.value)}
					options={cropOptions}
					placeholder="Select Crop"
					maxSelectedLabels={3}
					selectAllLabel="Select All"
					disabled={assignTabData().length === 1}
				/>
				<MultiSelect
					value={selectedRegions}
					onChange={(e) => setSelectedRegions(e.value)}
					options={regionOptions}
					placeholder="Select Region"
					maxSelectedLabels={3}
					disabled={assignTabData().length === 1}
					selectAllLabel="Select All"
				/>
				<MultiSelect
					value={selectedCountries}
					onChange={(e) => setSelectedCountries(e.value)}
					options={countriesOptions}
					placeholder="Select Country"
					maxSelectedLabels={3}
					disabled={assignTabData().length === 1}
					selectAllLabel="Select All"
				/>
				<Button label="Filter" onClick={() => filterDatapools()} disabled={(!selectedCrops.length && !selectedRegions.length && !selectedCountries.length) || assignTabData().length === 1} />
				<Button
					label="Clear"
					onClick={() => {
						setSelectedRegions([]);
						setSelectedCrops([]);
						setSelectedCountries([]);
						setFilteredData(null);
					}}
				/>
			</div>
			<TabView
				activeIndex={activeIndex}
				onTabChange={(e) => {
					setSelectedRegions([]);
					setSelectedCountries([]);
					setSelectedCrops([]);
					setFilteredData(null);
					setActiveIndex(e.index);
				}}
			>
				<TabPanel header="Browse Public Datapools">
					<div className="table-card">
						<DataPoolView
							tab="public"
							filteredData={filteredData}
							pinnedDatapools={pinned}
							data={publicDatapools}
							setPinned={setPinned}
						/>
					</div>
				</TabPanel>
				{renderUserTabs()}
			</TabView>
			<NewDataPoolDialog dialogStatus={dialogStatus} setDialogStatus={setDialogStatus} user={user} setRefreshData={setRefreshData} refreshData={refreshData} />
		</div>
	);
};

export default FiltersAndData;
