import { act, renderHook } from "@testing-library/react";

import { describe, expect, test } from "vitest";
import { Table } from "../../types/table.types";
import { useTableSort } from "../../hooks/use-table-sort.hook";

describe("useTableSort", () => {
    const mockData = [
        { id: 1, name: "Zulu", age: 30, date: "2024-01-15T00:00:00Z" },
        { id: 2, name: "Alpha", age: 25, date: "2024-03-20T00:00:00Z" },
        { id: 3, name: "Bravo", age: 35, date: "2024-02-10T00:00:00Z" },
    ];

    test("Should return unsorted data when no column is selected", () => {
        // Arrange & Act
        const { result } = renderHook(() => useTableSort(mockData));

        // Assert
        expect(result.current.sortedData).toEqual(mockData);
        expect(result.current.sortColumn).toBeNull();
        expect(result.current.sortDirection).toBeNull();
    });

    test("Should sort descending when first click on column", () => {
        // Arrange
        const { result } = renderHook(() => useTableSort(mockData));

        // Act
        act(() => {
            result.current.handleSort("name");
        });

        // Assert
        expect(result.current.sortColumn).toBe("name");
        expect(result.current.sortDirection).toBe("desc");
        expect(result.current.sortedData[0].name).toBe("Zulu");
        expect(result.current.sortedData[2].name).toBe("Alpha");
    });

    test("Should sort ascending when second click on same column", () => {
        // Arrange
        const { result } = renderHook(() => useTableSort(mockData));

        // Act - First click (desc)
        act(() => {
            result.current.handleSort("name");
        });

        // Act - Second click (asc)
        act(() => {
            result.current.handleSort("name");
        });

        // Assert
        expect(result.current.sortColumn).toBe("name");
        expect(result.current.sortDirection).toBe("asc");
        expect(result.current.sortedData[0].name).toBe("Alpha");
        expect(result.current.sortedData[2].name).toBe("Zulu");
    });

    test("Should toggle between desc and asc when clicking multiple times", () => {
        // Arrange
        const { result } = renderHook(() => useTableSort(mockData));

        // Act - First click (desc)
        act(() => {
            result.current.handleSort("name");
        });

        // Assert first
        expect(result.current.sortDirection).toBe("desc");

        // Act - Second click (asc)
        act(() => {
            result.current.handleSort("name");
        });

        // Assert second
        expect(result.current.sortDirection).toBe("asc");

        // Act - Third click (desc again)
        act(() => {
            result.current.handleSort("name");
        });

        // Assert third
        expect(result.current.sortDirection).toBe("desc");
    });

    test("Should sort numbers when column contains numbers", () => {
        // Arrange
        const { result } = renderHook(() => useTableSort(mockData));

        // Act - Sort by age (descending)
        act(() => {
            result.current.handleSort("age");
        });

        // Assert
        expect(result.current.sortedData[0].age).toBe(35);
        expect(result.current.sortedData[1].age).toBe(30);
        expect(result.current.sortedData[2].age).toBe(25);
    });

    test("Should sort dates when column contains dates", () => {
        // Arrange
        const { result } = renderHook(() => useTableSort(mockData));

        // Act - Sort by date (descending = most recent first)
        act(() => {
            result.current.handleSort("date");
        });

        // Assert - Most recent first (March -> February -> January)
        expect(result.current.sortedData[0].date).toBe("2024-03-20T00:00:00Z");
        expect(result.current.sortedData[1].date).toBe("2024-02-10T00:00:00Z");
        expect(result.current.sortedData[2].date).toBe("2024-01-15T00:00:00Z");
    });

    test("Should use custom sort function when provided in config", () => {
        // Arrange
        const config: Table.ColumnConfig<(typeof mockData)[0]>[] = [
            {
                key: "name",
                headerCell: "Name",
                sortable: (data: typeof mockData, direction: Table.SortDirection) => {
                    return [...data].sort((a, b) => {
                        return direction === "desc" ? b.name.length - a.name.length : a.name.length - b.name.length;
                    });
                },
            },
        ];

        const { result } = renderHook(() => useTableSort(mockData, { config }));

        // Act
        act(() => {
            result.current.handleSort("name");
        });

        // Assert - Sorted by length (desc: longest first)
        expect(result.current.sortedData[0].name).toBe("Alpha"); // 5 chars
        expect(result.current.sortedData[1].name).toBe("Bravo"); // 5 chars
        expect(result.current.sortedData[2].name).toBe("Zulu"); // 4 chars
    });

    test("Should reset to new column when clicking different column", () => {
        // Arrange
        const { result } = renderHook(() => useTableSort(mockData));

        // Act - Sort by name
        act(() => {
            result.current.handleSort("name");
        });

        // Assert first column
        expect(result.current.sortColumn).toBe("name");
        expect(result.current.sortDirection).toBe("desc");

        // Act - Switch to age (should start with desc)
        act(() => {
            result.current.handleSort("age");
        });

        // Assert switched
        expect(result.current.sortColumn).toBe("age");
        expect(result.current.sortDirection).toBe("desc");
        expect(result.current.sortedData[0].age).toBe(35);
    });

    test("Should handle null values when data contains null", () => {
        // Arrange
        const dataWithNull = [
            { id: 1, name: "Alpha" },
            { id: 2, name: null },
            { id: 3, name: "Bravo" },
        ];

        const { result } = renderHook(() => useTableSort(dataWithNull));

        // Act
        act(() => {
            result.current.handleSort("name");
        });

        // Assert - Null should be at the end
        expect(result.current.sortedData[2].name).toBeNull();
    });
});
