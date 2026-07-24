export type MenuContentProps = React.DetailedHTMLProps<
	React.MenuHTMLAttributes<HTMLElement>,
	HTMLElement
> & {
	children: React.ReactNode;
	"position-anchor"?: string;
	id?: string;
	placement?: "right-start" | "right-end" | "left-start" | "left-end";
};
const MenuContent = ({
	children,
	"position-anchor": positionAnchor,
	id,
	placement: position = "left-end",
	...props
}: MenuContentProps) => {
	return (
		<menu
			id={id}
			popover="auto"
			aria-label="popover"
			position-anchor={positionAnchor}
			className={`${props.className ?? ""} ${position}`}
			{...props}
		>
			{children}
		</menu>
	);
};

export default MenuContent;
MenuContent.displayName = "Menu.Content";
