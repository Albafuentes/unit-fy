import "./table.css";
import type React from "react";
import { isValidElement } from "react";
import { Filter, Pagination, Table } from "./components";
import {
	type FilterState,
	type PaginationState,
	useTableController,
} from "./hooks";
import type { TableTypes } from "./types/table.types";

export interface TableProviderProps<T extends object> {
	config?: TableTypes.Column<T>[];
	data: T[];
	onRowClick?: (_data: T, _rowIndex: number) => void; // onClick in row - if you need apply only in one row use rowIndex.
	rowIsDisabled?: (_data: T, _rowIndex: number) => boolean; // disable row - if you need apply only in one row use rowIndex.
	rowStyle?: (
		_data: T,
		_rowIndex: number,
	) => React.HTMLAttributes<HTMLTableRowElement>; // apply style in row - if you need apply only in one row use rowIndex.
	//TODO: add selectable option
	children?: React.ReactNode[]; // add filter and pagination
}

const TableProvider = <T extends Record<string, unknown>>({
	config,
	data,
	onRowClick,
	rowIsDisabled,
	rowStyle,
	children,
}: TableProviderProps<T>): React.JSX.Element => {
	const PaginationComponent = children?.find(
		(child) =>
			isValidElement(child) &&
			(child as React.ReactElement).type === Pagination,
	) as React.ReactElement<PaginationState> | undefined;

	const FilterComponent = children?.find(
		(child) =>
			isValidElement(child) && (child as React.ReactElement).type === Filter,
	) as React.ReactElement<FilterState<T>> | undefined;

	const { dataTable, parseColumns, sortState } = useTableController<T>(
		data,
		config,
		!!PaginationComponent,
		PaginationComponent ? PaginationComponent.props : undefined,
		!!FilterComponent,
	);

	return (
		<div style={{ overflowX: "auto" }} className="container">
			{FilterComponent}
			<Table<T>
				dataTable={dataTable}
				parseColumns={parseColumns}
				sortState={sortState}
				onRowClick={onRowClick}
				rowIsDisabled={rowIsDisabled}
				rowStyle={rowStyle}
			/>
			{PaginationComponent}
		</div>
	);
};

export default TableProvider;
TableProvider.displayName = "TableProvider";
