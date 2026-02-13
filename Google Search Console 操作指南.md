# Google Search Console (GSC) 操作指南

本文档旨在指导您如何正确提交网站至 Google Search Console，并进行后续的核查与监控。

## 第一阶段：立即执行 (Day 1)

### 1. 提交 Sitemap (站点地图)
这是告诉 Google "我的网站有哪些页面" 最快的方式。

1.  登录 [Google Search Console](https://search.google.com/search-console)。
2.  在左侧菜单栏点击 **"索引 (Indexing)"** -> **"站点地图 (Sitemaps)"**。
3.  在 "添加新的站点地图" 输入框中输入：`sitemap.xml`
4.  点击 **"提交 (Submit)"**。
    *   *预期结果*：状态栏显示绿色的 **"成功 (Success)"**。

### 2. 优先抓取首页 (URL Inspection)
强制 Google 爬虫立即访问您的首页。

1.  在页面顶部的 **搜索栏** 输入：`https://www.dailywelloo.com/` 并回车。
2.  等待数据检索完成后，点击 **"请求编入索引 (Request Indexing)"**。
    *   *预期结果*：弹出 "已请求编入索引" 的确认窗口。

---

## 第二阶段：次日核查 (Day 2 / Tomorrow)

### 1. 检查索引状态 (Check Indexing Status)
提交 24 小时后，您需要确认 Google 是否已经开始处理您的请求。

1.  **查看覆盖率**：
    *   点击左侧菜单 **"网页 (Pages)"**。
    *   查看 **"已编入索引 (Indexed)"** 的数量。如果不是 0，说明收录已经开始。
    *   查看 **"未编入索引 (Not indexed)"** 的原因：
        *   *已爬取 - 尚未编入索引 (Crawled - currently not indexed)*：正常，Google 还在评估质量。
        *   *已发现 - 尚未编入索引 (Discovered - currently not indexed)*：正常，爬虫还在排队。
        *   *404 错误*：如果不应该出现，需立即检查链接。

2.  **再次检查首页**：
    *   再次在顶部搜索栏输入首页 URL。
    *   如果显示绿色的 **"网址在 Google 索引中 (URL is on Google)"**，恭喜！您的首页已被收录。

---

## 第三阶段：日常监控 (Ongoing)

### 1. 搜索表现 (Performance)
*   **查看位置**：左侧菜单 **"效果 (Performance)"**。
*   **关注指标**：
    *   **点击次数 (Clicks)**：多少人从 Google 点进来了。
    *   **展示次数 (Impressions)**：您的网站在搜索结果中出现了多少次。
    *   **平均排名 (Average Position)**：您的关键词排在第几页。

### 2. 链接检查
*   定期查看 **"网页 (Pages)"** 报告，确保没有大量的 5xx 服务器错误或 404 错误。

---

## 常见问题 (FAQ)

**Q: 为什么 Sitemap 提交后显示 "无法读取 (Couldn't fetch)"？**
A: 这是 Google 的常见 Bug。只要您确认浏览器能打开 `https://www.dailywelloo.com/sitemap.xml`，请忽略该错误，等待 24 小时后再看，通常会自动变绿。

**Q: 为什么首页被收录了，但文章页没有？**
A: Google 的收录是分优先级的。首页权重最高，内页通常需要几天到几周时间慢慢放出。持续更新高质量内容是加速收录的唯一办法。
