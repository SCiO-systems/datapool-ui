import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Fieldset } from 'primereact/fieldset';
import { Dialog } from 'primereact/dialog';
import './styles.css';
import AdvancedSearchComponent from '@scioservices/advanced-search-library/dist';
import '@scioservices/advanced-search-library/dist/css/styles.css';
import '@scioservices/advanced-search-library/dist/css/querybuilder.css';
import { useLocation, useSearchParams } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useAuth0 } from '@auth0/auth0-react';
import { Chart, DynamicTable, ApiCallDialog } from './components';
import AdvancedSearchService from '../../services/httpService/advancedSearchService';
import DatapoolHeader from '../../components/DatapoolHeader';
import { sortArrayOfObjectsByPropertyValue } from '../../utils/functions';
import ApiService from '../../services/httpService/apiService';

const AdvancedSearchPage = () => {
	const [mongoQuery, setMongoQuery] = useState();
	const [elasticQuery, setElasticQuery] = useState();
	const [valid, setValid] = useState(false);
	const [searchResults, setSearchResults] = useState(null);
	const [histogramVariable, setHistogramVariable] = useState('');
	const [chartData, setChartData] = useState([]);
	const [lazyState, setlazyState] = useState({
		first: 0,
		rows: 50,
		page: 1,
	});
	const [loading, setLoading] = useState(false);
	const [toggleUniqueIdsDialog, setToggleUniqueIdsDialog] = useState(false);
	const [datapoints, setDatapoints] = useState([]);
	const [datasetIdExists, setDatasetIdExists] = useState(false);
	const [api, setApi] = useState({});
	const [viewApiDialog, setViewApiDialog] = useState(false);

	const { user } = useAuth0();

	const location = useLocation();
	const { selectedDatapool, publicDatapool } = location.state;

	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(
		() => {
			if (selectedDatapool) {
				console.log(selectedDatapool);
				if (selectedDatapool.alias) {
					AdvancedSearchService.getDatapoints(selectedDatapool.alias, publicDatapool)
						.then((res) => {
							setDatapoints(res.datasetid);
						});
					ApiService.getUserDatapoolApis(user.sub, selectedDatapool.metadata?.datapool_id)
						.then((res) => {
							setApi(res);
						});
				}
			}
		}, [selectedDatapool]
	);

	const viewApiCallCode = () => {
		ApiService.getApiSecret(user.sub, selectedDatapool.metadata?.datapool_id, api.auth_zero_id)
			.then((res) => {
				setApi({ ...api, secret: res.client_secret });
				setViewApiDialog(true);
			});
	};

	const filters = () => {
		let newFilters = selectedDatapool.filters;
		newFilters = newFilters.map((item) => {
			const temp = { ...item, valueEditorType: item.type };
			if (item.values) {
				let sortedValues = sortArrayOfObjectsByPropertyValue(item.values, 'label');
				sortedValues = sortedValues.map((val) => {
					let newLabel = val.label;
					let newName = val.name;
					if (val.label === 'na') {
						newLabel = 'NA';
					}
					if (val.name === 'na') {
						newName = 'NA';
					}
					return { label: newLabel, name: newName };
				});
				temp.values = sortedValues;
			}
			delete temp.validator;
			return temp;
		});
		newFilters = sortArrayOfObjectsByPropertyValue(newFilters, 'label');
		return newFilters;
	};

	const getSearchResults = () => {
		if (elasticQuery && valid) {
			const json = JSON.parse(elasticQuery);
			const query = JSON.parse(json.query);
			// setLoading(true);
			AdvancedSearchService.getDatapoolSearchResults(selectedDatapool.alias, lazyState.first, lazyState.first + lazyState.rows, query, publicDatapool)
				.then((res) => {
					setSearchResults(res);
				})
				.finally(() => {
					// setLoading(false);
					setHistogramVariable('');
					setChartData([]);
				});
			setSearchParams(mongoQuery, { state: location.state });
		}
	};

	const datapointsArray = () => {
		if (datapoints instanceof Array) {
			return datapoints;
		}
		return [];
	};

	const renderHistogram = () => {
		if (elasticQuery && valid && (selectedDatapool?.histogramVariables instanceof Array)) {
			if (selectedDatapool?.histogramVariables.length) {
				return (
					<div className="variable-distribution">
						<p>Variable Distribution</p>
						<Dropdown
							value={histogramVariable}
							options={selectedDatapool?.histogramVariables}
							onChange={(e) => {
								const json = JSON.parse(elasticQuery);
								const query = JSON.parse(json.query);
								query.bool.filter = [
									{
										range: {
											longitude: {
												gte: -2147483648,
											},
										},
									},
								];
								AdvancedSearchService.getHistogramData(e.value.name, query, selectedDatapool.alias, publicDatapool)
									.then((res) => {
										let newChartData = res.frequencies;
										newChartData = newChartData.map((item) => {
											return [item.value, item.frequency];
										});
										setChartData(newChartData);
									});
								setHistogramVariable(e.value);
							}}
							optionLabel="label"
						/>
						{chartData.length ? <Chart chartData={chartData} /> : null}
					</div>
				);
			}
		}
		return null;
	};

	return (
		<div className="advanced-search-page">
			<DatapoolHeader
				datapool={selectedDatapool.metadata}
				headerState={{ codebook: true, api: api.api_id ? false : !!user?.sub, viewApi: !!api.api_id }}
				viewApi={viewApiCallCode}
			/>
			{selectedDatapool?.filters
				? (
					<Fieldset legend="Search">
						<div className="advanced-search-component">
							<AdvancedSearchComponent
								addIcon={<i className="fa-solid fa-plus" />}
								deleteIcon={<i className="fa-solid fa-x" />}
								setMongoQuery={setMongoQuery}
								setElasticQuery={setElasticQuery}
								setValid={setValid}
								filters={filters()}
							/>
							<Button
								label="Search"
								disabled={!valid}
								onClick={() => getSearchResults()}
							/>
						</div>
					</Fieldset>
				)
				: null
			}
			{
				searchResults
					? (
						<>
							<div className="table-containers">
								<div className="header">
									<p>Results</p>
									{elasticQuery && valid
										? (
											<div className="header-buttons">
												<Button
													icon="fa-light fa-file"
													iconPos="right"
													label="Export JSON"
													outlined
													onClick={() => {
														const json = JSON.parse(elasticQuery);
														const query = JSON.parse(json.query);
														AdvancedSearchService.exportCsv(selectedDatapool.alias, query, publicDatapool)
															.then((res) => {
																if (res.download_link) {
																	window.open(res.download_link, '_blank');
																}
															});
													}}
												/>
												<Button
													icon="fa-light fa-file"
													iconPos="right"
													label="Export CSV"
													outlined
													disabled
												/>
											</div>
										)
										: null}
								</div>
								<DynamicTable setDatasetIdExists={setDatasetIdExists} datasetIdExists={datasetIdExists} loading={loading} searchResults={searchResults} lazyState={lazyState} setlazyState={setlazyState} getSearchResults={getSearchResults} />
							</div>
							{
								datasetIdExists
									? (
										<div className="datapoints">
											<p>DATAPOINTS retrieved from ({datapoints.length}) datasets</p>
											<Button
												label="View Dataset IDs"
												onClick={() => {
													setToggleUniqueIdsDialog(true);
												}}
												disabled={!datapoints.length}
											/>
										</div>
									)
									: null
							}

						</>
					)
					: (
						<div className="table-containers">
							<p>No results found</p>
						</div>
					)
			}
			{renderHistogram()}
			<ApiCallDialog selectedDatapool={selectedDatapool} api={api} visible={viewApiDialog} setVisible={setViewApiDialog} elasticQuery={elasticQuery} />
			<Dialog header="Datasets" visible={toggleUniqueIdsDialog} style={{ width: '50vw' }} onHide={() => setToggleUniqueIdsDialog(false)}>
				<DataTable
					value={datapointsArray()}
					showGridlines
					stripedRows
					paginator
					rows={10}
				>
					<Column field="name" header="Dataset Id" />
					<Column field="count" header="Datapoints" />
				</DataTable>
			</Dialog>
		</div>
	);
};

export default AdvancedSearchPage;
