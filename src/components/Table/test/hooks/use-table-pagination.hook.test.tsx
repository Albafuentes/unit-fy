import { act, renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { useTablePagination } from "../../hooks/use-table-pagination.hook";

describe("useTablePagination", () => {
	const initialData = Array.from({ length: 25 }, (_, i) => i + 1); // [1,2,...25]

	test("Should initialize correctly when using initial configuration", () => {
		const { result } = renderHook(() =>
			useTablePagination(initialData, { pageSize: 10, initialPage: 1 }),
		);

		expect(result.current.currentPage).toBe(1);
		expect(result.current.pageSize).toBe(10);
		expect(result.current.totalItems).toBe(25);
		expect(result.current.totalPages).toBe(3);
		expect(result.current.displayedItems).toEqual([
			1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
		]);
		expect(result.current.canNextPage).toBe(true);
		expect(result.current.canPreviousPage).toBe(false);
	});

	test("Should change page correctly when using setPage", () => {
		const { result } = renderHook(() =>
			useTablePagination(initialData, { pageSize: 10 }),
		);

		act(() => result.current.setPage(2));
		expect(result.current.currentPage).toBe(2);
		expect(result.current.displayedItems).toEqual([
			11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
		]);

		act(() => result.current.setPage(3));
		expect(result.current.currentPage).toBe(3);
		expect(result.current.displayedItems).toEqual([21, 22, 23, 24, 25]);

		// No permite pasar de totalPages
		act(() => result.current.setPage(5));
		expect(result.current.currentPage).toBe(3);
	});

	test("Should next page and previous page work correctly", () => {
		const { result } = renderHook(() =>
			useTablePagination(initialData, { pageSize: 10 }),
		);

		act(() => result.current.nextPage());
		expect(result.current.currentPage).toBe(2);
		act(() => result.current.previousPage());
		expect(result.current.currentPage).toBe(1);

		// previousPage no baja de 1
		act(() => result.current.previousPage());
		expect(result.current.currentPage).toBe(1);

		// nextPage no pasa de totalPages
		act(() => result.current.setPage(3));
		act(() => result.current.nextPage());
		expect(result.current.currentPage).toBe(3);
	});

	test("Should change page size and reset current page", () => {
		const { result } = renderHook(() =>
			useTablePagination(initialData, { pageSize: 10 }),
		);

		act(() => result.current.setPage(2));
		expect(result.current.currentPage).toBe(2);

		act(() => result.current.setPageSize(5));
		expect(result.current.pageSize).toBe(5);
		expect(result.current.currentPage).toBe(1);
		expect(result.current.displayedItems).toEqual([1, 2, 3, 4, 5]);
		expect(result.current.totalPages).toBe(5);
	});

	test("Should reset current page automatically when initial data changes", () => {
		const { result, rerender } = renderHook(
			({ data }) => useTablePagination(data, { pageSize: 10 }),
			{
				initialProps: { data: initialData },
			},
		);

		act(() => result.current.setPage(3));
		expect(result.current.currentPage).toBe(3);

		// Cambiamos initialData → currentPage se reinicia
		const newData = Array.from({ length: 15 }, (_, i) => i + 1);
		rerender({ data: newData });

		expect(result.current.currentPage).toBe(1);
		expect(result.current.totalItems).toBe(15);
		expect(result.current.totalPages).toBe(2);
		expect(result.current.displayedItems).toEqual([
			1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
		]);
	});
});
