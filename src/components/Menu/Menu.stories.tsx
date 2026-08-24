import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import type { MenuItemProps } from "./components/MenuItem";
import Menu from "./index";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: "Menu",
	component: Menu.Provider,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "padded",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
	args: {},
} satisfies Meta<typeof Menu.Provider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: [
			React.createElement(Menu.Trigger, null, "Open menu"),
			React.createElement(Menu.Content, null, [
				React.createElement<MenuItemProps>(
					Menu.Item,
					{
						action: () => console.log("Item 1 clicked"),
					},
					"Item 1",
				),
				React.createElement(
					Menu.Item,
					{
						as: "a",
						href: "https://example.com",
					},
					"Item 2",
				),
				React.createElement(
					Menu.Item,
					{
						as: "input",
						action: () => console.log("Item 1 clicked"),
					},
					"Item 3",
				),
			]),
		],
	},
};

export const Empty: Story = {
	args: {
		children: [
			React.createElement(Menu.Trigger, null, "Open menu"),
			React.createElement(Menu.Content, null, "Menu content"),
		],
	},
};
