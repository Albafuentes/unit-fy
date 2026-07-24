export const filteredData = <T extends object>(
	data: T[],
	keyAccessor: keyof T,
	value: unknown,
) => {
	return data.filter((item) => {
		const itemValue = item[keyAccessor];
		if (itemValue === undefined || itemValue === null) {
			return false;
		}
		return String(itemValue)
			.toLowerCase()
			.includes(String(value).toLowerCase());
	});
};
