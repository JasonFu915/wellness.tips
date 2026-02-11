# 健康小贴士（Daily Health Tips）

一个基于 Next.js + Markdown 的多语言健康贴士站点，支持 en / zh / es / fr / de 五种语言，包含文章列表、详情页、搜索、SEO 与可选广告位。

## 功能概览
- 多语言路由与语言切换
- Markdown 内容管理（content/{lang}）
- 文章列表与详情页
- 站内搜索（Fuse.js）
- SEO 友好（Open Graph、sitemap）
- 可开关的 AdSense 广告位

## 目录结构
```
app/                 Next.js App Router
components/          组件
content/{lang}/      各语言 Markdown 内容
lib/                 Markdown 与数据加载
public/images/{lang}/封面图
```

## 本地开发
```bash
npm install
npm run dev
```

## 构建与部署
```bash
npm run build
npm start
```

## 环境变量
广告位可选，未开启时不加载脚本也不渲染广告。
```
NEXT_PUBLIC_ADSENSE_ENABLED=true
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxx
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

## 内容规范
每篇文章使用 Frontmatter：
```
---
title: "标题"
description: "摘要"
publishDate: "2026-02-10"
tags: ["tag1", "tag2"]
lang: "zh"
---
```

## 部署建议
- 推荐使用 Vercel
- 首次部署后设置 NEXT_PUBLIC_SITE_URL 为 Vercel 域名
- 自定义域名可后续在 Vercel 中配置
