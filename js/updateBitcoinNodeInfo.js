import { flashUpdateEffect } from "./utils.js"

export async function updateBitcoinNodesCount() {
    try {
        const response = await fetch("https://bitnodes.io/api/v1/snapshots/latest/");
        if (!response.ok) throw new Error("Bitnodes API 오류");

        const data = await response.json();
        const nodeCount = data.total_nodes; // 활성화된 노드 개수

        document.getElementById("bitcoinNodes").textContent = `${nodeCount.toLocaleString()} 개`;

        // 값이 갱신될 때 반짝이게 만들기
        flashUpdateEffect("bitcoinNodes");

    } catch (error) {
        console.error("비트코인 노드 데이터를 불러오는 중 오류 발생:", error);
        document.getElementById("bitcoinNodes").textContent = "데이터 오류";
    }
}

export async function updateBitcoinNodesChart() {
    try {
        const response = await fetch("https://bitnodes.io/api/v1/snapshots/latest/");
        if (!response.ok) throw new Error("Bitnodes API 오류");

        const data = await response.json();
        const nodes = data.nodes;

        // 국가별 노드 개수 집계
        const countryNodeCounts = {};
        for (const node in nodes) {
            const countryCode = nodes[node][2];
            countryNodeCounts[countryCode] = (countryNodeCounts[countryCode] || 0) + 1;
        }

        // 데이터 변환 후 상위 10개 국가 필터링
        const sortedNodes = Object.entries(countryNodeCounts)
            .map(([country, count]) => ({ country, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // 차트 업데이트
        const ctx = document.getElementById("bitcoinNodesChart").getContext("2d");
        new Chart(ctx, {
            type: "bar",
            data: {
                labels: sortedNodes.map(n => n.country),
                datasets: [{
                    label: "비트코인 노드 수",
                    data: sortedNodes.map(n => n.count),
                    backgroundColor: "rgba(54, 162, 235, 0.5)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

        // 값이 갱신될 때 반짝이게 만들기
        flashUpdateEffect("bitcoinNodesChart");

    } catch (error) {
        console.error("비트코인 국가별 노드 차트 데이터를 불러오는 중 오류 발생:", error);
    }
}


//아래 updateBitcoinNodesByCountry와 updateNodesByCountryUI 함수와 모호성 존재
async function updateBitcoinNodesByCountry() {
    try {
        const response = await fetch("https://bitnodes.io/api/v1/snapshots/latest/");
        if (!response.ok) throw new Error("Bitnodes API 오류");

        const data = await response.json();
        const nodes = data.nodes;

        // 국가별 노드 개수 집계
        const countryNodeCounts = {};
        for (const node in nodes) {
            const countryCode = nodes[node][2]; // 국가 코드 (예: "US", "GB")
            countryNodeCounts[countryCode] = (countryNodeCounts[countryCode] || 0) + 1;
        }

        // 데이터 변환 (객체 → 배열) 후 정렬 (노드 개수가 많은 순)
        const sortedNodes = Object.entries(countryNodeCounts)
            .map(([country, count]) => ({ country, count }))
            .sort((a, b) => b.count - a.count);

        // UI 업데이트
        updateNodesByCountryUI(sortedNodes);

    } catch (error) {
        console.error("비트코인 국가별 노드 데이터를 불러오는 중 오류 발생:", error);
        document.getElementById("bitcoinNodesByCountry").textContent = "데이터 오류";
    }
}

// UI 업데이트 함수
function updateNodesByCountryUI(nodesData) {
    const tableBody = document.getElementById("bitcoinNodesByCountryBody");
    tableBody.innerHTML = ""; // 기존 데이터 초기화

    nodesData.forEach(({ country, count }, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${country}</td>
            <td>${count.toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
    });

    // 값이 갱신될 때 반짝이게 만들기
    flashUpdateEffect("bitcoinNodesByCountry");
}

export async function updateKoreaBitcoinNodes() {
    try {
        const response = await fetch("https://bitnodes.io/api/v1/snapshots/latest/");
        if (!response.ok) throw new Error("Bitnodes API 오류");

        const data = await response.json();
        const nodes = data.nodes;

        // 한국(KR) 노드 개수 필터링
        let koreaNodeCount = 0;
        for (const node in nodes) {
            if (nodes[node][2] === "KR") {
                koreaNodeCount++;
            }
        }

        // UI 업데이트
        document.getElementById("koreaBitcoinNodes").textContent = `${koreaNodeCount.toLocaleString()} 개`;

        // 값이 갱신될 때 반짝이게 만들기
        flashUpdateEffect("koreaBitcoinNodes");

    } catch (error) {
        console.error("비트코인 한국 노드 데이터를 불러오는 중 오류 발생:", error);
        document.getElementById("koreaBitcoinNodes").textContent = "데이터 오류";
    }
}