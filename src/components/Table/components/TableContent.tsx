import {
	IconArrowDown,
	IconArrowUp,
	IconColumnInsertRight,
	IconDotsVertical,
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
	onRowClick?: (_data: T, _rowIndex: number) => void;
	rowIsDisabled?: (_data: T, _rowIndex: number) => boolean;
	rowStyle?: (
		_data: T,
		_rowIndex: number,
	) => React.HTMLAttributes<HTMLTableRowElement>;
}

const columnAction = <T extends object>(
	hideColumnState: HideColumnState<T>,
	isHeadTable: boolean = false,
) => {
	return isHeadTable
		? React.createElement(
				"th",
				{
					key: "table-head-action-cell",
					scope: "col",
					id: uuidv4(),
				},
				<Menu.Provider>
					<Menu.Trigger variant="link" className="th-sortable_trigger">
						<IconDotsVertical stroke={2} size={18} />
					</Menu.Trigger>
					<Menu.Content size="sm">
						<Menu.Item
							as={Button}
							variant="link"
							action={hideColumnState.reset}
						>
							<IconColumnInsertRight stroke={2} size={18} />
							Show All Columns
						</Menu.Item>
					</Menu.Content>
				</Menu.Provider>,
			)
		: React.createElement(
				"td",
				{
					key: "table-body-action-cell ",
				},
				null,
			);
};

const TableContent = <T extends Record<string, any>>({
	dataTable,
	parseColumns,
	config,
	sortState,
	hideColumnState,
	onRowClick,
	rowIsDisabled,
	rowStyle,
}: TableContentProps<T>): React.JSX.Element => {
	const hasActionColumn = useMemo(() => {
		return config?.some((column) => column.isSortable) ?? false;
	}, [config]);

	const headerColumns = useMemo(() => {
		return parseColumns.map((column: TableTypes.Column<T>) => {
			return React.createElement(
				"th",
				{
					key: `table-head-cell-${String(column.accessorKey)}`,
					scope: "col",
					colSpan: column.colSpan || undefined,
					id: uuidv4(),
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
								action={() => hideColumnState.action([column.accessorKey])}
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
	}, [parseColumns, sortState, hideColumnState]);

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
				<>
					{hasActionColumn && columnAction<T>(hideColumnState, false)}
					{mapperColumn(rowIndex)}
				</>,
			);
		});
	}, [
		dataTable,
		rowIsDisabled,
		onRowClick,
		mapperColumn,
		rowStyle,
		hasActionColumn,
		hideColumnState,
	]);

	return (
		<table className="table" data-testid="table">
			<thead>
				<tr>
					{hasActionColumn && columnAction<T>(hideColumnState, true)}
					{headerColumns}
				</tr>
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
