import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import './styles.css';

const DynamicTable = (props) => {
	const { loading, searchResults, getSearchResults, lazyState, setlazyState, datasetIdExists, setDatasetIdExists } = props;

	const [columns, setColumns] = useState([]);
	const [activeColumns, setActiveColumns] = useState([]);

	useEffect(
		() => {
			if (searchResults.documents) {
				const properties = Object.keys(searchResults.documents[0]);
				const temp = properties.filter((item) => {
					if (typeof searchResults.documents[0][item] === 'string' || typeof searchResults.documents[0][item] === 'number') {
						return true;
					}
					return false;
				});
				if (temp.find((item) => item === 'dataset_id')) {
					setDatasetIdExists(true);
				}
				const newColumns = temp.filter((item) => item !== 'dataset_id');
				const columnsToRender = newColumns.filter((item) => !item.includes('enriched_'));
				setColumns([...columnsToRender]);
			}
		}, [searchResults]
	);

	useEffect(() => {
		loadLazyData();
	}, [lazyState]);

	const loadLazyData = () => {
		// setLoading(true);
		// console.log(lazyState);
		getSearchResults();
		// .then(() => setLoading(false));
	};

	const onPage = (event) => {
		setlazyState(event);
	};

	const columnHeader = (item) => {
		return <p className="column-header">{item}</p>;
	};

	const renderValue = (rowData, item) => {
		if (rowData[item] === -2147483648) {
			return 'NA';
		} 
		return rowData[item];
	};
	const renderColumns = () => {
		return activeColumns.map((item) => {
			return (
				<Column
					field={item}
					header={columnHeader(item)}
					body={(rowData) => renderValue(rowData, item)}
				/>
			);
		});
	};

	const header = () => {
		return (
			<MultiSelect
				selectAllLabel="Select All"
				maxSelectedLabels={3}
				value={activeColumns}
				options={columns}
				onChange={(e) => setActiveColumns(e.value)}
			/>
		);
	};

	if (!searchResults.documents) {
		return null;
	}

	return (
		<div className="dynamic-table">
			<DataTable
				value={searchResults.documents}
				showGridlines
				stripedRows
				header={header}
				loading={loading}
				paginator
				first={lazyState.first}
				rows={lazyState.rows}
				rowsPerPageOptions={[5, 10, 25, 50]}
				totalRecords={searchResults.total}
				onPage={onPage}
				lazy
				paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
				currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
			>
				{datasetIdExists ? <Column field="dataset_id" header={columnHeader('dataset_id')} /> : null}
				{renderColumns()}
			</DataTable>
		</div>
	);
};

export default DynamicTable;
