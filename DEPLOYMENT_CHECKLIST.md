# 🚀 问卷系统部署检查清单

## 当前状态

### ✅ 已完成
- [x] GitHub 仓库创建：https://github.com/ruoan724996/survey-system
- [x] 后端代码就绪：backend/server.js + package.json
- [x] Railway 配置：railway.json 已配置
- [x] 飞书 API 凭证：已配置在 TOOLS.md

### ⏳ 待完成
- [ ] Railway 项目创建并连接 GitHub
- [ ] 环境变量配置（飞书 API 凭证）
- [ ] 前端 API 地址修改为 Railway URL
- [ ] 部署测试

---

## 部署步骤

### 1. Railway 部署

访问：https://railway.app/dashboard

1. New Project → Deploy from GitHub
2. 选择仓库：ruoan724996/survey-system
3. 配置 Root Directory: `backend`

### 2. 环境变量配置

在 Railway 面板添加以下变量：

```bash
FEISHU_APP_ID=your-feishu-app-id-here
FEISHU_APP_SECRET=your-feishu-app-secret-here
FEISHU_APP_TOKEN=your-feishu-app-token-here
FEISHU_TABLE_ID=tblWbQxbHNiKk5gB
PORT=3000
NODE_ENV=production
```

### 3. 前端 API 地址修改

获取 Railway 分配域名后（如：https://survey-backend-production.up.railway.app）

修改前端 HTML 中的 API_BASE_URL：
```javascript
// 原来
const API_BASE_URL = '/api';

// 修改为
const API_BASE_URL = 'https://survey-backend-production.up.railway.app/api';
```

### 4. 测试验证

- [ ] 访问前端页面
- [ ] 填写并提交问卷
- [ ] 检查飞书多维表格是否有数据
- [ ] 检查 Railway 日志

---

## 备用方案：Sealos 部署

如果 Railway 有问题，可以使用 Sealos：

```bash
cd /Users/tianfch/.openclaw/workspace/projects/survey-system
sealos run -e APP_ID=your-feishu-app-id-here \
          -e APP_SECRET=your-feishu-app-secret-here \
          -e APP_TOKEN=your-feishu-app-token-here \
          -e TABLE_ID=tblWbQxbHNiKk5gB \
          docker.io/library/node:18
```

---

## 当前问卷文件

1. **survey_form.html** - 大模型培训反馈调查问卷（第一版）
2. **deep 交流筛选问卷.html** - Deep 交流筛选问卷（第二版）← 需要部署这个

---

*最后更新：2026-03-09 11:30*
