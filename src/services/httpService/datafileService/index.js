/* eslint-disable class-methods-use-this */
import { http } from '../index';

class DatafileService {
	getUserDatafiles = async (userId) => {
		const result = await http.get(`user/${userId}/datafiles/all/get`);
		return result.data;
	};

	// addDatafilesToDatapool = async (userId, datapoolId, datafiles) => {
	// 	const result = await http.post(`user/${userId}/datapools/${datapoolId}/datafiles/add`, { datafiles });
	// 	return result.data;
	// };

	getDatapoolDatafiles = async (userId, datapoolId) => {
		const result = await http.get(`user/${userId}/datapools/${datapoolId}/datafiles/all/get`);
		return result.data;
	};

	getDatapoolDatafilesInverse = async (userId, datapoolId) => {
		const result = await http.get(`user/${userId}/datapools/${datapoolId}/datafiles/all/get-inverse`);
		return result.data;
	};

	confirmUpload = async (userId, fileKey) => {
		const result = await http.post(`user/${userId}/datafiles/confirmUpload`, { fileKey });
		return result.data;
	};

	generateCodebook = async (userId, datapoolId, datafileKey, version, s3Location) => {
		const data = {
			datapoolId,
			dataFile: datafileKey,
			version,
			destinationKey: s3Location,
		};

		const result = await http.post(`user/${userId}/datapools/${datapoolId}/versions/codebook/template/get`, data);
		return result.data;
	};

	validateCodebook = async (userId, datapoolId, codebookKey) => {
		const data = {
			codebook: codebookKey,
		};
		const result = await http.post(`user/${userId}/datapools/${datapoolId}/versions/codebook/validate`, data);
		return result.data;
	};

	generateVersion = async (userId, datapoolId, version, datapool, selectedFile, codebook, codebookTemplate) => {
		const data = {
			version: version || 1,
			codebook,
			codebookTemplate,
			dataFileKey: selectedFile.key,
			dataFileId: selectedFile.datafile_id,
			alias: datapool.alias,
		};
		const result = await http.post(`user/${userId}/datapools/${datapoolId}/versions/generate`, data);
		return result.data;
	};

	getRelatedDatapools = async (userId, datafileId) => {
		const result = await http.get(`user/${userId}/datafiles/${datafileId}/datapools/get`);
		return result.data;
	};

	getPresignedUrl = async (userId, dfId) => {
		const result = await http.get(`user/${userId}/datafiles/${dfId}/presigned/get`);
		return result.data;
	};

	deleteDatafile = async (userId, dfId) => {
		const result = await http.delete(`user/${userId}/datafiles/${dfId}/delete`);
		return result.data;
	};
}

export default new DatafileService();
