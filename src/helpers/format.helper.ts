import {
	isAValidDate,
	isValidBoolean,
	isValidNumber,
	isValidString,
} from "./validation.helper";

export const FALLBACK = "-";

/*
 * Format functions
 */
export const formatDate = (
	date: unknown | null,
	locale: string,
	timeZone: string,
	withTime: boolean = false,
): string => {
	if (!date || !isAValidDate(String(date))) return FALLBACK;

	try {
		return new Date(String(date)).toLocaleDateString(locale, {
			timeZone,
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			...(withTime
				? {
						hour: "2-digit",
						minute: "2-digit",
					}
				: {}),
		});
	} catch {
		return FALLBACK;
	}
};

export const formatByte = (byte: unknown | null, locale: string): string => {
	if (!byte || !isValidNumber(Number(byte))) return FALLBACK;

	try {
		return new Intl.NumberFormat(locale, {
			style: "unit",
			unit: "byte",
		}).format(Number(byte));
	} catch {
		return FALLBACK;
	}
};

export const formatNumber = (
	number: unknown | null,
	locale: string,
): string => {
	if (!number || !isValidNumber(Number(number))) return FALLBACK;

	try {
		return new Intl.NumberFormat(locale).format(Number(number));
	} catch {
		return FALLBACK;
	}
};

export const formatNumberPercent = (
	number: unknown | null,
	locale: string,
): string => {
	if (!number || !isValidNumber(Number(number))) return FALLBACK;

	try {
		return new Intl.NumberFormat(locale, { style: "percent" }).format(
			Number(number),
		);
	} catch {
		return FALLBACK;
	}
};

export const formatNumberCurrency = (
	number: unknown | null,
	locale: string,
	currency: string,
): string => {
	if (number === null || !isValidNumber(Number(number))) return FALLBACK;

	try {
		return new Intl.NumberFormat(locale, {
			style: "currency",
			currency,
		}).format(Number(number));
	} catch {
		return FALLBACK;
	}
};

export const formatBoolean = (boolean: unknown | null): string => {
	if (!boolean || !isValidBoolean(boolean)) return String(boolean);

	try {
		return boolean ? "yes" : "no";
	} catch {
		return FALLBACK;
	}
};

export const formatSentenceString = (str: unknown | null): string => {
	if (!str || !isValidString(str)) return FALLBACK;

	const words = String(str)
		.replace(/([a-z0-9])([A-Z])/g, "$1 $2") //camelCase/PascalCase
		.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2") // consecutive acronyms

		.replace(/[_\-.]+/g, " ") // replace _, -, ., espaces - snake_case, kebab-case, dot.case, etc.
		.trim()
		.split(/\s+/)
		.filter(Boolean)
		.map((w) => w.toLowerCase());

	if (words.length === 0) return "";

	return (
		words[0][0].toUpperCase() +
		words[0].slice(1) +
		(words.length > 1 ? ` ${words.slice(1).join(" ")}` : "")
	);
};
