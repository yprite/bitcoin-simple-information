//-----  Visual Effect -----
function flashUpdateEffect(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.classList.add("flash-effect");
    setTimeout(() => {
        element.classList.remove("flash-effect");
    }, 500); // 0.5초 후 효과 제거
}

//-----  Retrieve data for bitcoin -----
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

async function updateKimchiPremium() {
    try {
        const exchangeRate = await fetchExchangeRate();
        const btcKrwPrice = await fetchUpbitBTCPrice();
        const btcUsdPrice = await fetchBinanceBTCPrice();
        
        if (btcKrwPrice.current === 0 || btcUsdPrice === 0) throw new Error("데이터 없음");

        const btcKrwEquivalent = btcUsdPrice * exchangeRate;
        const premium = ((btcKrwPrice.current - btcKrwEquivalent) / btcKrwEquivalent) * 100;
        document.getElementById("kimchiPremium").textContent = premium.toFixed(2) + "%";
    } catch (error) {
        console.error("김치 프리미엄 계산 중 오류 발생:", error);
        document.getElementById("kimchiPremium").textContent = "데이터 오류";
    }
}

async function updateSatoshiPrice() {
    try {
        const btcKrwPrice = await fetchUpbitBTCPrice();
        if (btcKrwPrice.current === 0 || btcKrwPrice.previous === 0) throw new Error("데이터 없음");

        const satoshiPrice = btcKrwPrice.current / 100000000;
        const satoshiPricePrevious = btcKrwPrice.previous / 100000000;
        const changePercentage = ((satoshiPrice - satoshiPricePrevious) / satoshiPricePrevious) * 100;

        document.getElementById("satoshiPrice").textContent = satoshiPrice.toFixed(6) + " KRW";
        document.getElementById("satoshiChange").textContent = `어제 대비 ${changePercentage.toFixed(2)}%`;
    } catch (error) {
        console.error("1사토시 가격 계산 중 오류 발생:", error);
        document.getElementById("satoshiPrice").textContent = "데이터 오류";
        document.getElementById("satoshiChange").textContent = "데이터 오류";
    }
}

const exchangeAddresses = [
    //Binanace
    "1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s",
    "3FupcB1RQ93QqPccv1RP8YxUVRsZDZbm8f",
    "bc1q4h9h6z2qg9vg3ffn8ks3yphuupc53kxjqykv9w",
    //Coinbase
    "3D2oetdNuZUqQHPJmcMDDHYoqkyNVsFk9r",
	"3KZ526Nx7AwRAr8fH5EHK2RCHJXMWtwVsT",
    //Kraken
    "3QW5V3zyyHWeW9G7wFT6nAdY1htqGtQXBo",
	"bc1qg92e9zfq7vyeu2ujm0c89d07kx2drnyc50cdm9",
    // Bitfinex (비트파이넥스)
	"3Cbq7aT1tY8kMxWLbitaG7yT6bPbKChq64",
	"bc1ql0ejh5crd05hs5ewfs8yftw6s6z5dzjgwmt29f",
    // Bittrex (비트트렉스)
	"3Nxwenay9Z8Lc9JBiywExpnEFiLp6Afp8v",
	"bc1qv4s2c9gz7skjj8p5xxt8n6es8ymkx83wg4m4x9",
	"Bittrex 온체인 데이터 조회 (BTCScan)",
    // OKX (구 OKEx)
	"3G98wRVB4Z2MMXXGmmVTH7GC72XHJGPeuE",
	"bc1q66sk67nnt6s3rt5y6cq8pr9mk7hfppjdtlq6m5",
    // Huobi (후오비)
	"1KFHE7w8BhaENAswwryaoccDb6qcT6DbYY",
	"bc1qnx4f3gcfavsv8sr0v4wll43p9au3tmdnyhr03x",
    // Upbit (업비트)
	"1PuDg7drPGEHh8qyoXzK5NvixuMVhS4BEB",
	"bc1q9dx84hl8v9px7u4tj2umahj23mhyc5dhpt0ua7",
    // Bithumb (빗썸)
	"1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v",
	"bc1q62mrwljksl92s6n6fj2e37zflgwjswv6t9tny4",
    // KuCoin (쿠코인)
	"3Cbq7aT1tY8kMxWLbitaG7yT6bPbKChq64",
	"bc1q62mrwljksl92s6n6fj2e37zflgwjswv6t9tny4",
];

async function fetchExchangeHoldings() {
    try {
        let totalBalance = 0;

        for (const address of exchangeAddresses) {
            const response = await fetch(`https://blockchain.info/q/addressbalance/${address}`);
            if (!response.ok) throw new Error(`API 오류: ${address}`);
            const balance = await response.json();
            
            totalBalance += balance / 100000000; // 사토시 단위를 BTC로 변환
        }

        document.getElementById("exchangeHoldings").textContent = `${totalBalance.toFixed(2)} BTC`;
    } catch (error) {
        console.error("거래소 BTC 보유량 데이터를 불러오는 중 오류 발생:", error);
        document.getElementById("exchangeHoldings").textContent = "데이터 오류";
    }
}

async function fetchBitcoinHashrate() {
    try {
        const response = await fetch("https://api.blockchain.info/stats");
        if (!response.ok) throw new Error("Blockchain API 오류");
        
        const data = await response.json();
        const hashrate = data.hash_rate; // 해쉬레이트 값 (TH/s 단위)

        document.getElementById("hashrate").textContent = `${hashrate.toFixed(2)} EH/s`;
    } catch (error) {
        console.error("비트코인 해쉬레이트 데이터를 불러오는 중 오류 발생:", error);
        document.getElementById("hashrate").textContent = "데이터 오류";
    }
}

async function fetchBitcoinLastFee() {
    try {
        const response = await fetch("https://api.blockchain.info/stats");
        if (!response.ok) throw new Error("Blockchain API 오류");
        
        const data = await response.json();
        const avgFeeBtc = data.trade_volume_btc / data.n_tx; // 평균 트랜잭션 수수료 (BTC 단위)
        const avgFeeSat = avgFeeBtc * 1e8; // BTC → Satoshi 변환
        const avgFeeSatPerVByte = avgFeeSat / 250; // 일반적인 트랜잭션 크기 250 vB 기준

        document.getElementById("latestFee").textContent = `${avgFeeSatPerVByte.toFixed(2)} sat/vB`;
    } catch (error) {
        console.error("비트코인 수수료 데이터를 불러오는 중 오류 발생:", error);
        document.getElementById("latestFee").textContent = "데이터 오류";
    }
}


async function fetchBitcoinNomralFee() {
    try {
        const response = await fetch("https://mempool.space/api/v1/fees/recommended");
        if (!response.ok) throw new Error("Mempool API 오류");
        
        const data = await response.json();
        const normalFee = data.halfHourFee; // 일반 전송 수수료 (sat/vB 단위)

        document.getElementById("normalFee").textContent = `${normalFee} sat/vB`;
    } catch (error) {
        console.error("비트코인 수수료 데이터를 불러오는 중 오류 발생:", error);
        document.getElementById("normalFees").textContent = "데이터 오류";
    }
}

async function fetchFastestBitcoinFee() {
    try {
        const response = await fetch("https://mempool.space/api/v1/fees/recommended");
        if (!response.ok) throw new Error("Mempool API 오류");

        const data = await response.json();
        const fastestFee = data.fastestFee; // 가장 빠른 전송 수수료 (sat/vB 단위)
        console.log(data);

        document.getElementById("fastestFee").textContent = `${fastestFee} sat/vB`;
    } catch (error) {
        console.error("비트코인 빠른 전송 수수료 데이터를 불러오는 중 오류 발생:", error);
        document.getElementById("fastestFee").textContent = "데이터 오류";
    }
}

async function fetchBitcoinHalvingRemainingBlocks() {
    try {
        const response = await fetch("https://blockchain.info/q/getblockcount");
        if (!response.ok) throw new Error("Blockchain API 오류");

        const currentBlock = await response.json();
        const nextHalvingBlock = 1050000; // 다음 반감기 블록
        const remainingBlocks = nextHalvingBlock - currentBlock; // 남은 블록 수

        if (remainingBlocks < 0) {
            document.getElementById("halvingBlocks").textContent = "이미 반감기 도달";
            return;
        }

        document.getElementById("halvingBlocks").textContent = `${remainingBlocks} 블록`;

        // 값이 갱신될 때 반짝이게 만들기
        flashUpdateEffect("halvingBlocks");

    } catch (error) {
        console.error("반감기까지 남은 블록 데이터 불러오는 중 오류 발생:", error);
        document.getElementById("halvingBlocks").textContent = "데이터 오류";
    }
}

async function fetchBitcoinHalvingRemainingTime() {
    try {
        const response = await fetch("https://blockchain.info/q/getblockcount");
        if (!response.ok) throw new Error("Blockchain API 오류");
        
        const currentBlock = await response.json();
        const nextHalvingBlock = 1050000; // 다음 반감기 블록
        const remainingBlocks = nextHalvingBlock - currentBlock; // 남은 블록 수

        if (remainingBlocks < 0) {
            document.getElementById("halvingBlocks").textContent = "이미 반감기 도달";
            document.getElementById("halvingTime").textContent = "-";
            return;
        }

        // 예상 남은 시간 계산 (평균 블록 생성 시간: 10분)
        const remainingMinutes = remainingBlocks * 10;
        const remainingHours = Math.floor(remainingMinutes / 60);
        const remainingDays = Math.floor(remainingMinutes / 1440); // 1440분 = 1일

        document.getElementById("halvingBlocks").textContent = `${remainingBlocks} 블록`;
        document.getElementById("halvingTime").textContent = `${remainingDays} 일 ${remainingHours % 24} 시간 남음`;

        // 값이 갱신될 때 반짝이게 만들기
        flashUpdateEffect("halvingTime");

    } catch (error) {
        console.error("반감기까지 남은 시간 데이터 불러오는 중 오류 발생:", error);
        document.getElementById("halvingBlocks").textContent = "데이터 오류";
        document.getElementById("halvingTime").textContent = "데이터 오류";
    }
}

async function fetchBitcoinHalvingElapsedTime() {
    try {
        const response = await fetch("https://blockchain.info/q/getblockcount");
        if (!response.ok) throw new Error("Blockchain API 오류");
        
        const currentBlock = await response.json();
        const lastHalvingBlock = 840000; // 마지막 반감기 블록
        const elapsedBlocks = currentBlock - lastHalvingBlock; // 지난 블록 수

        if (elapsedBlocks < 0) {
            document.getElementById("halvingElapsed").textContent = "아직 반감기 도달 전";
            return;
        }

        // 지난 시간 계산 (평균 블록 생성 시간: 10분)
        const elapsedMinutes = elapsedBlocks * 10;
        const elapsedHours = Math.floor(elapsedMinutes / 60);
        const elapsedDays = Math.floor(elapsedMinutes / 1440); // 1440분 = 1일

        document.getElementById("halvingElapsed").textContent = `${elapsedDays} 일 ${elapsedHours % 24} 시간 경과`;

        // 값이 갱신될 때 반짝이게 만들기
        flashUpdateEffect("halvingElapsed");

    } catch (error) {
        console.error("반감기 경과 시간 데이터 불러오는 중 오류 발생:", error);
        document.getElementById("halvingElapsed").textContent = "데이터 오류";
    }
}

const GLASSNODE_API_KEY = "YOUR_API_KEY"; // 여기에 본인 API 키 입력

async function fetchGlassnodeData(metric) {
    try {
        const response = await fetch(`https://api.glassnode.com/v1/metrics/supply/${metric}?api_key=${GLASSNODE_API_KEY}`);
        if (!response.ok) throw new Error(`Glassnode API 오류 - ${metric}`);
        
        const data = await response.json();
        return data.length > 0 ? data[data.length - 1].value : 0; // 최신 데이터 반환
    } catch (error) {
        console.error(`비트코인 보유자 비율(${metric}) 데이터를 불러오는 중 오류 발생:`, error);
        return "데이터 오류";
    }
}

async function fetchBitcoinHolder1y() {
    const holder1y = await fetchGlassnodeData("long_term_holders_supply_percent");
    document.getElementById("holder1y").textContent = `${holder1y.toFixed(2)}%`;
    flashUpdateEffect("holder1y");
}

async function fetchBitcoinHolder3y() {
    const holder3y = await fetchGlassnodeData("supply_in_3y_hodl");
    document.getElementById("holder3y").textContent = `${holder3y.toFixed(2)}%`;
    flashUpdateEffect("holder3y");
}

async function fetchBitcoinHolder5y() {
    const holder5y = await fetchGlassnodeData("supply_in_5y_hodl");
    document.getElementById("holder5y").textContent = `${holder5y.toFixed(2)}%`;
    flashUpdateEffect("holder5y");
}

async function fetchBitcoinHolder10y() {
    const holder10y = await fetchGlassnodeData("supply_in_10y_hodl");
    document.getElementById("holder10y").textContent = `${holder10y.toFixed(2)}%`;
    flashUpdateEffect("holder10y");
}

async function updateAllData() {
    await updateKimchiPremium();
    await updateSatoshiPrice();
    await fetchExchangeHoldings();
    await fetchBitcoinHashrate();
    await fetchBitcoinLastFee();

    await fetchBitcoinHalvingRemainingBlocks();
    await fetchBitcoinHalvingRemainingTime();
    await fetchBitcoinHalvingElapsedTime();

    
    // API 키 필요
    await fetchBitcoinHolder1y()
    await fetchBitcoinHolder3y()
    await fetchBitcoinHolder5y()
    await fetchBitcoinHolder10y()

    // 미구현
    // await fetchBitcoinNomralFee();

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
