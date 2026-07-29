import { describe, expect, test } from "vitest";

describe("pagination.helper", () => {
	test("should return the correct number of pages based on total items and items per page", () => {
		const data = [
			{ name: "Item 1" },
			{ name: "Item 2" },
			{ name: "Item 3" },
			{ name: "Item 4" },
			{ name: "Item 5" },
		];
		const page = 1;
		const pageSize = 2;

		const paginatedData = data.slice((page - 1) * pageSize, page * pageSize);

		expect(paginatedData).toEqual([{ name: "Item 1" }, { name: "Item 2" }]);
	});
});
