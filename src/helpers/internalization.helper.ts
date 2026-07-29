import { currencies } from "@/assets/currency";
import { FALLBACK } from "./format.helper";

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
	return currencies[getCountryCode()].alphabeticCode ?? CURRENCY_FALLBACK;
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
