import { currencies } from "@/assets/currency";

export const FALLBACK = "-";

/*
 * Internationalization functions
 */
export const COUNTRY_FALLBACK = "US";
export const CURRENCY_FALLBACK = "USD";

export const getLocale = (): string => {
	return navigator.language;
};

export const getTimeZone = (): string => {
	return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const getCountryCode = (): string => {
	const locale = getLocale();
	return (
		new Intl.Locale(locale).region ??
		locale.split("-")[0] ??
		COUNTRY_FALLBACK
	).toLowerCase();
};

export const getCurrency = (): string => {
	return currencies[getCountryCode()].currency ?? CURRENCY_FALLBACK;
};

//more info in :https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames/of
export const getIntlNames = (
	type: "region" | "currency" | "language",
	code: string,
): string => {
	try {
		const intlNames = new Intl.DisplayNames([getLocale()], { type });
		return intlNames.of(code) ?? FALLBACK;
	} catch {
		return FALLBACK;
	}
};

/*
 * Validation functions
 */
const isoDateOnly = /^\d{4}-\d{2}-\d{2}$/;
const isoDateTime =
	/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/;

export const isAValidDate = (date: string): boolean => {
	const trimmed = date.trim();
	if (!trimmed) return false;

	if (!isoDateTime.test(trimmed) && !isoDateOnly.test(trimmed)) {
		return false;
	}

	const parsed = new Date(trimmed);
	return !Number.isNaN(parsed.getTime());
};

export const isValidNumber = (value: unknown): boolean => {
	return typeof value === "number" && Number.isFinite(value) && value >= 0;
};

export const isValidString = (value: unknown): boolean => {
	return typeof value === "string" && value.trim().length > 0;
};

export const isValidBoolean = (value: unknown): boolean => {
	return typeof value === "boolean";
};

/*
 * Format functions
 */
export const formatDate = (
	date: Date | string | null,
	locale: string,
	timeZone: string,
	withTime: boolean = false,
): string => {
	if (!date || !isAValidDate(String(date))) return FALLBACK;

	try {
		return new Date(date).toLocaleDateString(locale, {
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

export const formatByte = (
	byte: number | string | null,
	locale: string,
): string => {
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
	number: number | string | null,
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
	number: number | string | null,
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
	number: number | string | null,
	locale: string,
	currency: string,
): string => {
	if (!number || !isValidNumber(Number(number))) return FALLBACK;

	try {
		return new Intl.NumberFormat(locale, {
			style: "currency",
			currency,
		}).format(Number(number));
	} catch {
		return FALLBACK;
	}
};

export const formatBoolean = (boolean: boolean | null): string => {
	if (!boolean || !isValidBoolean(boolean)) return FALLBACK;

	try {
		return boolean ? "yes" : "no";
	} catch {
		return FALLBACK;
	}
};

export const formatSentenceString = (str: string | null): string => {
	if (!str || !isValidString(str)) return FALLBACK;

	const words = str

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
