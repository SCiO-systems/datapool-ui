/* eslint-disable class-methods-use-this */
import { http, httpUnintercepted } from '../index';

class ApiService {
	createApi = async (userId, datapoolId) => {
		const result = await http.get(`user/${userId}/datapools/${datapoolId}/apis/create`);
		return result.data;
	};

	deleteApi = async (userId, datapoolId, apiId) => {
		const result = await http.delete(`user/${userId}/datapools/${datapoolId}/apis/${apiId}/delete`);
		return result.data;
	};

	getAllUserApis = async (userId) => {
		const result = await http.get(`user/${userId}/apis/all/get`);
		return result.data;
	};

	getAllDatapoolApis = async (userId, datapoolId) => {
		const result = await http.get(`user/${userId}/datapools/${datapoolId}/apis/all/get`);
		return result.data;
	};

	getUserDatapoolApis = async (userId, datapoolId) => {
		const result = await http.get(`user/${userId}/datapools/${datapoolId}/apis/get`);
		return result.data;
	};

	getApiSecret = async (userId, datapoolId, apiId) => {
		const result = await httpUnintercepted.get(`user/${userId}/datapools/${datapoolId}/apis/${apiId}/get`);
		return result.data;
	};
}

export default new ApiService();
