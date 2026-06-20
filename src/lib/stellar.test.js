/* global BigInt */
import {
    toStroops,
    fromStroops,
    isValidStellarAddress,
    tierName,
    shortAddress,
} from "./stellar";

describe("stroop conversion", () => {
    test("toStroops converts XLM to stroops", () => {
        expect(toStroops("1")).toBe(BigInt(10_000_000));
        expect(toStroops(2.5)).toBe(BigInt(25_000_000));
    });

    test("toStroops handles invalid input safely", () => {
        expect(toStroops("abc")).toBe(BigInt(0));
        expect(toStroops("")).toBe(BigInt(0));
    });

    test("fromStroops converts stroops back to XLM", () => {
        expect(fromStroops(10_000_000)).toBe(1);
        expect(fromStroops(BigInt(25_000_000))).toBe(2.5);
    });

    test("round-trips a value", () => {
        expect(fromStroops(toStroops("123.45"))).toBeCloseTo(123.45, 5);
    });
});

describe("isValidStellarAddress", () => {
    test("accepts a well-formed public key", () => {
        expect(
            isValidStellarAddress(
                "GBH2MIGQ3TA7WWADXM6UIBJ7I73NRS7BVUX324JFC4VTFZXIPWPZLYSO"
            )
        ).toBe(true);
    });

    test("rejects malformed addresses", () => {
        expect(isValidStellarAddress("not-an-address")).toBe(false);
        expect(isValidStellarAddress("GABC")).toBe(false); // too short
        expect(isValidStellarAddress("")).toBe(false);
        expect(isValidStellarAddress(null)).toBe(false);
    });
});

describe("tierName", () => {
    test("maps badge tiers to names", () => {
        expect(tierName(0)).toBe("None");
        expect(tierName(1)).toBe("Bronze");
        expect(tierName(2)).toBe("Silver");
        expect(tierName(3)).toBe("Gold");
    });
});

describe("shortAddress", () => {
    test("shortens a long address", () => {
        expect(
            shortAddress("GBH2MIGQ3TA7WWADXM6UIBJ7I73NRS7BVUX324JFC4VTFZXIPWPZLYSO")
        ).toBe("GBH2…LYSO");
    });

    test("handles empty input", () => {
        expect(shortAddress("")).toBe("");
        expect(shortAddress(null)).toBe("");
    });
});
