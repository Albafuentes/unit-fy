import { type JSX, useMemo, useState } from "react";
import type { FilterProps } from "../components/Filter";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "../config";
import {
	buildColumns,
	filteredData,
	paginatedData,
	sortedData,
} from "../helpers";
import type { TableTypes } from "../types/table.types";

export type SortState<T> = {
	keyAccessor: keyof T | null;
	direction: TableTypes.SortDirection;
	action: (
		direction: TableTypes.SortDirection,
		keyAccessor: keyof T,
		data: T[],
	) => void;
};

export type Filters<T> = {
	keyAccessor: keyof T | null;
	value: unknown;
	render: (
		action: () => void,
		reset: () => void
	) => JSX.Element;
};

export type PaginationState = {
	currentPage: number;
	totalPages: number;
	pageSize: number;
	action: (page: number, pageSize?: number) => void;
	pageSizeAction: (pageSize: number) => void;
};

export const useTableController = <T extends object>(
	data: T[],
	config: TableTypes.Column<T>[] | undefined,
	hasPagination: boolean = false,
	paginationProps?: Omit<PaginationState, "action">,
	filters?: Filters<T>[],
) => {
	const [dataTable, setDataTable] = useState<T[]>(() => {
		if (!hasPagination) {
			return data;
		}

		return paginatedData(
			data,
			paginationProps?.currentPage ?? DEFAULT_PAGE_NUMBER,
			paginationProps?.pageSize ?? DEFAULT_PAGE_SIZE,
		);
	});
	const [parseColumns, setParseColumns] = useState(
		buildColumns<T>(data, config),
	);

	//--- Filter Functionality

	const actionFilter = (value: unknown) => {
		if (!value || !filters) return;

		const newFilters: Filters<T>[] = filters
			.filter((filter) => filter.value !== null && filter.value !== undefined)
			.map((filter) => ({
				keyAccessor: filter.keyAccessor,
				value: filter.value,
				render: filter.render,
			}));

		const filteredResult = newFilters.reduce((acc, filter) => {
			if (filter.keyAccessor && filter.value) {
				return filteredData(acc, filter.keyAccessor, String(filter.value));
			}
			return acc;
		}, data);

		setDataTable(filteredResult);
		setParseColumns(buildColumns<T>(filteredResult, config));
	};

	const resetFilters = () => {
		setDataTable(data);
		setParseColumns(buildColumns<T>(data, config));
	};

	//--- Pagination Functionality

	const [paginationState, setPaginationState] = useState<PaginationState>({
		currentPage: paginationProps?.currentPage ?? DEFAULT_PAGE_NUMBER,
		totalPages: Math.ceil(
			data.length / (paginationProps?.pageSize ?? DEFAULT_PAGE_SIZE),
		),
		pageSize: paginationProps?.pageSize ?? DEFAULT_PAGE_SIZE,
		action: (page: number, pageSize?: number) =>
			hasPagination && actionPagination(page, pageSize),
		pageSizeAction: (pageSize: number) =>
			hasPagination && pageSizeAction(pageSize),
	});

	const pageSizeAction = (newPageSize: number) => {
		actionPagination(paginationState.currentPage, newPageSize);
	};

	const actionPagination = useMemo(
		() => (page: number, pageSize?: number) => {
			if (!hasPagination) {
				return;
			}
			const effectivePageSize = pageSize ?? paginationState.pageSize;
			const newData = paginatedData(data, page, effectivePageSize);
			setDataTable(newData);

			setParseColumns(buildColumns<T>(newData, config));

			setPaginationState((prevState) => ({
				...prevState,
				currentPage: page,
				pageSize: effectivePageSize,
				totalPages: Math.ceil(data.length / effectivePageSize),
			}));
		},
		[data, hasPagination, config, paginationState.pageSize],
	);

	//--- Sort Functionality

	const actionSort = (
		direction: TableTypes.SortDirection,
		keyAccessor: keyof T,
	) => {
		if (!direction) {
			return;
		}
		const newData = sortedData(direction, keyAccessor, dataTable);
		setDataTable(newData);

		const buildedColumns = buildColumns<T>(newData, config);
		setParseColumns(buildedColumns);

		setSortState((prevState) => ({
			...prevState,
			keyAccessor,
			direction,
		}));
	};

	const [sortState, setSortState] = useState<SortState<T>>({
		keyAccessor: null,
		direction: null,
		action: (direction: TableTypes.SortDirection, keyAccessor: keyof T) =>
			actionSort(direction, keyAccessor),
	});

	return {
		dataTable,
		parseColumns,
		sortState,
		actionFilter,
		resetFilters,
		paginationState,
	};
};
