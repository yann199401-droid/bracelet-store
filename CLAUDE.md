# 禅意手作 | Zen Craft Bracelets

## 项目概述
Next.js 14 电商网站，面向海外销售天然木石手串。中式风格设计（朱红 #B22222、金色 #D4A84B、墨色 #1A1A2E、牙白 #F5F0E8）。

## 启动方式
```bash
cd /Users/yann/bracelet-store
npm run dev          # 开发模式（port 3000）
npm run build && npm start   # 生产模式（port 3457 需 -p 参数）
```

## 技术栈
- Next.js 14 (App Router), React 18
- Tailwind CSS（中式主题色）
- Prisma + SQLite
- JWT 认证（httpOnly cookie）
- Stripe Checkout（支付）
- Resend（邮件通知）

## 核心架构

### 目录结构
- `src/app/` — Next.js App Router 页面和 API 路由
- `src/components/` — 可复用组件（layout/ cart/ ui/）
- `src/lib/` — 工具库（auth.js, stripe.js, email.js, prisma.js, CartContext.jsx, AuthContext.jsx, I18nContext.jsx, ToastContext.jsx）
- `src/i18n/` — 中英文翻译（zh.json, en.json）
- `prisma/schema.prisma` — 数据模型定义

### 数据模型 (PostgreSQL / Neon)
Product, ProductReview, User, ForumCategory, ForumPost, ForumComment, Order, ContactMessage, Coupon, Referral

### 认证
JWT + httpOnly cookie，AuthContext 管理前端状态，/api/auth/me 挂载时自动检测。

### 支付流程
Checkout 页 → POST /api/create-checkout-session → Stripe Checkout 跳转 → 用户支付 → Stripe Webhook → POST /api/stripe/webhook → 订单状态更新 → 发送确认邮件

## 已完成功能
- [x] 首页、产品列表/详情、关于、论坛、注册登录
- [x] 购物车（CartContext + localStorage 持久化）
- [x] Stripe 支付集成（Checkout Session + Webhook）
- [x] 邮件通知系统（Resend，订单确认+发货通知模板）
- [x] i18n 中英文双语（I18nContext + 服务端助手）
- [x] 品牌开场动画（SplashScreen，书法笔画动画）
- [x] Toast 全局通知系统
- [x] 错误处理（error.js, 404, ErrorSection）
- [x] 加载骨架屏
- [x] 图片懒加载、SEO 元数据、JSON-LD 结构化数据
- [x] 客户晒图系统（上传+展示+全屏查看）
- [x] 推荐有礼营销活动（Coupon + Referral）

## 当前状态（2026年7月25日）
1. **环境变量待配置：** 需要创建 `.env.local`，填入 Stripe Secret Key / Webhook Secret / Resend API Key
2. **数据库已经同步：** `npx prisma db push` 已完成
3. **代码已验证：** `npm run build` 33 条路由全部编译成功

## 待完成事项（按优先级）
1. **Stripe 注册上线**
   - 用户选择 Stripe Atlas 路线（$500 开美国公司+Stripe 账户）
   - 需要做的事情：注册 Stripe Atlas → 拿到 API keys → 配置 .env.local → 部署后在 Stripe Dashboard 设置 Webhook 端点指向 `/api/stripe/webhook`
2. **购买域名 + Vercel 部署**
   - 推荐 Cloudflare / Namecheap / Porkbun
   - 域名格式意向：`zencraftbracelets.com` 类型
3. **创建 `.env.local`** 包含实际密钥
4. **管理员后台** — 查看和处理订单
5. **后续可选：** 法律页面（隐私/条款/退换）、Google Analytics、Newsletter

## 关键文件引用
| 文件 | 说明 |
|---|---|
| `src/lib/stripe.js` | 懒加载 Stripe SDK |
| `src/lib/email.js` | Resend 邮件发送（订单确认+发货通知） |
| `src/lib/auth.js` | JWT 认证工具 |
| `src/lib/CartContext.jsx` | 购物车状态管理 |
| `src/lib/I18nContext.jsx` | 多语言 |
| `src/app/api/create-checkout-session/route.js` | Stripe Checkout 创建 |
| `src/app/api/stripe/webhook/route.js` | Stripe Webhook 处理 |
| `src/i18n/zh.json` | 中文翻译 |
| `src/i18n/en.json` | 英文翻译 |
| `prisma/schema.prisma` | 数据模型 |
