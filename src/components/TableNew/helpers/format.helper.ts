import React, { createElement } from "react";
import {
  FALLBACK,
	formatBoolean,
	formatByte,
	formatDate,
	formatNumber,
	formatNumberCurrency,
	formatNumberPercent,
} from "../../../helpers/format.helper.js";
import type { TableTypes } from "../Table.tsx";

/**
 * Converts a cell value to a displayable string.
 * If the value is an object (not null, array, or Date), returns "[Object]".
 */
export const formatCellToString = (value: unknown): string => {
	if (
		value === null ||
		value === undefined ||
		(typeof value === "string" && value.length === 0)
	) {
		return FALLBACK;
	}

	if (React.isValidElement(value)) {
		return "[Custom Render]";
	}

	// Check if value is an object (but not an array or Date)
	if (
		typeof value === "object" &&
		!Array.isArray(value) &&
		!(value instanceof Date)
	) {
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

const validationValue = <T extends object>(
	value: T[keyof T],
): string | null => {
	if (
		value === null ||
		value === undefined ||
		(typeof value === "string" && value.length === 0)
	) {
		return null;
	}
	return String(value);
};

const getLocale = (): string => {
	return navigator.language;
};

const getTimeZone = (): string => {
	return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const formatDataToCellType = <T extends object>(
	renderType: TableTypes.CellType,
): ((
	cellData: T[keyof T],
	_colIndex: number,
	_rowData: T,
) => React.JSX.Element) => {
	switch (renderType) {
		case "date":
			return (cellData: T[keyof T]) =>
				createElement(
					"span",
					null,
					formatDate(validationValue<T>(cellData), getLocale(), getTimeZone()),
				);
        case "date-time":
			return (cellData: T[keyof T]) =>
				createElement(
					"span",
					null,
					formatDate(validationValue<T>(cellData), getLocale(), getTimeZone(), true),
				);
		case "byte":
			return (cellData: T[keyof T]) =>
				createElement(
					"span",
					null,
					formatByte(validationValue<T>(cellData), getLocale()),
				);
		case "boolean":
			return (cellData: T[keyof T]) =>
				createElement(
					"span",
					null,
					typeof cellData === "boolean"
						? formatBoolean(cellData)
						: String(cellData),
				);
		case "number":
			return (cellData: T[keyof T]) =>
				createElement(
					"span",
					null,
					formatNumber(validationValue<T>(cellData), getLocale()),
				);
		case "number-percent":
			return (cellData: T[keyof T]) =>
				createElement(
					"span",
					null,
					formatNumberPercent(validationValue<T>(cellData), getLocale()),
				);
		case "number-currency":
			return (cellData: T[keyof T]) =>
				createElement(
					"span",
					null,
					formatNumberCurrency(
						validationValue<T>(cellData),
						getLocale(),
						"USD",
					),
				);
		case "badge":
			return (cellData: T[keyof T]) =>
				createElement("span", null, String(cellData ?? ""));
		default:
			// Default: use renderText which handles both short and long text automatically
			return (cellData: T[keyof T]) =>
				createElement("span", null, String(cellData ?? ""));
	}
};
