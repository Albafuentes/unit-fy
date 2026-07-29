/** biome-ignore-all lint/suspicious/noExplicitAny: The use of 'any' is intentional for testing purposes */
import { act, cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { SortDirectionEnum } from "../types/table.types";
import TableContent, { type TableContentProps } from "./TableContent";

describe("TableContent-component", () => {
	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
	});

	const sortAction = vi.fn();

	const hideColumnAction = vi.fn();
	const hideColumnReset = vi.fn();

	const selectColumnAction = vi.fn();
	const selectColumnReset = vi.fn();

	const onRowClick = vi.fn();
	const rowIsDisabled = vi.fn();
	const rowStyle = vi.fn();

	const tableContentProps: TableContentProps<any> = {
		parsedColumns: [
			{
				accessorKey: "name",
				isSortable: true,
				isHidable: true,
			},
		],
		sortState: {
			keyAccessor: "name",
			direction: SortDirectionEnum.Asc,
			action: sortAction,
		},
		dataTable: [
			{
				name: "John Doe",
			},
		],
		hideColumnState: {
			action: hideColumnAction,
			reset: hideColumnReset,
		},
		selectColumnState: {
			selectedRows: [],
			action: selectColumnAction,
			reset: selectColumnReset,
		},
		hasActionColumn: true,
		onRowClick: onRowClick,
		rowIsDisabled: rowIsDisabled,
		rowStyle: rowStyle,
	};

	test("should render correctly when compiles", async () => {
		const { getByRole, getByTestId } = await render(
			<TableContent {...tableContentProps} />,
		);

		expect(getByTestId("table")).toBeTruthy();

		expect(
			getByRole("button", {
				name: "name column name actions sortable and hidable",
			}),
		).toBeTruthy();
		expect(
			getByRole("checkbox", { name: "Select or unselect all rows" }),
		).toBeTruthy();

		expect(getByRole("cell", { name: "John Doe" })).toBeTruthy();
		expect(
			getByRole("cell", { name: "Select or unselect row 1" }),
		).toBeTruthy();
	});

	test("should execute the sort action function when a column is sorted", async () => {
		const { getByRole } = await render(<TableContent {...tableContentProps} />);

		act(() => {
			getByRole("button", {
				name: "name column name actions sortable and hidable",
			}).click();
		});

		const sortAscButton = getByRole("button", { name: "Sort Ascending" });
		expect(sortAscButton).toBeTruthy();

		act(() => {
			sortAscButton.click();
		});

		expect(sortAction).toHaveBeenCalledWith(SortDirectionEnum.Asc, "name");
	});

	test("should execute the hide column action function when a column is toggled", async () => {
		const { getByRole } = await render(<TableContent {...tableContentProps} />);

		act(() => {
			getByRole("button", {
				name: "name column name actions sortable and hidable",
			}).click();
		});

		const hideColumnButton = getByRole("button", { name: "Hide Column" });

		act(() => {
			hideColumnButton.click();
		});

		expect(hideColumnAction).toHaveBeenCalledWith(["name"], false);
	});

	test("should execute the onRowClick function when a row is clicked", async () => {
		const { getByRole } = await render(<TableContent {...tableContentProps} />);

		const row = getByRole("row", { name: "Select or unselect row 1 John Doe" });
		act(() => {
			row.click();
		});

		await waitFor(() => {
			expect(onRowClick).toHaveBeenCalled();
		});
	});

	test("should execute the rowIsDisabled function when a row is clicked", async () => {
		const { getByRole } = await render(
			<TableContent {...tableContentProps} rowIsDisabled={() => true} />,
		);

		const row = getByRole("row", { name: "Select or unselect row 1 John Doe" });
		act(() => {
			row.click();
		});

		expect(row).toHaveAttribute("class", "tr-disabled");
		expect(row).toHaveAttribute("aria-disabled", "true");
		expect(onRowClick).not.toHaveBeenCalled();
	});

	test("should execute the hideColumn function when a checkbox row is clicked", async () => {
		const { getByRole } = await render(<TableContent {...tableContentProps} />);

		const rowCheckbox = getByRole("checkbox", {
			name: "Select or unselect row 1",
		});
		act(() => {
			rowCheckbox.click();
		});

		expect(selectColumnAction).toHaveBeenCalledWith([
			tableContentProps.dataTable[0].internalId,
		]);
	});

	test("should add the custom row style when a row is clicked", async () => {
		const { getByRole, debug } = await render(
			<TableContent
				{...tableContentProps}
				rowStyle={() => ({ backgroundColor: "red" })}
			/>,
		);

		const row = getByRole("row", { name: "Select or unselect row 1 John Doe" });

		debug(row);

		expect(row).toHaveAttribute("style", "background-color: red;");
	});
});
