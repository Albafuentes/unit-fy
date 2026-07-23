import React from "react";
import { Button } from "../../Button/Button";

export type MenuItemProps = { children: React.ReactNode } & {
	value: string;
	action?: (value: string) => void;
	as?: keyof React.JSX.IntrinsicElements;
};

export const DEFAULT_ELEMENT = "p";

const MenuItem = ({ children, value, action, as }: MenuItemProps) => {
	const props = {
		...((as === "button" || as === "a") && action
			? { onClick: () => action(value) }
			: {}),
	};

	const Element = () => {
		switch (as) {
			case "button":
				return <Button {...props}>{children}</Button>;
			// Add more cases here for other elements if needed
			default:
				return React.createElement(as ?? DEFAULT_ELEMENT, props, children);
		}
	};
	return <li>{<Element />}</li>;
};

export default MenuItem;
MenuItem.displayName = "Menu.Item";
