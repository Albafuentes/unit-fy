import { IconSwitchVertical } from "@tabler/icons-react";
import React, { useCallback, useMemo } from "react";
import { formatCellToString } from "../helpers";
import type { SortState } from "../hooks/use-table-controller.hook";
import { SortDirectionEnum, type TableTypes } from "../types/table.types";
import EmptyState from "./EmptyState";

export interface TableContentProps<T extends object> {
	parseColumns: TableTypes.Column<T>[];
	sortState: SortState<T>;
	dataTable: T[];
	onRowClick?: (_data: T, _rowIndex: number) => void;
	rowIsDisabled?: (_data: T, _rowIndex: number) => boolean;
	rowStyle?: (
		_data: T,
		_rowIndex: number,
	) => React.HTMLAttributes<HTMLTableRowElement>;
}

const TableContent = <T extends Record<string, any>>({
	dataTable,
	parseColumns,
	sortState,
	onRowClick,
	rowIsDisabled,
	rowStyle,
}: TableContentProps<T>): React.JSX.Element => {
	const headerColumns = useMemo(() => {
		return parseColumns.map((column: TableTypes.Column<T>) => {
			return React.createElement(
				"th",
				{
					key: `table-head-cell-${String(column.accessorKey)}`,
					scope: "col",
					colSpan: column.colSpan || undefined,
					id: crypto.randomUUID(),
					className: column.divideY
						? "th-divisable"
						: column.isSortable
							? "th-sortable"
							: "",
				},
				column.header,
				column.isSortable ? (
					<button
						type="button"
						className="th-sortable-button"
						onClick={() => {
							sortState.action(
								sortState.direction === SortDirectionEnum.Desc
									? SortDirectionEnum.Asc
									: SortDirectionEnum.Desc,
								column.accessorKey,
							);
						}}
					>
						<IconSwitchVertical stroke={2} />
					</button>
				) : null,
			);
		});
	}, [parseColumns, sortState]);

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
		<table className="table" data-testid="table">
			<thead>
				<tr>{headerColumns}</tr>
			</thead>
			{dataTable.length === 0 ? (
				<EmptyState colSpan={parseColumns.length} />
			) : (
				<tbody>{bodyRows}</tbody>
			)}
		</table>
	);
};

export default TableContent;
TableContent.displayName = "Table.Content";
