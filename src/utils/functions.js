/* eslint-disable import/prefer-default-export */
export const sortArrayOfObjectsByPropertyValue = (array, property) => {
	if (array instanceof Array) {
		if (array.length) {
			let flag = true;
			array.map((item) => {
				if (!item[property]) {
					flag = false;
				}
			});
			if (flag) {
				const compare = (a, b) => {
					if (a[property] < b[property]) {
						return -1;
					}
					if (a[property] > b[property]) {
						return 1;
					}
					return 0;
				};

				return array.sort(compare);
			}
			return array;
		}
		return array;
	}
	return [];
};
