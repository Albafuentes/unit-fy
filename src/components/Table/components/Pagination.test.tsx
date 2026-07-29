import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import Pagination from "./Pagination";

describe("Pagination-component", () => {
	afterEach(() => {
		cleanup();
	});

	const action = vi.fn();
	const pageSizeAction = vi.fn();

	const paginationProps = {
		currentPage: 1,
		totalPages: 10,
		pageSize: 5,
		action: action,
		pageSizeAction: pageSizeAction,
	};

	test("should render correctly when compiles", async () => {
		const { getByRole, getByText } = await render(
			<Pagination {...paginationProps} />,
		);

		expect(getByText("Page 1 of 10")).toBeTruthy();
		expect(getByRole("combobox", { name: "Rows per page" })).toBeTruthy();
		expect(getByRole("button", { name: "previous page" })).toBeTruthy();
		expect(getByRole("button", { name: "next page" })).toBeTruthy();

		const nextPageButton = getByRole("button", { name: "next page slice" });
		expect(nextPageButton).toBeTruthy();

		act(() => {
			nextPageButton.click();
		});
		expect(getByRole("button", { name: "previous page slice" })).toBeTruthy();
	});

	test("should execute the action function when a page is clicked", async () => {
		const { getByRole } = await render(<Pagination {...paginationProps} />);

		const nextPageButton = getByRole("button", { name: "next page" });
		act(() => {
			nextPageButton.click();
		});
		expect(action).toHaveBeenCalledWith(2, 5);
	});

	test("should execute the pageSizeAction function when a page size is selected", async () => {
		const { getByRole } = await render(<Pagination {...paginationProps} />);

		const pageSizeSelect = getByRole("combobox", { name: "Rows per page" });
		act(() => {
			fireEvent.change(pageSizeSelect, { target: { value: "10" } });
		});
		expect(pageSizeAction).toHaveBeenCalledWith(10);
	});
});
