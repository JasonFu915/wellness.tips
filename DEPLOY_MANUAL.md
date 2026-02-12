# 🚀 Daily Health Tips 部署与运维手册

本文档将指导你从零开始，在一个干净的环境中完成「健康小贴士」网站的部署。请严格按照步骤执行。

---

## 📋 零、准备工作 (Missing Information Check)

在开始之前，请确保你手边有以下信息。如果缺失，请先获取：

1.  **DashScope API Key** (阿里云百炼): 用于自动生成文章。
    *   *获取方式*: 阿里云控制台 -> 模型服务灵积 -> API-KEY。
    *   *变量名*: `DASHSCOPE_API_KEY`
2.  **Google AdSense Client ID** (可选): 用于显示广告。
    *   *格式*: `ca-pub-xxxxxxxxxxxxxxxx`
    *   *变量名*: `NEXT_PUBLIC_ADSENSE_CLIENT`
3.  **GitHub 账号**: 已登录。
4.  **Vercel 账号**: 已登录。

---

## 🧹 一、环境清理 (Full Reset)

为了确保环境干净，我们将清理旧的配置。

### 1. 清理 Vercel 项目
1.  登录 [Vercel Dashboard](https://vercel.com/dashboard)。
2.  找到之前的 `daily-health-tips` 项目（如果存在）。
3.  点击 **Settings** -> **General**。
4.  滚动到底部，点击 **Delete Project**。
5.  输入项目名称确认删除。
    *   *目的*: 彻底清除旧的部署记录、环境变量和域名绑定。

### 2. 清理本地 Vercel 关联
在你的 VS Code 终端中，执行以下命令以取消本地文件夹与旧 Vercel 项目的关联：

```bash
rm -rf .vercel
# Windows PowerShell 请使用:
# Remove-Item -Path .vercel -Recurse -Force
```

---

## 🐙 二、GitHub 配置

### 1. 推送代码
确保所有本地代码都已提交并推送到 GitHub。

```bash
git add .
git commit -m "Prepare for clean deploy"
git push origin main
```

### 2. 配置 Secrets (用于自动化)
进入 GitHub 仓库页面 -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**。

添加以下 Secret：

| Name | Value | 说明 |
|------|-------|------|
| `DASHSCOPE_API_KEY` | `sk-xxxxxxxx` | 你的阿里云 API Key，用于 Python 脚本生成内容 |
| `VERCEL_DEPLOY_HOOK` | (稍后填) | ⚠️ 这一步先跳过，等 Vercel 项目创建好后再回来填 |

---

## ▲ 三、Vercel 部署 (核心步骤)

### 1. 导入项目
1.  访问 [Vercel Dashboard](https://vercel.com/new)。
2.  在 **Import Git Repository** 区域，找到你的 GitHub 仓库 `daily-health-tips`，点击 **Import**。

### 2. 配置项目 (Configure Project)
在 "Configure Project" 页面：

*   **Project Name**: 保持默认或修改为你喜欢的名字 (如 `daily-health-tips`)。
*   **Framework Preset**: Vercel 会自动识别为 `Next.js` (如果没有，请手动选择)。
*   **Root Directory**: 保持默认 `./`。
*   **Environment Variables** (展开此项):
    添加以下环境变量：

    | Key | Value | 说明 |
    |-----|-------|------|
    | `NEXT_PUBLIC_ADSENSE_ENABLED` | `true` | 开启广告 (如不需要填 false) |
    | `NEXT_PUBLIC_ADSENSE_CLIENT` | `ca-pub-xxx` | 你的 AdSense ID (如不开广告可不填) |

*   点击 **Deploy** 按钮。

### 3. 等待首次部署
Vercel 会开始构建。等待约 1-2 分钟。
*   **成功**: 屏幕上会撒花，显示 "Congratulations!"。
*   **失败**: 如果失败，请查看 Log，通常是代码错误，但根据检查，当前代码应该是通过的。

---

## 🔗 四、配置自动化触发器 (Deploy Hook)

为了让 GitHub Actions 能通知 Vercel 进行部署，我们需要配置 Deploy Hook。

### 1. 创建 Hook
1.  在 Vercel 项目页面，点击 **Settings** -> **Git**。
2.  滚动到 **Deploy Hooks** 部分。
3.  **Hook Name**: 输入 `GitHub Action Trigger`。
4.  **Git Branch**: 输入 `main` (确保只触发主分支)。
5.  点击 **Create Hook**。
6.  **复制** 生成的 URL (类似 `https://api.vercel.com/v1/integrations/deploy/prj_xxx/xxx`)。

### 2. 回填 GitHub Secret
1.  回到 GitHub 仓库 -> **Settings** -> **Secrets and variables** -> **Actions**。
2.  点击 **New repository secret** (或更新已有的)。
3.  **Name**: `VERCEL_DEPLOY_HOOK`
4.  **Value**: 粘贴刚才复制的 URL。
5.  点击 **Add secret**。

---

## ✅ 五、验证全流程

现在我们手动触发一次 GitHub Actions 来验证一切是否正常。

1.  进入 GitHub 仓库 -> **Actions** 标签页。
2.  在左侧选择 **Daily Content Generator** (或你的 Workflow 名字)。
3.  点击右侧的 **Run workflow** -> **Run workflow**。
4.  观察运行结果：
    *   **Build**: 应该全绿。
    *   **Trigger Vercel Deployment**: 应该显示 `HTTP status: 201`。
5.  回到 Vercel Dashboard -> **Deployments**。
    *   你应该能看到一个新的部署条目正在 "Building" 或 "Ready"。
    *   触发来源显示为 "GitHub Action Trigger" 或类似标识。

---

## ❓ 常见问题与排错 (Troubleshooting)

### Q1: GitHub Action 显示 "Triggering Vercel deployment..." 但 Vercel 没反应？
*   **原因**: Hook URL 错误或未绑定到正确的项目。
*   **检查**:
    1.  确认 GitHub Secret `VERCEL_DEPLOY_HOOK` 的值是否与 Vercel Settings 中的完全一致。
    2.  确认 Vercel Hook 的 **Git Branch** 设置为 `main`。
    3.  复制 Hook URL 在浏览器直接访问，看是否返回 `job.state: "PENDING"`。

### Q2: Vercel 构建失败，提示 "Command not found"？
*   **原因**: 依赖未安装。
*   **检查**: 确保根目录有 `package.json` 且 `package-lock.json` 或 `yarn.lock` 已提交。Vercel 会自动运行 `npm install`。

### Q3: 网站打开显示 404？
*   **原因**: 路由问题。
*   **检查**: 本项目使用了多语言路由，访问根路径 `/` 应该自动跳转到 `/en` 或 `/zh`。如果未跳转，检查 `middleware.js` 是否生效。

### Q4: 广告不显示？
*   **原因**: AdSense 审核未通过或环境变量未生效。
*   **检查**:
    1.  确保 `NEXT_PUBLIC_ADSENSE_ENABLED` 为 `true`。
    2.  新添加的环境变量需要 **Redeploy** (重新部署) 才会生效。去 Deployments 页面，点一个旧的部署，选 "Redeploy"。

---

## 📝 维护备忘
- **日常更新**: GitHub Action 会按计划自动运行，无需人工干预。
- **手动更新**: 在本地修改 `.md` 文件 -> commit -> push，Vercel 会自动部署。