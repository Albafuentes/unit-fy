import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import Pagination from "../../components/Pagination";
import type { UseTablePaginationExports } from "../../hooks/use-table-pagination.hook";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
	ChevronLeft: () => <span data-testid="chevron-left" />,
	ChevronRight: () => <span data-testid="chevron-right" />,
	
}));

describe("Pagination", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		cleanup()
	});

	type MockData = { id: number; name: string };

	const createMockPagination = (
		overrides?: Partial<UseTablePaginationExports<MockData>>,
	): UseTablePaginationExports<MockData> => ({
		currentPage: 1,
		pageSize: 10,
		displayedItems: [],
		totalPages: 5,
		totalItems: 50,
		setPage: vi.fn(),
		setPageSize: vi.fn(),
		nextPage: vi.fn(),
		previousPage: vi.fn(),
		canNextPage: true,
		canPreviousPage: false,
		...overrides,
	});

	const renderWithProvider = (
		pagination: UseTablePaginationExports<MockData>,
	) => {
		return render(<Pagination pagination={pagination} />);
	};

	test.each([
		{ pagination: createMockPagination({ totalItems: 0, totalPages: 0 }) },
		{ pagination: createMockPagination({ totalItems: 5, totalPages: 1 }) },
	] as const)("Should no render when the total items is 0 or the total pages is 1", ({
		pagination,
	}) => {
		renderWithProvider(pagination);
		expect(screen.queryByLabelText("Página anterior")).not.toBeInTheDocument();
		expect(screen.queryByLabelText("Página siguiente")).not.toBeInTheDocument();
	});

	test("Should render pagination when multiple pages", () => {
		// Arrange
		const pagination = createMockPagination({
			totalItems: 50,
			totalPages: 5,
		});

		// Act
		renderWithProvider(pagination);

		// Assert - Check for navigation buttons
		const prevButton = screen.getByLabelText("Página anterior");
		const nextButton = screen.getByLabelText("Página siguiente");
		expect(prevButton).toBeInTheDocument();
		expect(nextButton).toBeInTheDocument();
	});

	test("Should disable previous button when on first page", () => {
		// Arrange
		const pagination = createMockPagination({
			currentPage: 1,
			canPreviousPage: false,
		});

		// Act
		renderWithProvider(pagination);

		// Assert
		const prevButton = screen.getByLabelText("Página anterior");
		expect(prevButton).toBeDisabled();
	});

	test("Should disable next button when on last page", () => {
		// Arrange
		const pagination = createMockPagination({
			currentPage: 5,
			totalPages: 5,
			canNextPage: false,
		});

		// Act
		renderWithProvider(pagination);

		// Assert
		const nextButton = screen.getByLabelText("Página siguiente");
		expect(nextButton).toBeDisabled();
	});

	test("Should enable previous button when not on first page", () => {
		// Arrange
		const pagination = createMockPagination({
			currentPage: 2,
			canPreviousPage: true,
		});

		// Act
		renderWithProvider(pagination);

		// Assert
		const prevButton = screen.getByLabelText("Página anterior");
		expect(prevButton).not.toBeDisabled();
	});

	test("Should enable next button when not on last page", () => {
		// Arrange
		const pagination = createMockPagination({
			currentPage: 1,
			canNextPage: true,
		});

		// Act
		renderWithProvider(pagination);

		// Assert
		const nextButton = screen.getByLabelText("Página siguiente");
		expect(nextButton).not.toBeDisabled();
	});

	test("Should show navigation icons when rendered", () => {
		// Arrange
		const pagination = createMockPagination({
			totalItems: 50,
			totalPages: 5,
		});

		// Act
		renderWithProvider(pagination);

		// Assert
		expect(screen.getByTestId("previous-page-button")).toBeInTheDocument();
		expect(screen.getByTestId("next-page-button")).toBeInTheDocument();
	});

	test("Should handle middle page when not first or last", () => {
		// Arrange
		const pagination = createMockPagination({
			currentPage: 3,
			totalPages: 5,
			canPreviousPage: true,
			canNextPage: true,
		});

		// Act
		renderWithProvider(pagination);

		// Assert
		const prevButton = screen.getByLabelText("Página anterior");
		const nextButton = screen.getByLabelText("Página siguiente");
		expect(prevButton).not.toBeDisabled();
		expect(nextButton).not.toBeDisabled();
	});

	test("Should handle two pages when minimal pagination", () => {
		// Arrange
		const pagination = createMockPagination({
			currentPage: 1,
			totalPages: 2,
			totalItems: 15,
		});

		// Act
		renderWithProvider(pagination);

		// Assert
		const prevButton = screen.getByLabelText("Página anterior");
		const nextButton = screen.getByLabelText("Página siguiente");
		expect(prevButton).toBeInTheDocument();
		expect(nextButton).toBeInTheDocument();
	});

	test("Should handle large page count when many pages", () => {
		// Arrange
		const pagination = createMockPagination({
			currentPage: 5,
			totalPages: 100,
			totalItems: 1000,
		});

		// Act
		renderWithProvider(pagination);

		// Assert
		const prevButton = screen.getByLabelText("Página anterior");
		const nextButton = screen.getByLabelText("Página siguiente");
		expect(prevButton).toBeInTheDocument();
		expect(nextButton).toBeInTheDocument();
	});

	test("Should use correct page size when rendering", () => {
		// Arrange
		const pagination = createMockPagination({
			pageSize: 25,
			totalItems: 100,
			totalPages: 4,
		});

		// Act
		renderWithProvider(pagination);

		// Assert - Pagination buttons should be present
		expect(screen.getByRole("button", { name: "Página anterior" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Página siguiente" })).toBeInTheDocument();
	});
});
