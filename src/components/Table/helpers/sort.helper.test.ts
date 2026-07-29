/** biome-ignore-all lint/suspicious/noExplicitAny: The use of 'any' is intentional for testing purposes */
import { cleanup } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { SortDirectionEnum } from "../types/table.types";
import { compareValues, sortedData } from "./sort.helper";

vi.mock("../../../helpers/format.helper", () => ({
	getLocale: () => "en-US",
	isAValidDate: (value: string) => /^\d{4}-\d{2}-\d{2}/.test(value),
}));

describe("sort--helper", () => {
	afterEach(() => {
		cleanup();
		vi.clearAllMocks();
	});

	const data: any[] = [
		{ id: 3, name: "Charlie" },
		{ id: 1, name: "Alice" },
		{ id: 2, name: "Bob" },
	];

	test.each([
		[{ a: null, b: "algo", direction: SortDirectionEnum.Asc }, 1],
		[{ a: undefined, b: "algo", direction: SortDirectionEnum.Asc }, 1],
		[{ a: "algo", b: null, direction: SortDirectionEnum.Asc }, -1],
		[{ a: "algo", b: undefined, direction: SortDirectionEnum.Asc }, -1],
	])("should compare values correctly when the values are null or undefined", (input, output) => {
		expect(compareValues(input.a, input.b, input.direction)).toBe(output);
	});

	test("should order correctly ascending when comparing numbers", () => {
		expect(compareValues(1, 2, SortDirectionEnum.Asc)).toBeLessThan(0);
		expect(compareValues(2, 1, SortDirectionEnum.Asc)).toBeGreaterThan(0);
		expect(compareValues(5, 5, SortDirectionEnum.Asc)).toBe(0);
	});

	test("should order correctly descending when comparing numbers", () => {
		expect(compareValues(1, 2, SortDirectionEnum.Desc)).toBeGreaterThan(0);
		expect(compareValues(2, 1, SortDirectionEnum.Desc)).toBeLessThan(0);
	});

	test("should detect numeric strings when comparing them as numbers", () => {
		expect(compareValues("2", "10", SortDirectionEnum.Asc)).toBeLessThan(0);
		expect(compareValues("10", "2", SortDirectionEnum.Asc)).toBeGreaterThan(0);
	});

	test("should order correctly ascending when comparing dates", () => {
		const older = new Date("2020-01-01");
		const newer = new Date("2023-01-01");

		expect(compareValues(older, newer, SortDirectionEnum.Asc)).toBeLessThan(0);
		expect(compareValues(newer, older, SortDirectionEnum.Asc)).toBeGreaterThan(
			0,
		);
	});

	test("should order correctly descending when comparing dates", () => {
		const older = new Date("2020-01-01");
		const newer = new Date("2023-01-01");

		expect(compareValues(older, newer, SortDirectionEnum.Desc)).toBeGreaterThan(
			0,
		);
	});

	test("should detect ISO dates when comparing them as dates", () => {
		expect(
			compareValues("2020-01-01", "2023-01-01", SortDirectionEnum.Asc),
		).toBeLessThan(0);
		expect(
			compareValues("2023-01-01", "2020-01-01", SortDirectionEnum.Desc),
		).toBeLessThan(0);
	});

	test("should order correctly ascending when comparing strings", () => {
		expect(compareValues("ana", "beto", SortDirectionEnum.Asc)).toBeLessThan(0);
	});

	test("should order correctly descending when comparing strings", () => {
		expect(
			compareValues("ana", "beto", SortDirectionEnum.Desc),
		).toBeGreaterThan(0);
	});

	test("should ignore upper case and accents when comparing strings", () => {
		expect(compareValues("Ana", "ana", SortDirectionEnum.Asc)).toBe(0);
		expect(compareValues("Álvaro", "Alvaro", SortDirectionEnum.Asc)).toBe(0);
	});

	test.each([
		[{ direction: SortDirectionEnum.Asc, keyAccessor: "id" }, [1, 2, 3]],
		[{ direction: SortDirectionEnum.Desc, keyAccessor: "id" }, [3, 2, 1]],
		[
			{ direction: SortDirectionEnum.Asc, keyAccessor: "name" },
			["Alice", "Bob", "Charlie"],
		],
	])("should order with SortDirectionEnum correctly when execute sortedData", (input, output) => {
		const result = sortedData(input.direction, input.keyAccessor, data);
		expect(result.map((item) => item[input.keyAccessor])).toEqual(output);
	});

	test("should not mutate the original array when sorting", () => {
		const original = [...data];
		sortedData(SortDirectionEnum.Asc, "id", data);

		expect(data).toEqual(original);
	});

	test("should return the same data unsorted when no direction is passed", () => {
		// @ts-expect-error probamos el guard con valor falsy
		const result = sortedData(undefined, "id", data);

		expect(result).toBe(data);
	});

	test("should return the same data unsorted when no keyAccessor is passed", () => {
		// @ts-expect-error probamos el guard con valor falsy
		const result = sortedData(SortDirectionEnum.Asc, undefined, data);

		expect(result).toBe(data);
	});
});
