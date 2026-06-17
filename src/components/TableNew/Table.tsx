import "./table.css";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import EmptyState from "./components/EmptyState";

import { formatCellToString } from "./helpers/format.helper";

import { useTableController } from "./hooks/use-table-controller.hook";

import { SortDirectionEnum, type TableTypes } from "./types/table.types";

export interface TableProps<T extends object> {
	config?: TableTypes.Column<T>[];
	data: T[];
	onRowClick?: (_data: T, _rowIndex: number) => void; // onClick in row - if you need apply only in one row use rowIndex.
	rowIsDisabled?: (_data: T, _rowIndex: number) => boolean; // disable row - if you need apply only in one row use rowIndex.
	rowStyle?: (
		_data: T,
		_rowIndex: number,
	) => React.HTMLAttributes<HTMLTableRowElement>; // apply style in row - if you need apply only in one row use rowIndex.
	//TODO: add selectable option
}

const Table = <T extends Record<string, any>>({
	config,
	data,
	onRowClick,
	rowIsDisabled,
	rowStyle,
}: TableProps<T>): React.JSX.Element => {
	const { dataTable, parseColumns, sortState } = useTableController<T>(
		data,
		config,
	);

	const headerColumns = useMemo(() => {
		return parseColumns.map((column: TableTypes.Column<T>) => {
			return React.createElement(
				"th",
				{
					key: `table-head-cell-${String(column.accessorKey)}`,
					scope: "col",
					colSpan: column.colSpan || undefined,
					id: crypto.randomUUID(),
					className: column.divideY ? "th-divisable" : "",
				},
				column.isSortable
					? React.createElement(
							"div",
							{
								display: "flex",
								alignItems: "center",
								gap: 2,
							},
							column.header,
							sortState.direction === SortDirectionEnum.Desc ? (
								<ArrowUpAZ
									className="th-sortable"
									data-testid="arrow-up"
									onClick={() => {
										sortState.action(
											SortDirectionEnum.Asc,
											column.accessorKey,
											dataTable,
										);
									}}
								/>
							) : (
								<ArrowDownAZ
									className="th-sortable"
									data-testid="arrow-down"
									onClick={() => {
										sortState.action(
											SortDirectionEnum.Desc,
											column.accessorKey,
											dataTable,
										);
									}}
								/>
							),
						)
					: column.header,
			);
		});
	}, [parseColumns, sortState, dataTable]);

	const mapperColumn = useCallback(
		(rowIndex: number) => {
			const rowData = dataTable[rowIndex];
			const rowRecord = rowData as Record<string, unknown> | undefined;
			return parseColumns.map(
				(column: TableTypes.Column<T>, colIndex: number) =>
					React.createElement(
						"td",
						{
							key: `table-body-cell-${String(column.accessorKey)} `,
							colSpan: column.colSpan || undefined,
							...(column.minWidth || column.maxWidth || column.align
								? {
										style: {
											...(column.minWidth ? { minWidth: column.minWidth } : {}),
											...(column.maxWidth ? { maxWidth: column.maxWidth } : {}),
											...(column.align ? { alignItems: column.align } : {}),
										},
									}
								: {}),
						},
						(() => {
							const cellValue = rowRecord?.[String(column.accessorKey)];
							return column.cell
								? column.cell(cellValue as T[keyof T], colIndex, rowData)
								: formatCellToString(cellValue);
						})(),
					),
			);
		},
		[parseColumns, dataTable],
	);

	// Create body rows with memoized callback
	const bodyRows = useMemo(() => {
		return dataTable.map((rowData: T, rowIndex: number) => {
			const isDisabled = rowIsDisabled
				? rowIsDisabled(rowData, rowIndex)
				: false;
			const haveOnclick = Boolean(onRowClick) && !isDisabled;

			return React.createElement(
				"tr",
				{
					key: `table-body-row-${rowIndex}`,
					onClick: () => {
						if (haveOnclick && onRowClick && !isDisabled) {
							onRowClick(rowData, rowIndex);
						}
					},
					className: isDisabled
						? "tr-disabled"
						: haveOnclick
							? "tr-clickeable"
							: "",
					...(rowStyle ? rowStyle(rowData, rowIndex) : {}),
				},
				mapperColumn(rowIndex),
			);
		});
	}, [dataTable, rowIsDisabled, onRowClick, mapperColumn, rowStyle]);

	return (
		<div style={{ overflowX: "auto" }} className="container">
			<table id="table" data-testid="table">
				{dataTable.length === 0 ? (
					<EmptyState colSpan={parseColumns.length} />
				) : (
					<React.Fragment>
						<thead>
							<tr>{headerColumns}</tr>
						</thead>

						<tbody>{bodyRows}</tbody>
					</React.Fragment>
				)}
			</table>
		</div>
	);
};

export default Table;
Table.displayName = "Table";
