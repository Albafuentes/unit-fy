import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { fn } from "storybook/test";
import { Pagination } from "./components";
import Table from "./index";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: "Table",
	component: Table.Provider,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "padded",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
	args: { onRowClick: fn() },
} satisfies Meta<typeof Table.Provider>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
	args: {
		config: [
			{ accessorKey: "rawString", isSortable: true },
			{ accessorKey: "rawNumber" },
			{ accessorKey: "rawEmpty", header: "Vacío → -" },
			{ accessorKey: "rawNull", header: "Null → -" },
			{ accessorKey: "rawObject" },
			{ accessorKey: "rawArray" },
			{ accessorKey: "colDate", header: "date", renderType: "date" as const },
			{ accessorKey: "colByte", header: "byte", renderType: "byte" as const },
			{
				accessorKey: "colBoolean",
				header: "boolean",
				renderType: "boolean" as const,
			},
			{
				accessorKey: "colNumber",
				header: "number",
				renderType: "number" as const,
			},
			{
				accessorKey: "colPercent",
				header: "%",
				renderType: "number-percent" as const,
			},
			{
				accessorKey: "colCurrency",
				header: "$",
				renderType: "number-currency" as const,
			},
			{
				accessorKey: "colDateTime",
				header: "date-time",
				renderType: "date-time" as const,
			},
			{
				accessorKey: "colBadge",
				header: "badge",
				renderType: "badge" as const,
			},
			{
				accessorKey: "colCustom",
				header: "Custom",
				cell: (value: unknown) =>
					React.createElement("strong", null, String(value)),
			},
		],
		data: [
			{
				rawString: crypto.randomUUID(),
				rawNumber: 3.14159,
				rawEmpty: "",
				rawNull: null,
				rawObject: { id: 1 },
				rawArray: [10, 20],

				colDate: "2024-06-15",
				colByte: 1536,
				colBoolean: true,
				colNumber: -42,
				colPercent: 0.875,
				colCurrency: 1999.5,
				colDateTime: "2024-06-15T14:30:00Z",
				colBadge: "active",
				colCustom: "Cualquier cosa",
			},
			{
				rawString: crypto.randomUUID(),
				rawNumber: 3.14159,
				rawEmpty: "",
				rawNull: null,
				rawObject: { id: 1 },
				rawArray: [10, 20],

				colDate: "2024-06-15",
				colByte: 1536,
				colBoolean: true,
				colNumber: -42,
				colPercent: 0.875,
				colCurrency: 1999.5,
				colDateTime: "2024-06-15T14:30:00Z",
				colBadge: "active",
				colCustom: "Cualquier cosa",
			},
		],
	},
};

export const Empty: Story = {
	args: {
		config: [
			{ accessorKey: "id", header: "ID" },
			{ accessorKey: "name", header: "Name" },
		],
		data: [],
	},
};

export const TableWithPagination: Story = {
	args: {
		config: [
			{ accessorKey: "rawString", isSortable: true },
			{ accessorKey: "rawNumber" },
			{ accessorKey: "rawEmpty", header: "Vacío → -" },
			{ accessorKey: "rawNull", header: "Null → -" },
			{ accessorKey: "rawObject" },
			{ accessorKey: "rawArray" },
			{ accessorKey: "colDate", header: "date", renderType: "date" as const },
			{ accessorKey: "colByte", header: "byte", renderType: "byte" as const },
			{
				accessorKey: "colBoolean",
				header: "boolean",
				renderType: "boolean" as const,
			},
			{
				accessorKey: "colNumber",
				header: "number",
				renderType: "number" as const,
			},
			{
				accessorKey: "colPercent",
				header: "%",
				renderType: "number-percent" as const,
			},
			{
				accessorKey: "colCurrency",
				header: "$",
				renderType: "number-currency" as const,
			},
			{
				accessorKey: "colDateTime",
				header: "date-time",
				renderType: "date-time" as const,
			},
			{
				accessorKey: "colBadge",
				header: "badge",
				renderType: "badge" as const,
			},
			{
				accessorKey: "colCustom",
				header: "Custom",
				cell: (value: unknown) =>
					React.createElement("strong", null, String(value)),
			},
		],
		data: Array.from({ length: 80 }).map((_, index) => ({
			rawString: index,
			rawNumber: 3.14159,
			rawEmpty: "",
			rawNull: null,
			rawObject: { id: 1 },
			rawArray: [10, 20],

			colDate: "2024-06-15",
			colByte: 1536,
			colBoolean: true,
			colNumber: -42,
			colPercent: 0.875,
			colCurrency: 1999.5,
			colDateTime: "2024-06-15T14:30:00Z",
			colBadge: "active",
			colCustom: "Cualquier cosa",
		})),
		children: [
			React.createElement(Pagination, {
				currentPage: 1,
				totalPages: 80,
				pageSize: 10,
			} as React.ComponentProps<typeof Pagination>),
		],
	},
};
