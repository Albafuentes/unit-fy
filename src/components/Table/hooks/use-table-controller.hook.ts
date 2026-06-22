import { useEffect, useMemo, useState } from "react";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "../config";
import { buildColumns } from "../helpers/columns.helper";
import { sortedData } from "../helpers/sort.helper";
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

export type FilterState<T> = {
	filters:{keyAccessor: keyof T | null, value: string | null}[];
	action: (keyAccessor: keyof T, value: string) => void;
};

export type PaginationState = {
	currentPage: number;
	totalPages: number;
	pageSize: number;
	action: (page: number) => void;
};

export const useTableController = <T extends object>(
	data: T[],
	config: TableTypes.Column<T>[] | undefined,
	hasPagination: boolean = false,
	paginationProps?: Omit<PaginationState, "action">,
	hasFilter: boolean = false,
) => {
	const [dataTable, setDataTable] = useState(data);
	const [parseColumns, setParseColumns] = useState(
		buildColumns<T>(data, config),
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

	//--- Filter Functionality
	const actionFilter = (keyAccessor: keyof T, value: string) => {
		if (!keyAccessor || !value) {
			setDataTable(data);
			return;
		}

		const filteredData = data.filter((row) => {
			const cellValue = row[keyAccessor];
			if (cellValue === null || cellValue === undefined) {
				return false;
			}
			return String(cellValue).toLowerCase().includes(value.toLowerCase());
		});

		setDataTable(filteredData);

		const buildedColumns = buildColumns<T>(filteredData, config);

		setParseColumns(buildedColumns);
		setFilteredState((prevState) => ({
			...prevState,
			filters: [...prevState.filters, { keyAccessor, value }],
		}));
	};

	const [filteredState, setFilteredState] = useState<FilterState<T>>({
		filters: [],
		action: (keyAccessor: keyof T, value: string) => {
			hasFilter && actionFilter(keyAccessor, value);
		},
	});

	//--- Pagination Functionality

	const [paginationState, setPaginationState] = useState<PaginationState>({
		currentPage: paginationProps?.currentPage ?? DEFAULT_PAGE_NUMBER,
		totalPages: Math.ceil(
			dataTable.length / (paginationProps?.pageSize ?? DEFAULT_PAGE_SIZE),
		),
		pageSize: paginationProps?.pageSize ?? DEFAULT_PAGE_SIZE,
		action: (page: number) => hasPagination && actionPagination(page),
	});

	const actionPagination = useMemo(
		() => (page: number) => {
			if (!hasPagination) {
				return;
			}
			const paginatedData = dataTable.slice(
				(page - 1) * paginationState.pageSize,
				page * paginationState.pageSize,
			);
			setDataTable(paginatedData);
			setPaginationState((prevState) => ({
				...prevState,
				currentPage: page,
			}));
		},
		[dataTable, hasPagination, paginationState.pageSize],
	);

	useEffect(() => {
		if (hasPagination) {
			actionPagination(paginationState.currentPage);
		}
	}, [actionPagination, paginationState.currentPage, hasPagination]);

	return {
		dataTable,
		parseColumns,
		sortState,
		filteredState,
		paginationState,
	};
};
