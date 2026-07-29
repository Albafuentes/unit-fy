/** biome-ignore-all lint/suspicious/noExplicitAny: The use of 'any' is intentional for testing purposes */
import { act, cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import type { HideColumnState } from "../hooks";
import HideColumns from "./HideColumn";

describe("HideColumn--component", () => {
	afterEach(() => {
		cleanup();
	});

	const hideColumnState: HideColumnState<any> = {
		action: vi.fn(),
		reset: vi.fn(),
	};

	const config = [
		{
			accessorKey: "name",
			header: "Name",
			isHidable: true,
		},
		{
			accessorKey: "age",
			header: "Age",
			isHidable: true,
		},
	];

	const parsedColumns = [
		{
			accessorKey: "name",
			header: "Name",
			isHidable: true,
		},
	];

	const hideColumnProps = {
		hideColumnState: hideColumnState,
		config: config,
		parsedColumns: parsedColumns,
	};

	test("should render correctly when compiles", async () => {
		const { getByRole } = await render(<HideColumns {...hideColumnProps} />);

		expect(getByRole("button", { name: "Column Visibility" })).toBeTruthy();
	});

	test("should execute the action function when a column is toggled", async () => {
		const screen = await render(<HideColumns {...hideColumnProps} />);

		const triggerButton = screen.getByRole("button", {
			name: "Column Visibility",
		});
		act(() => {
			triggerButton.click();
		});

		const nameCheckbox = screen.getByLabelText("Show name");
		act(() => {
			nameCheckbox.click();
		});

		await waitFor(() => {
			expect(hideColumnState.action).toHaveBeenCalledWith(["name"], false);
		});
	});
});
