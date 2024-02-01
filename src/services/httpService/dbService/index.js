/* eslint-disable class-methods-use-this */
import { http } from '../index';

class DbService {
	addUser = async (user) => {
		const data = {
			name: user['https://dev.datapool.scio.services/user_metadata.name'],
			surname: user['https://dev.datapool.scio.services/user_metadata.surname'],
			email: user.name,
		};
		return http.post(`/user/${user.sub}/add`, data);
	};
}

export default new DbService();
