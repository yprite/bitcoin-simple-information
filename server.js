const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/upbit/btc', async (req, res) => {
    try {
        const response = await axios.get('https://api.upbit.com/v1/ticker?markets=KRW-BTC');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'API 요청 실패' });
    }
}); 