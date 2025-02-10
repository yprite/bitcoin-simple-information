import { flashUpdateEffect } from "./utils.js"
import { formatKoreanWon } from "./utils.js"

async function fetchExchangeRate() {
    try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const data = await response.json();
        return data.rates.KRW || 1400;
    } catch (error) {
        console.error("환율 데이터를 불러오는 중 오류 발생:", error);
        return 1400;
    }
}

// 업비트 비트코인 가격 업데이트
async function fetchUpbitBTCPrice() {
    try {
        const response = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC");
        if (!response.ok) throw new Error("Upbit API 오류");
        const data = await response.json();
        return {
            current: data[0]?.trade_price || 0,
            previous: data[0]?.prev_closing_price || 0
        };
    } catch (error) {
        console.error("Upbit BTC 데이터를 불러오는 중 오류 발생:", error);
        return { current: 0, previous: 0 };
    }
}

async function fetchBinanceBTCPrice() {
    try {
        const response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
        if (!response.ok) throw new Error("Binance API 오류");
        const data = await response.json();
        return parseFloat(data.price) || 0;
    } catch (error) {
        console.error("Binance BTC 데이터를 불러오는 중 오류 발생:", error);
        return 0;
    }
}

export async function updateUpbitPrice() {
    const priceData = await fetchUpbitBTCPrice();
    const priceElement = document.getElementById("upbitBtcPrice");
    const changeElement = document.getElementById("upbitBtcChange");

    const currentPrice = priceData.current;
    const previousPrice = priceData.previous;

    if (previousPrice > 0) {
        const priceChange = currentPrice - previousPrice;
        const priceChangePercent = (priceChange / previousPrice) * 100;

        // 변동률 UI 적용 (색상 포함)
        changeElement.textContent = `어제 대비 ${priceChangePercent.toFixed(2)}%`;
        changeElement.style.color = priceChange >= 0 ? "lightgreen" : "red";
    } else {
        changeElement.textContent = "변화 없음";
    }

    // 가격을 한국 원화(KRW) 스타일로 변환하여 표시
    priceElement.textContent = formatKoreanWon(currentPrice);

    // 값이 갱신될 때 반짝이게 만들기
    flashUpdateEffect("upbitBtcPrice");
    flashUpdateEffect("upbitBtcChange");
}

export async function updateKimchiPremium() {
    try {
        const exchangeRate = await fetchExchangeRate();
        const btcKrwPrice = await fetchUpbitBTCPrice();
        const btcUsdPrice = await fetchBinanceBTCPrice();
        
        if (btcKrwPrice.current === 0 || btcUsdPrice === 0) throw new Error("데이터 없음");

        const btcKrwEquivalent = btcUsdPrice * exchangeRate;
        const premium = ((btcKrwPrice.current - btcKrwEquivalent) / btcKrwEquivalent) * 100;
        document.getElementById("kimchiPremium").textContent = premium.toFixed(2) + "%";

        // 값이 갱신될 때 반짝이게 만들기
        flashUpdateEffect("kimchiPremium");
    } catch (error) {
        console.error("김치 프리미엄 계산 중 오류 발생:", error);
        document.getElementById("kimchiPremium").textContent = "데이터 오류";
    }
}

// 1사토시 기준 가격 업데이트
export async function updateSatoshiPriceByUpbit() {
    try {
        const btcKrwPrice = await fetchUpbitBTCPrice();
        if (btcKrwPrice.current === 0 || btcKrwPrice.previous === 0) throw new Error("데이터 없음");

        const satoshiPrice = btcKrwPrice.current / 100000000;
        const satoshiPricePrevious = btcKrwPrice.previous / 100000000;
        const changePercentage = ((satoshiPrice - satoshiPricePrevious) / satoshiPricePrevious) * 100;

        document.getElementById("satoshiPrice").textContent = satoshiPrice.toFixed(6) + " KRW";
        document.getElementById("satoshiChange").textContent = `어제 대비 ${changePercentage.toFixed(2)}%`;

        // 값이 갱신될 때 반짝이게 만들기
        flashUpdateEffect("satoshiPrice");
        flashUpdateEffect("satoshiChange");
    } catch (error) {
        console.error("1사토시 가격 계산 중 오류 발생:", error);
        document.getElementById("satoshiPrice").textContent = "데이터 오류";
        document.getElementById("satoshiChange").textContent = "데이터 오류";
    }
}



async function fetchBitcoinPriceChange(metric, elementId) {
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/coins/bitcoin");
        if (!response.ok) throw new Error("CoinGecko API 오류");

        const data = await response.json();
        const change = data.market_data[metric].usd;

        document.getElementById(elementId).textContent = `${change.toFixed(2)}%`;

        // 값이 갱신될 때 반짝이게 만들기
        flashUpdateEffect(elementId);

    } catch (error) {
        console.error(`비트코인 ${elementId} 데이터 불러오는 중 오류 발생:`, error);
        document.getElementById(elementId).textContent = "데이터 오류";
    }
}

export async function updateBitcoinPriceChange1h() {
    await fetchBitcoinPriceChange("price_change_percentage_1h_in_currency", "priceChange1h");
}

export async function updateBitcoinPriceChange24h() {
    await fetchBitcoinPriceChange("price_change_percentage_24h_in_currency", "priceChange24h");
}

export async function updateBitcoinPriceChange7d() {
    await fetchBitcoinPriceChange("price_change_percentage_7d_in_currency", "priceChange7d");
}