import { formatKoreanWon } from "../js/utils.js";
import { flashUpdateEffect } from "../js/utils.js";
import { jest } from "@jest/globals"; 

describe("formatKoreanWon()", () => {
    test("100억 원 이상 변환", () => {
        expect(formatKoreanWon(100_000_000_000)).toBe("1000.00억 원");
    });

    test("1억 원 이상 변환", () => {
        expect(formatKoreanWon(10_000_000_000)).toBe("100.00억 원");
    });

    test("1000만 원 이상 변환", () => {
        expect(formatKoreanWon(10_000_000)).toBe("1.00천만 원");
    });

    test("100만 원 이상 변환", () => {
        expect(formatKoreanWon(1_000_000)).toBe("1.00백만 원");
    });

    test("10만 원 이상 변환", () => {
        expect(formatKoreanWon(100_000)).toBe("10.00만 원");
    });

    test("일반 원화 변환", () => {
        expect(formatKoreanWon(50_000)).toBe("5.00만 원");
    });
});

describe("flashUpdateEffect()", () => {
    let testElement;

    beforeEach(() => {
        document.body.innerHTML = `<div id="testElement"></div>`;
        testElement = document.getElementById("testElement");
    });

    test("요소에 'flash-effect' 클래스를 추가한다", () => {
        flashUpdateEffect("testElement");
        expect(testElement.classList.contains("flash-effect")).toBe(true);
    });

    test("0.5초 후 'flash-effect' 클래스가 제거된다", () => {
        jest.useFakeTimers(); // 가짜 타이머 사용

        flashUpdateEffect("testElement");

        // 초기 상태에서는 flash-effect가 존재
        expect(testElement.classList.contains("flash-effect")).toBe(true);

        // 500ms 이후 상태 확인
        jest.advanceTimersByTime(500);

        expect(testElement.classList.contains("flash-effect")).toBe(false);

        jest.useRealTimers(); // 원래 타이머로 복구
    });

    test("존재하지 않는 요소의 경우 아무 동작도 하지 않는다", () => {
        flashUpdateEffect("nonExistentElement"); // 존재하지 않는 ID
        expect(document.getElementById("nonExistentElement")).toBeNull();
    });
});