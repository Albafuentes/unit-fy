export type MenuContentProps = React.DetailedHTMLProps<
	React.MenuHTMLAttributes<HTMLElement>,
	HTMLElement
> & {
	children: React.ReactNode;
	"position-anchor"?: string;
	id?: string;
	placement?: "right-start" | "right-end" | "left-start" | "left-end";
	size?: "sm" | "md" | "lg";
};
const MenuContent = ({
	children,
	"position-anchor": positionAnchor,
	id,
	placement: position = "left-end",
	size = "md",
	...props
}: MenuContentProps) => {
	return (
		<menu
			id={id}
			popover="auto"
			aria-label="popover"
			position-anchor={positionAnchor}
			className={`${props.className ?? ""} menu-content--${position} menu-content--${size}`}
			{...props}
		>
			{children}
		</menu>
	);
};

export default MenuContent;
MenuContent.displayName = "Menu.Content";
