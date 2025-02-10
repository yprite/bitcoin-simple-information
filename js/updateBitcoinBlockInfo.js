import { flashUpdateEffect } from "./utils.js"

export async function updateBitcoinHashrate() {
    try {
        const response = await fetch("https://api.blockchain.info/stats");
        if (!response.ok) throw new Error("Blockchain API 오류");
        
        const data = await response.json();
        const hashrate = data.hash_rate; // 해쉬레이트 값 (TH/s 단위)

        document.getElementById("hashrate").textContent = `${hashrate.toFixed(2)} EH/s`;
        // 값이 갱신될 때 반짝이게 만들기
        flashUpdateEffect("hashrate");
    } catch (error) {
        console.error("비트코인 해쉬레이트 데이터를 불러오는 중 오류 발생:", error);
        document.getElementById("hashrate").textContent = "데이터 오류";
    }
}

export async function updateBitcoinLatestFee() {
    try {
        const response = await fetch("https://api.blockchain.info/stats");
        if (!response.ok) throw new Error("Blockchain API 오류");
        
        const data = await response.json();
        const avgFeeBtc = data.trade_volume_btc / data.n_tx; // 평균 트랜잭션 수수료 (BTC 단위)
        const avgFeeSat = avgFeeBtc * 1e8; // BTC → Satoshi 변환
        const avgFeeSatPerVByte = avgFeeSat / 250; // 일반적인 트랜잭션 크기 250 vB 기준

        document.getElementById("latestFee").textContent = `${avgFeeSatPerVByte.toFixed(2)} sat/vB`;
        // 값이 갱신될 때 반짝이게 만들기
        flashUpdateEffect("latestFee");
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