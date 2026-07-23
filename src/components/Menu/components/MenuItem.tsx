import React from "react";
import { Button } from "../../Button/Button";

export type MenuItemProps = { children: React.ReactNode } & {
	value: string;
	action?: (value: string) => void;
	as?: keyof React.JSX.IntrinsicElements;
};

const MenuItem = ({ children, value, action, as }: MenuItemProps) => {
	const props = {
		...((as === "button" || as === "a") && action
			? { onClick: () => action(value) }
			: {}),
	};
	return (
		<li>
			{as === "button" ? (
				<Button {...props}>{children}</Button>
			) : (
				React.createElement(as ?? "button", props, children)
			)}
		</li>
	);
};

export default MenuItem;
MenuItem.displayName = "Menu.Item";
