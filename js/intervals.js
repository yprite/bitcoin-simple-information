import { updateUpbitPrice } from "./updateBitcoinPrice.js"
import { updateSatoshiPriceByUpbit } from "./updateBitcoinPrice.js"
import { updateKimchiPremium } from "./updateBitcoinPrice.js"
import { updateBitcoinMarketCapKRW } from "./updateBitcoinMarketCap.js"
import { updateBitcoinDominance } from "./updateBitcoinMarketCap.js"
import { updateBitcoinPriceChange1h } from "./updateBitcoinPrice.js"
import { updateBitcoinPriceChange24h } from "./updateBitcoinPrice.js"
import { updateBitcoinPriceChange7d } from "./updateBitcoinPrice.js"

import { updateBitcoinHashrate } from "./updateBitcoinBlockInfo.js"
import { updateBitcoinLatestFee } from "./updateBitcoinBlockInfo.js"
import { updateBitcoinHalvingRemainingBlocks } from "./updateBitcoinHalving.js"
import { updateBitcoinHalvingRemainingTime } from "./updateBitcoinHalving.js"
import { updateBitcoinHalvingElapsedTime } from "./updateBitcoinHalving.js"

import { updateBitcoinHolder1y } from "./updateBitcoinHolderInfo.js"
import { updateBitcoinHolder3y } from "./updateBitcoinHolderInfo.js"
import { updateBitcoinHolder5y } from "./updateBitcoinHolderInfo.js"
import { updateBitcoinHolder10y } from "./updateBitcoinHolderInfo.js"
import { updateExchangeHoldings } from "./updateBitcoinHolderInfo.js"
import { updateBitcoinNodesCount } from "./updateBitcoinNodeInfo.js"
import { updateBitcoinNodesChart } from "./updateBitcoinNodeInfo.js"
import { updateKoreaBitcoinNodes } from "./updateBitcoinNodeInfo.js"



// ===== 그룹별 업데이트 함수 =====
async function update10sGroup() {
    await updateUpbitPrice();
    await updateSatoshiPriceByUpbit();
}
async function update30sGroup() {
    await updateKimchiPremium();
}

async function update1mGroup() {
    await updateBitcoinMarketCapKRW();
    await updateBitcoinDominance();
}
async function update2mGroup() {}

async function update5mGroup() {   
    await updateBitcoinPriceChange1h();
    await updateBitcoinPriceChange24h();
    await updateBitcoinPriceChange7d();

    // API 과도한 사용으로 429 에러 발생
    // await updateBitcoinNodesCount();
    // await updateBitcoinNodesChart();
    // await updateKoreaBitcoinNodes();
}
async function update10mGroup() {
    await updateBitcoinHashrate();
    await updateBitcoinLatestFee();
    await updateBitcoinHalvingRemainingBlocks();
    await updateBitcoinHalvingRemainingTime();
    await updateBitcoinHalvingElapsedTime();

    // API 키 필요
    // await fetchBitcoinHolder1y()
    // await fetchBitcoinHolder3y()
    // await fetchBitcoinHolder5y()
    // await fetchBitcoinHolder10y()
}

async function update30mGroup() {
    // 미구현
    // await fetchExchangeHoldings();
    // await fetchBitcoinNomralFee();
}

// ===== 그룹별 주기 설정 =====
function startIntervalGroups() {
    console.log("✅ 그룹별 데이터 업데이트 시작");

    setInterval(update10sGroup, 10000);  // 10초 그룹
    setInterval(update30sGroup, 30000);  // 30초 그룹
    setInterval(update1mGroup, 60000);   // 1분 그룹
    setInterval(update2mGroup, 120000);  // 2분 그룹
    setInterval(update5mGroup, 300000);  // 5분 그룹
    setInterval(update10mGroup, 600000); // 10분 그룹
}

// ===== 모든 데이터를 한 번 업데이트 =====
export async function updateAllData() {
    console.log("🔄 전체 데이터 초기 로드 실행");
    
    await update10sGroup();
    await update30sGroup();
    await update1mGroup();
    await update2mGroup();
    await update5mGroup();
    await update10mGroup();

    // 이후 그룹별 주기로 개별 업데이트 실행
    startIntervalGroups();
}