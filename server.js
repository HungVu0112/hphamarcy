const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();

app.use(cors());

app.use('/api/user', createProxyMiddleware({
    target: "http://localhost:3002/api/auth",
    changeOrigin: true,
    onProxyRes: (proxyRes) => {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*'; 
    }
}));

app.use('/api/product', createProxyMiddleware({
    target: "http://localhost:3001/api/product",
    changeOrigin: true,
    onProxyRes: (proxyRes) => {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));

app.use('/api/order', createProxyMiddleware({
    target: "http://localhost:3003/api/order",
    changeOrigin: true,
    onProxyRes: (proxyRes) => {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));

app.use((req, res) => res.status(404).send('API Gateway: Route not found'));

app.listen(3004, () => console.log('API Gateway running on port 3004'));