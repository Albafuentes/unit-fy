import { cleanup } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import { filteredData } from "./filter.helper";

describe("filter--helper", () => {
	afterEach(() => {
		cleanup();
	});
	test("should filter data based on the provided key and value", () => {
		const filterInput = { key: "name" as keyof (typeof data)[0], value: "bob" };
		const data = [
			{ name: "Alice", age: 25 },
			{ name: "Bob", age: 30 },
			{ name: null, age: 30 },
			{ name: "Charlie", age: 35 },
		];

		const result = filteredData(data, filterInput.key, filterInput.value);

		expect(result).toEqual([{ name: "Bob", age: 30 }]);
	});

	test("should return an empty array if no matches are found", () => {
		const filterInput = {
			key: "name" as keyof (typeof data)[0],
			value: "david",
		};
		const data = [
			{ name: "Alice", age: 25 },
			{ name: "Bob", age: 30 },
			{ name: "Charlie", age: 35 },
		];

		const result = filteredData(data, filterInput.key, filterInput.value);

		expect(result).toEqual([]);
	});

	test("should perform case-insensitive filtering", () => {
		const filterInput = {
			key: "name" as keyof (typeof data)[0],
			value: "ALICE",
		};
		const data = [
			{ name: "Alice", age: 25 },
			{ name: "Bob", age: 30 },
			{ name: "Charlie", age: 35 },
		];

		const result = filteredData(data, filterInput.key, filterInput.value);

		expect(result).toEqual([{ name: "Alice", age: 25 }]);
	});

	test("should filter based on numeric values", () => {
		const filterInput = {
			key: "age" as keyof (typeof data)[0],
			value: 30,
		};
		const data = [
			{ name: "Alice", age: 25 },
			{ name: "Bob", age: 30 },
			{ name: "Charlie", age: 35 },
		];

		const result = filteredData(data, filterInput.key, filterInput.value);

		expect(result).toEqual([{ name: "Bob", age: 30 }]);
	});
});
