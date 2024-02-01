/* eslint-disable no-param-reassign,jsx-a11y/no-static-element-interactions,consistent-return */
import * as echarts from 'echarts';
import React, { useState, useEffect } from 'react';
// import './styles.css';

const MockGraph = (props) => {
	const { chartData } = props;
	const [myChart, setMyChart] = useState(null);

	useEffect(() => {
		const chartDom = document.getElementById('chart-container');
		setMyChart(echarts.init(chartDom));
	}, [chartData]);

	useEffect(() => {
		// const myChart = echarts.init(chartDom);
		if (!myChart) return;

		myChart.showLoading();
		myChart.hideLoading();

		const option = {
			xAxis: [
				{
					type: 'value',
				},
			],
			yAxis: [
				{
					type: 'value',
				},
			],
			series: [
				{
					name: 'Direct',
					type: 'bar',
					barWidth: '100%',
					data: chartData,
				},
			],
		};

		myChart.setOption(option);
		return () => myChart.dispose();
	}, [myChart, chartData]);

	return (
		<div id="chart-container" style={{ width: '100%', height: '700px' }} />
	);
};
export default MockGraph;
