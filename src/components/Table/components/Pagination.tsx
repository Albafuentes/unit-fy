import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { DEFAULT_PAGE_SIZE_OPTIONS, DEFAULT_PAGE_SLICE_SIZE } from "../config";
import type { PaginationState } from "../hooks/use-table-controller.hook";

export type PublicPaginationProps = Omit<
	PaginationState,
	"action" | "pageSizeAction"
>;

export type PrivatePaginationProps = Pick<
	PaginationState,
	"currentPage" | "action" | "pageSizeAction"
>;

const Pagination: React.FC<
	PublicPaginationProps & Partial<PrivatePaginationProps>
> = ({ currentPage, totalPages, pageSize, action, pageSizeAction }) => {
	const [start, setStart] = useState(0);

	const pages = useMemo(
		() => Array.from({ length: totalPages }, (_, index) => index + 1),
		[totalPages],
	);

	const end = Math.min(start + DEFAULT_PAGE_SLICE_SIZE, totalPages);

	const visiblePages = pages.slice(start, end);

	const canGoBack = start > 0;
	const canGoForward = end < totalPages;

	return (
		<div id="pagination">
			<p>
				Página {currentPage} de {totalPages}
			</p>

			<label htmlFor="page-size">
				Filas por página
				<select
					id="page-size"
					name="page-size"
					value={pageSize}
					onChange={(e) => pageSizeAction?.(Number(e.target.value))}
				>
					{DEFAULT_PAGE_SIZE_OPTIONS.map((size) => (
						<option key={size} value={size}>
							{size}
						</option>
					))}
				</select>
			</label>

			<div>
				<button
					key={start - 1}
					type="button"
					className={currentPage === start - 1 ? "active" : ""}
					onClick={() =>
						action?.(Math.max(1, (currentPage ?? 1) - 1), pageSize)
					}
					disabled={(currentPage ?? 1) <= 1}
					aria-label="Página anterior"
				>
					<IconChevronLeft stroke={2} />
				</button>
				{canGoBack && (
					<button
						type="button"
						onClick={() =>
							setStart((prev) => Math.max(0, prev - DEFAULT_PAGE_SLICE_SIZE))
						}
					>
						...
					</button>
				)}

				{visiblePages.map((pageNumber) => (
					<button
						key={pageNumber}
						type="button"
						className={currentPage === pageNumber ? "active" : ""}
						onClick={() => action?.(pageNumber, pageSize)}
					>
						{pageNumber}
					</button>
				))}

				{canGoForward && (
					<button
						type="button"
						onClick={() =>
							setStart((prev) =>
								Math.min(
									prev + DEFAULT_PAGE_SLICE_SIZE,
									Math.max(
										0,
										totalPages - (pageSize ?? DEFAULT_PAGE_SLICE_SIZE),
									),
								),
							)
						}
					>
						...
					</button>
				)}
				<button
					key={end + 1}
					type="button"
					className={currentPage === end + 1 ? "active" : ""}
					onClick={() =>
						action?.(Math.min(totalPages, (currentPage ?? 1) + 1), pageSize)
					}
					disabled={(currentPage ?? 1) >= totalPages}
					aria-label="Página siguiente"
				>
					<IconChevronRight stroke={2} />
				</button>
			</div>
		</div>
	);
};

export default Pagination;
Pagination.displayName = "Pagination";
