/** biome-ignore-all lint/suspicious/noExplicitAny: The use of 'any' is intentional for testing purposes */
import { cleanup } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";
import type { TableTypes } from "../types/table.types";
import { buildColumns } from "./columns.helper";

describe("columns-helper", () => {
	afterEach(() => {
		cleanup();
	});
	test("should return an empty column by default if there is no config", () => {
		const result = buildColumns<any>([]);

		expect(result).toEqual([{ header: "", accessorKey: "" }]);
	});

	test("should build columns from the config, using accessorKey as header if header is not defined", () => {
		const config: TableTypes.Column<any>[] = [
			{ accessorKey: "name" },
			{ accessorKey: "age", header: "Edad" },
		];

		const result = buildColumns<any>([], config);

		expect(result).toEqual([
			{ header: "name", accessorKey: "name" },
			{ header: "Edad", accessorKey: "age" },
		]);
	});

	test("should filter columns from the config marked with isVisible: false", () => {
		const config: TableTypes.Column<any>[] = [
			{ accessorKey: "name" },
			{ accessorKey: "age", isVisible: false },
		];

		const result = buildColumns<any>([], config);

		expect(result).toEqual([{ header: "name", accessorKey: "name" }]);
	});

	test("genera una columna por cada key del primer elemento de data", () => {
		const data: any[] = [{ name: "Ana", age: 30, email: "ana@test.com" }];

		const result = buildColumns<any>(data);

		expect(result).toEqual([
			{ header: "name", accessorKey: "name" },
			{ header: "age", accessorKey: "age" },
			{ header: "email", accessorKey: "email" },
		]);
	});

	test("should use the columns from the config respecting their order and add at the end the keys from data that are missing in the config", () => {
		const data: any[] = [{ name: "Ana", age: 30, email: "ana@test.com" }];
		const config: TableTypes.Column<any>[] = [
			{ accessorKey: "email", header: "Correo" },
			{ accessorKey: "name" },
		];

		const result = buildColumns<any>(data, config);

		expect(result).toEqual([
			{ header: "Correo", accessorKey: "email" },
			{ header: "name", accessorKey: "name" },
			{ header: "age", accessorKey: "age" },
		]);
	});

	test("should exclude columns with isVisible: false from the config, but still exclude them from the default columns (because they remain in configKeys)", () => {
		const data: any[] = [{ name: "Ana", age: 30, email: "ana@test.com" }];
		const config: TableTypes.Column<any>[] = [
			{ accessorKey: "name" },
			{ accessorKey: "age", isVisible: false },
		];

		const result = buildColumns<any>(data, config);

		expect(result).toEqual([
			{ header: "name", accessorKey: "name" },
			{ header: "email", accessorKey: "email" },
		]);
	});

	test("should not generate a default column for the key 'internalId' even if it exists in data", () => {
		const data: any[] = [
			{ internalId: "1", name: "Ana", age: 30, email: "ana@test.com" },
		];
		const config: TableTypes.Column<any>[] = [{ accessorKey: "name" }];

		const result = buildColumns<any>(data, config);

		expect(result).toEqual([
			{ header: "name", accessorKey: "name" },
			{ header: "age", accessorKey: "age" },
			{ header: "email", accessorKey: "email" },
		]);
	});

	test("should include only the optional properties that were explicitly defined in the config", () => {
		const data: any[] = [{ name: "Ana", age: 30, email: "ana@test.com" }];
		const cellFn = (_cellData: any, _colIndex: number, _rowData: any) => (
			<p>"custom-cell"</p>
		);
		const config: TableTypes.Column<any>[] = [
			{
				accessorKey: "name",
				isSortable: true,
				align: "center",
				colSpan: 2,
				minWidth: "100px",
				maxWidth: "300px",
				divideY: true,
				isHidable: false,
				cell: cellFn,
			},
			{ accessorKey: "age" },
		];

		const result = buildColumns<any>(data, config);

		expect(result[0]).toEqual({
			header: "name",
			accessorKey: "name",
			isSortable: true,
			align: "center",
			colSpan: 2,
			minWidth: "100px",
			maxWidth: "300px",
			divideY: true,
			isHidable: false,
			cell: cellFn,
		});

		// La columna sin propiedades opcionales no debe incluir ninguna de esas keys
		expect(result[1]).toEqual({ header: "age", accessorKey: "age" });
		expect(result[1]).not.toHaveProperty("isSortable");
		expect(result[1]).not.toHaveProperty("cell");
	});

	test("should behave as if there is no config when config is an empty array (uses all keys from data)", () => {
		const data: any[] = [{ name: "Ana", age: 30, email: "ana@test.com" }];

		const result = buildColumns<any>(data, []);

		expect(result).toEqual([
			{ header: "name", accessorKey: "name" },
			{ header: "age", accessorKey: "age" },
			{ header: "email", accessorKey: "email" },
		]);
	});
});
