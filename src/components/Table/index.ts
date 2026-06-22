import {Table as TableComponent} from "./components";
import type { TableProviderProps } from "./TableProvider";
import TableProvider from "./TableProvider";

type TableWithProvider = typeof TableComponent & {
	Provider: typeof TableProvider;
};

const Table = TableComponent as TableWithProvider;
Table.Provider = TableProvider;

export default Table;
export { TableProvider, type TableProviderProps };
