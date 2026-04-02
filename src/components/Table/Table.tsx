import React, { useCallback, useMemo } from "react";
import Pagination from "./components/Pagination";
import SortSymbol from "./components/SortSymbol";
import { buildColumns } from "./helpers/columns.helper";
import { formatCellToString } from "./helpers/format.helper";
import { useTablePagination } from "./hooks/use-table-pagination.hook";
import { useTableSort } from "./hooks/use-table-sort.hook";
import type { Table as TableTypes } from "./types/table.types";

export interface TableProps<T extends object> {
	config?: TableTypes.ColumnConfig<T>[];
	data: T[];
	onClick?: (_data: T, _rowIndex: number) => void; // onClick in row - if you need apply only in one row use rowIndex.
	disabled?: (_data: T, _rowIndex: number) => boolean;
	rowStyle?: (
		_data: T,
		_rowIndex: number,
	) => React.HTMLAttributes<HTMLTableRowElement>;
	pagination?: TableTypes.PaginationOptions;
}

const Table = <T extends object = object>({
	config,
	data,
	onClick,
	disabled,
	rowStyle,
	pagination,
}: TableProps<T>): React.JSX.Element => {
	// Initialize sort hook with config
	const { sortedData, sortColumn, sortDirection, handleSort } = useTableSort<T>(
		data,
		{ config },
	);

	// Initialize pagination hook (if pagination options provided) — operates on filtered data
	const paginationConfig = useTablePagination<T>(sortedData, pagination);

	// Determine which data to display: paginated or all filtered data
	const displayData = pagination ? paginationConfig.displayedItems : sortedData;

	// Parse columns from the original data (not displayData) to handle empty pagination pages
	const parseData = data.length > 0 ? displayData : sortedData;
	const parseColumns = buildColumns<T>(parseData, config);

	// Memorize header parseColumns (only recalculates if parseColumns change)
	const headerColumns = useMemo(() => {
		return parseColumns.map((column: TableTypes.Column<T>) => {
			const isSortable =
				column.sortable === true || typeof column.sortable === "function";
			const isSorted = sortColumn === column.key;

			return React.createElement(
				"th",
				{
					textAlign: "left",
					textTransform: "capitalize",
					fontWeight: "semibold",
					key: `table-head-cell-${String(column.key)}`,
					scope: "col",
					colSpan: column.colSpan || undefined,
					style: {
						minWidth: column.minWidth || "fit-content",
						maxWidth: column.maxWidth || "auto",
						borderRight: column.divideY ? "1px solid gray" : "none",
					},
					cursor: isSortable ? "pointer" : "default",
					onClick: isSortable
						? () => handleSort(column.key as keyof T)
						: undefined,
					_hover: isSortable ? { bg: "bg.subtle" } : undefined,
				},
				isSortable
					? React.createElement(
							"div",
							{
								display: "flex",
								alignItems: "center",
								gap: 2,
							},
							column.headerCell,
							<SortSymbol isSorted={isSorted} sortDirection={sortDirection} />,
						)
					: column.headerCell,
			);
		});
	}, [parseColumns, sortColumn, sortDirection, handleSort]);

	// Create body cell parseColumns for a specific row
	const mapperColumn = useCallback(
		(rowIndex: number) => {
			const rowData = displayData[rowIndex];
			const rowRecord = rowData as Record<string, unknown> | undefined;
			return parseColumns.map((column: TableTypes.Column<T>, colIndex: number) =>
				React.createElement(
					"td",
					{
						key: `table-body-cell-${String(column.key)} `,
						colSpan: column.colSpan || undefined,
						textOverflow: "ellipsis",
						width: "auto",
						overflow: "hidden",
						whiteSpace: "break-spaces",
						style: {
							minWidth: column.minWidth || "auto",
							maxWidth: column.maxWidth || "auto",
							borderRight: column.divideY ? "1px solid gray" : "none",
						},
					},
					(() => {
						const cellValue = rowRecord?.[String(column.key)];
						return column.render
							? column.render(cellValue as T[keyof T], colIndex, rowData)
							: formatCellToString(cellValue);
					})(),
				),
			);
		},
		[parseColumns, displayData],
	);

	// Create body rows with memoized callback
	const bodyRows = useMemo(() => {
		return displayData.map((rowData: T, rowIndex: number) => {
			const isDisabled = disabled ? disabled(rowData, rowIndex) : false;
			const haveOnclick = Boolean(onClick) && !isDisabled;

			return React.createElement(
				"tr",
				{
					cursor: haveOnclick ? "pointer" : "default",
					_hover: {
						bg: haveOnclick ? "bg.subtle" : "",
					},
					key: `table-body-row-${rowIndex}`,
					onClick: () => {
						if (haveOnclick && onClick && !isDisabled) {
							onClick(rowData, rowIndex);
						}
					},
					bg: isDisabled ? "gray" : "inherit",
					opacity: isDisabled ? 0.5 : 1,
					...(rowStyle ? rowStyle(rowData, rowIndex) : {}),
				},
				mapperColumn(rowIndex),
			);
		});
	}, [displayData, disabled, onClick, mapperColumn, rowStyle]);

	return (
		<div
			style={{
				overflowX: "auto",
				overflowY: "auto",
				width: "100%",
				maxWidth: "100%",
			}}
		>
			<div
				style={{
					borderRadius: "lg",
					overflow: "scroll",
					width: "100%",
					backgroundColor: "bg.panel",
				}}
			>
				<table data-testid="table">
					<thead>
						<tr>{headerColumns}</tr>
					</thead>
					<tbody>
						{displayData.length > 0 ? (
							bodyRows
						) : (
							<tr>
								<td
									colSpan={parseColumns.length}
									style={{ borderColor: "transparent" }}
								>
									<p style={{ color: "gray", fontSize: "sm" }}>
										No hay datos disponibles en este momento.
									</p>
								</td>
							</tr>
						)}
					</tbody>
				</table>
				{pagination && <Pagination pagination={paginationConfig} />}
			</div>
		</div>
	);
};

export default Table;
Table.displayName = "Table";
