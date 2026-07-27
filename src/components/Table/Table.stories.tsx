import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { type JSX } from "react";
import { fn } from "storybook/test";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../Button/Button";
import Menu from "../Menu/index";
import type { FilterProps, TableFilters } from "./components/Filter";
import type { FiltersState } from "./hooks/use-table-controller.hook";
import Table from "./index";

type DataType = {
	rawString: string;
	rawNumber: number;
	rawEmpty: string;
	rawNull: null;
	rawObject: { id: number };
	rawArray: number[];

	colDate: string;
	colByte: number;
	colBoolean: boolean;
	colNumber: number;
	colPercent: number;
	colCurrency: number;
	colDateTime: string;
	colBadge: string;
	colCustom: string;
};

const DATA = Array.from({ length: 80 }).map((_, index) => ({
	rawString: uuidv4(),
	rawNumber: Number((Math.random() * 100).toFixed(2)),
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
}));

const CONFIG = [
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
];

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
		config: CONFIG,
		data: DATA,
		children: [React.createElement(Table.Content, null)],
	},
};

export const Empty: Story = {
	args: {
		config: [
			{ accessorKey: "id", header: "ID" },
			{ accessorKey: "name", header: "Name" },
		],
		data: [],
		children: [React.createElement(Table.Content, null)],
	},
};

export const TableWithPagination: Story = {
	args: {
		config: CONFIG,
		data: DATA,
		children: [
			React.createElement(Table.Content, null),
			React.createElement(Table.Pagination, {
				// Props públicas opcionales que el usuario puede pasar
				currentPage: 1,
				totalPages: 8,
				pageSize: 10,
			}),
		],
	},
};

const filterChildren = (
	action: (value: unknown) => void,
	reset: () => void,
	keyAccesor: string,
): JSX.Element => {
	const [value, setValue] = React.useState("");
	return (
		<Menu.Provider>
			<Menu.Trigger>{keyAccesor}</Menu.Trigger>
			<Menu.Content>
				<Menu.Item
					as="div"
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "start",
						alignItems: "start",
						gap: "1rem",
						paddingBlock: "0.5rem",
					}}
				>
					<label htmlFor="input">{keyAccesor} value:</label>
					<input
						id="input"
						value={value}
						onChange={(e) => setValue(e.target.value)}
						style={{ width: "100%" }}
					/>
					<div style={{ display: "flex", gap: "8px" }}>
						<Button onClick={() => action(value)}>Filter</Button>
						<Button
							onClick={() => {
								setValue("");
								reset();
							}}
						>
							Reset
						</Button>
					</div>
				</Menu.Item>
			</Menu.Content>
		</Menu.Provider>
	);
};

const FILTERS: TableFilters<DataType>[] = [
	{
		keyAccessor: "rawString",
		render: (action: (value: unknown) => void, reset: () => void) =>
			filterChildren(action, reset, "rawString"),
	},
	{
		keyAccessor: "rawNumber",
		render: (action: (value: unknown) => void, reset: () => void) =>
			filterChildren(action, reset, "rawNumber"),
	},
	{
		keyAccessor: "colCurrency",
		render: (action: (value: unknown) => void, reset: () => void) =>
			filterChildren(action, reset, "colCurrency"),
	},
	{
		keyAccessor: "colDateTime",
		render: (action: (value: unknown) => void, reset: () => void) =>
			filterChildren(action, reset, "colDateTime"),
	},
];

export const TableWithFilter: Story = {
	args: {
		config: CONFIG,
		data: DATA,
		children: [
			React.createElement<FilterProps<DataType>>(Table.Filter, {
				filters: FILTERS,
			}),
			React.createElement(Table.Content, null),
		],
	},
};
