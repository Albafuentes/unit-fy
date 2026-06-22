export const filteredData = (data: any[], keyAccessor: string, value: string) => {
	return data.filter((row) => {
		const cellValue = row[keyAccessor];
		if (cellValue === null || cellValue === undefined) {
			return false;
		}
		return String(cellValue).toLowerCase().includes(value.toLowerCase());
	});
};
