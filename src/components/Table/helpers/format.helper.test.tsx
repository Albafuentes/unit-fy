/** biome-ignore-all lint/correctness/useJsxKeyInIterable: the test.each not requiring keys */
/** biome-ignore-all lint/suspicious/noExplicitAny: The use of 'any' is intentional for testing purposes */
import { cleanup } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import { FALLBACK } from "@/helpers/format.helper";
import type { TableTypes } from "../types/table.types";
import { formatCellToString, renderCellByType } from "./format.helper";

describe("format-helper", () => {
	afterEach(() => {
		cleanup();
	});
	test.each([
		[{ key: "value" }, "[Object]"],
		[[1, 2, 3], "[Array]"],
		[<div key="test">Test</div>, "[Custom Render]"],
		[null, FALLBACK],
		[undefined, FALLBACK],
		["", FALLBACK],
		[123, "123"],
		["test", "test"],
		[true, "true"],
	])("should return the correct string representation for various values", (input, output) => {
		expect(formatCellToString(input)).toBe(output);
	});

	test.each([
		[
			{
				renderType: "number" as TableTypes.CellType,
				cellData: Number(1000),
				colIndex: 0,
				rowIndex: 0,
			},
			<span>1,000</span>,
		],
		[
			{
				renderType: "boolean" as TableTypes.CellType,
				cellData: Boolean(true),
				colIndex: 0,
				rowIndex: 0,
			},
			<span>yes</span>,
		],
		[
			{
				renderType: "date" as TableTypes.CellType,
				cellData: "2023-01-01",
				colIndex: 0,
				rowIndex: 0,
			},
			<span>01/01/2023</span>,
		],
		[
			{
				renderType: "date-time" as TableTypes.CellType,
				cellData: "2023-01-01T12:00:00Z",
				colIndex: 0,
				rowIndex: 0,
			},
			<span>01/01/2023, 01:00 PM</span>,
		],
		[
			{
				renderType: "byte" as TableTypes.CellType,
				cellData: Number(1048576),
				colIndex: 0,
				rowIndex: 0,
			},
			<span>1,048,576 byte</span>,
		],
		[
			{
				renderType: "number-percent" as TableTypes.CellType,
				cellData: Number(0.25),
				colIndex: 0,
				rowIndex: 0,
			},
			<span>25%</span>,
		],
		[
			{
				renderType: "number-currency" as TableTypes.CellType,
				cellData: Number(1000),
				colIndex: 0,
				rowIndex: 0,
			},
			<span>$1,000.00</span>,
		],
		[
			{
				renderType: "badge" as TableTypes.CellType,
				cellData: String("New"),
				colIndex: 0,
				rowIndex: 0,
			},
			<span>New</span>,
		],
	])('should return "[Object]" for object values', (input, output) => {
		expect(
			renderCellByType<any>(
				input.renderType,
				input.cellData,
				input.colIndex,
				input.rowIndex,
			),
		).toEqual(output);
	});
});
