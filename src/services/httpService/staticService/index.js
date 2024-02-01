/* eslint-disable class-methods-use-this */
import { http } from '../index';

class StaticService {
	getTest = async () => {
		const result = await http.get(`/publicDatapools`);
		return result.data;
	};
}

export default new StaticService();
