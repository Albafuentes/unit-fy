import type React from "react";
import { Button, type ButtonProps } from "../../Button/Button";


export type MenuItemProps<T extends React.ElementType = "p"> = {
    as?: T;
    children?: React.ReactNode;
    action?: () => void;
} & Omit<
    React.ComponentPropsWithoutRef<T>,
    "as" | "children" | "action"
>;

export const DEFAULT_ELEMENT = "p";

const MenuItem = <T extends React.ElementType = "p">(props: MenuItemProps<T>) => {
	const { children, as, ...rest } = props;
	const Component = as ?? "p";

	const handleClick = () => {
		if (props.action) {
			props.action();
		}
	};

	if (Component === Button) {
		return (
			<li>
				<Button
					{...("variant" in rest && {
						variant: rest?.variant as ButtonProps["variant"],
					})}
					{...("backgroundColor" in rest && {
						backgroundColor:
							rest?.backgroundColor as ButtonProps["backgroundColor"],
					})}
					{...("size" in rest && { size: rest?.size as ButtonProps["size"] })}
					onClick={handleClick}
				>
					{children}
				</Button>
			</li>
		);
	}

	// if (Component === "a") {
	// 	return (
	// 		<li>
	// 			<a
	// 				href={"href" in rest ? `${rest.href}` : "#"}
	// 				{...(rest as React.ComponentProps<"a">)}
	// 			>
	// 				{children}
	// 			</a>
	// 		</li>
	// 	);
	// }

	if (Component === "input") {
		return (
			<li>
				<input
					{...(rest as React.ComponentProps<"input">)}
					onBlur={handleClick}
				/>
			</li>
		);
	}

	return (
		<li>
			<Component {...(rest as any)} onClick={handleClick}>
				{children}
			</Component>
		</li>
	);
};

export default MenuItem;
MenuItem.displayName = "Menu.Item";
