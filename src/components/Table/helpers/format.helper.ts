import React, { createElement } from "react";
import {
	FALLBACK,
	formatBoolean,
	formatByte,
	formatDate,
	formatNumber,
	formatNumberCurrency,
	formatNumberPercent,
	getCurrency,
	getLocale,
	getTimeZone,
} from "../../../helpers/format.helper.js";
import type { TableTypes } from "../types/table.types.js";
import { validationValue } from "./validation.helper.js";

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
 * validationValue: Validates the cell value and returns a string or null.
 * getLocale: Retrieves the user's locale from the browser.
 * getTimeZone: Retrieves the user's time zone from the browser.
 * renderCellByType: Returns a renderer function based on the specified CellType.
 */

export const renderCellByType = <T extends object>(
	renderType: TableTypes.CellType,
	cellData: T[keyof T],
	_colIndex: number,
	_rowData: T,
): React.JSX.Element => {
	switch (renderType) {
		case "date":
			return createElement(
				"span",
				null,
				formatDate(validationValue<T>(cellData), getLocale(), getTimeZone()),
			);
		case "date-time":
			return createElement(
				"span",
				null,
				formatDate(
					validationValue<T>(cellData),
					getLocale(),
					getTimeZone(),
					true,
				),
			);
		case "byte":
			return createElement(
				"span",
				null,
				formatByte(validationValue<T>(cellData), getLocale()),
			);
		case "boolean":
			return createElement(
				"span",
				null,
				typeof cellData === "boolean"
					? formatBoolean(cellData)
					: String(cellData),
			);
		case "number":
			return createElement(
				"span",
				null,
				formatNumber(validationValue<T>(cellData), getLocale()),
			);
		case "number-percent":
			return createElement(
				"span",
				null,
				formatNumberPercent(validationValue<T>(cellData), getLocale()),
			);
		case "number-currency":
			return createElement(
				"span",
				null,
				formatNumberCurrency(validationValue<T>(cellData), getLocale(), getCurrency()),
			);
		case "badge":
			return createElement("span", null, String(cellData ?? ""));
		default:
			// Default: use renderText which handles both short and long text automatically
			return createElement("span", null, String(cellData ?? ""));
	}
};
