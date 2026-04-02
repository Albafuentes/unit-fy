export const FALLBACK = "-";

export const isValidNumber = (value: unknown): boolean => {
    return typeof value === "number" && Number.isFinite(value) && value >= 0;
};

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

export const formatByte = (byte: number | string | null, locale: string): string => {
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

export const formatNumber = (number: number | string | null, locale: string): string => {
	if (!number || !isValidNumber(Number(number))) return FALLBACK;

	try {
		return new Intl.NumberFormat(locale).format(Number(number));
	} catch {
		return FALLBACK;
	}
};

export const formatNumberPercent = (number: number | string | null, locale: string): string => {
	if (!number || !isValidNumber(Number(number))) return FALLBACK;

	try {
		return new Intl.NumberFormat(locale, { style: "percent" }).format(Number(number));
	} catch {
		return FALLBACK;
	}
};

export const formatNumberCurrency = (number: number | string | null, locale: string, currency: string): string => {
	if (!number || !isValidNumber(Number(number))) return FALLBACK;

	try {
		return new Intl.NumberFormat(locale, { style: "currency", currency }).format(Number(number));
	} catch {
		return FALLBACK;
	}
};

export const formatBoolean = (boolean: boolean | null): string => {
	if (!boolean) return FALLBACK;

	try {
		return boolean ? "Si" : "No";
	} catch {
		return FALLBACK;
	}
};