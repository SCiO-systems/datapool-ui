/* eslint-disable class-methods-use-this */
import { http } from '../index';

class AdvancedSearchService {
	getDatapoolSearchResults = async (id, from, to, query, publicStatus, userId) => {
		if (publicStatus) {
			const result = await http.post(`/datapools/public/search/${id}/documents/${from}/${to}`, { ...query });
			return result.data;
		}
		const result = await http.post(`user/${userId}//datapools/search/${id}/documents/${from}/${to}`, { ...query });
		return result.data;
	};

	getHistogramData = async (variable, query, index, publicStatus, userId) => {
		if (publicStatus) {
			const result = await http.post(`datapools/public/search/${index}/histogramData/${variable}`, { ...query });
			return result.data;
		} 
		const result = await http.post(`user/${userId}/datapools/search/${index}/histogramData/${variable}`, { ...query });
		return result.data;
	};

	exportCsv = async (index, query, publicStatus, userId) => {
		if (publicStatus) {
			const result = await http.post(`datapools/public/search/${index}/exportCsv`, { ...query });
			return result.data;
		}
		const result = await http.post(`user/${userId}/datapools/search/${index}/exportCsv`, { ...query });
		return result.data;
	};

	getDatapoolById = async (id, publicStatus, userId) => {
		if (publicStatus) {
			const result = await http.get(`/datapools/public/${id}/get`);
			return result.data;
		}
		const result = await http.get(`user/${userId}/datapools/${id}/get`);
		return result.data;
	};

	getDatapoints = async (index, publicStatus, userId) => {
		if (publicStatus) {
			const result = await http.get(`datapools/public/search/${index}/datapoints`);
			return result.data;
		}
		const result = await http.get(`user/${userId}/datapools/search/${index}/datapoints`);
		return result.data;
	};
}

export default new AdvancedSearchService();
