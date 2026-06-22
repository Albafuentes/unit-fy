export const paginatedData = (data: any[], page: number, pageSize: number) => {
	return data.slice((page - 1) * pageSize, page * pageSize);
};
