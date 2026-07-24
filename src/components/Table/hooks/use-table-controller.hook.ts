import { useEffect, useMemo, useState } from "react";
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
	//--- Filter Functionality: un único valor activo por columna, se reemplaza
	//--- en vez de acumularse cuando se filtra varias veces por la misma clave.
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

	//--- Pipeline derivado: data -> filtrado -> ordenado -> paginado.
	//--- Cada etapa se recalcula a partir de la anterior, así el filtro y el
	//--- orden siempre actúan sobre el dataset completo (no sobre una página
	//--- ya recortada) y la paginación respeta filtros y orden activos.

	const filteredResult = useMemo(() => {
		const entries = Object.entries(activeFilters) as [keyof T, string][];
		return entries.reduce(
			(acc, [keyAccessor, value]) => filteredData(acc, keyAccessor, value),
			data,
		);
	}, [data, activeFilters]);

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
		() => buildColumns<T>(dataTable, config),
		[dataTable, config],
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

	return {
		dataTable,
		parseColumns,
		sortState: {
			keyAccessor: sort.keyAccessor,
			direction: sort.direction,
			action: actionSort,
		} as SortState<T>,
		actionFilter,
		resetFilters,
		paginationState: {
			currentPage,
			totalPages,
			pageSize,
			action: actionPagination,
			pageSizeAction,
		} as PaginationState,
	};
};
