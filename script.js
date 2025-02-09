async function fetchExchangeRate() {
    try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        const data = await response.json();
        return data.rates.KRW || 1300;
    } catch (error) {
        console.error("환율 데이터를 불러오는 중 오류 발생:", error);
        return 1300;
    }
}

async function fetchUpbitBTCPrice() {
    try {
        const response = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC");
        if (!response.ok) throw new Error("Upbit API 오류");
        const data = await response.json();
        return data[0]?.trade_price || 0;
    } catch (error) {
        console.error("Upbit BTC 데이터를 불러오는 중 오류 발생:", error);
        return 0;
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

async function updateKimchiPremium() {
    try {
        const exchangeRate = await fetchExchangeRate();
        const btcKrwPrice = await fetchUpbitBTCPrice();
        const btcUsdPrice = await fetchBinanceBTCPrice();
        
        if (btcKrwPrice === 0 || btcUsdPrice === 0) throw new Error("데이터 없음");

        const btcKrwEquivalent = btcUsdPrice * exchangeRate;
        const premium = ((btcKrwPrice - btcKrwEquivalent) / btcKrwEquivalent) * 100;
        document.getElementById("kimchiPremium").textContent = premium.toFixed(2) + "%";
    } catch (error) {
        console.error("김치 프리미엄 계산 중 오류 발생:", error);
        document.getElementById("kimchiPremium").textContent = "데이터 오류";
    }
}

async function updateSatoshiPrice() {
    try {
        const btcKrwPrice = await fetchUpbitBTCPrice();
        if (btcKrwPrice === 0) throw new Error("데이터 없음");

        const satoshiPrice = btcKrwPrice / 100000000; // 1BTC = 100,000,000 사토시
        console.log("satoshiPrice:" + satoshiPrice);
        document.getElementById("satoshiPrice").textContent = satoshiPrice.toFixed(6) + " KRW";
    } catch (error) {
        console.error("1사토시 가격 계산 중 오류 발생:", error);
        document.getElementById("satoshiPrice").textContent = "데이터 오류";
    }
}

async function updateAllData() {
    await updateKimchiPremium();
    await updateSatoshiPrice();
}

updateAllData();
setInterval(updateAllData, 30000);

new Sortable(document.getElementById('sortableContainer'), {
    animation: 150,
    delay: 300,
    delayOnTouchOnly: true,
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag"
});
