import { Button, type ButtonProps } from "../../Button/Button";

export type MenuTriggerProps = ButtonProps & {
	children: React.ReactNode;
    "anchor-name"?: string;
};

const MenuTrigger = ({ children, ...props }: MenuTriggerProps) => {
	return <Button {...props}>{children}</Button>;
};

export default MenuTrigger;
MenuTrigger.displayName = "Menu.Trigger";
