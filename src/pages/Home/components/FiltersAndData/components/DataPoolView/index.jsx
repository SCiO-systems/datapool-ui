import React, { useState } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import 'primeflex/primeflex.css';
import './styles.css';
import { ItemCard } from './components';

const DataPoolView = (props) => {
	const { tab, filteredData, pinnedDatapools, data, setPinned } = props;

	const [layout, setLayout] = useState('list ');

	const itemTemplate = (itemData) => {
		return (
			<ItemCard itemData={itemData} pinnedDatapools={pinnedDatapools} layout={layout} tab={tab} setPinned={setPinned} />
		);
	};

	const header = () => {
		return (
			<div className="flex justify-content-end">
				<DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
			</div>
		);
	};
	
	return (
		<DataView
			value={filteredData || data}
			itemTemplate={itemTemplate}
			layout={layout}
			paginator
			rows={5}
			rowsPerPageOptions={[5, 10, 25, 50]}
			header={header()}
		/>
	);
};

export default DataPoolView;
