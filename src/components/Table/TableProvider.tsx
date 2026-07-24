import "./table.css";
import React, { isValidElement, type JSX } from "react";
import { Filter, Pagination, TableContent } from "./components";
import type { FilterProps } from "./components/Filter";
import type {
	PrivatePaginationProps,
	PublicPaginationProps,
} from "./components/Pagination";
import type { TableContentProps } from "./components/TableContent";
import {
	type Filters,
	type PaginationState,
	useTableController,
} from "./hooks";
import type { TableTypes } from "./types/table.types";

export interface TableProviderProps<T extends object> {
	config?: TableTypes.Column<T>[];
	data: T[];
	onRowClick?: (_data: T, _rowIndex: number) => void;
	rowIsDisabled?: (_data: T, _rowIndex: number) => boolean;
	rowStyle?: (
		_data: T,
		_rowIndex: number,
	) => React.HTMLAttributes<HTMLTableRowElement>;
	children: JSX.Element | JSX.Element[];
}

const TableProvider = <T extends Record<string, unknown>>({
	config,
	data,
	onRowClick,
	rowIsDisabled,
	rowStyle,
	children,
}: TableProviderProps<T>): React.JSX.Element => {
	// Extraer los sub-componentes de los children con tipado correcto
	const childrenArray = React.Children.toArray(children);

	const FilterComponent = childrenArray.find(
		(child) => isValidElement(child) && child.type === Filter,
	) as React.ReactElement<FilterProps<T>> | undefined;

	const TableComponent = childrenArray.find(
		(child) => isValidElement(child) && child.type === TableContent,
	) as React.ReactElement<TableContentProps<T>> | undefined;

	const PaginationComponent = childrenArray.find(
		(child) => isValidElement(child) && child.type === Pagination,
	) as
		| React.ReactElement<
				PublicPaginationProps & Partial<PrivatePaginationProps>
		  >
		| undefined;

	const {
		dataTable,
		parseColumns,
		sortState,
		paginationState,
		actionFilter,
		resetFilters,
	} = useTableController<T>(
		data,
		config,
		!!PaginationComponent,
		PaginationComponent
			? (PaginationComponent.props as Omit<PaginationState, "action">)
			: undefined,
		FilterComponent?.props.filters,
	);

	return (
		<div style={{ overflowX: "auto" }} id="table-container">
			{FilterComponent &&
				React.cloneElement<FilterProps<T>>(FilterComponent, {
					...FilterComponent.props,
					action: actionFilter,
					reset: resetFilters,
				})}

			{TableComponent &&
				React.cloneElement<TableContentProps<T>>(TableComponent, {
					...TableComponent.props,
					dataTable,
					parseColumns,
					sortState,
					onRowClick,
					rowIsDisabled,
					rowStyle,
				})}

			{PaginationComponent &&
				React.cloneElement<
					PublicPaginationProps & Partial<PrivatePaginationProps>
				>(PaginationComponent, {
					...PaginationComponent.props,
					currentPage: paginationState.currentPage,
					totalPages: paginationState.totalPages,
					pageSize: paginationState.pageSize,
					action: paginationState.action,
					pageSizeAction: paginationState.pageSizeAction,
				})}
		</div>
	);
};

export default TableProvider;
TableProvider.displayName = "Table.Provider";
