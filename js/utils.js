// ===== Visual Effects =====
export function flashUpdateEffect(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    element.classList.add("flash-effect");
    setTimeout(() => element.classList.remove("flash-effect"), 500);
}

// ===== Utility Functions =====
// 숫자를 한국 원화 스타일로 변환하는 함수
export function formatKoreanWon(amount) {
    if (amount >= 1_0000_0000) return `${(amount / 1_0000_0000).toFixed(2)}억 원`;
    if (amount >= 1_0000_000) return `${(amount / 1_0000_000).toFixed(2)}천만 원`;
    if (amount >= 1_0000_00) return `${(amount / 1_0000_00).toFixed(2)}백만 원`;
    if (amount >= 1_0000) return `${(amount / 1_0000).toFixed(2)}만 원`;
    return `${amount.toLocaleString()} 원`;
}