
const { formatKoreanWon } = require("../js/script.js");

describe("formatKoreanWon()", () => {
    test("100억 원 이상 변환", () => {
        expect(formatKoreanWon(150000000000)).toBe("150.00억 원");
    });

    test("1000만 원 이상 변환", () => {
        expect(formatKoreanWon(15000000)).toBe("1500.00만 원");
    });

    test("일반 숫자 변환", () => {
        expect(formatKoreanWon(50000)).toBe("50,000 원");
    });

    test("0 원 변환", () => {
        expect(formatKoreanWon(0)).toBe("0 원");
    });
});