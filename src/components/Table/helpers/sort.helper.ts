import { isAValidDate } from "@/helpers/format.helper";
import { SortDirectionEnum } from "../types/table.types";

const detectDataType = (value: unknown): "date" | "number" | "string" => {
	if (value === null || value === undefined) return "string";

	// Check if it's a Date object
	if (value instanceof Date) return "date";

	// Check if it's a valid ISO date string
	if (typeof value === "string" && isAValidDate(value)) {
		return "date";
	}

	// Check if it's a number
	if (typeof value === "number") return "number";

	// Check if it's a string that can be parsed as a number
	if (typeof value === "string" && !Number.isNaN(Number(value))) {
		return "number";
	}

	return "string";
};

/**
 * Compares two values based on their detected type
 */
export const compareValues = <T>(
	a: T,
	b: T,
	direction: SortDirectionEnum,
): number => {
	const typeA = detectDataType(a);
	const typeB = detectDataType(b);

	const locale = "es-ES";

	const stringCollator = new Intl.Collator(locale, {
		sensitivity: "base", // ignora acentos y mayúsculas
		numeric: false,
	});

	// Handle null/undefined values (always put them at the end)
	if (a === null || a === undefined) return 1;
	if (b === null || b === undefined) return -1;

	// If types don't match, compare as strings
	if (typeA !== typeB) {
		return direction === SortDirectionEnum.Asc
			? stringCollator.compare(String(a), String(b))
			: stringCollator.compare(String(b), String(a));
	}

	// Compare based on detected type
	switch (typeA) {
		case "date": {
			const dateA = a instanceof Date ? a : new Date(a as string);
			const dateB = b instanceof Date ? b : new Date(b as string);
			return direction === SortDirectionEnum.Asc
				? dateA.getTime() - dateB.getTime()
				: dateB.getTime() - dateA.getTime();
		}
		case "number": {
			const numA = typeof a === "number" ? a : Number(a);
			const numB = typeof b === "number" ? b : Number(b);
			return direction === SortDirectionEnum.Asc ? numA - numB : numB - numA;
		}

		default: {
			return direction === SortDirectionEnum.Asc
				? stringCollator.compare(String(a), String(b))
				: stringCollator.compare(String(b), String(a));
		}
	}
};

export const sortedData = <T>(
	direction: SortDirectionEnum,
	keyAccessor: keyof T,
	data: T[],
) => {
	if (!direction || !keyAccessor) {
		return data;
	}

	return [...data].sort((a, b) =>
		compareValues(a[keyAccessor], b[keyAccessor], direction),
	);
};
