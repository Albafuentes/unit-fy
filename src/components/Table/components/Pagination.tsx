import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE_OPTIONS, DEFAULT_PAGE_SLICE_SIZE } from "../config";
import type { PaginationState } from "../hooks/use-table-controller.hook";

type PublicPaginationProps = Omit<
	PaginationState,
	"action" | "pageSizeAction"
>;

type PrivatePaginationProps = Pick<
	PaginationState,
	"currentPage" | "action" | "pageSizeAction"
>;

export type PaginationProps = PublicPaginationProps & Partial<PrivatePaginationProps>;

const Pagination = ({
	currentPage,
	totalPages,
	pageSize,
	action,
	pageSizeAction,
}: PaginationProps): React.JSX.Element => {
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
		<div className="table-pagination">
			<p>
				Page {currentPage} of {totalPages}
			</p>

			<label htmlFor="page-size">
				Rows per page
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
					aria-label="previous page"
				>
					<IconChevronLeft stroke={2} />
				</button>
				{canGoBack && (
					<button
						type="button"
						onClick={() =>
							setStart((prev) => Math.max(0, prev - DEFAULT_PAGE_SLICE_SIZE))
						}
						aria-label="previous page slice"
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
									prev + DEFAULT_PAGE_SIZE,
									Math.max(
										0,
										totalPages - (pageSize ?? DEFAULT_PAGE_SIZE),
									),
								),
							)
						}
						aria-label="next page slice"
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
					aria-label="next page"
				>
					<IconChevronRight stroke={2} />
				</button>
			</div>
		</div>
	);
};

export default Pagination;
Pagination.displayName = "Table.Pagination";
