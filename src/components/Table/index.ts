import { Filter, Pagination, TableContent } from "./components";
import type { TableProviderProps } from "./TableProvider";
import TableProvider from "./TableProvider";

// Crear el objeto Table con sus sub-componentes
const Table = {
    Provider: TableProvider,
    Content: TableContent,
    Filter: Filter,
    Pagination: Pagination,
};

// Adjuntar los sub-componentes
Table.Provider = TableProvider;
Table.Content = TableContent;
Table.Filter = Filter;
Table.Pagination = Pagination;

export default Table;
export { TableProvider, type TableProviderProps };
