const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();

// 从环境变量读取配置（Railway 自动注入）
const PORT = process.env.PORT || 3000;

const FEISHU_CONFIG = {
    appId: process.env.FEISHU_APP_ID || 'cli_a90981de3c78dcc8',
    appSecret: process.env.FEISHU_APP_SECRET || 'RQ0RCFDrxfIelhQvgzHLJbp7C3agHnaq',
    appToken: process.env.FEISHU_APP_TOKEN || 'MMwsb70JkaDngbs8P5ecXGllnse',
    tableId: process.env.FEISHU_TABLE_ID || 'tblWbQxbHNiKk5gB'
};

// 中间件
app.use(cors({
    origin: '*',  // 允许所有来源（生产环境可限制为 GitHub Pages 域名）
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '10mb' }));

// 缓存 Token
let cachedToken = null;
let tokenExpireTime = 0;

// 获取飞书 Access Token
async function getFeishuToken() {
    if (cachedToken && Date.now() < tokenExpireTime) {
        console.log('✅ 使用缓存的 Token');
        return cachedToken;
    }

    console.log('🔄 获取新的 Access Token...');
    
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            app_id: FEISHU_CONFIG.appId,
            app_secret: FEISHU_CONFIG.appSecret
        });

        const options = {
            hostname: 'open.feishu.cn',
            port: 443,
            path: '/open-apis/auth/v3/tenant_access_token/internal',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                const result = JSON.parse(responseData);
                if (result.code === 0) {
                    cachedToken = result.tenant_access_token;
                    tokenExpireTime = Date.now() + (result.expire - 300) * 1000;
                    console.log('✅ Token 获取成功');
                    resolve(cachedToken);
                } else {
                    reject(new Error('获取 Token 失败：' + result.msg));
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

// 提交数据到飞书
async function submitToFeishu(fields) {
    const token = await getFeishuToken();
    
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ fields });

        const options = {
            hostname: 'open.feishu.cn',
            port: 443,
            path: `/open-apis/bitable/v1/apps/${FEISHU_CONFIG.appToken}/tables/${FEISHU_CONFIG.tableId}/records`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        console.log('📤 提交数据到飞书...');

        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                console.log('飞书响应状态:', res.statusCode);
                
                try {
                    const result = JSON.parse(responseData);
                    if (result.code === 0) {
                        console.log('✅ 提交成功');
                        resolve(result);
                    } else {
                        console.error('❌ 飞书 API 错误:', result.msg);
                        reject(new Error(result.msg || '提交失败'));
                    }
                } catch (e) {
                    reject(new Error('解析失败：' + e.message));
                }
            });
        });

        req.on('error', (e) => reject(new Error('请求失败：' + e.message)));
        req.write(data);
        req.end();
    });
}

// API 路由
app.post('/api/submit', async (req, res) => {
    console.log('\n📝 收到问卷提交');
    console.log('填写人:', req.body['姓名'] || '匿名');
    
    try {
        // 处理空值 - 姓名和部门可选
        const fields = { ...req.body };
        if (!fields['姓名'] || fields['姓名'].trim() === '') {
            fields['姓名'] = '匿名';
        }
        if (!fields['部门'] || fields['部门'].trim() === '') {
            fields['部门'] = '未填写';
        }
        
        const result = await submitToFeishu(fields);
        console.log('✅ 提交成功:', result.data.record.id);
        res.json({ success: true, recordId: result.data.record.id });
    } catch (error) {
        console.error('❌ 提交失败:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: '服务正常' });
});

app.get('/', (req, res) => {
    res.json({ 
        success: true, 
        message: '问卷系统后端服务运行中',
        endpoints: {
            submit: 'POST /api/submit',
            health: 'GET /api/health'
        }
    });
});

app.listen(PORT, () => {
    console.log('\n🚀 服务已启动');
    console.log(`📍 监听端口：${PORT}`);
    console.log(`🌍 环境变量：${process.env.NODE_ENV || 'development'}`);
});
