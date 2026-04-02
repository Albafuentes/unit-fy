import React, { createElement } from "react";
import { Table } from "../types/table.types";

/**
 * Converts a cell value to a displayable string.
 * If the value is an object (not null, array, or Date), returns "[Object]".
 */
export const formatCellToString = (value: unknown): string => {
    if (value === null || value === undefined || (typeof value === "string" && value.length === 0)) {
        return "-";
    }

    if (React.isValidElement(value)) {
        return "[Custom Render]";
    }

    // Check if value is an object (but not an array or Date)
    if (typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
        return "[Object]";
    }

    // Check if value is an array
    if (Array.isArray(value)) {
        return "[Array]";
    }

    return String(value);
};


/**
 * Get renderer function based on Table.CellType
 */
export const formatDataToCellType = <T extends object>(
    renderType: Table.CellType,
): ((cellData: T[keyof T], _colIndex: number, _rowData: T) => React.JSX.Element) => {
    switch (renderType) {
        case "date":
            return (cellData: T[keyof T]) =>
                createElement(
                  "span",
                  null,
                  String(new Date(String(cellData ?? "")).toLocaleDateString()),
                );
        case "byte":
            return (cellData: T[keyof T]) =>
                createElement(
                  "span",
                  null,
                  String(cellData ?? ""),
                );
        case "boolean":
            return (cellData: T[keyof T]) =>
                createElement(
                  "span",
                  null,
                  String(cellData ?? ""),
                );
        case "number":
            return (cellData: T[keyof T]) =>
                createElement(
                  "span",
                  null,
                  String(cellData ?? ""),
                );
        case "number-percent":
                return (cellData: T[keyof T]) =>
                createElement(
                  "span",
                  null,
                  String(cellData ?? ""),
                );
        case "number-currency":
            return (cellData: T[keyof T]) =>
                createElement(
                  "span",
                  null,
                  String(cellData ?? ""),
                );
        case "number-unit":
            return (cellData: T[keyof T]) =>
                createElement(
                  "span",
                  null,
                  String(cellData ?? ""),
                );
        case "status":
            return (cellData: T[keyof T]) =>
                createElement(
                  "span",
                  null,
                  String(cellData ?? ""),
                );
        default:
            // Default: use renderText which handles both short and long text automatically
            return (cellData: T[keyof T]) =>
                createElement(
                  "span",
                  null,
                  String(cellData ?? ""),
                );
    }
};