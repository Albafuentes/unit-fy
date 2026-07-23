import { createElement, type JSX } from "react";

export type MenuItemProps = { children: React.ReactNode } & {
	value: string;
	action?: (value: string) => void;
	as?: keyof JSX.IntrinsicElements;
};

const MenuItem = ({
	children,
	value,
	action,
	as = "button",
}: MenuItemProps) => {
	return (
		<li>
			{createElement(
				as,
				{
					...((as === "button" || as === "a") && action
						? { onClick: () => action(value) }
						: {}),
				},
				children,
			)}
		</li>
	);
};

export default MenuItem;
MenuItem.displayName = "Menu.Item";
