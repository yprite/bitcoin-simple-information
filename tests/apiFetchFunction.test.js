// const { fetchAPI, fetchUpbitBTCPrice, fetchBinanceBTCPrice } = require("../script.js");

// // Jest의 Mocking 기능 활용 (API 호출 방지)
// global.fetch = jest.fn(() =>
//     Promise.resolve({
//         ok: true,
//         json: () => Promise.resolve({ rates: { KRW: 1400 } }),
//     })
// );

// describe("fetchAPI()", () => {
//     test("정상적인 API 응답 테스트", async () => {
//         const data = await fetchAPI("https://api.exchangerate-api.com/v4/latest/USD");
//         expect(data.rates.KRW).toBe(1400);
//     });

//     test("API 오류 시 null 반환", async () => {
//         global.fetch = jest.fn(() => Promise.resolve({ ok: false }));
//         const data = await fetchAPI("https://api.exchangerate-api.com/v4/latest/USD");
//         expect(data).toBeNull();
//     });
// });

// describe("fetchUpbitBTCPrice()", () => {
//     test("업비트 비트코인 가격을 올바르게 가져오는지 확인", async () => {
//         global.fetch = jest.fn(() =>
//             Promise.resolve({
//                 ok: true,
//                 json: () =>
//                     Promise.resolve([{ trade_price: 50000000, prev_closing_price: 49000000 }]),
//             })
//         );
//         const result = await fetchUpbitBTCPrice();
//         expect(result.current).toBe(50000000);
//         expect(result.previous).toBe(49000000);
//     });
// });

// describe("fetchBinanceBTCPrice()", () => {
//     test("바이낸스 비트코인 가격을 올바르게 가져오는지 확인", async () => {
//         global.fetch = jest.fn(() =>
//             Promise.resolve({
//                 ok: true,
//                 json: () => Promise.resolve({ price: "45000" }),
//             })
//         );
//         const result = await fetchBinanceBTCPrice();
//         expect(result).toBe(45000);
//     });
// });