import "./menu.css";
import React, { isValidElement } from "react";
import type { MenuContentProps } from "./components/MenuContent";
import MenuItem, {
	DEFAULT_ELEMENT,
	type MenuItemProps,
} from "./components/MenuItem";
import MenuTrigger, { type MenuTriggerProps } from "./components/MenuTrigger";

export interface MenuProviderProps {
	children: React.ReactNode;
}

const MenuProvider = ({ children }: MenuProviderProps) => {
	const childrenArray = React.Children.toArray(children);

	const id = React.useId();

	console.log("childrenArray", id, childrenArray);

	const ItemsComponent = childrenArray.filter(
		(child) => isValidElement(child) && child.type === MenuItem,
	) as React.ReactElement<MenuItemProps>[];

	const TriggerComponent = childrenArray.find(
		(child) => isValidElement(child) && child.type === MenuTrigger,
	) as React.ReactElement<MenuTriggerProps> | undefined;

	const ContentComponent = childrenArray.find(
		(child) =>
			isValidElement(child) &&
			child.type !== MenuTrigger &&
			child.type !== MenuItem,
	) as React.ReactElement<MenuContentProps> | undefined;

	return (
		<div className="menu-container">
			{TriggerComponent &&
				React.cloneElement(TriggerComponent, {
					...TriggerComponent.props,
					popoverTarget: `menu-${id}`,
					"anchor-name": `--trigger-${id}`,
					children: TriggerComponent.props.children,
					disabled: !ContentComponent,
				})}

			{ContentComponent &&
				React.cloneElement(ContentComponent, {
					...ContentComponent.props,
					"position-anchor": `--trigger-${id}`,
					id: `menu-${id}`,
					children:
						ItemsComponent.length === 0 ? (
							<MenuItem value="noItems">No items</MenuItem>
						) : (
							ItemsComponent.map((item) => (
								<MenuItem
									key={item.props.value}
									value={item.props.value}
									action={item.props.action}
									as={item.props.as || DEFAULT_ELEMENT}
								>
									{item.props.children}
								</MenuItem>
							))
						),
				})}
		</div>
	);
};

export default MenuProvider;
MenuProvider.displayName = "Menu.Provider";
