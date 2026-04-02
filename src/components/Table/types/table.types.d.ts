export namespace Table {
    // Column interface
    interface Column<T = object> {
        headerCell: string;
        key: keyof T;
        colSpan?: number;
        minWidth?: string;
        maxWidth?: string;
        sortable?: boolean | SortFunction<T>;
        render?: (_cellData: T[keyof T], _colIndex: number, _rowData: T) => React.JSX.Element; // shows custom element if you need, if render is undefined the table shows data.
        divideY?: boolean; // Whether to divide the column by the value of the cell (optional)
    }

    // Cell type interface
    type CellType = "date" | "byte" | "boolean" | "number" | "number-percent" | "number-currency" | "number-unit" | "status";

    export type ColumnConfig<T extends object> = Column<T> & {
        hide?: boolean; // Whether to hide this column (optional, defaults to false)
        renderType?: CellType; // Type of renderer to use automatically (optional)
    };

    // Pagination interface
    interface Pagination {
        initialData?: T[];
        options?: PaginationOptions;
    }

    interface PaginationOptions {
        pageSize?: number;
        initialPage?: number;
    }

    // Sort direction interface
    export type SortDirection = "asc" | "desc";
}