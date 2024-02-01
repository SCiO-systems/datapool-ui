/* eslint-disable class-methods-use-this */
import { http } from '../index';

class DatapoolService {
	getPublicDatapools = async () => {
		const result = await http.get(`/datapools/public/all/get`);
		return result.data;
	};

	getUserDatapools = async (userId) => {
		const result = await http.get(`user/${userId}/datapools/all/get`);
		return result.data;
	};

	getUserPrivateDatapools = async (userId) => {
		const result = await http.get(`user/${userId}/datapools/private/get`);
		return result.data;
	};

	getDatapoolUsers = async (userId, datapoolId) => {
		const result = await http.get(`user/${userId}/datapools/${datapoolId}/users/all/get`);
		return result.data;
	};

	getDatapoolInverseUsers = async (userId, datapoolId) => {
		const result = await http.get(`user/${userId}/datapools/${datapoolId}/users/all/get-inverse`);
		return result.data;
	};

	addUsersToDatapool = async (userId, datapoolId, users) => {
		const result = await http.post(`user/${userId}/datapools/${datapoolId}/users/add`, { users });
		return result.data;
	};

	removeUserFromDatapool = async (userId, datapoolId, datapoolUserId) => {
		const result = await http.delete(`user/${userId}/datapools/${datapoolId}/users/${datapoolUserId}/delete`);
		return result.data;
	};

	updateUserRole = async (userId, datapoolId, datapoolUserId, roleId) => {
		const result = await http.post(`user/${userId}/datapools/${datapoolId}/users/${datapoolUserId}/role/${roleId}/update`);
		return result.data;
	};

	getDatapoolSearchResults = async (id, query) => {
		const result = await http.post(`/getDatapoolSearchResults/${id}`, { ...query });
		return result.data;
	};

	createDatapool = async (userId, metadata) => {
		const result = await http.post(`user/${userId}/datapools/create`, metadata);
		return result.data;
	};

	deleteDatapool = async (userId, datapoolId) => {
		const result = await http.delete(`user/${userId}/datapools/${datapoolId}/delete`);
		return result.data;
	};

	publishDatapool = async (userId, datapoolId) => {
		const result = await http.patch(`user/${userId}/datapools/${datapoolId}/publish`);
		return result.data;
	};

	lockDatapool = async (userId, datapoolId) => {
		const result = await http.patch(`user/${userId}/datapools/${datapoolId}/lock`);
		return result.data;
	};

	renameDatapool = async (userId, datapoolId, name) => {
		const result = await http.patch(`user/${userId}/datapools/${datapoolId}/rename`, { name });
		return result.data;
	};

	pinDatapool = async (userId, datapoolId) => {
		const result = await http.post(`user/${userId}/datapools/${datapoolId}/pin`);
		return result.data;
	};

	unpinDatapool = async (userId, datapoolId) => {
		const result = await http.post(`user/${userId}/datapools/${datapoolId}/unpin`);
		return result.data;
	};

	getUserPinnedDatapools = async (userId) => {
		const result = await http.get(`user/${userId}/datapools/pinned/get`);
		return result.data;
	};

	addDatapoolMetadataAndPublish = async (userId, datapoolId, description, citation, license) => {
		const result = await http.post(`user/${userId}/datapools/${datapoolId}/publish`, {
			description,
			citation,
			license,
		});
		return result.data;
	};

	editDatapoolMetadata = async (userId, datapoolId, description, citation, license) => {
		const result = await http.post(`user/${userId}/datapools/${datapoolId}/edit/metadata`, {
			description,
			citation,
			license,
		});
		return result.data;
	};

	getCurrentCodebookPresigned = async (userId, datapoolId) => {
		const result = await http.get(`user/${userId}/datapools/${datapoolId}/codebook/download`);
		return result.data;
	};
}

export default new DatapoolService();
