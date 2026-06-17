import type React from "react";
import { formatDataToCellType } from "./format.helper";
import { Table } from "../types/table.types";

export const buildColumns = <T extends object>(data: T[], config?: Table.ColumnConfig<T>[]): Table.Column<T>[] => {
    if (data.length <= 0)
        return !config
            ? ([{ headerCell: "", key: "" }] as Table.Column<T>[])
            : (config
                  .filter((columnConfig) => !columnConfig.hide)
                  .map((columnConfig) => ({
                      headerCell: columnConfig.headerCell ?? columnConfig.key as string,
                      key: columnConfig.key as string,
                  })) as Table.Column<T>[]);

    const allDataKeys = Object.keys(data[0]) as (keyof T)[];

    // If config is provided, use it to define columns and add missing ones
    if (config && config.length > 0) {
        const configKeys = new Set(config.map((columnConfig) => columnConfig.key));

        // Get columns from config (excluding hidden ones)
        const configColumns: Table.Column<T>[] = config
            .filter((columnConfig) => !columnConfig.hide)
            .map((columnConfig) => {
                // Determine render function: use explicit render if provided, otherwise use renderType
                let renderFunction: ((cellData: T[keyof T], colIndex: number, rowData: T) => React.JSX.Element) | undefined;

                if (columnConfig.render) {
                    // Explicit render function takes precedence
                    renderFunction = columnConfig.render;
                } else if (columnConfig.renderType) {
                    // Use renderer based on renderType
                    renderFunction = formatDataToCellType(columnConfig.renderType);
                }

                const column: Table.Column<T> = {
                    headerCell: columnConfig.headerCell ?? columnConfig.key as string,
                    key: columnConfig.key,
                    ...(columnConfig.colSpan !== undefined ? { colSpan: columnConfig.colSpan } : {}),
                    ...(columnConfig.minWidth !== undefined ? { minWidth: columnConfig.minWidth } : {}),
                    ...(columnConfig.maxWidth !== undefined ? { maxWidth: columnConfig.maxWidth } : {}),
                    ...(columnConfig.sortable !== undefined ? { sortable: columnConfig.sortable } : {}),
                    ...(columnConfig.divideY !== undefined ? { divideY: columnConfig.divideY } : {}),
                    ...(renderFunction !== undefined ? { render: renderFunction } : {}),
                };

                return column;
            });

        // Get keys that are in data but not in config
        const missingKeys = allDataKeys.filter((key) => !configKeys.has(key));

        // Add default columns for keys not in config
        const defaultColumns: Table.Column<T>[] = missingKeys.map((key: keyof T) => ({
            headerCell: key as string,
            key: key,
        }));

        // Combine config columns (with their order) and default columns
        return [...configColumns, ...defaultColumns];
    }

    // If no config provided, use all keys from data
    const columns: Table.Column<T>[] = allDataKeys.map((key: keyof T) => ({
        headerCell: key as string,
        key: key,
    }));

    return columns;
};