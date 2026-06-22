import { useCallback, useEffect, useMemo, useState } from "react";
import type { Table as TableTypes } from "../types/table.types";

export interface UseTablePaginationExports<T> {
    currentPage: number;
    pageSize: number;
    displayedItems: T[];
    totalPages: number;
    totalItems: number;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    nextPage: () => void;
    previousPage: () => void;
    canNextPage: boolean;
    canPreviousPage: boolean;
}


export const useTablePagination = <T, >(initialData: T[] = [], options: TableTypes.PaginationOptions = {}): UseTablePaginationExports<T> => {
    const { pageSize: initialPageSize = 30, initialPage = 1 } = options;

    const [currentPage, setCurrentPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);

    // When initialData changes, we reset the page automatically
    const mergedData = useMemo(() => {
        return initialData;
    }, [initialData]);

    const totalItems = mergedData.length;
    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize);

    useEffect(() => {
        if (mergedData.length) {
            setCurrentPage(initialPage);
        }
    }, [mergedData.length, initialPage]);

    const displayedItems = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return mergedData.slice(start, start + pageSize);
    }, [mergedData, currentPage, pageSize]);

    const setPage = useCallback(
        (page: number) => {
            const validPage = totalPages === 0 ? 1 : Math.max(1, Math.min(page, totalPages));
            setCurrentPage(validPage);
        },
        [totalPages],
    );

    const nextPage = useCallback(() => setPage(currentPage + 1), [currentPage, setPage]);

    const previousPage = useCallback(() => setPage(currentPage - 1), [currentPage, setPage]);

    const handleSetPageSize = useCallback((size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    }, []);

    return {
        currentPage,
        pageSize,
        displayedItems,
        totalPages,
        totalItems,
        setPage,
        setPageSize: handleSetPageSize,
        nextPage,
        previousPage,
        canNextPage: currentPage < totalPages,
        canPreviousPage: currentPage > 1,
    };
}
