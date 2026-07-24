import type React from "react";
import { Button, type ButtonProps } from "../../Button/Button";

export type MenuItemProps<T extends React.ElementType = "p"> = {
    as?: T;
    children?: React.ReactNode;
    action?: () => void;
    withSeparator?: boolean;
} & (T extends typeof Button
    ? Omit<ButtonProps, "as" | "children" | "action" | "onClick">
    : Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "action">);

export const DEFAULT_ELEMENT = "p";

const MenuItem = <T extends React.ElementType = "p">(
	props: MenuItemProps<T>,
) => {
	const { children, as, withSeparator, ...rest } = props;
	const Component = as ?? "p";

	const handleClick = () => {
		if (props.action) {
			props.action();
		}
	};

	if (Component === Button) {
		    const buttonProps = rest as Omit<ButtonProps, "children" | "onClick">;
		return (
			<li
				className={`menu-item-button ${withSeparator ? "menu-item--with-separator" : ""}`}
			>
				<Button
					{...buttonProps}
					onClick={handleClick}
				>
					{children}
				</Button>
			</li>
		);
	}

	if (Component === "input") {
		return (
			<li
				className={`menu-item-button ${withSeparator ? "menu-item--with-separator" : ""}`}
			>
				<input
					{...(rest as React.ComponentProps<"input">)}
					onBlur={handleClick}
				/>
			</li>
		);
	}

	return (
		<li
			className={`menu-item-button ${withSeparator ? "menu-item--with-separator" : ""}`}
		>
			<Component {...(rest as any)} onClick={handleClick}>
				{children}
			</Component>
		</li>
	);
};

export default MenuItem;
MenuItem.displayName = "Menu.Item";
