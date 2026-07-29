import { describe, expect, test } from "vitest";
import { validationValue } from "./validation.helper";

describe("validation-helper", () => {
	test("should return null for null, undefined, or empty string values", () => {
		expect(validationValue<any>(null)).toBeNull();
		expect(validationValue<any>(undefined)).toBeNull();
		expect(validationValue<any>("")).toBeNull();
	});
});
