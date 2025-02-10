import { flashUpdateEffect } from "./utils.js"

async function fetchBitcoinMarketCap() {
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/coins/bitcoin");
        if (!response.ok) throw new Error("CoinGecko API 오류");

        const data = await response.json();
        const marketCapUsd = data.market_data.market_cap.usd; // 시가총액 (USD 단위)

        document.getElementById("marketCap").textContent = `$${marketCapUsd.toLocaleString()} USD`;

        // 값이 갱신될 때 반짝이게 만들기
        flashUpdateEffect("marketCap");

    } catch (error) {
        console.error("비트코인 시가총액 데이터를 불러오는 중 오류 발생:", error);
        document.getElementById("marketCap").textContent = "데이터 오류";
    }
}

export async function updateBitcoinMarketCapKRW() {
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/coins/bitcoin");
        if (!response.ok) throw new Error("CoinGecko API 오류");

        const data = await response.json();
        const marketCapKrw = data.market_data.market_cap.krw; // 원화 시가총액

        // 숫자를 "조", "억", "천만", "백만", "십만", "만원" 단위로 변환하는 함수
        function formatKoreanCurrency(amount) {
            if (amount >= 1_0000_0000_0000) {
                return `${(amount / 1_0000_0000_0000).toFixed(2)}조 원`;
            } else if (amount >= 1_0000_0000) {
                return `${(amount / 1_0000_0000).toFixed(2)}억 원`;
            } else if (amount >= 1_0000_0000) {
                return `${(amount / 1_0000_0000).toFixed(2)}천만 원`;
            } else if (amount >= 1_0000_000) {
                return `${(amount / 1_0000_000).toFixed(2)}백만 원`;
            } else if (amount >= 1_0000_00) {
                return `${(amount / 1_0000_00).toFixed(2)}십만 원`;
            } else if (amount >= 1_0000) {
                return `${(amount / 1_0000).toFixed(2)}만 원`;
            } else {
                return `${amount.toLocaleString()} 원`;
            }
        }

        // 변환된 값 적용
        document.getElementById("marketCap").textContent = formatKoreanCurrency(marketCapKrw);

        // 값이 갱신될 때 반짝이게 만들기
        flashUpdateEffect("marketCap");

    } catch (error) {
        console.error("비트코인 시가총액 데이터를 불러오는 중 오류 발생:", error);
        document.getElementById("marketCap").textContent = "데이터 오류";
    }
}

export async function updateBitcoinDominance() {
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/global");
        if (!response.ok) throw new Error("CoinGecko API 오류");

        const data = await response.json();
        const btcDominance = data.data.market_cap_percentage.btc; // 비트코인 도미넌스 (%)

        document.getElementById("btcDominance").textContent = `${btcDominance.toFixed(2)}%`;

        // 값이 갱신될 때 반짝이게 만들기
        flashUpdateEffect("btcDominance");

    } catch (error) {
        console.error("비트코인 도미넌스 데이터를 불러오는 중 오류 발생:", error);
        document.getElementById("btcDominance").textContent = "데이터 오류";
    }
}