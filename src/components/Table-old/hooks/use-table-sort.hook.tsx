import { useCallback, useMemo, useState } from "react";
import { Table } from "../types/table.types";

export type SortDirection = "asc" | "desc" | null;

export interface UseTableSortReturn<T extends object> {
    sortedData: T[];
    sortColumn: keyof T | null;
    sortDirection: SortDirection;
    handleSort: (columnKey: keyof T) => void;
}

export interface UseTableSortOptions<T extends object> {
    config?: Table.ColumnConfig<T>[];
}

/**
 * Detects the type of data in a column
 */
const isAValidDate = (value: string): boolean => {
    return !Number.isNaN(Date.parse(value));
};

const detectDataType = (value: unknown): "date" | "number" | "string" => {
    if (value === null || value === undefined) return "string";

    // Check if it's a Date object
    if (value instanceof Date) return "date";

    // Check if it's a valid ISO date string
    if (typeof value === "string" && isAValidDate(value)) {
        return "date";
    }

    // Check if it's a number
    if (typeof value === "number") return "number";

    // Check if it's a string that can be parsed as a number
    if (typeof value === "string" && !Number.isNaN(Number(value))) {
        return "number";
    }

    return "string";
};

/**
 * Compares two values based on their detected type
 */
const compareValues = <T,>(a: T, b: T, direction: "asc" | "desc"): number => {
    const typeA = detectDataType(a);
    const typeB = detectDataType(b);

  
    const locale = "es-ES"

    const stringCollator = new Intl.Collator(locale, {
        sensitivity: "base", // ignora acentos y mayúsculas
        numeric: false,
    });

    // Handle null/undefined values (always put them at the end)
    if (a === null || a === undefined) return 1;
    if (b === null || b === undefined) return -1;

    // If types don't match, compare as strings
    if (typeA !== typeB) {
        return direction === "asc" ? stringCollator.compare(String(a), String(b)) : stringCollator.compare(String(b), String(a));
    }

    // Compare based on detected type
    switch (typeA) {
        case "date": {
            const dateA = a instanceof Date ? a : new Date(a as string);
            const dateB = b instanceof Date ? b : new Date(b as string);
            return direction === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
        }
        case "number": {
            const numA = typeof a === "number" ? a : Number(a);
            const numB = typeof b === "number" ? b : Number(b);
            return direction === "asc" ? numA - numB : numB - numA;
        }

        default: {
            return direction === "asc" ? stringCollator.compare(String(a), String(b)) : stringCollator.compare(String(b), String(a));
        }
    }
};

/**
 * Hook for managing table sorting state and logic
 */
export type SortFunction<T> = (data: T[], direction: SortDirection) => T[];

export const useTableSort = <T extends object>(data: T[], options?: UseTableSortOptions<T>): UseTableSortReturn<T> => {
    const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);

    // Extract custom sort functions from config
    const customSortFunctions = useMemo(() => {
        if (!options?.config) return undefined;

        const sortFunctions = new Map<keyof T, SortFunction<T>>();

        for (const columnConfig of options.config) {
            if (typeof columnConfig.sortable === "function") {
                sortFunctions.set(columnConfig.key, columnConfig.sortable);
            }
        }

        return sortFunctions.size > 0 ? sortFunctions : undefined;
    }, [options?.config]);

    /**
     * Handles sorting when a column header is clicked
     */
    const handleSort = useCallback(
        (columnKey: keyof T) => {
            if (sortColumn === columnKey) {
                // If already sorting by this column, toggle between desc <-> asc
                setSortDirection(sortDirection === "desc" ? "asc" : "desc");
            } else {
                // New column, start with descending (de mayor a menor)
                setSortColumn(columnKey);
                setSortDirection("desc");
            }
        },
        [sortColumn, sortDirection],
    );

    /**
     * Sorted data based on current sort state
     */
    const sortedData = useMemo(() => {
        if (!sortColumn || !sortDirection) {
            return data;
        }

        // Check if there's a custom sort function for this column
        const customSortFn = customSortFunctions?.get(sortColumn);

        if (customSortFn) {
            // Use custom sort function
            return customSortFn(data, sortDirection);
        }

        // Default sorting behavior (auto-detect type)
        const sorted = [...data].sort((a, b) => {
            return compareValues(a[sortColumn], b[sortColumn], sortDirection);
        });

        return sorted;
    }, [data, sortColumn, sortDirection, customSortFunctions]);

    return {
        sortedData,
        sortColumn,
        sortDirection,
        handleSort,
    };
};
