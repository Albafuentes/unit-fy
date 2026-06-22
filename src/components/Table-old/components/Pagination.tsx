import type { UseTablePaginationExports } from "../hooks/use-table-pagination.hook";

type PaginationButtonType = "previous" | "next" | number;
export interface PaginationButtonProps {
	onClick: () => void;
	disabled: boolean;
	ariaLabel: string;
	type: PaginationButtonType;
    isSelected?: boolean;
}

const PaginationButton: React.FC<PaginationButtonProps> = ({
	onClick,
	disabled,
	ariaLabel,
	type,
    isSelected = false,
}) => {
	const value = () => {
		switch (type) {
			case "previous":
				return <span>{"<"}</span>;
			case "next":
				return <span>{">"}</span>;
			default:
				return <span>{type}</span>;
		}
	};
	return (
		<button
			type="button"
			disabled={disabled}
			aria-label={ariaLabel}
			data-testid={`${type}-page-button`}
			style={{
				display: "flex",
				justifyContent: "flex-end",
				alignItems: "center",
				padding: "1rem",
                backgroundColor: isSelected ? "gray" : "transparent",
			}}
			onClick={onClick}
		>
            {value()}
		</button>
	);
};

/**
 * Pagination component is used to display the pagination component at the bottom of the table.
 * It receives the data and the pagination options and returns the pagination component.
 * The component uses the usePagination hook to manage the pagination.
 * Props:
 * PageSize is the number of items per page and initialPage is the initial page.
 * InitialPage is the initial page.
 */

export interface PaginationProps<T = unknown> {
	pagination: UseTablePaginationExports<T>;
}

const Pagination = <T,>({ pagination }: PaginationProps<T>) => {
	if (pagination.totalItems === 0 || pagination.totalPages <= 1) {
		return null;
	}

	const pages = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "flex-end",
				alignItems: "center",
				padding: "1rem",
			}}
		>
			<PaginationButton
				onClick={pagination.previousPage}
				disabled={!pagination.canPreviousPage}
				ariaLabel="Página anterior"
				type="previous"
			/>

			{pages.map((page) => (
				<PaginationButton
					key={page}
					onClick={() => pagination.setPage(page)}
					disabled={false}
					ariaLabel={`Página ${page}`}
					type={page}
                    isSelected={page === pagination.currentPage}
				/>
			))}

			<PaginationButton
				onClick={pagination.nextPage}
				disabled={!pagination.canNextPage}
				ariaLabel="Página siguiente"
				type="next"
			/>
		</div>
	);
};

export default Pagination;
