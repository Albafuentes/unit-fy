import type { PaginationState } from "../hooks/use-table-controller.hook";

const Pagination: React.FC<PaginationState> = ({
	currentPage,
	totalPages,
	pageSize,
	action,
}) => {
    console.log(currentPage, totalPages, pageSize, action);
	return <div>Pagination</div>;
};

export default Pagination;
Pagination.displayName = "Pagination";
