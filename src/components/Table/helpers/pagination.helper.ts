export const paginatedData = <T>(data: T[], page: number, pageSize: number) => {
	return data.slice((page - 1) * pageSize, page * pageSize);
};
