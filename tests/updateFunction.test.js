
// const {
//     updateUpbitPrice,
//     updateKimchiPremium,
//     updateSatoshiPriceByUpbit,
// } = require("../script.js");

// // Jest의 DOM 환경을 위한 모듈 (JSDOM)
// const { JSDOM } = require("jsdom");
// const dom = new JSDOM(`<!DOCTYPE html><body>
//     <div id="upbitBtcPrice"></div>
//     <div id="upbitBtcChange"></div>
//     <div id="kimchiPremium"></div>
//     <div id="satoshiPrice"></div>
//     <div id="satoshiChange"></div>
// </body>`);
// global.document = dom.window.document;

// describe("updateUpbitPrice()", () => {
//     test("업비트 가격 업데이트가 DOM에 적용되는지 확인", async () => {
//         global.fetch = jest.fn(() =>
//             Promise.resolve({
//                 ok: true,
//                 json: () =>
//                     Promise.resolve([{ trade_price: 50000000, prev_closing_price: 49000000 }]),
//             })
//         );

//         await updateUpbitPrice();
//         expect(document.getElementById("upbitBtcPrice").textContent).toBe("50,000,000 원");
//         expect(document.getElementById("upbitBtcChange").textContent).toContain("어제 대비");
//     });
// });

// describe("updateKimchiPremium()", () => {
//     test("김치 프리미엄이 올바르게 계산되고 업데이트되는지 확인", async () => {
//         global.fetch = jest.fn((url) => {
//             if (url.includes("exchangerate-api")) {
//                 return Promise.resolve({
//                     ok: true,
//                     json: () => Promise.resolve({ rates: { KRW: 1400 } }),
//                 });
//             }
//             if (url.includes("upbit.com")) {
//                 return Promise.resolve({
//                     ok: true,
//                     json: () =>
//                         Promise.resolve([{ trade_price: 50000000, prev_closing_price: 49000000 }]),
//                 });
//             }
//             if (url.includes("binance.com")) {
//                 return Promise.resolve({
//                     ok: true,
//                     json: () => Promise.resolve({ price: "45000" }),
//                 });
//             }
//         });

//         await updateKimchiPremium();
//         expect(document.getElementById("kimchiPremium").textContent).toContain("%");
//     });
// });

// describe("updateSatoshiPriceByUpbit()", () => {
//     test("1사토시 가격이 올바르게 계산되고 업데이트되는지 확인", async () => {
//         global.fetch = jest.fn(() =>
//             Promise.resolve({
//                 ok: true,
//                 json: () =>
//                     Promise.resolve([{ trade_price: 50000000, prev_closing_price: 49000000 }]),
//             })
//         );

//         await updateSatoshiPriceByUpbit();
//         expect(document.getElementById("satoshiPrice").textContent).toContain("KRW");
//         expect(document.getElementById("satoshiChange").textContent).toContain("어제 대비");
//     });
// });