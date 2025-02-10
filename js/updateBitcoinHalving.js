import { flashUpdateEffect } from "./utils.js"

export async function updateBitcoinHalvingRemainingBlocks() {
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

export async function updateBitcoinHalvingRemainingTime() {
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

export async function updateBitcoinHalvingElapsedTime() {
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