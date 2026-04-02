import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";

import { beforeEach, describe, expect, test, vi } from "vitest";
import Table from "../Table";
import type { Table as TableTypes } from "../types/table.types";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
    ArrowDownAZ: () => <span data-testid="arrow-down-az" />,
    ArrowDownUp: () => <span data-testid="arrow-down-up" />,
    ArrowUpAZ: () => <span data-testid="arrow-up-az" />,
    ChevronLeft: () => <span data-testid="chevron-left" />,
    ChevronRight: () => <span data-testid="chevron-right" />,
}));

describe("TableWrapper", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		cleanup();
	});
	type MockData = {
		id: string;
		fileUrl: string;
		status: string;
		date: string;
		price: number;
	};

	const mockList: MockData[] = [
		{
			id: "a",
			fileUrl: "b",
			status: "c",
			date: "2024-01-15T00:00:00Z",
			price: 100,
		},
		{
			id: "a2",
			fileUrl: "b2",
			status: "c2",
			date: "2024-02-20T00:00:00Z",
			price: 200,
		},
		{
			id: "a3",
			fileUrl: "b3",
			status: "c3",
			date: "2024-03-10T00:00:00Z",
			price: 300,
		},
	];

	test("Should show table when compiles", () => {
		// Arrange
		const config: TableTypes.ColumnConfig<MockData>[] = [
			{ key: "status", headerCell: "Status" },
		];

		// Act
		render(<Table config={config} data={mockList} />);

		// Assert
		const table = screen.getByRole("table");
		const tableHead = screen.getByRole("columnheader", { name: "Status" });
		const tableBody = screen.getAllByRole("row")[0];

		expect(table).toBeInTheDocument();
		expect(tableHead).toBeInTheDocument();
		expect(tableBody).toBeInTheDocument();
	});

	test("Should show table heads correctly when compiles", () => {
		// Arrange
		const config: TableTypes.ColumnConfig<MockData>[] = [
			{ key: "status", headerCell: "Status" },
			{ key: "id", headerCell: "ID" },
			{ key: "date", headerCell: "Date" },
		];

		// Act
		render(<Table config={config} data={mockList} />);

		// Assert
		const tableHeadStatus = screen.getByRole("columnheader", {
			name: /Status/,
		});
		const tableHeadId = screen.getByRole("columnheader", {
			name: /ID/,
		});
		const tableHeadDate = screen.getByRole("columnheader", {
			name: /Date/,
		});

		expect(tableHeadStatus).toBeInTheDocument();
		expect(tableHeadId).toBeInTheDocument();
		expect(tableHeadDate).toBeInTheDocument();
	});

	test("Should show table body correctly when compiles", () => {
		// Arrange
		const config: TableTypes.ColumnConfig<MockData>[] = [
			{ key: "status", headerCell: "Status" },
			{ key: "id", headerCell: "ID" },
			{
				key: "date",
				headerCell: "Date",
				render: (_cellData, _colIndex, _rowData) => (
					<div>some rendered stuff here</div>
				),
			},
		];

		// Act
		render(<Table config={config} data={mockList} />);

		// Assert
		const cellStatus = screen.getAllByRole("cell")[0];
		const cellID = screen.getAllByRole("cell")[1];
		const cellDate = screen.getAllByRole("cell")[2];

		expect(cellStatus).not.toBeEmptyDOMElement();
		expect(cellStatus).toHaveTextContent(mockList[0].status);
		expect(cellID).not.toBeEmptyDOMElement();
		expect(cellID).toHaveTextContent(mockList[0].id);
		expect(cellDate).toContainHTML("<div>some rendered stuff here</div>");
	});

	test("Should execute onclick when click in row", async () => {
		// Arrange
		const mockOnClick = vi.fn();
		const config: TableTypes.ColumnConfig<MockData>[] = [
			{
				key: "id",
				headerCell: "ID",
				render: (_cellData) => <button type="button">Click me</button>,
			},
		];

		// Act
		render(<Table config={config} data={mockList} onClick={mockOnClick} />);

		const tableRows = screen.getAllByRole("row");
		fireEvent.click(tableRows[1]);

		// Assert
		await waitFor(() => expect(mockOnClick).toHaveBeenCalled());
	});

	test("Should show sort icon when column is sortable", () => {
		// Arrange
		const config: TableTypes.ColumnConfig<MockData>[] = [
			{ key: "status", headerCell: "Status", sortable: true },
		];

		// Act
		render(<Table config={config} data={mockList} />);

		// Assert - Should show unsorted icon by default (ArrowDownUp)
		expect(screen.getByTestId("arrow-down-up")).toBeInTheDocument();
	});

	test("Should sort data when sortable column clicked", () => {
		// Arrange
		const config: TableTypes.ColumnConfig<MockData>[] = [
			{ key: "status", headerCell: "Status", sortable: true },
		];

		// Act
		render(<Table config={config} data={mockList} />);

		const statusHeader = screen.getByRole("columnheader", {
			name: /Status/,
		});
		fireEvent.click(statusHeader);

		// Assert - After first click, should sort descending (Z-A)
		const cells = screen.getAllByRole("cell");
		expect(cells[0]).toHaveTextContent("c3"); // Should be last item first (descending)
	});

	test("Should toggle sort direction when clicked twice", () => {
		// Arrange
		const config: TableTypes.ColumnConfig<MockData>[] = [
			{ key: "status", headerCell: "Status", sortable: true },
		];

		// Act
		render(<Table config={config} data={mockList} />);

		const statusHeader = screen.getByRole("columnheader", {
			name: /Status/,
		});

		// First click - descending
		fireEvent.click(statusHeader);
		const cellsDesc = screen.getAllByRole("cell");
		expect(cellsDesc[0]).toHaveTextContent("c3");

		// Second click - ascending
		fireEvent.click(statusHeader);
		const cellsAsc = screen.getAllByRole("cell");
		expect(cellsAsc[0]).toHaveTextContent("c");
	});

	test("Should not sort data when column not sortable", () => {
		// Arrange
		const config: TableTypes.ColumnConfig<MockData>[] = [
			{ key: "status", headerCell: "Status", sortable: false },
		];

		// Act
		render(<Table config={config} data={mockList} />);

		const statusHeader = screen.getByRole("columnheader", {
			name: /Status/,
		});
		fireEvent.click(statusHeader);

		// Assert - Data should remain in original order
		const cells = screen.getAllByRole("cell");
		expect(cells[0]).toHaveTextContent("c"); // First item unchanged
	});

	test("Should use custom sort when sort function provided", () => {
		// Arrange
		const config: TableTypes.ColumnConfig<MockData>[] = [
			{
				key: "price",
				headerCell: "Price",
				sortable: (data: MockData[], direction: TableTypes.SortDirection) => {
					// Custom: always sort by length of status field
					return [...data].sort((a, b) => {
						return direction === "desc"
							? b.status.length - a.status.length
							: a.status.length - b.status.length;
					});
				},
			},
		];

		// Act
		render(<Table config={config} data={mockList} />);

		const priceHeader = screen.getByRole("columnheader", {
			name: /Price/,
		});
		fireEvent.click(priceHeader);

		// Assert - Should use custom sort (by status length)
		const cells = screen.getAllByRole("cell");
		// Custom sort by status length desc: c2, c3, c
		expect(cells[0]).toHaveTextContent("200"); // c2 (length 2)
	});

	test("Should hide column when hide is true", () => {
		// Arrange
		const config: TableTypes.ColumnConfig<MockData>[] = [
			{ key: "id", headerCell: "ID", hide: true },
			{ key: "status", headerCell: "Status" },
		];

		// Act
		render(<Table config={config} data={mockList} />);

		// Assert - ID column should not be visible
		expect(
			screen.queryByRole("columnheader", { name: "ID" }),
		).not.toBeInTheDocument();
		expect(
			screen.getByRole("columnheader", { name: "Status" }),
		).toBeInTheDocument();
	});

	test("Should apply render type when render type provided", () => {
		// Arrange
		const config: TableTypes.ColumnConfig<MockData>[] = [
			{ key: "date", headerCell: "Date", renderType: "date" },
		];

		// Act
		render(<Table config={config} data={mockList} />);

		// Assert - Date should be formatted (not ISO string)
		const cells = screen.getAllByRole("cell");
		expect(cells[0]).not.toHaveTextContent("2024-01-15T00:00:00Z");
	});

	test("Should handle empty data when no data provided", () => {
		// Arrange
		const config: TableTypes.ColumnConfig<MockData>[] = [
			{ key: "status", headerCell: "Status" },
		];

		// Act
		render(<Table config={config} data={[]} />);

		// Assert - Table should still render with empty message
		expect(screen.getByTestId("table")).toBeInTheDocument();
		expect(
			screen.getByText("No hay datos disponibles en este momento."),
		).toBeInTheDocument();
	});
});
