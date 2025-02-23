const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 로깅 미들웨어 추가
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} [${req.method}] ${req.url}`);
    next();
});

// API 라우트
app.get('/api/upbit/btc', async (req, res) => {
    try {
        console.log('Upbit API 요청 시작');
        const response = await axios.get('https://api.upbit.com/v1/ticker?markets=KRW-BTC');
        console.log('Upbit API 응답 성공');
        res.json(response.data);
    } catch (error) {
        console.error('Upbit API 오류:', error.message);
        res.status(500).json({ error: 'Upbit API 요청 실패' });
    }
});

// Binance API
app.get('/api/binance/btc', async (req, res) => {
    try {
        console.log('Binance API 요청 시작');
        const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        console.log('Binance API 응답 성공');
        res.json(response.data);
    } catch (error) {
        console.error('Binance API 오류:', error.message);
        res.status(500).json({ error: 'Binance API 요청 실패' });
    }
});

// Exchange Rate API
app.get('/api/exchange-rate', async (req, res) => {
    try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: '환율 API 요청 실패' });
    }
});

// CoinGecko API
app.get('/api/bitcoin/price-changes', async (req, res) => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/bitcoin');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'CoinGecko API 요청 실패' });
    }
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    console.error('서버 에러:', err.stack);
    res.status(500).json({ error: '서버 내부 오류' });
});

// 서버 시작
app.listen(port, () => {
    console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
    console.log(`정적 파일 경로: ${path.join(__dirname, 'public')}`);
}); 