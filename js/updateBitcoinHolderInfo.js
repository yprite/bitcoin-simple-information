import { flashUpdateEffect } from "./utils.js"

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

export async function updateExchangeHoldings() {
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

export async function updateBitcoinHolder1y() {
    const holder1y = await fetchGlassnodeData("long_term_holders_supply_percent");
    document.getElementById("holder1y").textContent = `${holder1y.toFixed(2)}%`;
    flashUpdateEffect("holder1y");
}

export async function updateBitcoinHolder3y() {
    const holder3y = await fetchGlassnodeData("supply_in_3y_hodl");
    document.getElementById("holder3y").textContent = `${holder3y.toFixed(2)}%`;
    flashUpdateEffect("holder3y");
}

export async function updateBitcoinHolder5y() {
    const holder5y = await fetchGlassnodeData("supply_in_5y_hodl");
    document.getElementById("holder5y").textContent = `${holder5y.toFixed(2)}%`;
    flashUpdateEffect("holder5y");
}

export async function updateBitcoinHolder10y() {
    const holder10y = await fetchGlassnodeData("supply_in_10y_hodl");
    document.getElementById("holder10y").textContent = `${holder10y.toFixed(2)}%`;
    flashUpdateEffect("holder10y");
}