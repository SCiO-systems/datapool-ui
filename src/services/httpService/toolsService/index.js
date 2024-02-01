/* eslint-disable class-methods-use-this */
import { http } from '../index';

class ToolsService {
	transformCrop = async (userId, model, s3Key) => {
		const data = { model, s3Key };
		const result = await http.post(`user/${userId}/tools/crop`, data);
		return result.data;
	};
}

export default new ToolsService();
