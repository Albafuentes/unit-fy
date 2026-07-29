import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import EmptyState from "./EmptyState";

describe("EmptyState--component", () => {
	afterEach(() => {
		cleanup();
	});

	test("should render correctly when compiles", async () => {
		const { getByText } = await render(<EmptyState colSpan={3} />);

		expect(getByText("No hay datos disponibles en este momento.")).toBeTruthy();
	});

	test("should render a correct colSpan attribute when colSpan is 1", async () => {
		const colSpan = 1;

		const screen = await render(<EmptyState colSpan={colSpan} />);
		const tdElement = screen.getByRole("cell");

		expect(tdElement).toHaveAttribute("colSpan", colSpan.toString());
	});
});
