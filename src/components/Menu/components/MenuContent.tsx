export type MenuContentProps = React.DetailedHTMLProps<
	React.MenuHTMLAttributes<HTMLElement>,
	HTMLElement
> & {
	children: React.ReactNode;
	"position-anchor"?: string;
	placement?: "right-start" | "right-end" | "left-start" | "left-end";
};
const MenuContent = ({
	children,
	"position-anchor": positionAnchor,
	placement: position = "left-end",
}: MenuContentProps) => {
	return (
		<menu
			id="menu"
			popover="auto"
			aria-label="popover"
			position-anchor={positionAnchor}
			className={position}
		>
			{children}
		</menu>
	);
};

export default MenuContent;
MenuContent.displayName = "Menu.Content";
