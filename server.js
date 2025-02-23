const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

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

// SQLite 데이터베이스 연결
const dbPath = process.env.SQLITE_DB_PATH || 'data/visitors.db';
let db;
try {
    db = new Database(dbPath);
    console.log('데이터베이스 연결 성공');
    console.log('데이터베이스 경로:', dbPath);

    // 테이블 생성
    db.exec(`CREATE TABLE IF NOT EXISTS visitors (
        id INTEGER PRIMARY KEY,
        daily INTEGER DEFAULT 0,
        monthly INTEGER DEFAULT 0,
        last_daily_reset TEXT,
        last_monthly_reset TEXT
    )`);

    // 방문 기록 테이블 추가
    db.exec(`CREATE TABLE IF NOT EXISTS visitor_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        visitor_id TEXT,
        ip TEXT,
        visit_date TEXT,
        UNIQUE(visitor_id, ip, visit_date)
    )`);

    // 초기 레코드가 없다면 생성
    const row = db.prepare('SELECT * FROM visitors WHERE id = 1').get();
    if (!row) {
        const now = new Date().toISOString();
        db.prepare('INSERT INTO visitors (id, daily, monthly, last_daily_reset, last_monthly_reset) VALUES (?, ?, ?, ?, ?)')
          .run(1, 0, 0, now, now);
    }
} catch (err) {
    console.error('데이터베이스 연결 오류:', err);
}

// 방문자 수 초기화 및 업데이트 함수
function resetAndUpdateVisitors(visitorId, ip) {
    const now = new Date();
    const nowISO = now.toISOString();
    const today = now.toISOString().split('T')[0];  // YYYY-MM-DD

    try {
        // 오늘 이 방문자가 이미 방문했는지 확인
        const existingVisit = db.prepare(
            'SELECT * FROM visitor_logs WHERE visitor_id = ? AND ip = ? AND date(visit_date) = date(?)'
        ).get(visitorId, ip, today);

        if (existingVisit) {
            // 이미 방문한 경우 현재 카운트만 반환
            const counts = db.prepare('SELECT daily, monthly FROM visitors WHERE id = 1').get();
            return counts;
        }

        // 새로운 방문 기록 추가
        db.prepare(
            'INSERT OR IGNORE INTO visitor_logs (visitor_id, ip, visit_date) VALUES (?, ?, ?)'
        ).run(visitorId, ip, nowISO);

        // 기존 방문자 수 업데이트 로직
        const row = db.prepare('SELECT * FROM visitors WHERE id = 1').get();
        const lastDaily = new Date(row.last_daily_reset);
        const lastMonthly = new Date(row.last_monthly_reset);
        let daily = row.daily;
        let monthly = row.monthly;

        if (now.getDate() !== lastDaily.getDate() || 
            now.getMonth() !== lastDaily.getMonth() || 
            now.getFullYear() !== lastDaily.getFullYear()) {
            daily = 0;
        }

        if (now.getMonth() !== lastMonthly.getMonth() || 
            now.getFullYear() !== lastMonthly.getFullYear()) {
            monthly = 0;
        }

        daily++;
        monthly++;

        db.prepare(`
            UPDATE visitors 
            SET daily = ?, monthly = ?, 
            last_daily_reset = ?, last_monthly_reset = ? 
            WHERE id = 1
        `).run(daily, monthly, nowISO, nowISO);

        return { daily, monthly };
    } catch (error) {
        console.error('방문자 업데이트 중 오류:', error);
        throw error;
    }
}

// 방문자 수 업데이트 API
app.post('/api/visitors', (req, res) => {
    try {
        const visitorId = req.body.visitorId;
        const ip = req.ip || req.connection.remoteAddress;
        
        if (!visitorId) {
            return res.status(400).json({ error: '방문자 ID가 필요합니다' });
        }

        const counts = resetAndUpdateVisitors(visitorId, ip);
        res.json(counts);
    } catch (error) {
        console.error('방문자 수 업데이트 오류:', error);
        res.status(500).json({ error: '방문자 수 업데이트 실패' });
    }
});

// 방문자 수 조회 API
app.get('/api/visitors', (req, res) => {
    try {
        const row = db.prepare('SELECT daily, monthly FROM visitors WHERE id = 1').get();
        res.json(row);
    } catch (error) {
        console.error('방문자 수 조회 오류:', error);
        res.status(500).json({ error: '방문자 수 조회 실패' });
    }
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

// 서버 종료 시 데이터베이스 연결 닫기
process.on('SIGINT', () => {
    if (db) {
        db.close();
        console.log('데이터베이스 연결 종료');
    }
    process.exit(0);
}); 