import type { TableTypes } from "../types/table.types";

export const buildColumns = <T extends object>(
	data: T[],
	config?: TableTypes.Column<T>[],
): TableTypes.Column<T>[] => {
	if (data.length <= 0)
		return !config
			? ([{ header: "", accessorKey: "" }] as TableTypes.Column<T>[])
			: (config
					.filter((columnConfig) => columnConfig.isVisible !== false)
					.map((columnConfig) => ({
						header: columnConfig.header ?? (columnConfig.accessorKey as string),
						accessorKey: columnConfig.accessorKey as string,
					})) as TableTypes.Column<T>[]);

	const allDataKeys = Object.keys(data[0]) as (keyof T)[];

	// If config is provided, use it to define columns and add missing ones
	if (config && config.length > 0) {
		const configKeys = new Set(
			config.map((columnConfig) => columnConfig.accessorKey),
		);

		// Get columns from config (excluding hidden ones)
		const configColumns: TableTypes.Column<T>[] = config
			.filter((columnConfig) => columnConfig.isVisible !== false)
			.map((columnConfig) => {
				const column: TableTypes.Column<T> = {
					header: columnConfig.header ?? (columnConfig.accessorKey as string),
					accessorKey: columnConfig.accessorKey,
					...(columnConfig.isSortable !== undefined
						? { isSortable: columnConfig.isSortable }
						: {}),
					...(columnConfig.align !== undefined
						? { align: columnConfig.align }
						: {}),
					...(columnConfig.colSpan !== undefined
						? { colSpan: columnConfig.colSpan }
						: {}),
					...(columnConfig.minWidth !== undefined
						? { minWidth: columnConfig.minWidth }
						: {}),
					...(columnConfig.maxWidth !== undefined
						? { maxWidth: columnConfig.maxWidth }
						: {}),
					...(columnConfig.divideY !== undefined
						? { divideY: columnConfig.divideY }
						: {}),
					...(columnConfig.isHidable !== undefined
						? { isHidable: columnConfig.isHidable }
						: {}),
					...(columnConfig.cell !== undefined
						? { cell: columnConfig.cell }
						: {}),
				};

				return column;
			});

		// Get keys that are in data but not in config
		const missingKeys = allDataKeys.filter((key) => !configKeys.has(key));

		// Add default columns for keys not in config
		const defaultColumns: TableTypes.Column<T>[] = missingKeys
			.filter((key) => key !== "internalId")
			.map((key: keyof T) => ({
				header: key as string,
				accessorKey: key,
			}));
		// Combine config columns (with their order) and default columns
		return [...configColumns, ...defaultColumns];
	}

	// If no config provided, use all keys from data
	const columns: TableTypes.Column<T>[] = allDataKeys.map((key: keyof T) => ({
		header: key as string,
		accessorKey: key,
	}));
	return columns;
};
