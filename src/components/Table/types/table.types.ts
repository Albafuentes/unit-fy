import type { JSX } from "react";

export enum SortDirectionEnum {
	Asc = "asc",
	Desc = "desc",
}

export namespace TableTypes {
	export type CellType =
		| "date"
		| "date-time"
		| "byte"
		| "boolean"
		| "number"
		| "number-percent"
		| "number-currency"
		| "badge";

	export type SortDirection = SortDirectionEnum | null;

	export type Column<T = object> = {
		accessorKey: keyof T;

		//customization
		renderType?: CellType; // Type of renderer to use automatically (optional)
		header?: string | JSX.Element;
		cell?: (
			_cellData: T[keyof T],
			_colIndex: number,
			_rowData: T,
		) => React.JSX.Element; // shows custom element if you need, if render is undefined the table shows data.

		//Styles
		colSpan?: number;
		minWidth?: string;
		maxWidth?: string;
		align?: "left" | "center" | "right";
		divideY?: boolean; // Whether to divide the column by the value of the cell (optional)
		isVisible?: boolean; // Whether to hide this column (optional, defaults to false)
		//functionality
		isSortable?: boolean; // Whether the column is sortable (optional)
		isHidable?: boolean; // Whether the column can be hidden (optional)

	};
}
