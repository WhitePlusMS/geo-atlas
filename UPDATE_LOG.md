# 更新说明

## 2026-10-31（离线地图中国区域修正）

- `public/data/world_reference.geojson`：以天地图 2026 年 10 月全国省级 GeoJSON 合并中国区域，保留 10 段南海断续线；全球其他区域使用原 Natural Earth 1:5000 万数据并裁去与中国区域重叠的部分。站点坐标和业务数据未变。用户确认已取得数据使用许可。
- `src/services/globeVisuals.ts`、`src/components/map/SpatialDetailMap.vue`：在地球与详情图中绘制开放的南海断续线，避免误闭合为面；`src/views/MapView.vue` 与 `README.md` 同步注明天地图和 Natural Earth 的来源。
- `scripts/prepare-world-reference.py`：以两份原始 GeoJSON 的固定 SHA-256 指纹重建派生底图，使用 Python 和 Shapely 2；`scripts/check-map-geography.mjs` 检查藏南、台湾、阿克赛钦、永兴岛、钓鱼岛、相邻国家、断续线及数据指纹。
- 原始天地图数据文件指纹为 `3af8294f9ad61cc2bf84c1bb7e4bbf86a6336c68d754b699a0e6ddc33ef81486`。组合成果是学习用派生地图，不直接沿用原图审图号；公开使用应核实对应授权和审图要求。
- 原目录本地构建、坐标及几何检查通过；浏览器预览检查了地球旋转缩放、站点选择和详情地图。单文件构建及数据指纹检查通过，浏览器安全策略阻止 `file://` 直接打开，因此未完成单文件运行实测。
- 基于远端根目录结构的隔离工作区重新安装依赖，`npm run build`、关键坐标、地图布局 11 项和详情布局 10 项均通过；原始文件重建结果使用 LF 字节换行，避免 Windows 与 Linux 数据指纹不一致。该版本的本机浏览器地球旋转与缩放检查通过，预览服务已关闭。

## 2026-10-31（整理仓库目录）

- 将前端源码、配置、脚本和依赖锁文件移到仓库根目录；将六份运行数据和世界地图底图集中到 `public/data/`，简化仓库结构。
- 将数据同步调整为直接读取仓库内的数据：`predev`、`prebuild` 校验已有数据与校验和，新增 `data:checksums` 用于确认数据更新后主动重算；`.gitattributes` 保持数据字节，避免 Windows 与 Linux 换行转换造成校验失败。
- 更新 Pages 工作流的安装、构建与产物路径，更新 README、部署说明和忽略规则；修正离线构建和 GIS 派生脚本的项目根目录路径。
- 调整在独立工作区完成，不覆盖原工作目录中未提交的页面修改；本次不修改业务数据内容。
- 验证：`npm ci`、生产构建与 TypeScript 编译通过；地图布局检查 11 项、空间视图和模型检查 10 项通过。隔离副本中的数据字节被改动后，数据校验按预期拒绝，证明构建不会自动覆盖旧校验和。
- 对比 Git 暂存内容与原提交，六份运行数据和世界底图的字节完全一致；根目录工作流结构检查与 `git diff --check` 通过。

## 2026-10-31（筛选联动与首页精简）

- `src/services/siteFilters.ts`、`src/views/SitesView.vue`、`src/views/MapView.vue`、`src/components/site/SiteTable.vue`：地图和目录共用筛选规则，跨页面保留搜索、机构、地区和位置类型，详情返回保留条件；分别显示筛选总数和地图视窗数量。
- `src/components/statistics/SimpleBarChart.vue`、`src/components/statistics/BsrDetailTable.vue`、`src/views/StatisticsView.vue`：BSR 机构图联动原表分页明细，提供清除筛选、源表行号和原始数值；点击机构定位到明细，窄屏表格支持横向滚动。BSR 与 CRS 保持独立口径。
- `src/views/OverviewView.vue`、`src/layouts/AppShell.vue`：移除首页的“浏览参考站点”按钮及指定提示；保留地图入口与其他页面说明。
- 本地验证：TypeScript 检查、生产构建、数据校验及浏览器交互检查通过；覆盖筛选双向传递、空结果、详情返回、BSR 分页与清除和 390×844 模拟视口。构建仍提示地图资源超过 500 kB。
- 推送前在远端目录结构的隔离工作区执行 `npm ci` 与 `npm run build`，数据校验和 TypeScript 编译通过。

## 2026-10-31（移除各页面顶部黄色提示条）

- `src/layouts/AppShell.vue`、`src/components/common/BoundaryBanner.vue`：移除地图、站点、详情、模型和统计页共用的顶部黄色提示条及其路由文案；页面正文中的来源和数据说明保留。
- `src/styles/main.css`：清理提示条及其状态点专属样式；导航状态点保留。
- 验证：`npm run build`（包含 TypeScript 和数据校验）通过；本机浏览器逐页核对首页、地图、站点目录、站点详情、模型和统计，均无顶部黄色提示条。临时预览已关闭，地图资源大于 500 kB 的既有构建提示仍在。
