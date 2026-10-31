# GitHub 仓库与部署说明

## 建议的仓库信息

- 仓库名：`geo-atlas`
- 简介：`An interactive atlas for exploring infrastructure, geographic data, and source evidence.`
- 中文简介：一个用于浏览基础设施、地理数据和来源证据的交互式地图。
- 主题：`gis`、`vue`、`typescript`、`data-visualization`、`vite`。
- 当前仓库默认分支：`mater`。工作流也支持 `main`、`master`。

## 仓库内容

以本文件所在目录作为仓库根目录。前端源码位于 `DTC_2026_Web/`；构建前的数据同步还需要相邻的 `DTC_2026_前端直接使用/`，不能只上传前端目录。至少保留该目录中的 `sites.geojson`、`profiles.json`、`bsr.csv`、`evidence.csv`、`source_registry.json` 和 `frontend_meta.json`，以及前端的 `public/data/world_reference.geojson`。

根目录的 `.gitignore` 排除报名材料、比赛原始资料、研究归档、生成的提交包、构建产物和同步数据副本；前端所需的六份源数据及世界地图底图仍须提交。提交其他文件前应逐项核对授权、个人信息和发布范围；前端构建产物中的数据会随网站公开。

## 配置与触发

1. 将所需文件按原目录结构提交、推送到默认分支 `mater`（工作流也支持 `main`、`master`）。确认 `DTC_2026_Web/node_modules/` 和 `DTC_2026_Web/dist/` 未加入提交；它们由前端目录的 `.gitignore` 排除。
2. 进入 **Settings → Pages → Build and deployment**，将 Source 设为 **GitHub Actions**。
3. 在 **Actions** 运行记录中查看 `Deploy to GitHub Pages`。推送到 `mater`、`main` 或 `master` 时会自动运行；也可在该工作流页面点击 **Run workflow** 手动运行。首次需要工作流已存在于默认分支。如果第一次推送发生在完成第 2 步之前，可在设置后手动运行。
4. 在 Pages 页面查看实际网址与发布状态。若账号为 `WhitePlusMS`、仓库名采用上述建议且未使用自定义域名，预期地址为 `https://whiteplusms.github.io/geo-atlas/`。

工作流在 GitHub 的 Linux 环境中执行 `npm ci` 和 `npm run build`。构建前会同步并校验数据；成功后通过 GitHub 官方 Pages 动作发布 `DTC_2026_Web/dist/`，不需要额外设置个人访问令牌。与示例的 `gh-pages` 分支方式不同，官方文档说明使用 `GITHUB_TOKEN` 推送的提交不会触发 Pages 构建。GitHub Pages 的可用性取决于仓库可见性和账号方案。

本配置只发布静态前端和其构建产物，不提供后端服务。仓库创建、提交推送和 GitHub 上的首次部署均需实际执行后才能确认。
