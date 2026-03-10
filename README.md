# 📋 大模型培训调查问卷系统

**部署架构：** GitHub Pages（前端） + Railway（后端）

## 🌐 访问地址

- **前端页面：** https://ruoan724996.github.io/survey-system/
- **后端 API：** https://survey-backend-production.up.railway.app
- **数据查看：** https://baijiubg.feishu.cn/base/your-feishu-app-token-here

## 📁 项目结构

```
survey-system/
├── frontend/              # 前端（部署到 GitHub Pages）
│   └── index.html        # 问卷页面
├── backend/               # 后端（部署到 Railway）
│   ├── server.js         # Express 服务
│   └── package.json      # Node.js 依赖
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions 自动部署
└── README.md             # 本文件
```

## 🚀 部署说明

### 前端部署（GitHub Pages）

1. 推送代码到 `main` 分支
2. GitHub Actions 自动构建
3. 访问：https://ruoan724996.github.io/survey-system/

### 后端部署（Railway）

1. 在 Railway 创建新项目
2. 连接此 GitHub 仓库
3. 设置 Root Directory 为 `backend`
4. 配置环境变量（见下方）
5. 自动部署

### 环境变量配置

在 Railway 后台设置以下变量：

```bash
FEISHU_APP_ID=your-feishu-app-id-here
FEISHU_APP_SECRET=your-feishu-app-secret-here
FEISHU_APP_TOKEN=your-feishu-app-token-here
FEISHU_TABLE_ID=tblWbQxbHNiKk5gB
PORT=3000
NODE_ENV=production
```

## 📊 问卷内容

1. **基本信息** - 姓名、部门、培训日期
2. **培训内容评价** - 帮助程度、难度、收获
3. **大模型应用调研** - 开发经验、功能类型、困难
4. **后续关注方向** - 学习形式、时间投入
5. **整体满意度** - 评分、推荐意愿

## 💰 成本

- **GitHub Pages:** 免费
- **Railway:** $5/月额度（够用）
- **飞书多维表格:** 免费（20,000 行）

**合计：¥0/月**

## 🛠️ 技术栈

**前端：**
- HTML5 + CSS3
- 原生 JavaScript
- 响应式设计

**后端：**
- Node.js 18+
- Express 4.x
- HTTPS 请求飞书 API

**数据：**
- 飞书多维表格
- 飞书开放平台 API

## 📝 开发测试

### 本地运行后端

```bash
cd backend
npm install
npm start
```

访问：http://localhost:3000

### 本地运行前端

直接用浏览器打开 `frontend/index.html`

## 🔐 安全说明

- 飞书 App Secret 存储在 Railway 环境变量
- 前端无法访问密钥
- Token 自动缓存和刷新
- CORS 配置允许跨域访问

## 📞 联系

**开发：** 田福成  
**GitHub:** https://github.com/ruoan724996

---

**部署时间：** 2026-03-06
