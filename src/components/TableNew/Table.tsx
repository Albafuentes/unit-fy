import "./table.css";
import React, { type JSX, useCallback, useMemo } from "react";
import EmptyState from "./components/EmptyState";
import { buildColumns } from "./helpers/columns.helper";
import { formatCellToString } from "./helpers/format.helper";

export namespace TableTypes {
	export type CellType =
		| "date"
		| "date-time"
		| "byte"
		| "boolean"
		| "number"
		| "number-percent"
		| "number-currency"
		| "badge";

	export type Column<T = object> = {
		key: keyof T;
		headerCell?: string | JSX.Element;
		colSpan?: number;
		minWidth?: string;
		maxWidth?: string;
		render?: (
			_cellData: T[keyof T],
			_colIndex: number,
			_rowData: T,
		) => React.JSX.Element; // shows custom element if you need, if render is undefined the table shows data.
		divideY?: boolean; // Whether to divide the column by the value of the cell (optional)
		hide?: boolean; // Whether to hide this column (optional, defaults to false)
		renderType?: CellType; // Type of renderer to use automatically (optional)
	};
}

export interface TableProps<T extends object> {
	config?: TableTypes.Column<T>[];
	data: T[];
	onRowClick?: (_data: T, _rowIndex: number) => void; // onClick in row - if you need apply only in one row use rowIndex.
	rowIsDisabled?: (_data: T, _rowIndex: number) => boolean;
	rowStyle?: (
		_data: T,
		_rowIndex: number,
	) => React.HTMLAttributes<HTMLTableRowElement>;
}

const Table = <T extends Record<string, any>>({
	config,
	data,
	onRowClick,
	rowIsDisabled,
	rowStyle,
}: TableProps<T>): React.JSX.Element => {
	const parseColumns = buildColumns<T>(data, config);

	const headerColumns = useMemo(() => {
		return parseColumns.map((column: TableTypes.Column<T>) => {
			return React.createElement(
				"th",
				{
					key: `table-head-cell-${String(column.key)}`,
					scope: "col",
					colSpan: column.colSpan || undefined,
					id: crypto.randomUUID(),
					className: column.divideY ? "th-divisable" : "",
				},
				column.headerCell,
			);
		});
	}, [parseColumns]);

	const mapperColumn = useCallback(
		(rowIndex: number) => {
			const rowData = data[rowIndex];
			const rowRecord = rowData as Record<string, unknown> | undefined;
			return parseColumns.map(
				(column: TableTypes.Column<T>, colIndex: number) =>
					React.createElement(
						"td",
						{
							key: `table-body-cell-${String(column.key)} `,
							colSpan: column.colSpan || undefined,
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
		[parseColumns, data],
	);

	// Create body rows with memoized callback
	const bodyRows = useMemo(() => {
		return data.map((rowData: T, rowIndex: number) => {
			const isDisabled = rowIsDisabled ? rowIsDisabled(rowData, rowIndex) : false;
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
	}, [data, rowIsDisabled, onRowClick, mapperColumn, rowStyle]);

	return (
		<div style={{ overflowX: "auto" }} className="container">
			<table id="table" data-testid="table">
				{data.length === 0 ? (
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
