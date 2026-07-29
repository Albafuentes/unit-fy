/*
 * validationValue: Validates the cell value and returns a string or null.
 */
//TODO: Is a value helper
export const validationValue = <T extends object>(
	value: T[keyof T],
): T[keyof T] | null => {
	if (
		value === null ||
		value === undefined ||
		(typeof value === "string" && value.length === 0)
	) {
		return null;
	}
	return value;
};
