import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { TableFilters } from "../components/Filter";
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
	action: (direction: TableTypes.SortDirection, keyAccessor: keyof T) => void;
};

export type HideColumnState<T> = {
	action: (keyAccessor: (keyof T)[], isVisible: boolean) => void;
	reset: () => void;
};

export type FiltersState<T> = {
	activeFilters: Partial<Record<keyof T, string>>;
	action: (value: unknown, keyAccessor: keyof T) => void;
	reset: (keyAccessor: keyof T) => void;
};

export type SelectColumnState<T> = {
	selectedRows: string[];
	action: (keyAccessor: (keyof T)[]) => void;
	reset: () => void;
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
	paginationProps?: Omit<PaginationState, "action" | "pageSizeAction">,
	filters?: TableFilters<T>[],
) => {
	const dataWithId = useMemo(
		() =>
			data.map((row) => ({
				...row,
				internalId: "internalId" in row ? row.internalId : uuidv4(),
			})),
		[data],
	);

	// --- Config State
	const [tableConfig, setTableConfig] = useState<
		TableTypes.Column<T>[] | undefined
	>(config);
	//--- Filter Functionality
	const [activeFilters, setActiveFilters] = useState<
		Partial<Record<keyof T, string>>
	>({});

	//--- Sort Functionality
	const [sort, setSort] = useState<{
		keyAccessor: keyof T | null;
		direction: TableTypes.SortDirection;
	}>({ keyAccessor: null, direction: null });

	//--- Pagination Functionality
	const [currentPage, setCurrentPage] = useState(
		paginationProps?.currentPage ?? DEFAULT_PAGE_NUMBER,
	);
	const [pageSize, setPageSize] = useState(
		paginationProps?.pageSize ?? DEFAULT_PAGE_SIZE,
	);

	const [selectedRows, setSelectedRows] = useState<string[]>([]);

	//--- Pipeline derivado: dataWithId -> filtrado -> ordenado -> paginado.
	//--- Cada etapa se recalcula a partir de la anterior, así el filtro y el orden siempre actúan sobre el dataset completo (no sobre una página  ya recortada) y la paginación respeta filtros y orden activos.

	const filteredResult = useMemo(() => {
		const entries = Object.entries(activeFilters) as [keyof T, string][];
		return entries.reduce(
			(acc, [keyAccessor, value]) => filteredData(acc, keyAccessor, value),
			dataWithId,
		);
	}, [dataWithId, activeFilters]);

	const sortedResult = useMemo(() => {
		if (!sort.direction || sort.keyAccessor === null) {
			return filteredResult;
		}
		return sortedData(sort.direction, sort.keyAccessor, filteredResult);
	}, [filteredResult, sort]);

	const totalPages = Math.max(1, Math.ceil(sortedResult.length / pageSize));

	// Si al filtrar/ordenar la página actual queda fuera de rango, se corrige.
	useEffect(() => {
		if (currentPage > totalPages) {
			setCurrentPage(totalPages);
		}
	}, [currentPage, totalPages]);

	const dataTable = useMemo(() => {
		if (!hasPagination) {
			return sortedResult;
		}
		return paginatedData(sortedResult, currentPage, pageSize);
	}, [sortedResult, hasPagination, currentPage, pageSize]);

	const parseColumns = useMemo(
		() => buildColumns<T>(dataTable, tableConfig),
		[dataTable, tableConfig],
	);

	//--- Actions

	const actionFilter = (value: unknown, keyAccessor: keyof T) => {
		if (!filters || keyAccessor === undefined || keyAccessor === null) {
			return;
		}

		setActiveFilters((prevFilters) => {
			const nextFilters = { ...prevFilters };
			if (value === undefined || value === null || value === "") {
				delete nextFilters[keyAccessor];
			} else {
				nextFilters[keyAccessor] = String(value);
			}
			return nextFilters;
		});
		setCurrentPage(DEFAULT_PAGE_NUMBER);
	};

	const resetFilters = (keyAccessor: keyof T) => {
		setActiveFilters((prevFilters) => {
			const nextFilters = { ...prevFilters };
			delete nextFilters[keyAccessor];
			return nextFilters;
		});
		setCurrentPage(DEFAULT_PAGE_NUMBER);
	};

	const actionSort = (
		direction: TableTypes.SortDirection,
		keyAccessor: keyof T,
	) => {
		setSort({ keyAccessor, direction });
	};

	const actionPagination = (page: number, newPageSize?: number) => {
		if (!hasPagination) {
			return;
		}
		if (newPageSize !== undefined) {
			setPageSize(newPageSize);
		}
		setCurrentPage(page);
	};

	const pageSizeAction = (newPageSize: number) => {
		setPageSize(newPageSize);
		setCurrentPage(DEFAULT_PAGE_NUMBER);
	};

	const actionHideColumn = (keyAccessor: (keyof T)[], isVisible: boolean) => {
		if (!tableConfig) {
			return;
		}
		const columnConfig = tableConfig.map((column) =>
			keyAccessor.includes(column.accessorKey)
				? { ...column, isVisible: isVisible }
				: column,
		);
		setTableConfig(columnConfig);
	};

	const resetHideColumn = () => {
		setTableConfig((prev) =>
			prev?.map((column) => ({
				...column,
				isVisible:
					config?.find((c) => c.accessorKey === column.accessorKey)
						?.isVisible ?? true,
			})),
		);
	};

	const actionSelectRow = (rowIds: string[]) => {
		if (!tableConfig) {
			return;
		}

		const rowIsPreviouslySelected = rowIds.some((id) =>
			selectedRows.includes(id),
		);

		setSelectedRows((prevSelectedRows) => {
			const updatedSelectedRows = rowIsPreviouslySelected
				? prevSelectedRows.filter((id) => !rowIds.includes(id))
				: [...prevSelectedRows, ...rowIds];

			return Array.from(new Set(updatedSelectedRows));
		});
	};

	const resetSelectColumn = () => {
		setSelectedRows([]);
	};

	return {
		dataTable,
		parseColumns,
		sortState: {
			keyAccessor: sort.keyAccessor,
			direction: sort.direction,
			action: actionSort,
		} as SortState<T>,
		paginationState: {
			currentPage,
			totalPages,
			pageSize,
			action: actionPagination,
			pageSizeAction,
		} as PaginationState,
		filtersState: {
			activeFilters,
			action: actionFilter,
			reset: resetFilters,
		},
		hideColumnState: {
			action: actionHideColumn,
			reset: resetHideColumn,
		} as HideColumnState<T>,
		selectColumnState: {
			selectedRows,
			action: actionSelectRow,
			reset: resetSelectColumn,
		} as SelectColumnState<T>,
	};
};
