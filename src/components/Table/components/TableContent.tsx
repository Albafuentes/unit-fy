import {
	IconArrowDown,
	IconArrowUp,
	IconEyeOff,
	IconSelector,
} from "@tabler/icons-react";
import React, { useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../../Button/Button";
import Menu from "../..//Menu";
import { formatCellToString, renderCellByType } from "../helpers";
import type {
	HideColumnState,
	SelectColumnState,
	SortState,
} from "../hooks/use-table-controller.hook";
import { SortDirectionEnum, type TableTypes } from "../types/table.types";
import EmptyState from "./EmptyState";

export interface TableContentProps<T extends object> {
	parsedColumns: TableTypes.Column<T>[];
	sortState: SortState<T>;
	dataTable: T[];
	hideColumnState: HideColumnState<T>;
	selectColumnState: SelectColumnState<T>;
	hasActionColumn: boolean;
	onRowClick?: (_data: T, _rowIndex: number) => void;
	rowIsDisabled?: (_data: T, _rowIndex: number) => boolean;
	rowStyle?: (
		_data: T,
		_rowIndex: number,
	) => React.HTMLAttributes<HTMLTableRowElement>;
}

const TableContent = <T extends Record<string, any>>({
	dataTable,
	parsedColumns,
	sortState,
	hideColumnState,
	selectColumnState,
	onRowClick,
	rowIsDisabled,
	rowStyle,
	hasActionColumn,
}: TableContentProps<T>): React.JSX.Element => {
	const allRowIds = dataTable?.map((row) => row.internalId) as string[];
	const allRowIdsAreChecked = allRowIds.every((internalId) =>
		selectColumnState.selectedRows.includes(internalId),
	);

	const id = useMemo(() => uuidv4(), []);

	const headerColumns = useMemo(() => {
		return parsedColumns.map((column: TableTypes.Column<T>) => {
			return React.createElement(
				"th",
				{
					key: `table-head-cell-${id}-${String(column.accessorKey)}`,
					scope: "col",
					colSpan: column.colSpan || undefined,
					id: `table-head-cell-${id}-${String(column.accessorKey)}`,
					className: column.divideY
						? "th-divisable"
						: column.isSortable
							? "th-sortable"
							: "",
				},
				column.isSortable || column.isHidable ? (
					<Menu.Provider>
						<Menu.Trigger variant="link" className="th-sortable_trigger">
							{column.header}
							<IconSelector
								stroke={2}
								size={18}
								aria-label={`Column ${String(column.accessorKey)} actions ${column.isSortable ? "sortable" : ""} ${column.isSortable && column.isHidable ? "and" : ""} ${column.isHidable ? "hidable" : ""}`}
							/>
						</Menu.Trigger>
						<Menu.Content size="sm">
							{column.isSortable === true && (
								<Menu.Item
									as={Button}
									variant="link"
									action={() =>
										sortState.action(SortDirectionEnum.Asc, column.accessorKey)
									}
								>
									<IconArrowUp stroke={2} size={18} />
									Sort Ascending
								</Menu.Item>
							)}
							{column.isSortable === true && (
								<Menu.Item
									as={Button}
									variant="link"
									action={() =>
										sortState.action(SortDirectionEnum.Desc, column.accessorKey)
									}
								>
									<IconArrowDown stroke={2} size={18} />
									Sort Descending
								</Menu.Item>
							)}
							{column.isHidable === true && (
								<Menu.Item
									as={Button}
									variant="link"
									withSeparator
									action={() =>
										hideColumnState.action([column.accessorKey], false)
									}
									style={{ color: "var(--color-red_500)" }}
								>
									<IconEyeOff stroke={2} size={18} />
									Hide Column
								</Menu.Item>
							)}
						</Menu.Content>
					</Menu.Provider>
				) : (
					column.header
				),
			);
		});
	}, [parsedColumns, sortState, hideColumnState, id]);

	const headerRows = useMemo(() => {
		return React.createElement(
			"tr",
			{
				key: `table-head-row-${id}`,
				id: `table-head-row-${id}`,
			},
			hasActionColumn
				? React.createElement(
						"th",
						{
							scope: "col",
							id: `table-head-action-cell-${id}`,
						},
						<input
							type="checkbox"
							checked={allRowIdsAreChecked}
							onChange={() =>
								allRowIdsAreChecked
									? selectColumnState.reset()
									: selectColumnState.action(allRowIds)
							}
							aria-label="Select or unselect all rows"
						/>,
					)
				: null,
			headerColumns,
		);
	}, [
		headerColumns,
		selectColumnState,
		allRowIdsAreChecked,
		allRowIds,
		hasActionColumn,
		id,
	]);

	const bodyColumns = useCallback(
		(rowIndex: number) => {
			const row: T = dataTable[rowIndex];

			return parsedColumns.map(
				(column: TableTypes.Column<T>, colIndex: number) =>
					React.createElement(
						"td",
						{
							key: `table-body-cell-${row.internalId}-${String(column.accessorKey)}`,
							id: `table-body-cell-${row.internalId}-${String(column.accessorKey)}`,
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
							const cellValue: T[keyof T] = row?.[String(column.accessorKey)];
							return column.cell
								? column.cell(cellValue, colIndex, row)
								: column.renderType
									? renderCellByType(
											column.renderType,
											cellValue,
											colIndex,
											row,
										)
									: formatCellToString(cellValue);
						})(),
					),
			);
		},
		[parsedColumns, dataTable],
	);

	// Create body rows with memoized callback
	const bodyRows = useMemo(() => {
		return dataTable.map((rowData: T, rowIndex: number) => {
			const isDisabled = rowIsDisabled
				? rowIsDisabled(rowData, rowIndex)
				: false;
			const haveOnclick = Boolean(onRowClick) && !isDisabled;

			const isSelected = selectColumnState.selectedRows.includes(
				rowData.internalId,
			);

			return React.createElement(
				"tr",
				{
					key: `table-body-row-${rowData.internalId}`,
					id: `table-body-row-${rowData.internalId}`,
					onClick: () => {
						if (haveOnclick && onRowClick && !isDisabled) {
							onRowClick(rowData, rowIndex);
						}
					},
					className: isSelected
						? "tr-selected"
						: isDisabled
							? "tr-disabled"
							: haveOnclick
								? "tr-clickeable"
								: "",
					...(rowStyle ? rowStyle(rowData, rowIndex) : {}),
				},

				hasActionColumn
					? React.createElement(
							"td",
							{ id: `table-body-action-cell-${rowData.internalId}` },
							<input
								type="checkbox"
								checked={isSelected}
								onChange={() => selectColumnState.action([rowData.internalId])}
								aria-label={`Select or unselect row ${rowIndex + 1}`}
							/>,
						)
					: null,

				bodyColumns(rowIndex),
			);
		});
	}, [
		dataTable,
		rowIsDisabled,
		onRowClick,
		bodyColumns,
		rowStyle,
		selectColumnState,
		hasActionColumn,
	]);

	return (
		<table className="table" data-testid="table">
			<thead>{headerRows}</thead>
			{dataTable.length === 0 ? (
				<EmptyState colSpan={parsedColumns.length} />
			) : (
				<tbody>{bodyRows}</tbody>
			)}
		</table>
	);
};

export default TableContent;
TableContent.displayName = "Table.Content";
