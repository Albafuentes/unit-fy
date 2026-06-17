/*
 * validationValue: Validates the cell value and returns a string or null.
 */
export const validationValue = <T extends object>(
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

/*
* isAValidDate: Checks if a string is a valid date.
*/
export const isAValidDate = (value: string): boolean => {
    return !Number.isNaN(Date.parse(value));
};

