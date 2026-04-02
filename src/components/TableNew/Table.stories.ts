import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { fn } from "storybook/test";
import Table from "./Table";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: "Table",
	component: Table,
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
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
	args: {
		config: [
			{ key: "rawString" },
			{ key: "rawNumber" },
			{ key: "rawEmpty", headerCell: "Vacío → -" },
			{ key: "rawNull", headerCell: "Null → -" },
			{ key: "rawObject" },
			{ key: "rawArray" },
			{ key: "colDate", headerCell: "date", renderType: "date" as const },
			{ key: "colByte", headerCell: "byte", renderType: "byte" as const },
			{
				key: "colBoolean",
				headerCell: "boolean",
				renderType: "boolean" as const,
			},
			{ key: "colNumber", headerCell: "number", renderType: "number" as const },
			{
				key: "colPercent",
				headerCell: "%",
				renderType: "number-percent" as const,
			},
			{
				key: "colCurrency",
				headerCell: "$",
				renderType: "number-currency" as const,
			},
			{
				key: "colDateTime",
				headerCell: "date-time",
				renderType: "date-time" as const,
			},
			{
				key: "colBadge",
				headerCell: "badge",
				renderType: "badge" as const,
			},
			{
				key: "colCustom",
				headerCell: "Custom",
				render: (value) => React.createElement("strong", null, String(value)),
			},
		],
		data: [
			{
				rawString: "Texto plano",
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
				rawString: "Texto plano",
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
			{ key: "id", headerCell: "ID" },
			{ key: "name", headerCell: "Name" },
		],
		data: [],
	},
};
