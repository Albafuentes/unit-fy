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
import { formatCellToString } from "../helpers";
import type {
	HideColumnState,
	SelectColumnState,
	SortState,
} from "../hooks/use-table-controller.hook";
import { SortDirectionEnum, type TableTypes } from "../types/table.types";
import EmptyState from "./EmptyState";

export interface TableContentProps<T extends object> {
	parseColumns: TableTypes.Column<T>[];
	sortState: SortState<T>;
	config?: TableTypes.Column<T>[] | undefined;
	dataTable: T[];
	hideColumnState: HideColumnState<T>;
	selectColumnState: SelectColumnState<T>;
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
	config,
	sortState,
	hideColumnState,
	selectColumnState,
	onRowClick,
	rowIsDisabled,
	rowStyle,
}: TableContentProps<T>): React.JSX.Element => {
	const hasActionColumn = useMemo(() => {
		return config?.some((column) => column.isSortable) ?? false;
	}, [config]);

	const allRowIds = dataTable?.map((row) => row.id);
	const allRowIdsAreChecked = allRowIds.every((id) =>
		selectColumnState.selectedRows.includes(id),
	);

	const id = uuidv4();

	const headerColumns = useMemo(() => {
		return parseColumns.map((column: TableTypes.Column<T>) => {
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
				column.isSortable ? (
					<Menu.Provider>
						<Menu.Trigger variant="link" className="th-sortable_trigger">
							{column.header}
							<IconSelector stroke={2} size={18} />
						</Menu.Trigger>
						<Menu.Content size="sm">
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
							<Menu.Item
								as={Button}
								variant="link"
								withSeparator
								action={() =>
									hideColumnState.action([column.accessorKey], false)
								}
							>
								<IconEyeOff stroke={2} size={18} />
								Hide Column
							</Menu.Item>
						</Menu.Content>
					</Menu.Provider>
				) : (
					column.header
				),
			);
		});
	}, [parseColumns, sortState, hideColumnState, id]);

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
							onClick={() =>
								allRowIdsAreChecked
									? selectColumnState.reset()
									: selectColumnState.action(allRowIds)
							}
							onChange={() => {}}
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
			const rowData = dataTable[rowIndex];
			const rowRecord = rowData as Record<string, unknown> | undefined;

			return parseColumns.map(
				(column: TableTypes.Column<T>, colIndex: number) =>
					React.createElement(
						"td",
						{
							key: `table-body-cell-${rowData.internalId}-${String(column.accessorKey)}`,
							id: `table-body-cell-${rowData.internalId}-${String(column.accessorKey)}`,
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
								onClick={() => selectColumnState.action([rowData.internalId])}
								onChange={() => {}}
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
				<EmptyState colSpan={parseColumns.length} />
			) : (
				<tbody>{bodyRows}</tbody>
			)}
		</table>
	);
};

export default TableContent;
TableContent.displayName = "Table.Content";
