import MenuContent from "./components/MenuContent";
import MenuItem from "./components/MenuItem";
import MenuTrigger from "./components/MenuTrigger";
import MenuProvider, { type MenuProviderProps } from "./Menu";

// Crear el objeto menu con sus sub-componentes
const Menu = {
	Provider: MenuProvider,
	Item: MenuItem,
	Trigger: MenuTrigger,
    Content: MenuContent,
};

// Adjuntar los sub-componentes
Menu.Provider = MenuProvider;
Menu.Item = MenuItem;
Menu.Trigger = MenuTrigger;
Menu.Content = MenuContent;

export default Menu;
export { MenuProvider, type MenuProviderProps };
