/** biome-ignore-all lint/suspicious/noExplicitAny: The use of 'any' is intentional for testing purposes */
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import type { TableFilters } from "./Filter";
import Filter from "./Filter";

describe("Filter-component", () => {
	afterEach(() => {
		cleanup();
	});

	const filters: TableFilters<any>[] = [
		{
			keyAccessor: "name",
			render: (action, _reset) => {
				return (
					<button type="button" onClick={action}>
						name
					</button>
				);
			},
		},
		{
			keyAccessor: "age",
			render: (action, _reset) => {
				return (
					<button type="button" onClick={action}>
						age
					</button>
				);
			},
		},
		{
			keyAccessor: "",
			render: (_action, reset) => {
				return (
					<button type="button" onClick={reset}>
						reset
					</button>
				);
			},
		},
	];

	const action = vi.fn();
	const reset = vi.fn();

	const filterProps = {
		filters: filters,
		action: action,
		reset: reset,
	};

	test("should render correctly when compiles", async () => {
		const screen = await render(<Filter {...filterProps} />);

		expect(screen.getByRole("button", { name: "age" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "name" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "reset" })).toBeInTheDocument();

		expect(action).not.toHaveBeenCalled();
		expect(reset).not.toHaveBeenCalled();
	});

	test("should call reset action function when button is clicked", async () => {
		const { getByRole } = await render(<Filter {...filterProps} />);

		const button = getByRole("button", { name: "reset" });
		act(() => {
			button.click();
		});

		expect(reset).toHaveBeenCalled();
	});

	test("should call action  function when button is clicked", async () => {
		const { getByRole } = await render(<Filter {...filterProps} />);

		const button = getByRole("button", { name: "age" });
		act(() => {
			button.click();
		});

		expect(action).toHaveBeenCalled();
	});
});
