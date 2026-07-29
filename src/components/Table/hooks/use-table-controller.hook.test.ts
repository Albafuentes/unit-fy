/** biome-ignore-all lint/suspicious/noExplicitAny: The use of 'any' is intentional for testing purposes */

import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { v4 as uuidv4 } from "uuid";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { SortDirectionEnum } from "../types/table.types";
import { useTableController } from "./use-table-controller.hook";

vi.mock("uuid", () => ({
	v4: vi.fn(),
}));

vi.mock("../config", () => ({
	DEFAULT_PAGE_NUMBER: 1,
	DEFAULT_PAGE_SIZE: 2,
}));

vi.mock("../helpers", () => ({
	buildColumns: vi.fn((_data, config) => config ?? []),
	filteredData: vi.fn((data: any[], keyAccessor: string, value: string) =>
		data.filter((row) =>
			String(row[keyAccessor])
				.toLowerCase()
				.includes(String(value).toLowerCase()),
		),
	),
	sortedData: vi.fn(
		(direction: SortDirectionEnum, keyAccessor: string, data: any[]) => {
			const sorted = [...data].sort((a, b) => {
				if (a[keyAccessor] < b[keyAccessor])
					return direction === SortDirectionEnum.Asc ? -1 : 1;
				if (a[keyAccessor] > b[keyAccessor])
					return direction === SortDirectionEnum.Asc ? 1 : -1;
				return 0;
			});
			return sorted;
		},
	),
	paginatedData: vi.fn((data: any[], page: number, pageSize: number) => {
		const start = (page - 1) * pageSize;
		return data.slice(start, start + pageSize);
	}),
}));

describe("use-table-controller--hook", () => {
	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
	});

	beforeEach(() => {
		let counter = 0;
		(uuidv4 as unknown as ReturnType<typeof vi.fn>).mockImplementation(
			() => `uuid-${++counter}`,
		);
	});

	const data = (): any[] => [
		{ id: 3, name: "Charlie" },
		{ id: 1, name: "Alice" },
		{ id: 2, name: "Bob" },
	];

	const config = [
		{ accessorKey: "id", header: "Id" },
		{ accessorKey: "name", header: "Nombre" },
	];

	test("should assign an internalId generated with uuid when the row does not have an internalId", () => {
		const { result } = renderHook(() =>
			useTableController<any>(data(), undefined),
		);

		expect(result.current.dataTable).toEqual([
			{ id: 3, name: "Charlie", internalId: "uuid-1" },
			{ id: 1, name: "Alice", internalId: "uuid-2" },
			{ id: 2, name: "Bob", internalId: "uuid-3" },
		]);
	});

	test("should respect the existing internalId when the row already has it", () => {
		const data: any[] = [{ id: 1, name: "Alice", internalId: "existing" }];

		const { result } = renderHook(() =>
			useTableController<any>(data, undefined),
		);

		expect(result.current.dataTable[0].internalId).toBe("existing");
		expect(uuidv4).not.toHaveBeenCalled();
	});

	test("should call buildColumns with the table data and the current config when rendering the table", async () => {
		const { buildColumns } = await import("../helpers");
		const config = [{ accessorKey: "name", header: "Nombre" }];

		renderHook(() => useTableController<any>(data(), config as any));

		expect(buildColumns).toHaveBeenCalledWith(expect.any(Array), config);
	});

	test("should add an active filter and filter dataTable accordingly when filtering by a specific column", async () => {
		const { filteredData } = await import("../helpers");
		const { result } = renderHook(() =>
			useTableController<any>(
				data(),
				config,
				true,
				{ currentPage: 1, pageSize: 2, totalPages: 2 },
				[],
			),
		);

		act(() => {
			result.current.filtersState.action("ali", "name");
		});

		expect(filteredData).toHaveBeenCalledWith(expect.any(Array), "name", "ali");
		expect(result.current.dataTable).toHaveLength(1);
		expect(result.current.dataTable[0].name).toBe("Alice");
		expect(result.current.filtersState.activeFilters).toEqual({
			name: "ali",
		});
	});

	test("should remove the filter when the value is null, undefined, or an empty string", () => {
		const { result } = renderHook(() =>
			useTableController<any>(data(), undefined),
		);

		act(() => {
			result.current.filtersState.action("ali", "name");
		});
		act(() => {
			result.current.filtersState.action("", "name");
		});

		expect(result.current.filtersState.activeFilters).toEqual({});
		expect(result.current.dataTable).toHaveLength(3);
	});

	test("should reset the current page to DEFAULT_PAGE_NUMBER when applying a filter", () => {
		const { result } = renderHook(() =>
			useTableController<any>(
				data(),
				config,
				true,
				{
					currentPage: 2,
					pageSize: 2,
					totalPages: 2,
				},
				[
					{
						keyAccessor: "id",
						render: (value: any) => value.toString(),
					},
				],
			),
		);

		act(() => {
			result.current.filtersState.action("a", "name");
		});

		expect(result.current.paginationState.currentPage).toBe(1);
	});

	test("should remove the filter for the specified key and reset the page when calling reset(keyAccessor)", () => {
		const { result } = renderHook(() =>
			useTableController<any>(data(), undefined),
		);

		act(() => {
			result.current.filtersState.action("ali", "name");
		});
		act(() => {
			result.current.filtersState.reset("name");
		});

		expect(result.current.filtersState.activeFilters).toEqual({});
		expect(result.current.dataTable).toHaveLength(3);
	});

	test("should sort dataTable ascending by the specified key when clicking the sort button", async () => {
		const { sortedData } = await import("../helpers");
		const { result } = renderHook(() =>
			useTableController<any>(data(), undefined),
		);

		act(() => {
			result.current.sortState.action(SortDirectionEnum.Asc, "id");
		});

		expect(sortedData).toHaveBeenCalledWith(
			SortDirectionEnum.Asc,
			"id",
			expect.any(Array),
		);
		expect(result.current.dataTable.map((row) => row.id)).toEqual([1, 2, 3]);
		expect(result.current.sortState.keyAccessor).toBe("id");
		expect(result.current.sortState.direction).toBe(SortDirectionEnum.Asc);
	});

	test("should sort dataTable descending by the specified key when clicking the sort button", () => {
		const { result } = renderHook(() =>
			useTableController<any>(data(), undefined),
		);

		act(() => {
			result.current.sortState.action(SortDirectionEnum.Desc, "id");
		});

		expect(result.current.dataTable.map((row) => row.id)).toEqual([3, 2, 1]);
	});

	test("should not order when there is no direction or keyAccessor", () => {
		const { result } = renderHook(() =>
			useTableController<any>(data(), undefined),
		);

		expect(result.current.dataTable.map((row) => row.id)).toEqual([3, 1, 2]);
	});

	test("should return only the current page in dataTable when hasPagination is true", () => {
		const { result } = renderHook(() =>
			useTableController<any>(data(), undefined, true, {
				currentPage: 1,
				pageSize: 2,
				totalPages: 2,
			}),
		);

		expect(result.current.dataTable).toHaveLength(2);
		expect(result.current.paginationState.totalPages).toBe(2);
	});

	test("should return all results in dataTable when hasPagination is false", () => {
		const { result } = renderHook(() =>
			useTableController<any>(data(), undefined, false),
		);

		expect(result.current.dataTable).toHaveLength(3);
	});

	test("should update currentPage when hasPagination is true and action(page) is called", () => {
		const { result } = renderHook(() =>
			useTableController<any>(data(), undefined, true, {
				currentPage: 1,
				pageSize: 2,
				totalPages: 2,
			}),
		);

		act(() => {
			result.current.paginationState.action(2);
		});

		expect(result.current.paginationState.currentPage).toBe(2);
		expect(result.current.dataTable).toHaveLength(1); // último elemento de la página 2
	});

	test("should not change currentPage when hasPagination is false and action(page) is called", () => {
		const { result } = renderHook(() =>
			useTableController<any>(data(), undefined, false, {
				currentPage: 1,
				pageSize: 2,
				totalPages: 2,
			}),
		);

		act(() => {
			result.current.paginationState.action(2);
		});

		expect(result.current.paginationState.currentPage).toBe(1);
	});

	test("should update pageSize when action(page, pageSize) is called", () => {
		const { result } = renderHook(() =>
			useTableController<any>(data(), undefined, true, {
				currentPage: 1,
				pageSize: 2,
				totalPages: 2,
			}),
		);

		act(() => {
			result.current.paginationState.action(1, 3);
		});

		expect(result.current.paginationState.pageSize).toBe(3);
		expect(result.current.dataTable).toHaveLength(3);
	});

	test("should update pageSize and reset currentPage to DEFAULT_PAGE_NUMBER when pageSizeAction is called", () => {
		const { result } = renderHook(() =>
			useTableController<any>(data(), undefined, true, {
				currentPage: 2,
				pageSize: 1,
				totalPages: 3,
			}),
		);

		act(() => {
			result.current.paginationState.pageSizeAction(3);
		});

		expect(result.current.paginationState.pageSize).toBe(3);
		expect(result.current.paginationState.currentPage).toBe(1);
	});

	test("should correct currentPage if it goes out of range after filtering (useEffect)", () => {
		const { result } = renderHook(() =>
			useTableController<any>(
				data(),
				undefined,
				true,
				{
					currentPage: 2,
					pageSize: 2,
					totalPages: 2,
				},
				[],
			),
		);

		expect(result.current.paginationState.currentPage).toBe(2);

		act(() => {
			result.current.filtersState.action("alice", "name");
		});

		expect(result.current.paginationState.totalPages).toBe(1);
		expect(result.current.paginationState.currentPage).toBe(1);
	});

	test("should mark the specified columns with isVisible when hiding a column", () => {
		const { result } = renderHook(() =>
			useTableController<any>(data(), config as any),
		);

		act(() => {
			result.current.hideColumnState.action(["name"], false);
		});

		// parsedColumns viene de buildColumns mockeado devolviendo tableConfig tal cual
		expect(result.current.parsedColumns).toEqual([
			{ accessorKey: "id", header: "Id" },
			{ accessorKey: "name", header: "Nombre", isVisible: false },
		]);
	});

	test("should do nothing if there is no tableConfig (initial config undefined)", () => {
		const { result } = renderHook(() =>
			useTableController<any>(data(), undefined),
		);

		act(() => {
			result.current.hideColumnState.action(["name"], false);
		});

		expect(result.current.parsedColumns).toEqual([]);
	});

	test("should restore isVisible according to the original config (or true if it was not defined)", () => {
		const { result } = renderHook(() =>
			useTableController<any>(data(), config as any),
		);

		act(() => {
			result.current.hideColumnState.action(["name"], false);
		});
		act(() => {
			result.current.hideColumnState.reset();
		});

		expect(result.current.parsedColumns).toEqual([
			{ accessorKey: "id", header: "Id", isVisible: true },
			{ accessorKey: "name", header: "Nombre", isVisible: true },
		]);
	});

	test("should add new selected rows to selectedRows when action is called", () => {
		const { result } = renderHook(() =>
			useTableController<any>(data(), config as any),
		);

		act(() => {
			result.current.selectColumnState.action(["row-1", "row-2"]);
		});

		expect(result.current.selectColumnState.selectedRows).toEqual([
			"row-1",
			"row-2",
		]);
	});

	test("should deselect rows if any were already selected when action is called", () => {
		const { result } = renderHook(() =>
			useTableController<any>(data(), config as any),
		);

		act(() => {
			result.current.selectColumnState.action(["row-1", "row-2"]);
		});
		act(() => {
			result.current.selectColumnState.action(["row-1"]);
		});

		expect(result.current.selectColumnState.selectedRows).toEqual(["row-2"]);
	});

	test("should not duplicate already selected ids when action is called", () => {
		const { result } = renderHook(() =>
			useTableController<any>(
				data(),
				config as any,
				true,
				{
					currentPage: 1,
					pageSize: 2,
					totalPages: 2,
				},
				[],
			),
		);

		act(() => {
			result.current.selectColumnState.action(["row-1"]);
		});
		act(() => {
			result.current.selectColumnState.action(["row-1", "row-3"]);
		});

		expect(result.current.selectColumnState.selectedRows).toEqual(["row-3"]);
	});

	test("should do nothing when there is no tableConfig ", () => {
		const { result } = renderHook(() =>
			useTableController<any>(data(), undefined),
		);

		act(() => {
			result.current.selectColumnState.action(["row-1"]);
		});

		expect(result.current.selectColumnState.selectedRows).toEqual([]);
	});

	test("should reset selectedRows when reset is called", () => {
		const { result } = renderHook(() =>
			useTableController<any>(data(), config as any),
		);

		act(() => {
			result.current.selectColumnState.action(["row-1"]);
		});
		act(() => {
			result.current.selectColumnState.reset();
		});

		expect(result.current.selectColumnState.selectedRows).toEqual([]);
	});
});
