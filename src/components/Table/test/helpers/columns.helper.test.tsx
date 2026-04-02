import { describe, expect, test, vi } from "vitest";
import { buildColumns } from "../../helpers/columns.helper";

import type { Table } from "../../types/table.types";

type MockData = {
	id: string;
	fileUrl: string;
	status: string;
};

describe("Should create a correct table column when execute Table.helper", () => {
	const renderFunction = vi.fn();

	test.each([
		[
			undefined, //without config
			[
				{
					headerCell: "id",
					key: "id",
				},
				{
					headerCell: "fileUrl", 
					key: "fileUrl",
				},
				{
					headerCell: "status",
					key: "status",
				},
			] as Table.Column<MockData>[],
		],
		[
			//with colSpan, minWidth, maxWidth config
			[
				{
					key: "id" as const,
					headerCell: "id",
				},
				{
					key: "fileUrl" as const,
					headerCell: "fileUrl",
				},
				{
					key: "status" as const,
					colSpan: 2,
					headerCell: "State Animal",
					minWidth: "10rem",
					maxWidth: "20rem",
				},
			] as Table.ColumnConfig<{
				id: string;
				fileUrl: string;
				status: string;
			}>[],
			[
				{
					headerCell: "id",
					key: "id",
				},
				{
					headerCell: "fileUrl",
					key: "fileUrl",
				},
				{
					key: "status",
					colSpan: 2,
					headerCell: "State Animal",
					minWidth: "10rem",
					maxWidth: "20rem",
				},
			] as Table.Column<MockData>[],
		],
		[
			// with hideColumns
			[
				{
					key: "id" as const,
					headerCell: "id",
					hide: true,
				},
				{
					key: "fileUrl" as const,
					headerCell: "fileUrl",
				},
				{
					key: "status" as const,
					headerCell: "status",
				},
			] as Table.ColumnConfig<{
				id: string;
				fileUrl: string;
				status: string;
			}>[],
			[
				{
					headerCell: "fileUrl",
					key: "fileUrl",
				},
				{
					headerCell: "status",
					key: "status",
				},
			] as Table.Column<MockData>[],
		],
		[
			// with render
			[
				{
					key: "id" as const,
					headerCell: "id",
					render: renderFunction,
				},
				{
					key: "fileUrl" as const,
					headerCell: "fileUrl",
					render: renderFunction,
				},
				{
					key: "status" as const,
					headerCell: "status",
					render: renderFunction,
				},
			] as Table.ColumnConfig<{
				id: string;
				fileUrl: string;
				status: string;
			}>[],
			[
				{
					headerCell: "id",
					key: "id" as const,
					render: renderFunction,
				},
				{
					headerCell: "fileUrl",
					key: "fileUrl" as const,
					render: renderFunction,
				},
				{
					headerCell: "status",
					key: "status" as const,
					render: renderFunction,
				},
			] as Table.Column<MockData>[],
		],
		[
			// with partial config - should include missing columns automatically
			[
				{
					key: "id" as const,
					headerCell: "ID",
					hide: true,
				},
				{
					key: "status" as const,
					headerCell: "Estado",
				},
			] as Table.ColumnConfig<{
				id: string;
				fileUrl: string;
				status: string;
			}>[],
			[
				{
					headerCell: "Estado",
					key: "status",
				},
				{
					headerCell: "fileUrl",
					key: "fileUrl",
				},
			] as Table.Column<MockData>[],
		],
	])('"%s" -> "%s"', (config:
		| Table.ColumnConfig<{ id: string; fileUrl: string; status: string }>[]
		| undefined, expected: Table.Column<MockData>[]) => {
		expect(
			buildColumns(
				[
					{ id: "a", fileUrl: "b", status: "c" },
					{ id: "a2", fileUrl: "b2", status: "c2" },
					{ id: "a3", fileUrl: "b3", status: "c3" },
				],
				config,
			),
		).toStrictEqual(expected);
	});
});
