// 공통 API 요청 함수
export async function fetchAPI(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API 오류: ${url}`);
        return await response.json();
    } catch (error) {
        console.error(`API 요청 실패: ${url}`, error);
        return null;
    }
}
