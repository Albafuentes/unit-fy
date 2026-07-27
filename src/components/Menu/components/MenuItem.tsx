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
	const { children, as, withSeparator, action, ...rest } = props;
	const Component = as ?? "p";

	if (Component === Button) {
		    const buttonProps = rest as Omit<ButtonProps, "children" | "onClick">;
		return (
			<li
				className={`${withSeparator ? "menu-item--with-separator" : ""}`}
			>
				<Button
					{...buttonProps}
					onClick={action ? () => action() : undefined}
				>
					{children}
				</Button>
			</li>
		);
	}

	if (Component === "input") {
		return (
			<li
				className={`${withSeparator ? "menu-item--with-separator" : ""}`}
			>
				<label>
				<input
					{...(rest as React.ComponentProps<"input">)}
					onChange={() => {}}
					onBlur={action ? () => action() : undefined}
				/>
				{children ?? ""}
				</label>
			</li>
		);
	}

	return (
		<li
			className={`${withSeparator ? "menu-item--with-separator" : ""}`}
		>
			<Component {...(rest as any)} onClick={action ? () => action() : undefined}>
				{children}
			</Component>
		</li>
	);
};

export default MenuItem;
MenuItem.displayName = "Menu.Item";
