# 更新说明

## 2026-10-31（复核全部分支和工作区）

- 获取远端分支后检查仓库内 4 个本地分支、1 个远端分支和 5 个 Git 工作区；全部分支的已提交历史均已包含在 `origin/mater`，没有额外的 Git stash。
- 将 `geo-atlas-experience-20261031` 的 12 个未提交代码文件逐一与当前版本比较：11 个完全一致，`src/views/MapView.vue` 在该版本基础上保留了天地图来源链接；其原始开发记录也已并入本文件。
- 原始工作区的已跟踪代码修改与当前版本或已合并的历史提交对应；89 个未跟踪文件中 87 个字节一致，其余为增加历史说明的旧 README 和合并历史记录的本文件。六份运行数据与当前 `public/data/` 字节一致。
- 旧工作区的未提交状态予以保留，避免覆盖或重置原文件；依赖、构建产物及 `.gitignore` 明确排除的本地报名和研究资料不作为分支改动合并。


## 2026-10-31（合入已完成的首页和交互调整）

- 合入 `geo-atlas-experience-20261031` 工作区尚未提交的页面调整，包括首页左侧说明与右侧交互地球、地图全屏布局、站点搜索、跨页定位、统计筛选及模型和详情入口。
- `src/views/MapView.vue` 同时保留新版页面布局和天地图地理参考链接；现有中国地图修复、离线数据及近景清晰度改进保持不变。
- 验证：生产构建、数据校验、离线中国地图检查、地图布局与空间视图检查通过；本地浏览器确认首页左右布局、进入地图、站点搜索及天地图来源入口。
- 保留来源工作区，以下为其原始开发记录（记录中的未推送状态是当时的状态）。

## 2026-10-31（首页与地图交互调整，进行中）

- 基于线上 `ca4c450` 在独立工作区实施，保留原工作区未提交修改；复用现有三维地球、筛选、数据和来源组件，不调整飞机及卫星模型。
- 调整地球组件布局，预览和地图共用同一实现；完整地图将区域和机构筛选放到底部同一行，导航移入地图右上角，图例按需展开，以扩大地图画布。
- 首页改为左侧简要说明、右侧可拖动的真实地球预览；点击地球或展开按钮进入地图。地图页默认使用完整视口，保留站点选择、筛选、来源与详情入口。
- 地图增加按名称、地区和记录号查找站点；站点目录和详情增加跳转地图定位入口，沿用已有筛选参数和真实站点 ID。
- BSR 明细增加站点、地区和源表行号搜索；面积排行按源表工作表与行号定位明细，机构统计与排行筛选可清除，保持 BSR 与 CRS 的数据口径分离。
- 开放系统模型页突出实体选择与模型视角，将更新审核过程折叠保留，增加当前实体的地图入口；保留来源、模型 JSON 和明确的能力边界。
- 浏览器检查发现聚合列表与多设施详情面板重叠；展开聚合时关闭上一站点详情，选中站点时隐藏聚合列表，继续保留地图中的分散标记。
- 跨页带入筛选后，地图显示当前结果数量及修改、清除入口；窄屏将站点搜索和定位控件移到独立一行，避免与返回和导航按钮重叠。
- 根据实际多设施站点检查，将筛选状态移到左上方，避免遮挡左下的设施列表。
- 窄屏实测中多设施面板遮挡站点卡片操作，改为默认收起并可展开的组成地点面板；保留设施定位、范围说明及来源入口。
- 首页地球点击和聚合标记点击均进入完整地图；拖动不触发跳转，单站点标记继续带入对应站点。
- 控制收起后的设施面板宽度，为地图来源入口留出空间。
- 清理首页移除的旧成果卡片、区域分布和资料链样式，保留其余页面共用样式。
- 验证：`npm run build`（含数据合同、SHA-256 和 TypeScript 检查）通过，地图与空间检查分别通过 11 项和 10 项；使用临时生产预览在 `/geo-atlas/` 子路径检查桌面 1440×900 与窄屏 390×844，浏览器未记录运行错误。
- 真实浏览器交互覆盖：首页拖动和点击进入地图、区域与机构筛选、地图搜索定位、站点目录筛选与跳转、画像及来源抽屉、模型关系定位、BSR 面积排行与原表搜索。数据文件未修改；本次未推送或部署。
- 验收结束后关闭临时预览并确认 4197 端口无监听；改动留在独立工作区，原工作区的未提交内容未覆盖。


## 2026-10-31（同步剩余工作区内容）

- `src/services/globeVisuals.ts`：同步地球近景贴图清晰度调整，根据视距和屏幕大小选择贴图覆盖范围，改善放大后的显示。
- `README.md`、`DTC_2026_Web/README.md`：说明当前前端位于仓库根目录，旧目录只保留部分历史文件和回归截图。
- 补充原工作区中 Git 可见的研究文档、设计报告、成果压缩包及回归截图，保留原有路径；成果压缩包生成于地图修复之前，属于历史资料，不代表当前地图版本。
- 旧目录下的六项数据文件已迁移至当前 `public/data/`，保留远端现行数据和根目录结构。
- 合并原工作区更新说明的历史内容，保留当前地图修复记录；原工作区文件未被清理或重置。


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

# 原工作区历史记录（截至 2026-10-31）

## 2026-10-31（离线地图中国区域修正）

- 应用户要求推送：因原工作区落后远端且有未提交改动，在远端 `ca4c450` 基础上建立隔离工作区，按仓库根目录结构仅移植地图相关 8 个文件；提交 `74857291860a43105917954b8cdfda9aba3bca36` 已推送至 `origin/mater`，未合并或覆盖原工作区。
- 隔离工作区的依赖安装、生产构建、地图关键坐标检查、11 项地图布局和 10 项详情布局检查通过；GitHub Actions 运行 `41212371588` 构建与 Pages 部署成功。线上地图页面已加载，线上底图 SHA-256 为 `32a4841833396196e6ba6d69bb1aeed8f130ae312895676210449b75fbbc3ff4`，与推送版本一致；原始地理数据源指纹不变。
- 推送过程中发现原工作区 `DTC_2026_前端直接使用/` 目录及其中 6 个 Git 跟踪数据文件显示已删除；本次操作未删除、恢复或覆盖它们，原工作区其他未提交改动均保留。临时预览服务已停止。

- 使用天地图“行政区划可视化”下载的 2026 年 10 月全国省级 GeoJSON（原文件 SHA-256：`3af8294f9ad61cc2bf84c1bb7e4bbf86a6336c68d754b699a0e6ddc33ef81486`），合并 34 个省级面并保留其中的 10 段南海断续线；全球其他区域保留原 Natural Earth 1:5000 万参考数据，并裁去与中国区域重叠的部分。用户确认已取得许可，本次用于个人学习。
- 更新 `DTC_2026_Web/public/data/world_reference.geojson`：替换中国区域、移除旧的台湾及港澳独立要素，记录天地图和 Natural Earth 来源、原始文件指纹、加工方式和受影响的相邻要素；站点坐标及业务数据不变。
- 更新 `DTC_2026_Level1_资料包/tools/prepare_world_reference.py`：要求明确提供原始天地图文件，校验两份输入指纹后可重建底图；需要 Python 和 Shapely 2，不会再仅以旧底图覆盖修正结果。
- 原始天地图文件归档为 `DTC_2026_Level1_资料包/sources/public_enrichment/geographic_reference/tianditu_china_provinces_202610.geojson`，可供按固定指纹重建和复查；页面标注“仅供地图可视化使用”。
- 更新 `DTC_2026_Web/src/services/globeVisuals.ts` 和 `DTC_2026_Web/src/components/map/SpatialDetailMap.vue`：分别在地球与二维详情图绘制独立的南海断续线，并调整地理参考说明；保留原有交互和未提交的近景纹理改进。
- 更新 `DTC_2026_Web/src/views/MapView.vue` 与 `README.md` 的来源说明；新增 `DTC_2026_Web/scripts/check-map-geography.mjs`，检查藏南、台湾、阿克赛钦、永兴岛、钓鱼岛、相邻国家、断续线及原始数据指纹。
- 验证：TypeScript 编译通过；通过几何检查确认以上关键坐标落在预期要素、10 段断续线存在且中国区域与相邻多边形无面积重叠。天地图页面显示的审图号属于原始页面，不能用于本项目合成图；公开展示前仍需核实适用授权和审图要求。
- 进一步验证：`npm run build`、数据校验、地图布局 11 项、详情布局 10 项及地图关键坐标检查均通过；本地构建预览中检查地球旋转、缩放、站点选择及详情地图，浏览器无错误或警告，截图保存在 `DTC_2026_Web/review-captures/china-map-20261031.png`。临时单文件构建成功并核对内嵌底图指纹；浏览器安全策略拒绝打开 `file://`，故没有将该结果记为单文件实际浏览器运行通过。临时预览服务已停止，未重新打包或覆盖既有正式提交文件。
- 将临时构建的单文件另存为 `DTC_2026_一级提交成果/软件/DTC2026_地图学习版.html`，供个人离线检查；保留原来的正式提交文件，不代表已重做正式提交包或公开发布。

## 2026-10-31（接入 GitHub 仓库）

- 核对 `WhitePlusMS/geo-atlas` 为空的公开仓库，默认分支为 `mater`；更新 `.github/workflows/deploy-gh-pages.yml`，将 `mater` 加入推送触发分支，保留原有分支及手动触发。
- 更新 `README.md` 和 `GITHUB_DEPLOYMENT.md` 中的分支与触发说明，避免首次推送后因分支不匹配而不运行部署。
- TypeScript 前端检查与工作流触发分支检查通过。发布审查发现 `manifest/frontend_allowlist.csv` 将上游数据标为内部用途、`external_export_allowed=false`，`manifest/source_rights.csv` 对来源也保留外发待核查状态；真实前端数据能否公开发布仍待确认。暂不推送或触发部署。
- 准备以 `mater` 初始化本地 Git 仓库并配置用户指定的远端，先暂存不含业务数据的前端源码、配置与部署说明；最终提交范围和推送以外发范围确认结果为准。
- 用户确认六份前端数据及其来源可公开发布；本次准备提交前端源码、六份输入、世界地图底图及部署文件。原始比赛资料、报名资料、研究归档和历史候选副本不纳入此次发布；`.gitignore`、`README.md` 与 `GITHUB_DEPLOYMENT.md` 同步说明该范围，不改动本机原始材料。
- 在 GitHub 仓库的 Pages 设置中将发布来源设为 `GitHub Actions`；实际发布状态以后续 Actions 运行结果为准。
- 从暂存快照执行全新依赖安装、数据校验、TypeScript 编译与 Vite 构建，通过；首次提交 `bea1e6960551ba437de743001331735cb5fe4405` 已推送并回读远端 `mater` 一致，GitHub Actions 运行 41204687813 已由 push 触发。部署结论等待云端执行。
- GitHub Actions 运行 41204687813 的构建、Pages 配置、产物上传与部署均成功；实际打开 `https://whiteplusms.github.io/geo-atlas/`，概览显示数据已加载，地图页的三维地球与站点标记正常渲染。该验证是线上浏览器检查，不代表来源许可台账已完成逐条复核或任何组织方验收。
- 推送后工作区回读发现 `DTC_2026_Web/src/components/map/GlobeScene.vue` 和 `DTC_2026_Web/src/services/globeVisuals.ts` 已有未提交修改；这些修改未包含在本次 `bea1e69` 推送及线上部署中，保留现状未覆盖。

## 2026-10-31（仓库忽略规则与项目 README）

- 新增根目录 `.gitignore`：排除依赖、构建产物、常见缓存、环境变量及密钥、本机编辑器文件、报名材料和生成的提交包；仅排除可由前端数据同步脚本生成的六份数据副本及其校验和，保留相邻源数据与独立世界地图底图。
- 新增根目录 `README.md`：介绍项目功能、技术栈、目录、环境、本地运行、数据同步与检查、GitHub Pages 部署及数据和许可边界。
- 更新 `GITHUB_DEPLOYMENT.md`：根据新的名称建议改为 `geo-atlas`，同步简介、预计地址和忽略规则说明。
- 原因与影响：准备 GitHub 仓库并减少提交本机产物和报名信息；忽略规则不删除现有文件，未声明尚未确认的项目或第三方资料许可证。前端业务代码和数据未修改，尚未创建或发布仓库。
- 验证：使用临时 Git 仓库检查关键排除项与源码、源数据、地图底图保留规则；仅复制可纳入仓库的前端与数据文件到隔离目录，`npm ci`、`npm run build`、`npm run map:check`（11 项）和 `npm run pages:check`（10 项）通过。构建输出仍有既有大资源块提示；未验证实际 GitHub Actions 或线上部署。
- 按项目约束，结束前核实并停止了本项目 `127.0.0.1:5173` 的 Vite 进程；未操作其他服务。

## 2026-10-31（GitHub Pages 自动部署配置）

- 新增 `.github/workflows/deploy-gh-pages.yml`：参照 IndustrialRobot-Lab 的构建部署触发体验，支持 `main`、`master` 推送及手动触发，使用 Node.js 22、锁文件安装、项目原有数据校验和前端构建，再通过 GitHub 官方 Pages 动作发布 `DTC_2026_Web/dist`。按 Pages 部署组串行处理；依据 GitHub 文档，使用官方部署动作避开 `GITHUB_TOKEN` 推送分支不触发 Pages 构建的问题。
- 新增 `GITHUB_DEPLOYMENT.md`：记录仓库名、简介和主题建议，前端构建需要的相邻数据文件、Pages 设置与触发步骤，以及公开资料和静态部署的边界。
- 原因与影响：当前项目的前端构建依赖仓库根目录下的相邻数据目录；保留原目录结构可复用既有同步与校验流程。未修改前端业务代码和源数据，也未创建仓库、推送或实际部署。
- 验证：在临时隔离副本执行 `npm ci`、`npm run build`，六个数据文件同步、数据校验、TypeScript 编译与 Vite 构建通过；工作流 YAML 解析及触发条件、权限、构建步骤和产物路径结构检查通过。本机为 Windows，GitHub Linux 环境及实际 Pages 发布尚未验证；构建存在既有大资源块提示。

## 2026-10-10（一级直接提交成果完善，进行中）

- 目标与责任：按用户新授权继续完成4条地区定位、16个多设施对象的GIS表达、全部66条详细画像，以及开放系统模型理解与运用展示；逐条查证、修正和审核由Codex承担。最终产出一级软件与提交材料，不自行投稿或发布，不把内部审核称为组委会专家通过。
- 当前基线：66条画像长说明trim字符数最小/中位/最大为108/293.5/671；45条画像有103项文字关系，其中16条为多设施汇总对象。组件合同只有名称、关系和出处，尚无组件级定位；无开放系统模型专页。上述为本轮只读统计，原来源文件和上一轮有效审核尚未改动。
- 新增事实盘点：`DTC_2026_Level1_资料包/evidence/submission_code_inventory_2026-10-10.md`记录完整源码阅读、数据流、统计和可复用接口；`submission_locations_research_2026-10-10.md`及`submission_location_facts_2026-10-10.json`记录4+16对象的现有来源范围；`submission_requirements_model_research_2026-10-10.md`记录赛题、联盟术语、模型公开资料与提交要求读取边界。这些报告由GPT-6 LUNA提供事实描述，不是参赛批准结论。
- 采用原则：复用独立画像合同、静态数据加载、来源抽屉、证据表和审核指纹；新增事实必须有可读取一手证据，不猜坐标，不以通用文字凑画像长度；编译优先、严格类型、最简代码。尚未运行本轮构建或浏览器验收，未启动npm开发服务，未调用网页端GPT。
- 修改`tools/collect_location_evidence.py`：显式接收查证计划路径，支持为组成设施/地区请求原始GeoJSON形状；复用单线程缓存和每秒一次限速，不增加前端在线地名查询。采集仍不选择或批准结果。
- 官方图面检查：完整提取并查看已归档车力通信所告示的两页PDF，确认红色为设施区域、蓝色为周边管制范围，图纸声明1:25,000比例误差。周边海域六个坐标不能直接当作设施站址；后续若派生定位，必须保留图面配准过程与该精度范围。首次尝试bundled Python缺少fitz，改用已安装PyMuPDF读取，未安装额外依赖。
- 新增`tools/derive_shariki_reference.py`：从原PDF提取六个编号控制点，配准官方图面，只数字化已视觉核对的红色设施轮廓并选面内展示点；保存控制残差、图面坐标、原PDF哈希、重建方法与参考精度。不以蓝色管制区冒充设施边界，不写入正式坐标或真人确认状态。
- 前端第一批扩展：`src/types/data.ts`增加章节出处、组件独立ID/定位和公开参考范围的严格合同，以及官方图面派生方法、模型概念与真实空间统计；新增`components/map/SpatialDetailMap.vue`复用静态参考地理层，以经纬度投影分别展示组件、地区范围和定位依据；`SiteDetailView.vue`接入逐段来源与空间视图，避免长说明与章节重复显示；`services/labels.ts`增加官方图面证据标签。正式数据仍需本轮审核后重建，尚未宣称最终验收通过。
- 前端模型展示：新增`views/ModelView.vue`，以实际实体切换、属性出处、组件地图、关系和JSON模型视图展示一级运用，并显示真实来源版本及更新审核链；接入`router/index.ts`和`layouts/AppShell.vue`。明确通用概念与项目解释、快照更新与现场测控的范围。第一批及本批前端`vue-tsc -b`均通过，尚待新数据与真实浏览器联合复验。
- 第二轮事实报告：新增`evidence/submission_location_second_pass_2026-10-10.md/.json`、`submission_spatial_lookup_plan_2026-10-10.json`与`submission_gis_member_candidates_2026-10-10.md/.json`，记录4+16对象继续查证的命名地理成员、非地理组织和已归档GIS名称候选；报告本身不批准点位。新增`data/submission_location_lookup_plan.json`为77项可直接检索的计划，排除用MOD图处理的33号和用国防部坐标表处理的65号，开始按既有限速机制采集原始命名要素/形状。
- 官方来源归档：已获取联盟术语、两份白皮书公开摘要和赛题转载的原始HTTP响应；澳国防部两份大PDF直接取回超时，保留失败元数据，不冒称已完整归档；官方搜索索引中的两版A/B角点表相互一致，可进一步核对转换。全部仍为查证输入，本轮正式画像尚未重新签署。
- 新增`holt_report_corner_tables.json`与`tools/derive_holt_reference.py`：保留国防部原表8个GDA94/MGA50角点、对应报告/章节及地籍标签，通过已核实的ArcGIS project接口一次转换并缓存原响应。A/B分别绘制报告角点凸包；B区原表东西方位标签与Easting顺序的差异原样保存，不按有疑义的标签构造自交边界。前端定位方法增加官方坐标表类型；无需新增GIS依赖。
- 修改`tools/reviewed_inputs.py`：将父对象、组件和地区范围统一到同一原始证据校验，检查GeoJSON形状与原响应、官方图面变换与原PDF、官方角点与原转换请求/响应；新增空间输入指纹，使组件/范围修改也会使旧画像审核失效。Python编译通过；正式空间输入须经根代理逐项选择后才进入构建。
- 修改`tools/build_profile_artifacts.py`：生成逐段出处、组件稳定ID/独立定位和范围合同；统一注册真实空间证据，加入章节/关系/范围字段证据与模型概念、输入版本、空间计数；官方图表与地名查询分别统计。来源登记缺失改为直接失败，删除旧的仅链接登记兜底。该层仍只生成草稿并保留指纹未变的旧审核，不能自动批准新稿。
- 修改`tools/validate_level1_package.py`至`.3`：要求长说明与已审章节完全一致，逐段/关系出处可解析，组件ID唯一、定位和范围与归档输入逐值一致；16个多设施对象各有独立地理成员，模型概念出处及显示输入版本与实际审核一致；收据新增空间/图表输入和派生脚本。编译通过，完整数据校验将在定稿后执行。

## 2026-10-10（一级画像、定位证据与多设施关系补齐完成）

- 范围与责任：按用户授权，Codex承担全部66条画像、定位证据与设施关系的查证、修正及审核，不要求用户逐条参与；本轮完成一级公开参考应用的内部验收，未实施二级推演或参赛投稿。
- 方法与原则：采用本地research技能，GPT-6 LUNA分区读取资料/大量源码，只描述第一方事实与获取限制；主代理独立核对、修订及签署。沿用原画像合同、目录、证据表、来源抽屉及生成流程，保持最简、类型严格、候选隔离和原始字段不覆盖；未调用网页端GPT。
- 新增 `DTC_2026_Level1_资料包/tools/collect_location_evidence.py` 与 `data/location_lookup_plan.json`：一次性检索原48个手填位置，缓存原始字节、查询参数、时间、对象ID与SHA-256；单线程、单机、应用User-Agent、每秒最多一次Nominatim请求。失败/同名错误结果也保留，采集不选点或自动批准，前端没有在线通用地名查询功能。
- 新增 `tools/archive_profile_sources.py`：保存实际HTML/PDF响应及失败元数据，可读正文/官方索引正文采用明确方式的短节选；防止初始采集草稿覆盖已修订定稿。`sources/public_enrichment/`增加三个分区研究Markdown、日/韩补充稿、三个原文capture JSON、`profile_documents/`与`location_lookups/`。研究区块已按主代理更正后的事实同步，初始补充线索注明非定稿。
- 新增 `sources/public_enrichment/level1_research.json`、`location_evidence.json`：98个采用的第一方文献档案（44原始HTML/PDF、27可读正文节选、27官方索引正文节选）；66条真实选点记录为GIS18、OSM47、GNIS1。记录位置对象、范围及关系，不以模型记忆/坐标猜测填补。
- 新增 `DTC_2026_Web/scripts/derive-gis-points.mjs` 及 `sources/public_enrichment/gis_point_derivation.json`：旧18个GIS顶点均值中，16/20/24号分别对应Miramar、Vandenberg、JBPHH，三点位于来源面外；复用现有Three.js Earcut改为有效面内三角形中心，其余15点保持面内均值。算法从原始几何重算，18点独立包含性检查通过。
- 事实修正：Fort Greely正式命名1955-08-06；JBLM的1947年对应McChord Air Force Base，不能误写成McChord Field始建；岩国区分山口县岩国市与广岛县大竹市；Basa为Floridablanca/Pampanga并删除未逐站落实的通用EDCA建设类别；Camp Melchor保留原表截断名称并补正式全名。Futenma一般职能材料的实际DVIDS发布日为2023-10-23，未采信检索代理误述的12月日期。
- 定位与关系修正：MCBH选择GNIS主驻地gaz_id=2512282，与Camp H. M. Smith/Pearl City Annex分开；Kwajalein主岛Bucholz机场、岩国和群山共用跑道均补直接官方关系依据；Camp Butler与Futenma分别列名；Harold E. Holt Area A/B分别记录；旧NRCS与SAC/NSA名称不直接合并。16个多设施对象增加可回源的组成/关联条目。
- 4条地区锚点：33号Shariki采用Toyotomicho地区且不冒用日方基地/通知缓冲坐标；48号采用镇海区且不冒用韩国海军基地；60号采用巴拉望Balabac岛并排除Zamboanga同名岛；61号由NCIS一手所在地说明细化为Sembawang地区。它们保持LOCALITY_ANCHOR并明确不是精确设施中心。
- 新增 `tools/reviewed_inputs.py`：校验66条完整覆盖、所有采用档案和原始响应的哈希、稳定ID及坐标逐值一致，GIS派生必须匹配原快照；篡改文件或选择与原始响应不符时立即失败。
- 修改 `tools/build_level1_package.py`：删除48点硬编码表，从真实选点输入重建目录、GeoJSON与字段证据；点几何来源与坐标来源一致。主流程接入必需的画像生成，再生成一次有效最终收据；输出实际manifest计数。历史9月目录/地名查询保留独立来源ID和历史说明，不冒称当时已归档，也不再用于本轮选点。
- 修改 `tools/build_profile_artifacts.py`：移除通用模板，逐站物化描述、事实、文献段落/日期、components与location_evidence；记录当前真实统计。allowlist的目录、画像和证据声明根据实际源ID计算，移除过时“画像草稿/审核后变原始事实”说明。描述审核通过后仍为DERIVED；审核输入含原CRS/DISDI、事实定稿和定位输入哈希，内容未变才保留既有审核。
- 修改 `tools/validate_level1_package.py`：缺画像/来源不得静默兼容；加入归档档案外键、组件出处、选点/目录一致及实际坐标审核方法校验；收据覆盖新增审核输入和读取器。版本为level1-validator-2026-10-10.2。
- 修改 `contracts/reference_site.schema.json`、重建 `contracts/base_profile.schema.json`：增加地区语义、档案/关系/定位字段及LOOKUP_RESPONSE_ARCHIVED审核类型；严格记录AI_AGENT，不伪装真人审核。
- 重建资料包 `data/reference_site_catalog.csv`、`.geojson`、`site_location_review.csv`、`site_match_review.csv`、候选CSV/GeoJSON、`base_profiles.json`、`site_point_candidates.csv`、BSR staging/metadata；重建 `evidence/field_evidence.csv`、`manifest/source_manifest.csv`、`source_rights.csv`、`frontend_allowlist.csv`、`public_source_registry.csv`、质量JSON/Markdown与验证收据。66份APPROVED记录由主代理实际审核后签署；重建验证保留全部有效记录。
- 同步 `DTC_2026_前端直接使用/`、`DTC_2026_Web/public/data/`、`.checksums.json`及`dist/`：8份前端业务文件采用当前数据；原始PDF/XLSX和824要素DISDI源快照未覆盖，候选层仍不自动合并。最终字段证据从1,524增至2,005条，保留事实等级。
- 修改前端 `src/types/data.ts`、`services/labels.ts`、`views/SiteDetailView.vue`、`OverviewView.vue`、`MapView.vue`、`components/map/GlobeScene.vue`、`MapLegend.vue`：严格类型接入定位与关系；总览显示66来源审核通过及18+48定位依据；详情展示选点原因、文献段落/日期及设施出处，标明实际Codex审核身份。地图地区锚点用紫色空心标记和独立图例，地区坐标降低显示小数位。
- 修改 `DTC_2026_Web/scripts/verify-data.mjs`：按真实2,005行证据及来源外键校验，核对画像/定位/文献/关系与元数据一致；完整生产构建要求66份有效APPROVED及level1_ready=true。SHA-256按其数值比较，统一大小写后校验，保留8文件指纹及候选隔离。
- 文档同步：重写根 `DTC_2026_参赛符合性审核_2026-10-10.md` 的要求对照、完成证据、4地区锚点、66条逐站表及4输入指纹；更新Web/资料包README、`frontend_build_checklist.md`、`evidence/readiness_matrix.md`、`input_boundary.md`、`official_sources_research.md`；更新DATA_GAP_RESEARCH、旧官方复核报告、公开查询方案、二级晋级方案以及GIS研究目录的三个导航文件，区分当前验收与9月历史规划，删除“明早开工/空几何/用户必须逐条审核”的现况误述。
- 编译与构建：所有改动Python脚本py_compile、Node脚本语法、前端和Vite配置TypeScript检查通过；最终npm run build通过（8文件同步/哈希通过）。既有Three.js地图资源超过500kB仅产生构建提示。
- 校验：资料包34项检查通过，最终sites=66、profiles=66、reviewed=66、approved=66、changes_required=0、coordinate_evidence=18+48、locality=4、multi_site=16、bsr=1626、evidence=2005、候选匹配/面=74/21、历史GNIS候选点17。manifest共161来源行，public_source_registry148行。
- 审核/证据专项13项通过：重建保留66审核；说明、坐标和来源输入改动使旧审核失效；选点必须匹配原响应；篡改原始响应/正文档案被拒绝；冒称真人审核/孤立关系出处被拒绝；隔离正常样本控制与18点面内检查通过；目录/画像/字段证据allowlist声明与实际来源集合一致。结果保存在 `quality/level1_review_checks.json`，测试只修改临时或内存副本，临时目录已自动清理。
- 浏览器验收：最终应用在域名根路径和/dtc/子目录正常；逐页核对全部66条正确记录号、来源审核通过、真实审核员和选点依据，4地区锚点标签正确。地图大陆参考层与图例、来源抽屉正常，正常页面无运行错误。390像素视口新增内容无横向溢出。记录保存为 `DTC_2026_Web/review-captures/level1-browser-checks-2026-10-10.json`，完整总览截图为 `level1-approved-2026-10-10.jpg`。
- 清理与验证范围：视口已恢复，本轮浏览器页已关闭；核对Node进程48852及4180/4181端口归属后终止本轮静态验收服务，两端口确认0监听。没有启动npm开发服务，没有修改用户已有服务，没有推送、部署或提交。一级公开资料展示通过内部验收，精确设施边界、真人确认与组委会专家验收仍如实保持独立状态。

## 2026-10-10（参赛符合性与66条来源审核）

- 原因：用户要求按参赛说明核对软件，并明确由 Codex 担任审核员；此前“等待用户人工审核/正式坐标确认”将内部建议当成赛事硬要求，不准确。
- 本轮范围：一级与二级要求对照；66条画像基础字段、说明内容及坐标来源链审核。结论是一级部分符合、二级尚未实现；补充说明和坐标证据由 Codex 承担，不转给用户逐条审核。
- 修改 `DTC_2026_Level1_资料包/tools/build_profile_artifacts.py`：复用既有独立画像合同，改用 `review_status`、`review_record`，记录实际审核员/时间/范围/整改项；绑定内容、坐标和归档来源哈希，重生成保留有效审核并使变更内容的旧审核失效。移除说明中泛称已核验全部坐标、人审前置条件及来源数量=强覆盖的错误推断；补充实际审核指标。
- 修改 `DTC_2026_Level1_资料包/tools/validate_level1_package.py`：校验完成审核必须有与当前内容匹配的记录；需要修改必须有整改项，批准不得残留整改项；验证器版本更新为2026-10-10.1。
- 修改 `DTC_2026_Web/src/types/data.ts`、`services/labels.ts`、`views/OverviewView.vue`、`views/SiteDetailView.vue`、`views/MapView.vue`：严格类型接入来源审核；显示Codex已审核66条、需补充66条、GIS快照可追溯18条/缺定位结果48条，详情显示每条整改项；不再显示等待用户人工审核。
- 修改 `DTC_2026_Web/scripts/verify-data.mjs`：检查审核记录与统计一致、批准与整改项一致，保留候选隔离和文件哈希检查。
- 刷新 `DTC_2026_Level1_资料包/contracts/base_profile.schema.json`、`data/base_profiles.json`、`evidence/field_evidence.csv`：同步审核合同、66条实际决定和派生证据状态；`data/site_point_candidates.csv`由原生成流程重写，候选语义继续隔离。
- 刷新资料包 `manifest/source_manifest.csv`、`manifest/source_rights.csv`、`manifest/frontend_allowlist.csv`、`sources/public_enrichment/public_source_registry.csv`：来源登记继承真实获取状态，未归档定位响应保持 `REMOTE_QUERY_NOT_ARCHIVED`，新链接只记 `REMOTE_LINK_REGISTERED`；原来源文件和权利边界不覆盖。
- 刷新资料包 `quality/level1_data_quality.json`、`quality/level1_data_quality.md`、`quality/validation_receipt.json`：加入实际审核统计、整改项与新验证器收据，机器合同通过不等于参赛内容获批。
- 刷新 `DTC_2026_前端直接使用/profiles.json`、`point_candidates.csv`、`evidence.csv`、`frontend_meta.json`、`source_registry.json`；`DTC_2026_Web/public/data`、`.checksums.json`与`dist`通过原同步/构建流程更新。没有覆盖原始PDF/XLSX或改动原有66个点的数值。
- 新增 `DTC_2026_参赛符合性审核_2026-10-10.md`；更新Web README和既有参赛说明入口，逐条区分官方任务、内部建议和Codex审核判断。主办方精确坐标、GIS候选和真正人工确认字段保持真实值，没有将AI审核伪装成人工或主办方验收。
- 核验：66条名称/地区/机构/属地/运营字段与归档CRS原表一致；18个点逐值对应归档DISDI要素的顶点均值，48个手填点缺原始Nominatim结果，10条多设施记录需说明锚点关系。全部66条说明仅含基础身份/地区等内容，尚不足以据此批准“详细说明”。
- 追加修改 `DTC_2026_Web/src/layouts/AppShell.vue`、`src/components/common/BoundaryBanner.vue`：删除地图路由与默认提示中的笼统“代理核验代表点”，改为公开补充和逐条审核说明，避免将48条缺定位记录误述为坐标已核实；沿用原提示组件，不增加重复逻辑。
- 编译与构建：修改后的前端和Vite配置TypeScript检查通过；Python构建器/验证器编译、Node数据脚本语法检查通过。最终 `npm run build` 通过，8文件同步/校验通过，统计为 `sites=66, profiles=66, bsr=1626, evidence=1524, candidates=74/21, reviewed=66, changes_required=66, coordinate_evidence=18/48`；既有地图资源超过500kB的提示是构建警告，未影响通过。
- 数据合同与审核专项检查：资料包34项校验通过。重生成保留66条有效审核；说明、坐标或归档来源哈希变化时旧审核失效；冒称真人审核员或非法输入哈希被schema拒绝。专项检查在内存中完成，没有向正式数据注入测试记录。
- 浏览器复验：使用最终构建的临时静态服务，在 `/dtc/` 子目录核对总览、地图、Fort Wainwright、Fort Greely及Shariki详情；确认Codex实际审核员/日期/整改项、18/48口径和不同坐标来源标签一致，不再出现待用户人工审核或全部坐标已核实的页面声明。正常请求未记录浏览器运行错误。
- 响应式与留档：390px视口下新增审核段落及来源按钮无横向溢出；新增 `DTC_2026_Web/review-captures/source-review-2026-10-10.jpg`，为真实总览页面截图，不参与业务数据或构建。
- 清理：本轮浏览器页已关闭，视口覆盖已复位；核对Node验收进程39368与4180/4181端口所有者后终止该进程，端口确认0监听。
- 验证范围：完成来源审核、源码/数据合同、完整构建和本机浏览器复验；66条详细说明补充及定位证据修订仍是本报告列出的后续工作，未伪装为完成。本轮未使用网页端GPT、未启动npm开发服务、未提交、未部署或执行组委会验收。

## 2026-10-10（项目源码与文档问题修复完成）

- 修改 `DTC_2026_Web/src/types/data.ts`、`src/services/dataLoader.ts`、`src/stores/data.ts`：依据既有画像 schema 添加独立画像类型和加载入口，将 66 条画像纳入核心数据；加载时校验站点与画像唯一对应，全部成功后才提交数据，失败保留明确错误并支持重试。
- 修改 `DTC_2026_Web/scripts/sync-data.mjs`、`scripts/verify-data.mjs`：同步清单增加 `profiles.json`；校验画像数量、唯一站点关联、说明长度、审核枚举、来源引用和正式几何隔离，核对画像审核统计及 8 文件 SHA-256；CSV 改为按记录解析，避免正文换行干扰计数。
- 修改 `DTC_2026_Web/src/views/SiteDetailView.vue`、`src/services/labels.ts`：详情展示既有长短说明、画像审核状态、原始待核实项，复用来源抽屉展示画像来源；删除错误 ID 回退第一条站点的行为，增加未找到提示和目录链接。
- 修改 `DTC_2026_Web/src/layouts/AppShell.vue`、`src/views/OverviewView.vue`：顶栏根据真实加载状态显示，核心失败时提供重试且不展示半套页面；总览用已加载数据计数，明确画像批准数量和人工确认几何数量。
- 修改 `DTC_2026_Web/src/components/map/GlobeScene.vue` 及数据加载器：地理参考层复用统一 JSON 加载函数，数据请求跟随 Vite `BASE_URL`，覆盖域名根目录与子目录部署。
- 修改 `DTC_2026_Web/src/components/evidence/SourceDrawer.vue`：缺少 SHA-256 的来源显示“未记录”，修复浏览器复验中发现的“已登记”误导性占位，避免将来源已登记理解为原始文件哈希已保存。
- 原因与原则：修复画像未接入、错误详情、固定加载提示和子目录路径问题；沿用现有数据合同、store、页面布局和来源抽屉，保持单一职责、严格类型及最小修改。画像和坐标审核状态继续来自真实数据，本轮不生成或伪造人工批准记录。
- 修改 `DATA_GAP_RESEARCH.md`、`DTC_2026_Level1_资料包/frontend_build_checklist.md`、`DTC_2026_Web/README.md`：更新 66 个代表点、66 条画像、1,524 条证据及真实审核状态，说明画像入口、错误地址、加载重试、子目录访问和相邻资料源依赖；原因是旧文档的空几何/未建前端描述已失效。
- 修改 `DTC_2026_官方来源与一级要求复核报告_2026-09-15.md`：增加当前本地实现状态，并明确第 1—8 节为 9 月 15 日历史联网审查；影响是保留历史证据来源，同时避免把旧计数当作当前状态。
- 同步生成 `DTC_2026_Web/public/data/profiles.json`，更新 `public/data/.checksums.json` 的 8 文件哈希登记；其余业务副本由既有脚本按资料源刷新。现有画像、代表点、来源和审核原始数据未重新生成。
- 修复前已用既有 `dist/` 在真实浏览器复现：错误 ID 显示第一条站点；`/dtc/` 子目录请求根路径数据失败，但顶栏仍显示“数据已加载”。本轮临时验收端口为 4180/4181，验证结束后关闭本轮服务。
- 编译与构建：前端与 Vite 配置的 TypeScript 检查退出码均为 0；最终 `npm run build` 通过，已刷新 `DTC_2026_Web/dist/` 的页面资源与数据副本。
- 数据检查：同步输出 8 个业务文件；前端数据校验通过（`sites=66, profiles=66, bsr=1626, evidence=1524, candidates=74/21, formal_spatial=false`）。原有 Level 1 只读校验器返回 `ok=true`，34 个合同、来源、候选隔离、画像及收据检查均通过。
- 数据校验专项复验：在隔离临时副本执行同一校验脚本，正常数据通过；重复画像 ID、缺失来源、未经批准开放几何提升分别被正确拒绝，4 个场景全部通过。临时副本已清理。
- 浏览器复验：真实浏览器覆盖总览、地图、66 行目录、详情、BSR 统计和候选复核；在域名根目录与 `/dtc/` 子目录核对画像详情，并检查第 1 条、多设施记录及第 66 条记录关联。子目录地球大陆参考层正常显示，候选页显示 74 条匹配、21 个边界、0 自动合并。
- 异常行为复验：无效站点 ID 显示“未找到参考站点”，不出现第一条站点；人为延迟数据请求时显示加载中且不提前展示画像；人为令画像请求返回 503 后显示失败和重试，解除故障并点击重试后恢复成功。这些故障只发生在临时验收服务中，实际数据文件未被修改。
- 界面复验：来源按钮打开对应来源抽屉，缺少 SHA-256 时显示“未记录”；首页显示 66 条画像、批准 0、人工确认几何 0。390px 窄屏截图及元素尺寸检查未发现画像/说明/来源按钮横向溢出，桌面详情及地图截图显示正常；正常请求的新浏览器页未记录运行错误。
- 清理：本轮创建的验收浏览器页已关闭，验收 Node 进程已终止，4180/4181 端口确认无监听，视口覆盖已复位。
- 验证范围：完成本机源码、完整构建、现有数据合同与真实浏览器验收。画像仍为 `AGENT_DRAFT`，人工确认几何仍为 0；本轮修复没有替代真实人工审核、生产部署或组委会正式提交验收。

## 2026-10-10（项目现状复查）

- 修改文件：仅更新项目根目录 `UPDATE_LOG.md`，记录本次复查的实际证据、待处理项和验证范围。原因：用户要求重新查看项目，且项目约束要求每次操作后补充本地更新说明。影响：为后续工作提供当前状态基线，本条记录不表示待处理项已经修复。
- 检查方式：大量源码及资料阅读由 GPT-6 LUNA 子代理执行，只提供文件、字段和行为描述；主代理独立复核关键源码、数据关联、文件哈希及类型检查结果。本轮未调用网页端 GPT。

### 当前实现与数据

- 主应用为 `DTC_2026_Web/`，采用 Vue 3、TypeScript、Pinia、Vue Router、Three.js 与 PapaParse。现有页面覆盖总览、代表点地图、参考站点目录、站点详情、BSR 统计和候选复核；数据从本地静态文件加载。
- `DTC_2026_Web/public/data/sites.geojson` 当前包含 66 个 Point，坐标状态均为 `AGENT_VERIFIED_REPRESENTATIVE`；其中位置语义为 `REPRESENTATIVE_POINT` 的有 56 条，`MULTI_SITE_NO_SINGLE_POINT` 的有 10 条。不能将显示点位表述为正式竞赛精确坐标或设施边界。
- `frontend_meta.json` 当前记录 `display_geometry_count=66`、`human_confirmed_geometry_count=0`、`unconfirmed_coordinate_count=66`、`formal_spatial_layer_ready=false`。
- `DTC_2026_前端直接使用/profiles.json` 有 66 条唯一画像，全部能够按 `site_id` 关联现有站点，且均有 `description_short`、`description_long`；人工审核状态全部为 `AGENT_DRAFT`。
- 当前 BSR 为 1,626 行，字段证据为 1,524 行，匹配候选为 74 行，候选面为 21 个。1,524 条证据中，`SOURCE_FACT` 为 450 条、`DERIVED` 为 1,040 条、`CANDIDATE` 为 22 条、`UNKNOWN` 为 12 条，证据总数不能直接当作已核实事实数量。
- 对 `.checksums.json` 登记的 7 个文件分别计算 SHA-256，确认相邻数据源目录、`public/data/` 和现有 `dist/data/` 的内容均与登记哈希一致。

### 本次确认的待处理项

- 画像展示尚未接通：`DTC_2026_Web/scripts/sync-data.mjs` 的 7 文件清单不含 `profiles.json`；`src/services/dataLoader.ts`、`src/stores/data.ts` 和 `src/views/SiteDetailView.vue` 没有画像加载或描述字段展示。现有详情页展示 CRS 基础字段、代表位置和证据入口，尚未展示已生成的逐站点长短说明。
- 无效详情地址会显示其他站点：`src/views/SiteDetailView.vue` 在目标 `site_id` 不存在时使用 `data.sites[0]`，会把错误地址呈现为第一条站点的详情。
- 加载状态文字与实际状态不一致：`src/layouts/AppShell.vue` 将顶栏“数据已加载”写为固定文本，没有根据 `loading`、`error` 或 `coreReady` 改变。
- 子目录部署存在数据路径限制：`vite.config.ts` 使用 `base: './'`，而 `src/services/dataLoader.ts` 使用站点根路径 `/data/`。若应用放在域名子目录且根目录没有这些数据文件，静态数据请求会指向错误位置；该项为源码路径分析，本轮没有执行部署验证。
- 部分资料说明仍保留历史状态：`DATA_GAP_RESEARCH.md` 和 `DTC_2026_官方来源与一级要求复核报告_2026-09-15.md` 中仍有主几何全空、418 条证据或尚无 Vue 工程/画像的旧描述。继续工作时应以本条复查的数据状态为准，历史报告的结论需要结合日期阅读。
- 本地资料中仍未找到组委会回信或正式作品提交介质、入口的原件依据，不能仅凭现有网页工程认定正式提交要求已满足。

### 本轮验证与边界

- `node scripts/verify-data.mjs`：通过，输出 `sites=66, bsr=1626, evidence=1524, candidates=74/21, formal_spatial=false`。
- `node node_modules/vue-tsc/bin/vue-tsc.js --project tsconfig.app.json --noEmit --incremental false`：通过，退出码 0。
- `node node_modules/typescript/bin/tsc --project tsconfig.node.json --noEmit --incremental false`：通过，退出码 0。
- 使用 PapaParse 独立解析全部证据 CSV，并复核画像计数、站点关联及审核标记；本次核对未运行数据同步脚本。
- 当前工作目录及 `DTC_2026_Web/` 不是可读取的 Git 仓库，因此未取得分支、提交历史或 Git 差异证据。
- 本轮验证覆盖源码、类型、静态数据和既有数据副本的一致性；未进行完整构建、浏览器交互或正式提交验收。本轮没有启动项目服务。

## 2026-09-15（网页端联网核验官方来源与一级要求）

- 新增 `DTC_2026_官方来源与一级要求复核报告_2026-09-15.md`，记录网页端 GPT 通过当前连接重新读取工作区并联网核对赛事公开发布页、CRS、DoD BSR、RAND、Data.gov/DISDI、USGS GNIS 和 MilitaryINSTALLATIONS 等来源的结果。
- 核验结论：当前 8 文件资料包的数量、来源分层、候选隔离和外发门总体正确，没有发现公开补充数据冒充组委会正式竞赛数据；但不能把“frontend-ready inputs”表述为已经被运行中前端实际消费。
- 明确记录两个一级任务缺口：主图层 66 条记录仍无人工确认 GIS 几何；尚未形成 66 条逐基地详细说明数据。
- 明确记录一个 provenance 限制：4 份本地初赛文件的内容来源真实可靠，但工作区尚无组委会邮件、附件清单或收件回执，暂不能独立证明它们就是组委会发给本团队的完整附件批次。
- 本次只新增核验报告和更新日志，不修改现有数据、构建器、验证器或业务代码。

## 2026-09-15（位置复核表纳入正式验证链）

- 修改 `DTC_2026_Level1_资料包/tools/build_level1_package.py`：将 `data/site_location_review.csv` 纳入正式构建、来源清单、权利清单、前端白名单和质量报告，并登记 GNIS 与 MilitaryINSTALLATIONS 的公开检索来源及外发限制。
- 修改 `DTC_2026_Level1_资料包/tools/validate_level1_package.py`：新增 66 条位置复核记录、16/10/1/18/21 分区、来源回链、候选坐标语义和主图层隔离校验；候选点全部保持 `REVIEW_REQUIRED`，不进入主图层。
- 修改 `DTC_2026_Level1_资料包/frontend_build_checklist.md`、`DATA_GAP_RESEARCH.md`：补充位置复核表及其内部复核用途。
- 修改 `DTC_2026_前端直接使用/frontend_meta.json`：增加 8 个平铺文件的运行时用途、加载范围、来源和外发边界，前端可按文件职责直接接入。
- 修改 `DTC_2026_Level1_资料包/tools/validate_level1_package.py`：明确断言 `data/site_location_review.csv` 的 `surface_scope=INTERNAL_REVIEW`，防止未来被误标为生产图层。
- 刷新 `DTC_2026_前端直接使用/frontend_meta.json` 的 `generated_at`，与本轮重建时间一致。
- 影响：此前“第 8 个文件未纳入正式验证链”的网页端审核意见已闭环；主图层仍为 66 条记录、无未确认几何，候选几何仍隔离，正式生产空间层仍未开放。
- 验证：`py_compile`、资料包构建器、独立校验器均通过；manifest 14 行，位置复核 66 行，BSR 1,626 行，收据状态为 `PUBLISHED_AFTER_VALIDATION`。

## 2026-09-15（新增前端直接使用平铺文件夹）

- 新增 `DTC_2026_前端直接使用/`，将前端启动阶段需要的 CSV、GeoJSON、JSON 和字段证据文件直接平铺复制到一个文件夹内。
- 新增 `DTC_2026_前端直接使用/README.md`，用最简说明标明每个文件的用途，并明确主地图与候选地图的使用边界。
- 影响：前端开发人员只需打开该文件夹即可开始列表、搜索、详情、统计、证据抽屉和候选复核页面，不需要在 `data/`、`evidence/`、`quality/` 等资料子目录之间查找。
- 本次只新增整理副本和说明文件，不修改原始资料、业务代码或既有 Level 1 资料包。

## 2026-09-15（按网页端复核收缩前端交付目录）

- 将 `DTC_2026_前端直接使用/` 的运行入口收缩为 5 个常规文件：`sites.geojson`、`bsr.csv`、`evidence.csv`、`source_registry.json`、`frontend_meta.json`。
- 将候选复核文件保留为 `candidates.csv`、`candidates.geojson`；候选几何仍只允许复核页按需加载，不能并入主地图。
- 新增 `source_registry.json`，合并前端来源抽屉需要的来源标题、发布者、日期、URL、许可、rights、署名和外发限制。
- 新增 `frontend_meta.json`，合并并裁剪 BSR 元数据与质量状态，保留前端需要的数量、单位、空间层边界和官方输入缺口。
- 移除前端目录中的重复/审计副本：原主表 CSV、原始长文件名副本、独立 BSR metadata、完整质量 JSON 和开发 README；完整 Level 1 资料包及其原始资料不变。
- 影响：普通前端只需读取 `sites.geojson`；统计页按需读取 `bsr.csv`；证据抽屉读取 `evidence.csv` 并通过 `source_id` 查 `source_registry.json`；候选复核页再读取两个 `candidates.*` 文件。

## 2026-09-15（补齐精简前端元数据的审计字段）

- 根据网页端独立审核结果，补充 `DTC_2026_前端直接使用/source_registry.json` 的 `retrieved_at`、`sha256`、`verification_status`，恢复来源抽屉展示获取状态、文件指纹和验证状态的能力。
- 补充 `DTC_2026_前端直接使用/frontend_meta.json` 的 `overall_status`、`exact_name_match_count`、`exact_match_location_compatible_count`、冲突统计和 `human_confirmed_geometry_count`，使首页能够表达“22 条精确兼容匹配、21 个候选面、0 个已确认几何”的边界。
- 本次只修改两个前端 JSON 和更新日志，不新增文件、不改变 7 文件结构、不修改完整 Level 1 资料包和原始数据。

## 2026-09-15（网页端第 7 轮最终就绪复核）

- 网页端独立复核结论：`READY_FOR_FRONTEND_SHELL_WITH_EXPLICIT_SPATIAL_BOUNDARY`。
- 网页端确认：主 GeoJSON 无未确认几何泄漏；21 个候选 polygon 与 74 行候选 CSV 的 eligible exact 子集一致；候选证据已正确标为 `CANDIDATE`，Andersen 为 `CONFLICT_FOUND`，且 provenance 强制回链 DISDI；BSR、rights/allowlist、指标和 receipt 发布门禁均未发现新的可复现问题。
- 当前交付边界：可立即开始前端 shell、总览、列表、筛选、详情、证据抽屉和候选复核 UI；正式生产空间层仍关闭，因为主 display geometry=0、人工确认 geometry=0、66 条点坐标未确认。当前确认收到的官方批次不包含单独竞赛坐标主表、竞赛 ID 或正式字段字典；未来官方附件才是新输入。
- 最终当前统计：66 条 CRS 参考记录、22 条精确名称/地区兼容匹配、21 个可进入候选面的精确 polygon、1 条精确组件冲突、候选建议总组件冲突 2 条、45 条无候选 polygon、BSR 1,626 行、DISDI 824 要素。
- 本地最终验证：`py_compile`、资料包构建器、独立校验器均通过；收据为 `PUBLISHED_AFTER_VALIDATION`，全部检查项为 `true`。未修改业务代码、未启动服务。

## 2026-09-15（最终网页复核指出的证据等级收敛）

- 原因：网页端复核发现 `evidence/field_evidence.csv` 将公开匹配候选写成 `DERIVED/MACHINE_MATCHED`，与当前 `SOURCE_FACT / DERIVED / CANDIDATE / UNKNOWN` 事实等级口径不一致；Andersen 的组件冲突也没有同步到证据行。
- 修改 `DTC_2026_Level1_资料包/tools/build_level1_package.py`：几何匹配证据统一标为 `CANDIDATE`；存在匹配冲突时，证据行的 `review_status` 写为 `CONFLICT_FOUND`，普通机器候选保留 `MACHINE_MATCHED`。
- 修改 `DTC_2026_Level1_资料包/tools/validate_level1_package.py`：校验所有证据等级属于现行 taxonomy，并逐条校验几何候选证据与匹配复核表的候选 ID、冲突状态一致；质量报告新增 `candidate_evidence_taxonomy_ok` 门禁。
- 影响：前端证据抽屉不会把身份/几何候选当作普通派生事实；当前仍保持主图层 `geometry=null`、21 个候选面仅供内部复核。未修改业务代码、未启动服务。
- 验证：`py_compile`、资料包构建器、独立校验器均通过；全部检查项为 `true`。

## 2026-09-15（网页复核状态编号同步）

- 修改 `DTC_2026_Level1_资料包/evidence/readiness_matrix.md`：将上一轮网页复核明确记录为 `package_iteration=3`、`review_round=5`、`CHANGES_REQUIRED`，并将证据等级修正后的待复核状态记为 `review_round=6`，不再混用 package iteration 与 review round。

## 2026-09-15（最终网页复核指出的候选证据来源门禁）

- 原因：网页端复核发现候选证据虽然已标为 `CANDIDATE`，但校验器只验证 `source_id` 存在于 manifest，没有强制它与 `site_match_review.match_source_id` 和 DISDI 来源一致；`field_evidence.csv` 也未纳入发布收据哈希。
- 修改 `DTC_2026_Level1_资料包/tools/validate_level1_package.py`：候选证据必须回链到 DISDI `source_id`，并精确匹配 `PUBLIC_REFERENCE_MATCH_CANDIDATE`、`FeatureServer layer 0`、`candidate <id>` provenance；将 `evidence/field_evidence.csv` 加入固定 receipt hash 集合。
- 影响：候选证据不能被改指向另一条合法来源而继续通过发布门禁。未修改业务代码、未启动服务。
- 验证：`py_compile`、资料包构建器、独立校验器均通过；`candidate_evidence_taxonomy_ok=true`、收据为 `PUBLISHED_AFTER_VALIDATION`。

## 2026-09-15（网页复核状态推进至第 7 轮）

- 修改 `DTC_2026_Level1_资料包/evidence/readiness_matrix.md`：将第 6 轮标记为已发现并修正 provenance 门禁问题，当前独立复核推进为 `package_iteration=3`、`review_round=7`。

## 2026-09-15（网页端最终复核指出的几何门与当前统计修正）

- 原因：网页端复核确认主图层隔离已成立，但发现 README 把 1 条组件冲突写成 2 条；同时包级校验器把“当前 0 个几何”错误收紧成“任何已确认几何都不允许”，与 `geometry_status=HUMAN_CONFIRMED` 合同不一致。
- 修改 `DTC_2026_Level1_资料包/README.md`：将组件冲突数量修正为 1，保持 22 条精确名称匹配、21 个可进入候选面的统计关系。
- 修改 `DTC_2026_Level1_资料包/tools/validate_level1_package.py`：主图层只拒绝未确认的具体几何；允许 `geometry_status=HUMAN_CONFIRMED` 且通过 Feature 合同的几何；质量校验同时核对实际 display 几何数、未确认几何数、人工确认几何数和正式空间层状态。
- 修改 `DTC_2026_Level1_资料包/tools/build_level1_package.py`：正式空间层状态根据 66 条主 Feature 的身份确认、几何确认和非空几何实际计算，不再硬编码为 `false`。
- 影响：当前资料包仍为 `display_geometry_count=0`、`formal_spatial_layer_ready=false`；未来补入真实人工确认几何时，校验器不会因“几何数量非零”而错误拒绝，但仍会拒绝未确认候选泄漏。未修改业务代码、未启动服务。

## 2026-09-15（最终一致性扫描前的当前状态）

- 当前资料包已按网页端对抗复核完成一次完整重建：`66` 条 CRS 参考目录、`22` 条精确名称匹配、`21` 个地区/组件准入候选面、`45` 条无候选 polygon、`66` 条点坐标待确认、BSR `1,626` 行、DISDI `824` 要素。
- `quality/level1_data_quality.json` 的 `_ok` 门禁由独立 validator 的真实结果回写；`quality/validation_receipt.json` 为 `PUBLISHED_AFTER_VALIDATION`，记录当前构建 ID、validator 版本、全部检查项和关键输出哈希。
- 当前边界：主 GeoJSON 仍是 `66/66` 个 `geometry=null`；候选面仅在独立 `INTERNAL_REVIEW` 图层；正式竞赛坐标、竞赛 ID、正式字段字典和逐条人工身份确认仍为 `UNKNOWN`。未修改业务代码、未启动服务、未执行外部发送。

## 2026-09-15（合同闭合后的资料包重建与独立验收）

- 原因：完成网页端对抗复核提出的 P1/P2 修正后，需要用当前工作区重新生成并验证所有落盘文件，避免只验证内存对象或沿用旧统计。
- 修改结果：重建 `DTC_2026_Level1_资料包` 的参考目录、主/候选 GeoJSON、匹配队列、BSR staging/metadata、来源 manifest、source rights、frontend allowlist 和质量报告；组件冲突候选不进入候选面；补充 `quality/validation_receipt.json`。
- 当前统计：66 条 CRS 参考目录；22 条精确名称匹配；21 个地区/组件准入候选面；45 条无候选 polygon；66 条点坐标仍未人工确认；BSR staging 1,626 行；DISDI 快照 824 要素。
- 验证：`python -m py_compile tools/build_level1_package.py tools/validate_level1_package.py` 通过；构建器通过；独立校验器 `ok=true`，包含 Draft 2020-12 实例、geometry fixture、BSR 回源/Decimal、manifest/retrieval、权限继承和验证收据检查。未修改业务代码、未启动服务、未执行外部发送。

## 2026-09-15（网页端对抗复核后的合同闭合修正）

- 原因：网页端独立复核指出上一版虽然主 GeoJSON 隔离了候选面，但校验器仍是自定义的半套 JSON Schema 语义，几何门误用 `review_status`，组件冲突仍可能显示为高置信度，BSR/来源权限/获取时间和构建验证证据链尚未闭合。
- 修改 `DTC_2026_Level1_资料包/tools/build_level1_package.py`：新增 `component_compatible`、`name_match_confidence`、`identity_confidence`；Andersen 等组件冲突不再进入候选几何层；BSR staging 字段顺序固定；来源 manifest 增加 `retrieved_at`，并将 `local_storage_status` 限定为纯存储枚举；source rights 拆为原始源文件直出、派生数据内部使用和外发三个维度；构建器在最终校验后生成 `quality/validation_receipt.json`。
- 修改 `DTC_2026_Level1_资料包/tools/validate_level1_package.py`：使用 Draft 2020-12 JSON Schema 实现校验 `$ref`、`oneOf`、`allOf` 和实例类型；几何门改为 `geometry_status`；加入身份/组件回源校验、BSR 精确字段映射/源 XLSX 重抽取/Decimal 规范文本校验、manifest 获取时间和权限继承门禁，以及三组几何合同正反 fixture。
- 修改 `DTC_2026_Level1_资料包/contracts/reference_site_feature.schema.json` 与 `contracts/bsr_field_dictionary.csv`：几何条件合同改用 `geometry_status`；BSR 字典补充目标产物、严格字段顺序和统一事实等级。
- 影响：本批修改已重新生成资料包；正式质量报告和验证收据仍以构建器及独立校验器成功结果为准。未修改业务代码、未启动服务、未执行外部发送。
- 验证：`python -m py_compile tools/build_level1_package.py tools/validate_level1_package.py`、资料包构建器和独立校验器均通过。

## 2026-09-15（第 2 轮网页端复核后的第二次本地收敛）

- 原因：网页端第 2 轮独立复核已返回 `CHANGES_REQUIRED`，指出 Feature 实例合同未真正执行、BSR 字段/表头/筛选条件落地不完整、`SHA256_VERIFIED` 证明强度过高、派生资料缺少权利依赖、DISDI 候选字段和候选资格缺少回源校验、候选面缺少机器可读复核面标记，以及质量指标命名容易误读。
- 修改 `DTC_2026_Level1_资料包/tools/build_level1_package.py`：候选表和 GeoJSON 增加 `source_feature_id` 并适配 DISDI 的 `siteReportingComponent/siteOperationalStatus` 实际字段；BSR staging 落地 `source_criteria`；Decimal 序列化不再截断小数精度；manifest 状态改为 `SHA256_COMPUTED`；allowlist 增加 `surface_scope`、`derived_from_source_ids`，并从来源权利表继承 `requires_rights_review`；质量报告将指标改为 `display_geometry_count`、`geometry_candidate_count`、`geometry_no_candidate_count` 并按实际输出计算。
- 修改 `DTC_2026_Level1_资料包/tools/validate_level1_package.py`：加载并校验 `reference_site_feature.schema.json` 的具体主图层 Feature；检查 `feature.id == properties.site_id`、确认状态与几何的条件关系、候选 Feature 到 CSV/原始 DISDI 的名称/地区/组件/运营状态回源一致性、候选资格、BSR 字段精确覆盖、源表头、当前文件哈希、allowlist 来源依赖和权利继承。
- 修改 `DTC_2026_Level1_资料包/contracts/reference_site_feature.schema.json`、`README.md`、`evidence/readiness_matrix.md`、`frontend_build_checklist.md` 和 `UPDATE_LOG.md`：补足 Feature 条件合同、当前哈希语义、内部复核面边界并标记旧的 44 条历史表述已被覆盖。
- 影响：主 GeoJSON 仍为 66 条 `geometry=null`；独立候选面仍为 22 条、全部 `CANDIDATE/REVIEW_REQUIRED`；22 条精确候选的组件和运营状态现已从原始 DISDI 回源校验通过；正式空间层和外发仍保持关闭。未修改业务代码、未启动服务、未执行外部提交。
- 验证：`py_compile` 通过；构建器通过；独立校验器 `ok=true`，包括 Feature、候选回源、BSR、哈希、权利继承和 allowlist 门禁。
- 历史协作记录：网页端第 2 轮报告已留在 DTC 2026 项目对话；该对话达到长度上限后，后续复核已在新对话完成，当前状态以本文件顶部“最终一致性扫描前的当前状态”和最新验证收据为准。

## 2026-09-15（网页端第 2 轮复核发现的资料包缺陷修正）

- 原因：网页端独立复核实际读取了当前资料包，发现 DISDI 候选字段没有适配快照真实字段名、BSR 源表表头未在按位置抽取前断言、字段字典中的 `source_criteria` 未落到 staging/metadata，以及 Feature 合同尚未对落盘 Feature 实例执行完整校验。
- 修改 `DTC_2026_Level1_资料包/tools/build_level1_package.py`：候选组件兼容 `siteReportingComponent`，运营状态兼容 `siteOperationalStatus`、`operStat`、`operationalStatus` 和 `status`；读取 BSR 前先断言 `Federal DoD Main Report` 第 4 行 A:M 的 13 个源表头及 A2 源筛选条件；将 `source_criteria` 写入每条 staging 记录和 metadata。
- 修改 `DTC_2026_Level1_资料包/tools/validate_level1_package.py`：支持 schema `const`，对主 GeoJSON 每个具体 Feature 同时校验 Feature envelope、逻辑记录属性、geometry 类型/坐标范围和 display-safe 几何边界；新增 BSR 源筛选条件与源表头落地一致性门禁。
- 补足上述 Feature 实例校验器的 `object`/`array` JSON 类型识别；这是首次重跑暴露的校验器实现遗漏，已修正后再继续验收。
- 第二次重跑发现解析阶段字段已存在但 metadata 写出遗漏；已将 `source_headers` 和 `source_criteria` 真正写入 `data/bsr_fy2024_metadata.json`，避免校验只通过内存数据而未通过落盘数据。
- 影响：候选复核表/候选 GeoJSON 会保留 DISDI 快照实际可读的组件和运营状态；BSR 源列变更或 A2 条件缺失时构建会立即失败；主图层的 Feature 合同不再只是文件级/数量级检查。候选数据仍是 `CANDIDATE`，未改变人工确认边界；未修改业务代码、未启动服务、未执行外部发送。
- 验收：待运行 `py_compile`、资料包构建器和独立校验器；网页端第 2 轮最终报告仍需继续读取。

## 2026-09-15（根据网页端独立复核收敛 Level 1 资料包）

- 原因：网页端 DTC 2026 项目对上一轮落盘结果完成独立只读复核，结论为 `CHANGES_REQUIRED`；主要指出未确认候选面会通过主 GeoJSON 泄漏到普通地图、点坐标与 polygon 状态混用、只做几何类型检查、schema 未验证落盘实例、BSR 字典列不闭合、浮点尾差、来源外发门和陈旧状态等问题。
- 修改 `DTC_2026_Level1_资料包/tools/build_level1_package.py`：主 `reference_site_catalog.geojson` 改为 display-safe，未人工确认几何统一为 `null`；新增独立 `site_match_candidates.geojson` 复核面图层；新增 `geometry_status`、`geometry_source_id`、`geometry_note`，拆开点坐标和面几何语义；精确候选增加地区兼容性、候选组件和运营状态字段；BSR 数值用 Decimal 规范化序列化；manifest 的 DISDI 要素数改为从快照实际计算；manifest 使用 `local_storage_status` 表示本地存储状态；source rights 增加前端服务/外发/需复核机器字段；构建结束自动调用独立校验器。
- 新增 `DTC_2026_Level1_资料包/tools/validate_level1_package.py`：使用 Python 标准库校验 66 条目录、记录合同实例、display-safe GeoJSON、候选几何嵌套/范围/闭环、BSR 字典和元数据闭合、证据外键、manifest/rights 对齐、DISDI 要素数和外发门；失败返回非零退出码。
- 新增 `DTC_2026_Level1_资料包/contracts/reference_site_feature.schema.json`、`data/bsr_fy2024_metadata.json` 和 `manifest/frontend_allowlist.csv`；更新 `contracts/reference_site.schema.json`、`contracts/bsr_field_dictionary.csv`，补充 `contest_record_id`、geometry 状态、provenance 字段和源快照不直出的文件白名单。
- 更新 `README.md`、`frontend_build_checklist.md`、`evidence/input_boundary.md`、`evidence/readiness_matrix.md` 及 GIS 总目录：明确主图层/候选复核层分离、66 条点坐标仍未确认、44 条无候选几何、源快照禁止直接外发；将网页端独立复核更新为第 1 轮已完成、第 2 轮待复核；把总目录中的旧工作流段落标为历史快照；同步构建器模块说明，避免误读为候选几何已进入主地图。
- 影响：当前资料包可以安全开始前端壳、列表、筛选、详情、证据抽屉和复核 UI；正式竞赛坐标/ID、人工确认空间层和组委会正式字段字典仍为 `UNKNOWN`。未修改业务代码、未启动服务、未执行外部提交。
- 验证：`python -m py_compile ...` 通过；构建器输出 `catalog_rows=66`、`bsr_federal_data_rows=1626`、`candidate_geometry_rows=22`、`manifest_rows=12`、`validation=passed`；独立校验器 `ok=true`。

## 2026-09-14（确认初赛官方文件包为完整输入）

- 原因：用户进一步确认，组委会提供的就是 `初赛官方文件` 目录中的这 4 份文件，不再有单独的坐标附件或其他数据包。
- 将项目状态从“等待确认是否还有官方基地主数据”修正为“官方输入边界已确认，进入参考主表和一级 GIS 数据合同构建”。
- 明确已知限制：官方包不含独立的竞赛坐标主表、GeoJSON/CSV/GPKG、竞赛专用 ID 或正式字段字典。
- 更新总审计报告、报名指南、GIS 总目录、GIS 检索方案和研究资料 README，删除“继续等待另一个数据包”的下一步表述。
- 确定下一步：从 1 号 CRS 报告建立 66 个 `reference_site_catalog` 记录，用 Excel 做只读属性 staging，用公开可核验来源补齐地理位置和身份字段，并将补充内容标记为 `PUBLIC_ENRICHMENT`/`DERIVED`。
- 影响：仅更新比赛资料和进度文档，未修改业务代码、配置或运行服务，未执行外部发送或提交。

## 2026-09-14（初赛官方文件接收与逐份分析）

- 原因：用户确认报名已通过，组委会发送了初赛官方参考文件；需要把文件逐份读完，说明每份材料在项目中的用途，并同步当前项目进度。
- 已审计 `初赛官方文件` 下的 3 份 PDF 和 1 份 XLSX，以及 PDF 转换后的 Markdown 和转换产物；记录了文件哈希、页数/工作表、主要字段、日期口径、统计范围和可用边界。
- 新增 `初赛官方文件\分析报告\00_初赛官方文件审计总报告与项目进度_2026-09-14.md`，汇总四份文件的关系、当前阶段、输入分层、下一步和使用限制。
- 新增 `初赛官方文件\分析报告\01_基础设施背景与项目应用分析_2026-09-14.md`，分析 66 个重要站点、基础设施功能、访问/所有权模式和韧性概念。
- 新增 `初赛官方文件\分析报告\02_基地结构报告与数据接入分析_2026-09-14.md`，分析 FY2024 Excel 的全部工作表、筛选口径、统计差异、区域记录和一级数据接入方式。
- 新增 `初赛官方文件\分析报告\03_盟友伙伴视角与场景模型分析_2026-09-14.md`，分析盟友/伙伴场景假设、时间范围、分层结果和非实时使用边界。
- 新增 `初赛官方文件\分析报告\04_INDOPACOM组织与场景边界分析_2026-09-14.md`，分析责任区、组织结构、公开兵力背景和模型/UI 使用边界。
- 更新报名指南、GIS 总目录、GIS 检索方案和研究资料 README：报名状态改为已通过，当前阶段改为 D0—D1 官方资料接收审计与一级数据合同准备。
- 明确当前尚未确认有竞赛专用坐标主表、GeoJSON/CSV/GPKG、唯一记录编号或正式字段字典；参考报告不能直接替代一级地图主数据。
- 影响：仅新增/更新比赛资料与分析文档，未修改 IntelliTwin、前端、后端、配置或运行服务，未执行外部发送或提交。

## 2026-09-13（清理旧版 PPT 与 PDF）

- 原因：用户要求删除其他无用 PPT 和 PDF，避免报名版本混淆。
- 已删除 15 个文件：8 个旧版正式 PPTX/PDF，以及 7 个候选、备份 PPTX。
- 仅保留 AI辅助开发版 PPTX 和 PDF；清理前后 SHA-256 一致，内容未修改。
- 图片、研究资料、构建脚本、渲染图和校验回执保留。历史日志中的旧版交付记录保留为历史说明，文件现已删除。
- 同步图片来源说明中的当前版本信息。未执行外部发送或提交。

### 已删除文件

- `DTC_2026_报名材料\报名PPT_白茗松_DTC2026_赛道二.pptx`
- `DTC_2026_报名材料\报名PPT_白茗松_DTC2026_赛道二.pdf`
- `DTC_2026_报名材料\报名PPT_白茗松_DTC2026_赛道二_精简图文版.pptx`
- `DTC_2026_报名材料\报名PPT_白茗松_DTC2026_赛道二_精简图文版.pdf`
- `DTC_2026_报名材料\报名PPT_白茗松_DTC2026_赛道二_蓝青配色版.pptx`
- `DTC_2026_报名材料\报名PPT_白茗松_DTC2026_赛道二_蓝青配色版.pdf`
- `DTC_2026_报名材料\报名PPT_白茗松_DTC2026_赛道二_SCADA封面修订版.pptx`
- `DTC_2026_报名材料\报名PPT_白茗松_DTC2026_赛道二_SCADA封面修订版.pdf`
- `.ppt_build\registration_deck_candidate.pptx`
- `.ppt_build\registration_deck_prior_final.pptx`
- `.ppt_build\tmp\registration_deck_candidate.pptx`
- `.ppt_build\revision\candidate.pptx`
- `.ppt_build\styled\candidate.pptx`
- `.ppt_build\scada-cover\candidate.pptx`
- `.ppt_build\ai-practice\candidate.pptx`

## 2026-09-13（第三页改为 AI 辅助开发实践）

- 原因：用户确认第三页应强调 Vibe Coding 开发方式，而第二页继续保留 SCADA 技术经验。
- 新增 `.ppt_build/build_ai_practice.mjs` 与派生构建文件 `.ppt_build/ai_practice_generated.mjs`，仅替换第三页文字；中间产物和校验资料在 `.ppt_build/ai-practice/`。
- 新增 `DTC_2026_报名材料/报名PPT_白茗松_DTC2026_赛道二_AI辅助开发版.pptx` 及同名 PDF，保留此前版本。
- 第三页标题改为“AI 辅助开发实践”，副标题为“结合 Vibe Coding 与工程验证，完成需求拆解、功能开发和迭代”。
- 两张图片标签改为“Web 可视化应用”“三维仿真应用”，说明文字突出定义需求、组织 AI 辅助开发、检查结果和修正问题。
- 沿用实际项目图；不宣称全部代码由 AI 生成，不增加未经验证的效率指标。其余五页、第二页 SCADA 表述、封面联系方式及配色不变。
- 导出后核验六页结构、第三页文字与版式，以及其他五页正文未变。未执行外部发送或提交。

## 2026-09-13（SCADA 通用名称与封面联系信息）

- 原因：用户要求各页采用 SCADA 等通用项目类别名称，并在首页展示电话、邮箱和个人开发者身份，去除大号 DTC 标题。
- 新增 `.ppt_build/build_scada_cover.mjs` 及派生构建文件 `.ppt_build/scada_cover_generated.mjs`；新成品为 `DTC_2026_报名材料/报名PPT_白茗松_DTC2026_赛道二_SCADA封面修订版.pptx` 和同名 PDF，构建与渲染资料保存在 `.ppt_build/scada-cover/`。
- 第 1 页：将项目名称提升为主标题；赛事名称小字号保留；移除大号 DTC；补充姓名、个人开发者身份、电话和邮箱。联系方式直接读取已存在的本地报名邮件，不推测或另造号码。
- 第 2、3 页：将“二维监控研发”“Web 二维监控”改为“SCADA 系统研发”“Web SCADA 系统”；机器人案例改用“工业机器人仿真”通用名称；“独立开发者”统一为用户指定的“个人开发者”。
- 保持已确认的 6 页结构与蓝青配色，原始项目截图及其证据来源不篡改，不把 SCADA 类别表述扩展成未经验证的完整工业功能承诺。
- 导出后核验所有幻灯片文字、首页联系方式及最终渲染版式；PPTX 为可编辑正文，PDF 为图片型预览。保留所有历史版本。
- 未修改业务代码或原始项目图片，未发送、上传或提交材料。

## 2026-09-13（报名 PPT 克制配色修订）

- 原因：用户认可内容，要求减少纯黑白感，增加克制的样式。
- 新增 `.ppt_build/build_styled.mjs`，复用已确认的 6 页文字和图片，派生蓝青配色版本；构建结果保存在 `.ppt_build/styled/`，派生构建文件为 `.ppt_build/styled_generated.mjs`。
- 新增 `DTC_2026_报名材料/报名PPT_白茗松_DTC2026_赛道二_蓝青配色版.pptx` 及同名 PDF，保留已有版本。
- 样式：封面上半部深蓝底、白色标题、浅青副标题；内页采用浅蓝标题区、青绿色强调、深蓝标题、浅青重点区域及项目图片细边框。
- 影响：仅调整颜色和背景层次，页数、正文、联系方式、项目图和个人贡献表述均沿用已确认版本。
- 验证：导出后检查 6 页最终渲染，核对正文与原图文版一致；PDF 为图片型浏览副本，PPTX 保持原生可编辑文字。
- 未修改业务源码或项目原图，未启动或停止服务，未执行外部发送与提交。

## 2026-09-13（报名 PPT 精简与项目配图修订）

### 修改原因与原则

- 根据用户确认的精简方向，将报名材料压缩为 6 页，聚焦团队介绍、相关实践和初步设想。
- 遵循最简原则和事实可核验原则，以实际项目截图替换重复的能力声明，保留原稿及原始图片。

### 新增文件与内容

- `DTC_2026_报名材料/报名PPT_白茗松_DTC2026_赛道二_精简图文版.pptx`：6 页，灰白风格，正文为可编辑原生文本，嵌入两张项目图。
- 同名 `.pdf`：最终幻灯片渲染图构成的浏览副本。
- `DTC_2026_报名材料/项目图片/二维监控_组件验收.png`：既有二维监控组件验收图副本，说明本人组件、数据绑定、API 工作，不夸大为全部平台原创。
- `DTC_2026_报名材料/项目图片/机器人Web_笛卡尔示教.png`：既有机器人 Web 示教截图副本，说明教学仿真与三维交互能力。
- `DTC_2026_报名材料/项目图片来源与使用说明.md`：记录原始路径、贡献依据、采用位置、未采用素材、身份待确认项和验证边界。
- `.ppt_build/build_revision.mjs`、`.ppt_build/run_revision.ps1`：新版构建、渲染与 PDF 导出流程。
- `.ppt_build/revision/`：候选稿、最终稿渲染和校验回执。

### 具体调整及影响

- 删除原版反复出现的“不虚构”“不作的承诺”等写作过程说明。
- 移除报名流程、截止日期、组委会问询及未经依据支撑的 D0—D17 排期，改用阶段交付目标。
- 将三级任务名称与本团队一级重点分开表述，保留二级方向的简要初步设想。
- 补充地图浏览、对象详情、智能体辅助、人工核验和成果演示等具体功能。
- 修复原图文布局中文字越界、句号单独换行与邮箱超出色块问题。
- 团队名暂用“BMS 数字孪生”；任职单位名称沿用此前不披露口径，这两项尚待用户确认。原邮件附件名仍指向原版，未自动修改或发送。

### 检查与边界

- 构建脚本语法检查通过；首次校验因缺少运行时依赖路径环境变量失败，补齐运行环境后通过。
- 新版 PPTX 共 6 页，包完整性、首方导入、字体和几何检查通过；逐页查看最终稿渲染，未见越界、叠字或图片变形。
- PDF 为图片型浏览副本；未在用户 PowerPoint 中实际播放。既有项目截图不代表本轮重新运行验收。
- 不修改来源项目，不启动、停止或重启现有服务；不发送邮件、不上传材料、不执行任何外部报名提交。

## 2026-09-13

### 新增文件

- `DTC_2026_参赛调研与二级晋级方案.md`

### 修改原因

- 根据第八届数字孪生体挑战赛（DTC 2026）公开赛题、主办方关联资料、数字孪生体联盟资料、历届公开项目和 ACE/PMTEC 官方公开资料，形成参赛赛道选择与二级任务推进方案。
- 当前工作区此前为空，新增独立 Markdown 资料作为后续报名 PPT、任务拆解和实现验收的依据。

### 修改内容

- 核对 DTC 2026 两大赛道、三级任务、公开截止时间和奖励信息。
- 区分本届“一级/二级任务”与历届“阶段”表述，明确二级晋级存在专家评审边界。
- 汇总第二届、DTC 2021、DTC 2023、DTC 2024、DTC 2025 的公开项目形态和可验证规律。
- 对理论研究和场景开发进行工作量、可验收性、团队技术匹配度和 17 天窗口的比较。
- 给出推荐项目定位、一级 GIS 交付物、二级抽象状态/资源推演模型、时间表、分工、报名 PPT 结构和风险刹车线。
- 明确公开事实、场景假设、待确认事项和不应夸大的军事能力边界。

### 影响范围

- 只新增参赛调研文档和更新说明。
- 未修改 IntelliTwin、RAG、前端、后端、配置或任何现有项目源码。
- 未启动或重启任何前后端服务。

## 2026-09-13（第二次资料研究）

### 新增文件

- `DTC_2026_赛道2_GIS信息采集与检索方案.md`

### 修改原因

- 根据用户确定的场景开发赛道方向，建立 GIS、基地画像、ACE 抽象推演和 PMTEC 背景所需的系统化资料搜集方案。
- 将“广泛搜集”拆分为竞赛规则、基地主数据、基础地理、交通网络、保障背景、环境灾害、ACE/PMTEC 概念、历届案例、GIS 技术、许可证和可复现证据等独立研究域。
- 通过并行资料检索补充官方 ACE/PMTEC/保障资料、开放地理数据源、技术文档和数字孪生展示案例。

### 修改内容

- 新增 12 类信息域、P0/P1/P2 数据优先级和四轮检索顺序。
- 新增中英文检索词库、数据源分层、来源/许可证/事实边界规则。
- 新增基地、图层、节点、连接、资源、事件和运行记录的字段建议。
- 新增智能体资料抽取、人工审核、来源回链、质量检查和安全边界要求。
- 新增多智能体/多人分工模板、组委会待确认问题、9 月 13 日至 9 月 30 日的研究与开发节奏。
- 补充 ACE 的节点/保障/集中指挥与分布执行思路，以及 PMTEC 作为训练数据连接和复盘层的建模建议。
- 补充公开数据源池：Geofabrik、OCHA HDX、FAO GAUL、NOAA GSHHG/ETOPO/气象、Copernicus、ESA、IBTrACS、GDACS、Sentinel、Landsat、GIBS、GeoNames、Overture 和历史档案等，并区分 P0/P1/P2/P3 接入优先级。
- 补充可借鉴的数字孪生、地理仿真和时间回放案例，用于确定案例总览、时空地图、对象/事件详情和评估回放四类页面。
- 明确不搜集或不接入真实基地脆弱性、武器参数、实时军事活动、可执行攻击路径和其他现实行动化内容。

### 影响范围

- 只新增资料规划文档并更新本日志。
- 未修改 IntelliTwin、RAG、前端、后端、配置或任何现有项目源码。
- 未启动或重启任何前后端服务。

## 2026-09-13（第三次资料研究：LUNA 并发广泛检索）

### 新增文件

- `DTC_2026_GIS研究资料/README.md`（补充批次完成状态和目录入口）
- `DTC_2026_GIS研究资料/00_总目录与取数路线_2026-09-13.md`
- `DTC_2026_GIS研究资料/01_竞赛规则与历届项目.md`
- `DTC_2026_GIS研究资料/02_基地身份与公开画像来源.md`
- `DTC_2026_GIS研究资料/03_基础地理与行政海洋数据源.md`
- `DTC_2026_GIS研究资料/04_交通港口机场与抽象网络数据源.md`
- `DTC_2026_GIS研究资料/04_交通与基础设施数据源_LUNA.md`
- `DTC_2026_GIS研究资料/05_地形气象海洋与灾害数据源.md`
- `DTC_2026_GIS研究资料/06_ACE_PMTEC抽象模型与公开证据_LUNA.md`
- `DTC_2026_GIS研究资料/07_GIS技术标准与案例_LUNA.md`
- `DTC_2026_GIS研究资料/08_元数据许可证质量治理_LUNA.md`

### 修改原因

- 按用户要求并发使用 GPT-5.6-LUNA，对赛道 2 GIS/Level 1/Level 2 所需的竞赛规则、公开画像、地理底图、交通网络、环境灾害、ACE/PMTEC、GIS 技术、许可证和质量治理进行大范围检索。
- 将搜索结果从对话消息固化为可回溯 Markdown，避免来源、字段、格式、许可证、优先级和安全边界丢失。
- 对交通方向保留“宽候选池”和“LUNA 收敛稿”两份资料：前者用于发现来源，后者用于 P0/P1 接入决策。

### 修改内容

- 记录 DTC 2026 赛道 2 任务边界、历届公开项目线索、证据等级和一级验收关注点。
- 收集 GNS、GNIS、GeoNames、历史档案、Natural Earth、OSM、HDX、GAUL、海岸线、海域、GEBCO/ETOPO 等基础与公开画像来源。
- 收集 OurAirports、NGA WPI、FAA、OSM/Overpass/Geofabrik、Overture、GISCO、BTS、TIGER/Line、GTFS、货运统计等交通与抽象网络来源。
- 收集 USGS、NASA、NOAA、Copernicus、GEBCO、JMA、GDACS、GloFAS 等地形、气象、海洋和灾害来源，并整理离线快照字段。
- 基于公开 ACE/PMTEC、LVC、韧性资料抽象实体、关系、状态机、事件类型和评估指标，明确不进入现实行动化推演。
- 核验 MapLibre、PostGIS、STAC、GeoJSON/GeoPackage/矢量瓦片、QGIS、Cesium 和公开数字孪生案例，收敛“2D 优先、3D 可选、证据先行”的技术路线。
- 记录 RFC 7946、OGC、DCAT/ISO、数据许可、版本冻结、SHA-256、CRS/时间语义和质量检查要求。
- 新增总目录、P0 取数顺序、统一数据合同、来源台账字段和下一步工作清单。

### 影响范围

- 只新增和更新比赛资料 Markdown 及本更新日志。
- 未修改 IntelliTwin、RAG、前端、后端、配置或任何现有项目源码。
- 未启动、停止或重启任何前后端服务。
- 研究资料仅使用公开、非敏感信息；未保存实时军事活动、现实脆弱性、武器效能或可执行攻击路径。

## 2026-09-13（第四次资料研究：报名流程校正）

### 新增文件

- `DTC_2026_报名指南与报名PPT清单_2026-09-13.md`

### 修改文件

- `DTC_2026_赛道2_GIS信息采集与检索方案.md`
- `DTC_2026_GIS研究资料/00_总目录与取数路线_2026-09-13.md`

### 修改原因

- 根据重新核对的 DTC 2026 公开赛题稿，确认报名材料是团队介绍 PPT，发送邮箱为 `innobase@qq.com`，咨询微信为 `punkt1`；公开稿标注截止日期为 2026-09-30。
- 修正先前“先广泛取数、再推进报名”的工作顺序。场景开发一级明确依赖组委会提供的基地数据，因此报名和取得正式数据应是项目第 0 步。

### 修改内容

- 新增报名事实、证据状态、推荐邮件标题和正文、PPT 页结构、报名回执保存项、数据发放确认问题和收到数据后的审计流程。
- 在 GIS 信息采集方案中新增“报名是正式工作流的第一步”，明确公开数据只能用于预研，不能替代组委会数据。
- 在总目录中将 P0 顺序改为“报名 → 组委会确认/数据 → 原始数据审计 → 公开背景校验 → 一级 GIS → 二级抽象推演”。

### 影响范围

- 只新增/更新比赛资料 Markdown 和本更新日志。
- 未发送报名邮件、未联系组委会、未提交任何外部表单，也未下载或接收新的组委会数据。
- 未修改任何业务源码，未启动、停止或重启服务。

## 2026-09-13（第五次资料研究：最新公众号通知核验）

### 新增文件

- `DTC_2026_GIS研究资料/09_最新公众号通知核验_报名与数据下发_2026-09-13.md`

### 修改文件

- `DTC_2026_报名指南与报名PPT清单_2026-09-13.md`
- `DTC_2026_赛道2_GIS信息采集与检索方案.md`
- `DTC_2026_GIS研究资料/00_总目录与取数路线_2026-09-13.md`
- `DTC_2026_参赛调研与二级晋级方案.md`

### 修改原因

- 用户补充了两篇微信公众号材料，需要核对最新报名、审核、数据发放和截止时间信息。
- 2026-09-10 的《数据资料下发通知》补充说明：报名材料需要经过组委会审阅/批准，数据已开始向相关团队代表发放；其他团队仍可报名，通知写明正常截止时间为 2026-10-30。
- 该通知与 2026-09-05 公开赛题稿中的 2026-09-30 截止时间存在冲突，必须保留冲突并以最新通知暂定执行、通过邮件确认。

### 修改内容

- 保存两篇公众号的标题、日期、链接、可核实事实、未知项和对项目流程的影响。
- 将报名流程从“发邮件后等待数据”修正为“发送 PPT → 审核/批准 → 组委会发送数据 → 确认收件”。
- 将报名指南中的暂定截止时间更新为 2026-10-30，并保留与旧公开稿的冲突说明。
- 增加数据仅限本届比赛使用、不得外传或另作他用的资料治理提醒。
- 更新 GIS 资料总目录和采集方案，明确正式组委会数据在公开预研资料之前具有输入优先级。
- 将旧的固定日期排期改为“报名获批并收到数据后的相对 D0—D17 节奏”，提交节点以组委会最新通知为准。

### 影响范围

- 只新增/更新比赛资料 Markdown 和本更新日志。
- 未发送报名邮件、未联系组委会、未提交外部表单、未下载或接收组委会数据。
- 未修改任何业务源码，未启动、停止或重启服务。

## 2026-09-13（第六次资料研究：报名 PPT 交付）

### 新增文件

- `DTC_2026_报名材料/报名PPT_白茗松_DTC2026_赛道二.pptx`
- `DTC_2026_报名材料/报名PPT_白茗松_DTC2026_赛道二.pdf`
- `DTC_2026_报名材料/报名邮件正文_白茗松_DTC2026.md`
- `.ppt_build/build_registration_deck.mjs`
- `.ppt_build/run_build.ps1`
- `.ppt_build/run_render_pdf.ps1`
- `.ppt_build/make_pdf.py`

### 修改原因

- 根据已确认的报名信息，准备白茗松以独立开发者身份参加赛道二的报名材料。
- 以“进入第二阶段”为目标，报名 PPT 需要同时说明赛道理解、已有可验证能力、一级 GIS 交付路径、二级抽象推演目标和报名后工作节奏。
- 用户指定采用灰白科技风；在缺少截图授权和组委会正式数据的情况下，使用可编辑的原生图形、流程框和文字，不使用内部项目名称、内部数据或真实系统截图。

### 修改内容

- 制作 8 页 16:9 灰白科技风报名 PPT，项目名为“Pacific ACE 分布式基地网络数字孪生与保障推演平台”。
- 将个人介绍、工业数字孪生/Web 二维监控、Vue/TypeScript、Agent/MCP、Agent/RAG 和工程交付能力写成可核验能力，不宣称 DTC 数据已取得、任务已完成或已有成熟军事系统。
- 增加“正式数据 → 一级 GIS → 二级目标”的递进路线，以及报名获批并收到数据后的 D0—D17 相对节奏。
- 增加报名收件邮箱、独立开发者身份、项目名、赛道名和需要组委会确认的审核/数据/坐标系/字段/提交安排。
- 生成 PDF 副本并核验为 8 页；生成报名邮件正文，包含手机号，仅保存本地，不自动发送。
- 交付校验通过：PPTX 结构完整性通过、8 页、首方导入通过、微软雅黑字体策略通过、版式重叠告警清零。
- 处理一次 Windows PowerShell 中文路径编码问题，并保留修订前 PPTX 与校验回执作为构建目录内的回退证据。

### 影响范围

- 新增报名材料和构建/渲染辅助文件；未修改任何业务源码、前端、后端或现有比赛研究资料的技术内容。
- 未发送报名邮件、未联系组委会、未提交外部表单，也未取得组委会正式数据。
- 未启动、停止或重启任何前后端服务。
- 材料中的二级方案、时间节奏和数据字段均为报名后的拟实现方案，正式要求以组委会回复和数据包说明为准。

## 2026-09-14（Level 1 资料包落盘与当前入口整理）

### 新增文件

- `DTC_2026_Level1_资料包/README.md`
- `DTC_2026_Level1_资料包/frontend_build_checklist.md`
- `DTC_2026_Level1_资料包/evidence/input_boundary.md`
- `DTC_2026_Level1_资料包/evidence/official_sources_research.md`
- `DTC_2026_Level1_资料包/evidence/field_evidence.csv`
- `DTC_2026_Level1_资料包/contracts/reference_site.schema.json`
- `DTC_2026_Level1_资料包/contracts/bsr_field_dictionary.csv`
- `DTC_2026_Level1_资料包/data/reference_site_catalog.csv`
- `DTC_2026_Level1_资料包/data/reference_site_catalog.geojson`
- `DTC_2026_Level1_资料包/data/bsr_fy2024_federal_staging.csv`
- `DTC_2026_Level1_资料包/data/site_match_review.csv`
- `DTC_2026_Level1_资料包/manifest/source_manifest.csv`
- `DTC_2026_Level1_资料包/quality/level1_data_quality.json`
- `DTC_2026_Level1_资料包/quality/level1_data_quality.md`
- `DTC_2026_Level1_资料包/tools/build_level1_package.py`
- `DTC_2026_Level1_资料包/sources/official_disdi/NTAD_Military_Bases_2025-11-11.geojson`
- `DTC_2026_Level1_资料包/sources/official_disdi/Military_Bases_NTAD_Data_Dictionary.xlsx`

### 修改文件

- `DTC_2026_GIS研究资料/00_总目录与取数路线_2026-09-13.md`
- `DTC_2026_GIS研究资料/02_基地身份与公开画像来源.md`
- `DTC_2026_GIS研究资料/09_最新公众号通知核验_报名与数据下发_2026-09-13.md`
- `DTC_2026_GIS研究资料/README.md`
- `DTC_2026_报名指南与报名PPT清单_2026-09-13.md`
- `DTC_2026_赛道2_GIS信息采集与检索方案.md`
- `初赛官方文件/分析报告/00_初赛官方文件审计总报告与项目进度_2026-09-14.md`
- `初赛官方文件/分析报告/01_基础设施背景与项目应用分析_2026-09-14.md`
- `初赛官方文件/分析报告/02_基地结构报告与数据接入分析_2026-09-14.md`
- `初赛官方文件/分析报告/03_盟友伙伴视角与场景模型分析_2026-09-14.md`

### 修改原因

- 将四份本地初赛原件、CRS Table A-1、FY2024 BSR、公开 DISDI 快照及其数据字典组织成可重复生成的 Level 1 foundation 资料包。
- 让前端明早能够直接读取静态 CSV、GeoJSON、JSON 和证据表，同时把 44 条没有可靠公开几何的记录保留在待复核队列中。
- 根据审计复核修正字段语义：内部 `site_id`、CRS `source_record_no` 和未来可能出现的 `contest_record_id` 分离；不把公开机器候选写成人工确认。
- 修正 BSR 报告中 PRV 的金额单位表述，保留原始 `$M` 口径，避免把 `$2,232.31B` 误写成不一致的中文金额。
- 把历史研究稿中的过时“等待数据/尚未收到”表述标为历史快照，并把当前权威入口指向 Level 1 资料包；不删除历史证据。

### 修改影响与验收

- [历史快照，已被 2026-09-15 资料包合同覆盖] 66 条参考站点记录可从 `reference_site_catalog.csv` 和 GeoJSON 读取；当时 22 条为 DISDI 精确归一化名称机器候选，44 条为 `geometry: null` 的待定位记录。现行主 GeoJSON 为 66/66 条 `geometry: null`，候选面单独存放。
- 生成器只读取本地 CRS 转换 Markdown、原始 BSR XLSX 和可选 DISDI 快照；不修改四份初赛原件、不生成虚构坐标、不进行模糊自动合并。
- BSR staging 保留 `Federal DoD Main Report` 1,626 条源行、源工作表和源行号；字段字典明确 PRV 原始单位为 `USD million`。
- 已建立字段级证据、来源 manifest、JSON Schema、质量 JSON/Markdown 和前端开工清单；质量门禁要求 66/66 行、ID 唯一、证据覆盖完整、坐标不猜测。
- 当前工作区没有启动、停止或重启前后端服务，也没有修改业务源码。
- 额外修正了 GeoJSON 属性类型：`source_record_no` 输出为整数，空坐标/空来源输出为 JSON `null`，与 `contracts/reference_site.schema.json` 一致；CSV 的空值表现保持不变。
- 新增 `data/site_match_candidates.csv`：保留 DISDI 精确名称和美国/属地站点的低置信度相似候选，所有行固定 `auto_merge=false`，用于前端复核界面，不改变主目录或主 GeoJSON 的身份/几何。
- 收紧候选状态：没有同州/属地候选或未达到阈值的记录统一标为 `NO_CANDIDATE_GENERATED`，不再生成带空候选名的 `FUZZY_SUGGESTION` 行。
- 新增 `evidence/readiness_matrix.md`：将原件、66 条主表、GeoJSON、BSR staging、字段合同、证据覆盖、匹配队列、质量门禁、网页端复核和正式竞赛数据缺口逐项对应到实际文件与前端影响。
- 新增 `manifest/source_rights.csv`：将 12 条 manifest 来源的许可证、访问级别、权利限制、署名和再分发状态结构化，特别保留 DISDI 元数据中的 CC0、`non-public` 和 `otherRestrictions` 三个信号。
- 修正质量 JSON 的 manifest 统计，新增总来源数和本地转换产物数，确保 4 个原件、6 个转换产物、2 个公开快照在机器报告中完整可见。
- 修正质量 Markdown 生成模板，追加与 JSON 同步的 manifest、权利表、候选队列和当前可开工边界，避免人读报告停留在旧版统计。
- 将 `manifest/source_rights.csv` 纳入 `build_level1_package.py` 的可重复生成流程，并在质量 JSON 增加 manifest/权利表一一覆盖校验。
- 修正 1 号分析报告末尾、报名指南数据发放表格和 GIS 方案前部的历史状态残留，明确当前以 Level 1 资料包为入口，正式竞赛坐标/ID 仍为未知。
- 为 09 号公众号核验稿的两条旧状态加上 `[历史快照]` 前缀，防止检索结果将 2026-09-13 当日状态误当成当前状态。

## 2026-09-15（公开位置候选补充与前端入口收敛）

### 新增文件

- `DTC_2026_前端直接使用/site_location_review.csv`
- `DATA_GAP_RESEARCH.md`

### 修改内容

- 通过 USGS GNIS 官方地名服务为美国本土/属地站点收集官方地名、GNIS Feature ID、州/县和坐标候选；单点候选 16 条，多选/多点候选 10 条，Wake Island 保留为非军事地名候选 1 条。
- 通过美国国防部 MilitaryINSTALLATIONS 官方目录为 18 条海外站点补充安装点名称、所在地区和官方页面链接；这些页面用于身份/地区上下文，不被当作精确坐标主表。
- 将 66 条参考站点统一收敛为一张 `site_location_review.csv`，保留 `CANDIDATE`、`UNKNOWN`、`REVIEW_REQUIRED` 和未解决状态；未确认的候选坐标没有写入主 `sites.geojson`。
- 在 `frontend_meta.json` 增加位置复核表统计，在 `source_registry.json` 登记 GNIS 与 MilitaryINSTALLATIONS 两个公开补充来源，并明确外发仍关闭、需人工复核。

### 修改原因与影响

- 将能够公开核验的补充信息先落盘，减少前端继续构建时的空白字段，同时保持组委会正式坐标、竞赛 ID 和正式字段字典的未知边界。
- 前端直接使用目录只新增 1 张 66 行复核表；原有主地图、BSR、证据和候选面文件不被替换，主地图仍为 66 条空几何。
- 公开补充数据仍是内部复核用途，不能据此宣称已经获得组委会官方竞赛坐标或完成身份确认。
## 2026-09-15（网页 GPT 联网补查剩余公开资料）

- 新增 `DTC_2026_剩余公开资料查询方案_网页GPT_2026-09-15.md`，记录网页端 GPT 自行联网核查 66 条基地公开身份、地区来源、位置候选和逐基地说明来源的结果。
- 按参赛者确认，明确记录 `初赛官方文件/` 下 3 个 PDF + 1 个 XLSX 是组委会提供的完整初赛资料；不再把缺少传输凭证作为本轮阻塞。
- 记录 21 条原 `NO_PUBLIC_CANDIDATE_FOUND` 已找到官方身份/地区来源，但精确坐标/几何仍保持 `CANDIDATE` 或 `UNKNOWN`，不升级为 DTC 官方坐标。
- 记录菲律宾 EDCA、复合/伞形 installation、环礁和通信设施的名称与位置语义限制，避免公开补充被误写成组委会数据或精确基地几何。
- 本轮没有修改原始数据、候选图层、前端直接使用文件或业务代码；仅新增研究记录。

## 2026-09-15（网页 GPT 方案执行：66 条基地档案、来源引用与位置审核）

### 新增文件

- `DTC_2026_Level1_资料包/contracts/base_profile.schema.json`
- `DTC_2026_Level1_资料包/data/base_profiles.json`
- `DTC_2026_Level1_资料包/data/site_point_candidates.csv`
- `DTC_2026_Level1_资料包/sources/public_enrichment/public_source_registry.csv`
- `DTC_2026_Level1_资料包/tools/build_profile_artifacts.py`
- `DTC_2026_前端直接使用/profiles.json`
- `DTC_2026_前端直接使用/point_candidates.csv`

### 修改内容

- 按网页 GPT 的执行方案，为 CRS Table A-1 的 66 条记录生成 66 条一一对应的结构化基地说明；每条保留 CRS 来源 ID、公开补充来源 ID、说明短文/长文、未知项和人工审核状态。
- 登记 36 条公开补充来源：包括 USGS GNIS、Military OneSource 目录，以及网页 GPT 复核到的美军、盟友国防部门、菲律宾 EDCA 等公开官方页面；所有补充来源都标为 `PUBLIC_ENRICHMENT`，不冒充组委会输入。
- 生成 17 条 GNIS 点候选，全部标为 `CANDIDATE` + `REVIEW_REQUIRED`，只进入 `site_point_candidates.csv` 审核表，不写入主 GeoJSON。
- 为所有档案设置 `human_review_status=AGENT_DRAFT`、位置 `coordinate_review_status=REVIEW_REQUIRED`；公开身份已找到的 39 条与仅候选身份的 27 条分开统计，未把 66 条都夸大为已确认。
- 更新 `source_manifest.csv`、`source_rights.csv`、`frontend_allowlist.csv`、`frontend_meta.json`、`source_registry.json` 和质量报告；新增档案默认不加载，点位候选仅用于内部审核，外发门仍全部关闭。
- 增加补充脚本的具体实例检查：66 条档案唯一性、来源引用是否进入 manifest、点位外键/坐标范围/候选状态、主 GeoJSON 是否仍全部为空几何。
- 刷新 `quality/validation_receipt.json`，确保新来源 manifest 的哈希与验证收据同步。

### 修改原因与影响

- 让前端可以直接拿到一张 `profiles.json` 作为 66 条基地详情的统一入口，并用 `point_candidates.csv` 支撑位置审核页；不需要前端拼接多套研究稿。
- 这些说明是基于 CRS 官方参考表和公开网页整理出的 `DERIVED` 草稿；正式坐标、正式几何、竞赛 ID 和人工确认身份仍未获得，不得当作组委会坐标主表。
- 菲律宾 052—060 保留为 EDCA 设施语义，复合基地、环礁和通信设施不强行压成一个精确点。

### 验收结果

- `py_compile`：通过。
- 补充脚本实例检查：通过。
- 一级资料包验证器：通过；66 条目录、1,626 条 BSR 数据行、21 条 DISDI 候选面、来源/权利/前端白名单/证据链均通过。
- 当前主 GeoJSON：66 条记录，实际几何 0 条；候选点 17 条，全部待人工审核。
- 当前状态：66 条说明均为 `AGENT_DRAFT`，批准 0 条；前端可以开始静态详情页和审核页，但不能把候选位置自动显示成正式基地坐标。

## 2026-09-15（网页 GPT 对抗审核后的闭环修正）

### 修改文件

- `DTC_2026_Level1_资料包/tools/build_profile_artifacts.py`
- `DTC_2026_Level1_资料包/tools/validate_level1_package.py`
- `DTC_2026_Level1_资料包/contracts/base_profile.schema.json`
- `DTC_2026_Level1_资料包/data/base_profiles.json`
- `DTC_2026_Level1_资料包/evidence/field_evidence.csv`
- `DTC_2026_Level1_资料包/manifest/source_manifest.csv`
- `DTC_2026_Level1_资料包/manifest/source_rights.csv`
- `DTC_2026_Level1_资料包/quality/level1_data_quality.json`
- `DTC_2026_Level1_资料包/quality/validation_receipt.json`
- `DTC_2026_前端直接使用/frontend_meta.json`
- `DTC_2026_前端直接使用/source_registry.json`

### 修正内容、原因与影响

- 将 `base_profile.schema.json` 从“字段存在检查”收紧为真实合同：事实必须有 `fact_level`、`source_layer`、`source_ids`；身份关系、来源覆盖、人工审核状态、位置语义和位置审核状态均受枚举与必填约束。
- 复用 `evidence/field_evidence.csv`，为 66 条档案的标准名称、地区、类型、军种、短说明、长说明追加 776 条字段级证据；没有另起一套 profile evidence 系统。
- 把公开来源存在与人工身份确认拆开：当前 66 条统一为 `identity_status=SOURCE_ONLY`，人工确认统计为 0；明确公开地区来源为 22 条，位置审核仍为 66 条 `REVIEW_REQUIRED`，避免把“有官方网页”误报成“已确认身份/坐标”。
- 修正质量报告中来源权利行数的旧值：manifest 与 rights 均为 48 行且 ID 一致；新增顶层 profile、来源覆盖、人工审核、点位候选和未解决位置指标。
- 修正前端 profile 元数据中的伪来源 ID `public-enrichment-sources`，改为实际来源 ID 集合；恢复 GNIS 等既有来源的原始 manifest endpoint、状态和哈希语义，避免来源注册表被补充脚本降级覆盖。
- 将 profile schema、profile JSON、点位候选表、公开来源登记和 profile 构建脚本加入验证收据哈希；主验证器新增 profile schema、来源外键、统一证据覆盖、点位候选隔离和主图层隔离门禁。

### 验收结果

- `py_compile`：通过。
- 主验证器：通过；profile 相关门禁全部通过。
- 66 条 profile；66/66 具备 CRS + 公开来源链；profile evidence 776 条；公开来源 36 条；点位候选 17 条。
- `manifest/source_manifest.csv` 与 `manifest/source_rights.csv`：48/48，ID parity=true。
- 主 GeoJSON 几何：0；人工确认身份：0；人工确认点位：0；位置审核待处理：66。
- 收据：`PUBLISHED_AFTER_VALIDATION`；收据包含 24 个关键产物哈希和 33 个验证检查项。

## 2026-09-15（最终来源语义复核修正）

- 按网页 GPT 最终复核提示，将菲律宾 CRS 052—056 与 057—060 分别绑定到 DoD 原有五个 EDCA 地点公告和新增四个 EDCA 地点公告，避免来源范围错配；公开来源登记增至 37 条。
- 将 `N/A` 的 `public_service_component` 证据改为 `UNKNOWN`，保留 CRS 原始 `N/A` 事实，不再把未知值标成已确认军种。
- 重新生成 profile、统一证据、来源登记、前端元数据和验证收据；主验证器与补充构建器均通过。

## 2026-09-15（前端统一证据同步）

- 将规范资料包的 1,194 行 `evidence/field_evidence.csv` 同步到 `DTC_2026_前端直接使用/evidence.csv`，其中新增 profile 证据 776 行。
- 在 profile 验证器中增加规范证据与前端平铺证据的逐字同步检查；前端 5 个新增/更新成品也加入验证收据哈希。
- 重新执行构建与验证，结果保持通过。
## 2026-09-15（最终网页 GPT 审核 P1 收尾）

- `DTC_2026_Level1_资料包/tools/build_profile_artifacts.py`：将质量报告中的 evidence 统计改为从实际 `evidence/field_evidence.csv` 计算，记录总行数、基础 evidence 行数和 profile evidence 行数；将通用“公开目录仅作候选背景”的治理免责声明降为 `DERIVED/DERIVED_OUTPUT`，避免冒充公开来源原文事实。
- `DTC_2026_Level1_资料包/tools/validate_level1_package.py`：将验证器版本提升为 `level1-validator-2026-09-15.2`；收据覆盖全部 10 个前端平铺文件；增加平铺文件与规范资料的逐文件同步门禁，并增加 evidence 质量统计与实际行数的一致性门禁。
- 影响：前端平铺目录的副本漂移、质量报告残留 418 行旧统计、以及治理说明被标为 `SOURCE_FACT` 的问题均在构建时自动失败，不再依赖人工发现。
- 原始组委会 3 个 PDF + 1 个 XLSX 未修改；没有启动服务。

## 2026-09-16（代理核验代表点写回前端地图）

### 修改文件

- `DTC_2026_Level1_资料包/tools/build_level1_package.py`
- `DTC_2026_Level1_资料包/tools/build_profile_artifacts.py`
- `DTC_2026_Level1_资料包/tools/validate_level1_package.py`
- `DTC_2026_Level1_资料包/contracts/reference_site.schema.json`
- `DTC_2026_Level1_资料包/contracts/reference_site_feature.schema.json`
- `DTC_2026_Level1_资料包/README.md`
- `DTC_2026_Level1_资料包/quality/level1_data_quality.md`
- 由构建器重新生成的 `DTC_2026_Level1_资料包/data/*`、`quality/*`、`manifest/*` 和 `DTC_2026_前端直接使用/*` 对应产物

### 修改内容、原因与影响

- 为 66 条 CRS 参考记录生成 `AGENT_VERIFIED_REPRESENTATIVE` Point，写入主 `reference_site_catalog.geojson` 和前端平铺 `sites.geojson`；地图不再因缺少组委会坐标而完全空白。
- 21 条可对应公开 DISDI footprint 的记录使用公开 footprint 的代表点；其余记录使用公开安装点/地名查询得到的代表点，并登记统一来源 `public-agent-location-research-2026-09-16`。这些点只表示“前端定位用的公开代表位置”，不冒充组委会正式坐标、精确边界或内部设施位置。
- 对 Naval Base Kitsap、Naval Base Ventura County、Kwajalein Atoll、Camp Butler、Yongsan-Casey、Harold E. Holt 等多设施/母子设施记录，写入 `coordinate_semantics=MULTI_SITE_NO_SINGLE_POINT`，保留代表点但明确不能解释成单一设施。
- 对菲律宾 052—060 继续保留 `EDCA_AGREED_LOCATION` 语义，不改称美国军事基地。
- 扩展记录合同、GeoJSON 合同和验证器：允许代理核验代表 Point，但只有 `HUMAN_CONFIRMED` 才能把 `formal_spatial_layer_ready` 置为 true；候选 polygon 仍隔离在 `candidates.geojson`。
- 将规范资料包与 `DTC_2026_前端直接使用` 的 8 组对应文件纳入构建时自动同步，避免主资料与前端副本再次漂移；新增来源也进入 manifest、rights、allowlist 和前端来源登记。

### 验收结果

- `py_compile`：通过。
- 独立 Level1 验证：通过，`ok=true`。
- 目录：66 条；主地图 Point：66 条；主地图空 geometry：0 条；点坐标未补齐：0 条。
- 代理核验代表点：66 条；正式人工确认几何：0 条；正式空间层：仍为 `false`。
- BSR：1,626 条；DISDI 候选 polygon：21 条；profile：66 条；GNIS review-only 点候选：17 条。
- 来源/权利/allowlist/证据链、GeoJSON 合同、前端副本 parity：全部通过。
- 四份初赛官方原件未修改；没有启动服务。

### 追加修正

- 将 66 条 profile 文案中的“坐标仍待人工审核”改为“地图代表点已由本项目代理核验，正式竞赛坐标仍未提供”，避免与主地图实际状态冲突。
- 将 `frontend_meta.json` 的地图边界状态改为 `AGENT_VERIFIED_REPRESENTATIVE_POINTS_FORMAL_LAYER_GATED`；质量报告同步说明 66 条代表点与正式空间层的区别。
- 追加修正后重新执行 profile 构建和独立验证，结果仍为 `ok=true`。

### 后续自检修正

- 复查发现 Fort Wainwright 与 Joint Base Lewis-McChord 的 DISDI 公开范围包含大面积训练区，不能简单对全部边界顶点取平均作为地图点。
- 已改用对应安装点的公开代表坐标，并在记录说明中保留“代表点、不等于官方竞赛坐标或设施边界”的语义；其余站点继续使用单一公开 footprint 的代表点或已记录的公开安装点。
- 修正 `build_profile_artifacts.py` 在生成 `frontend_meta.json` 时遗留的旧统计：主图点数、无候选点数、候选 polygon 数、正式确认数及 `sites.geojson` 来源 ID 现在从当前规范目录重新计算，避免摘要与实际地图文件不一致。
- `sites.geojson` 的来源登记同时保留官方 CRS 输入来源与公开代表点来源，避免前端只看到补充来源而丢失官方资料边界。
- 根据网页端独立联网审查补充复合对象语义：013 Naval Base Coronado、026 Marine Corps Base Hawaii、041 Army Garrison Okinawa、046 Army Garrison Daegu 均改为 `MULTI_SITE_NO_SINGLE_POINT`，并保留公开锚点说明。
- 修正 `geometry_no_candidate_count` 的统计口径：该指标现在表示没有公开候选 polygon 的 CRS 记录（45），不再把“主地图已有代表点”错误当成“有候选边界”。
- 进一步按候选 GeoJSON 的实际唯一 `site_id` 计算该指标，消除审核队列重复记录造成的 44/45 不一致。

### 2026-09-16（DTC 2026 纯前端 Vue3 + Vite + Three.js 项目）

- 新建 `DTC_2026_Web/` 独立纯前端项目：Vue 3、TypeScript、Vite、Pinia、Vue Router、Three.js、PapaParse。
- 新建 `scripts/sync-data.mjs` 与 `scripts/verify-data.mjs`：开发/构建前自动同步 7 个前端数据文件，并校验 66 个站点、66 个代表点、1626 条 BSR、1524 条 evidence、74/21 条候选数据及正式空间层边界。
- 新建概览、代表点地图、参考站点、站点详情、BSR 统计、候选复核六个页面；Three.js 地球只显示代表点，候选 polygon 仅在复核页懒加载并显示轮廓。
- 新建统一数据类型、加载器、Pinia 数据 Store、地理转换和统计服务；来源抽屉保留来源、校验、SHA-256、权利及外部导出状态。
- 影响：前端可以直接从 `DTC_2026_Web` 启动，数据源仍以 `DTC_2026_前端直接使用/` 为唯一来源，不复制维护第二套手工数据。
- 修正 TypeScript 类型依赖后，`npm run data:verify` 与 `npm run build` 均通过，TypeScript 0 错误；未启动长期开发服务。

### 2026-09-16（纯前端首轮收口与响应式检查准备）

- 新增 `DTC_2026_Web/README.md`：写明运行方式、页面用途、数据同步规则和“代表点不等于官方精确坐标”的使用边界。
- 修改 `DTC_2026_Web/src/styles/main.css`：取消页面固定最小宽度，并补充窄窗口布局规则，避免普通浏览器窗口出现横向滚动条。
- 影响：不改变数据和业务语义，只改善项目交接说明与页面适配范围。
- 验收：`npm run build` 通过，数据校验仍为 `sites=66, bsr=1626, evidence=1524, candidates=74/21, formal_spatial=false`。
- 真实截图检查发现内置浏览器窄视口存在横向溢出；已在 `main.css` 的 1200px 断点补充顶部、英雄区和状态区的换行布局，作为最小响应式修正。
- 进一步定位到四列指标卡的最小内容宽度；已在同一断点切换为两列 `minmax(0, 1fr)`，避免指标卡把页面撑宽。
- 再次检查确认剩余宽度来自英雄区装饰圆环的旋转溢出；已为 `.app-shell` 增加横向裁切，装饰不变且不再产生页面级滚动宽度。
- 内置浏览器复测发现根 Flex 容器仍被内容最小宽度撑开；已为 `.app-shell` 与 `.main-shell` 增加视口宽度和可收缩约束，修正布局根因。
- 由于内置浏览器的截图视口与桌面布局宽度不同，页面根层增加 `html, body { overflow-x: hidden; }`；表格内部滚动区域不受影响。
- 真实浏览器验收发现站点详情页将数字 `source_record_no` 直接调用字符串方法，造成详情页运行时空白；已在 `SiteDetailView.vue` 中显式转为字符串后再补零格式化。
- 地图真实渲染出现 Three.js NaN 几何警告；已在 `GlobeScene.vue` 和 `geo.ts` 对站点点位与候选轮廓坐标增加有限数值保护，异常几何会被跳过，不影响正常数据。
- 为彻底隔离三维线几何异常，`GlobeScene.vue` 的经纬网格改为统一经过有限点校验后再加入场景，避免异常顶点触发 Three.js 包围球警告。

### 2026-09-16（地图视觉修正）

- 修改 `DTC_2026_Web/src/components/map/GlobeScene.vue`：加入独立的公开低分辨率世界地理参考层，补充大陆填充与海岸线；将默认镜头调整到印太区域；降低环境光与经纬网强度；将普通点、多设施点、EDCA 点改为不同形状并增加选中放大效果；新增悬浮站点提示，并修正站点数据异步加载后的点位刷新。
- 修改 `DTC_2026_Web/src/components/map/MapLegend.vue`、`src/views/MapView.vue`、`src/layouts/AppShell.vue`：删除 `THREE.JS / REPRESENTATIVE MAP` 技术展示字样，改用业务语义；修正 66 条代表位置计数排版；增加地理参考层边界说明；中文品牌名称置于主要层级。
- 修改 `DTC_2026_Web/src/styles/main.css`：让地图页使用更大的主工作区，压缩页面顶部占用，降低警示和装饰的视觉干扰，增加悬浮提示、图例符号及窄屏高度规则。
- 新增 `DTC_2026_Web/public/data/world_reference.geojson`：来自公开 D3 Graph Gallery 世界 GeoJSON 的独立视觉参考资产，不属于组委会 3 个 PDF + 1 个表格，也不用于推导站点坐标、设施边界或官方事实。
- 修改 `DTC_2026_Web/README.md`：明确地理参考层的来源和使用边界。
- 影响：不修改官方原件、不修改 66 条站点坐标及其语义、不加载候选 polygon 到主地图；只改善地图视觉表达和可读性。
- 追加修正：为 `GlobeScene.vue` 补充明确的相机朝向，使首屏稳定落在印太区域；为地图布局补充大屏/窄屏高度与单列切换，避免地球被裁切或主视觉被侧栏挤压。
- 追加验收：重新执行 `npm run data:verify` 与 `npm run build`，数据统计和 TypeScript/Vite 构建均通过。

### 2026-09-16（主页信息架构迭代）

- 修改 `DTC_2026_Web/src/views/OverviewView.vue`：将首页从通用指标 Dashboard 重排为比赛成果首页，首屏直接说明 66 条参考记录、代表位置和字段级证据成果；移除无数据意义的轨道装饰，增加地图/站点入口、资料处理链路、交付范围和区域分布。
- 修改 `DTC_2026_Web/src/styles/main.css`：为成果首页增加独立的首屏、核心指标、数据链路、状态边界和区域条形图样式，并补充窄屏布局。
- 影响：不改变任何官方原件、站点数据或数据边界，只改变首页的信息叙事和展示顺序；让评委先理解项目产出，再进入地图、站点和复核页面。
- 验收：`npm run build` 通过；数据校验为 `sites=66, bsr=1626, evidence=1524, candidates=74/21, formal_spatial=false`，TypeScript 与 Vite 构建均通过。
- 追加修正：窄窗口真实复测发现 `main-shell` 在移动断点继承了 `width: 0`，导致主页内容被压成竖向窄列；已在移动断点恢复主区 100% 宽度，并将顶部状态区改为块级布局。
- 追加验收：重新执行 `npm run build`，数据同步、数据校验、TypeScript 检查和 Vite 构建均通过。

### 2026-09-16（主页第二轮视觉复核修正）

- 修改 `DTC_2026_Web/src/views/OverviewView.vue`：删除与“正式空间层—未提供”重复的主页黄色边界段落，保留页面统一边界提示和状态行，避免同一事实重复抢占视觉注意力。
- 修改 `DTC_2026_Web/src/styles/main.css`：窄屏数据链由五个独立卡片改为紧凑的时间线式列表，减少无效纵向滚动并保留五步语义。
- 影响：不改变数据、统计口径或边界声明，只优化主页首屏后的信息密度与提示层级。
- 网页版 GPT 第二轮真实截图验收结论：`SECOND-ROUND VISUAL ACCEPTANCE: PASS`；无 P0，建议项仅为上述两项比赛前 polish。

### 2026-09-16（地图第二轮窄屏碰撞修正）

- 修改 `DTC_2026_Web/src/styles/main.css`：在地图页窄屏断点解除顶部栏固定高度，改为按状态行内容自适应并保留压缩间距。
- 原因：地图第二轮真实截图发现“数据已加载 / LEVEL 1”与黄色边界提示发生实际重叠。
- 影响：只修复地图页窄屏布局碰撞，不改变地球、站点点位、图例或数据语义。

### 2026-09-16（地图第三轮视觉验收）

- 修改 `DTC_2026_Web/src/components/map/GlobeScene.vue`：普通代表点、默认环和特殊点尺寸按审核意见做克制化调整，保留选中放大及多设施/EDCA 的形状区分。
- 修改 `DTC_2026_Web/src/layouts/AppShell.vue`、`src/styles/main.css`：地图页顶部信息自适应，避免状态 pill 与边界提示发生覆盖，同时让地球更早进入窄屏首屏。
- 网页版 GPT 第三轮真实截图验收结论：`FINAL VISUAL ACCEPTANCE: PASS`，`P0=0`、`P1=0`；地图页可以关闭。

### 2026-09-16（站点目录第一轮视觉修正）

- 修改 `DTC_2026_Web/src/components/common/BoundaryBanner.vue`、`src/layouts/AppShell.vue`：支持按页面提供边界提示文本，参考站点目录改为 CRS Table A-1 与公开代表位置的专属说明，不再机械复用“当前地图”提示。
- 修改 `DTC_2026_Web/src/components/site/SiteTable.vue`、`src/styles/main.css`：窄屏隐藏机构与机器语义两列，将机构和位置语义合并到站点名称下的中文辅助信息，避免表格右侧挤压不可读。
- 影响：只优化展示层级和窄屏可读性，保留原始字段及详情页数据。

### 2026-09-16（站点详情第一轮语义修正）

- 修改 `DTC_2026_Web/src/layouts/AppShell.vue`：站点详情页使用“本页代表位置来自公开来源补充……”的专属边界提示，避免把地图页文案机械复用到详情页。
- 影响：只调整页面提示语境，继续明确代表位置不等于正式竞赛坐标或设施边界；不改变坐标、证据或站点字段。

### 2026-09-16（BSR 统计第一轮语义修正）

- 修改 `DTC_2026_Web/src/layouts/AppShell.vue`：统计页顶部提示改为 BSR FY2024 独立数据集与 CRS 站点不强行关联的说明，去除地图页语境。
- 修改 `DTC_2026_Web/src/components/statistics/BsrSummary.vue`：将“自有建筑”明确为“自有建筑数量（count）”，避免把统计字段误解为面积或金额。
- 影响：只调整统计页展示语义，不改变 BSR 原始值、单位或计算口径。

### 2026-09-16（BSR 统计第三轮口径修正）

- 修改 `DTC_2026_Web/src/components/statistics/SimpleBarChart.vue`：增加可配置展示条数。
- 修改 `DTC_2026_Web/src/views/StatisticsView.vue`：总面积图表显式传入 `limit=10`，使“总面积 TOP 10”标题与实际展示条数一致；机构统计保留原有主要类别展示数量。
- 影响：修复统计页展示口径不一致，不改变 BSR 数据、排序或计算结果。

### 2026-09-16（BSR 统计最终口径修正）

- 修改 `DTC_2026_Web/src/views/StatisticsView.vue`：将机构统计标题明确为“主要机构类别 · Top 8 / 共 11 类”，与当前展示主要类别的组件行为一致。
- 影响：消除图表标题与实际条数的歧义，不改变 BSR 机构分类、排序或原始数据。

### 2026-09-16（BSR 统计最终视觉验收）

- 网页版 GPT 最终真实截图复核确认：机构统计“Top 8 / 共 11 类”、总面积 TOP 10、数值、单位和底部范围说明均一致可读；`P0=0`、`P1=0`，统计页可以关闭。

### 2026-09-16（候选复核第一轮视觉修正）

- 修改 `DTC_2026_Web/src/layouts/AppShell.vue`、`src/components/common/BoundaryBanner.vue`：候选复核页隐藏地图页专属的全局边界提示，只保留复核页自身的候选隔离警告。
- 修改 `DTC_2026_Web/src/views/ReviewView.vue`：在页面摘要明确展示“匹配候选 / 边界候选 / 自动合并”三者关系。
- 修改 `DTC_2026_Web/src/components/review/CandidateTable.vue`、`src/styles/main.css`：窄屏表格收敛为参考名称、候选名称、审核状态三列，匹配类型和兼容性改为中文辅助信息；桌面仍保留完整列结构。
- 影响：只优化候选复核的治理表达与窄屏可读性，候选数据仍保持 review-only，不进入正式地图或空间层。

### 2026-09-16（候选复核最终视觉验收）

- 网页版 GPT 第二轮真实截图确认：候选与正式层隔离、74/21/0 口径、窄屏三列表格、中文审核语义和 21 个边界轮廓说明均通过；`P0=0`、`P1=0`，候选复核页可以关闭。
- 本轮页面级终验完成：主页、地图、参考站点、站点详情、BSR 统计、候选复核均已使用真实浏览器截图交给网页版 GPT 逐页审核，并按意见完成必要迭代。

### 2026-09-16（视觉审核截图归档）

- 新增 `DTC_2026_Web/review-captures/overview-round2.jpg`：保存主页重排后的真实浏览器截图，供后续网页版 GPT 视觉复核与本地人工回看。
- 影响：仅增加审核留档，不参与前端构建、不作为业务数据、不改变任何官方资料或页面逻辑。

### 2026-09-16（第二轮浅色主题与地图微交互）

- 修改 `DTC_2026_Web/src/styles/tokens.css`：将全局基础色从深色背景切换为明亮的浅灰白底、深蓝文字、青绿色主强调色和琥珀色提示色。
- 修改 `DTC_2026_Web/src/styles/main.css`：补齐侧栏、导航、卡片、表格、筛选器、统计图、警示条和首页成果区域的浅色视觉覆盖；地图地球和候选地图保留深色空间画布，避免地理轮廓在浅底上失去对比。
- 修改 `DTC_2026_Web/src/components/map/GlobeScene.vue`：增加点位随相机视距平滑缩放的交互；增加由 Three.js 基础几何体组成的极小型金色巡航模型，沿地球外侧低速环绕，并限制为克制的装饰性态势提示。
- 修改 `DTC_2026_Web/src/views/MapView.vue`：在地图操作提示中明确滚轮缩放和点位随视距调节行为。
- 验证：`npm run build` 通过；数据同步与校验通过（sites=66、bsr=1626、evidence=1524、candidates=74/21、formal_spatial=false）；Vue 类型检查和 Vite 生产构建通过。
- 影响：这是展示层与地图交互优化，不改变官方输入、站点数量、位置语义、证据链或正式空间层边界。

### 2026-09-16（第二轮首页层级修正）

- 修改 `DTC_2026_Web/src/views/OverviewView.vue`：删除与 Hero 右侧成果摘要重复的第二组 66/66/1524 KPI 卡，保留一处量化证明，让数据链更早进入首屏。
- 修改 `DTC_2026_Web/src/layouts/AppShell.vue`：为概览页和地图页分别提供页面语境正确的边界提示；概览页不再复用“当前地图展示”文案，地图页保留地图专属说明。
- 影响：只修正首页信息层级和提示语义，不改变任何数据值、证据关系或地图交互。

### 2026-09-16（第二轮目录细节修正）

- 修改 `DTC_2026_Web/src/components/site/SiteTable.vue`：当展示名称与原始名称完全一致时不再重复渲染第二行；为状态单元格增加明确语义类名。
- 修改 `DTC_2026_Web/src/styles/main.css`：状态列在所有视口保持单行显示，并在窄屏保留最低可读宽度，避免“代表点”被挤成两行。
- 影响：只优化目录页扫描效率与状态徽章排版，不改变站点名称、原始字段、记录数量或筛选行为。

### 2026-09-16（第二轮目录信息减噪）

- 修改 `DTC_2026_Web/src/components/site/SiteTable.vue`：窄屏普通记录的次级信息只保留机构；仅在多设施代表点或 EDCA 位置时补充位置语义，避免与右侧“代表点”状态重复。
- 影响：只减少重复文字，保留特殊位置语义，不改变完整桌面列、原始数据或站点详情内容。

### 2026-09-16（第二轮候选边界画布适配）

- 修改 `DTC_2026_Web/src/components/review/CandidateScene.vue`：候选 GeoJSON 轮廓改为使用原始经纬度绘制，并按 21 个候选边界的实际范围自动计算正交相机视野；增加窗口尺寸变化时的画布重排。
- 原因：网页版 GPT 真实截图发现原画布虽然加载了 21 个候选要素，但坐标被错误映射到过大的固定视野中，首屏几乎不可见，形成“地图未加载”的展示风险。
- 影响：候选轮廓只在独立 review/debug 画布内可见，仍不会进入正式代表点地图或正式空间层；不修改任何输入数据和候选审核状态。

- 修正：补齐候选画布相机的初始化顺序，避免自适应视野计算因相机尚未创建而提前退出。
- 影响：仅修复候选轮廓的实际渲染，不改变坐标、候选数量、审核状态或正式地图隔离规则。

- 再修正 `DTC_2026_Web/src/components/review/CandidateScene.vue`：提高候选轮廓对比度，并为每个候选要素增加克制的中心定位点，避免全球范围适配后细小边界在首屏不可辨认。
- 影响：21 个候选要素在 review-only 画布中均有可识别的定位提示；定位点不代表正式坐标，不会进入代表点地图。

### 2026-09-16（候选边界画布修复后的网页版 GPT 终审）

- 网页版 GPT 基于修复后的真实浏览器截图确认：21 个候选边界/边界簇已可见；橙色 review/debug 图层未冒充正式空间层；74/21/0 口径、窄屏表格、浅色外壳与深色候选画布均通过。
- 终审结果：`P0=0`、`P1=0`；候选复核页达到对外展示和数据治理展示标准，可以关闭。剩余仅为逐条 zoom/highlight、英文中文化和辅助灰字加深等非阻塞 P2。

### 2026-09-16（候选边界轮廓可见性修复）

- 修改 `DTC_2026_Web/src/components/review/CandidateScene.vue`：将候选轮廓从 Three.js 默认细线改为高分辨率二维画布绘制，保留真实多边形轮廓、低透明度填充、可见描边和每个候选要素的定位环。
- 原因：全球范围适配后，Three.js 基础线宽在窄屏上细到近似不可见，造成“21 个边界没有加载”的错误观感。
- 影响：候选边界在独立 review-only 画布内可辨认，原始 GeoJSON、候选数量和正式地图隔离规则不变。

- 网页版 GPT 基于修复后的真实截图确认：候选边界簇、分散候选和定位环均可见，不再形成空白/加载失败观感；`P0=0`、`P1=0`，候选复核页可以关闭。

### 2026-09-16（界面英文展示层中文化）

- 新增 `DTC_2026_Web/src/services/labels.ts`：集中维护机构、地区、位置语义、事实等级、字段名、来源核验状态和权利状态的中文展示标签；底层原始值保持不变。
- 修改 `DTC_2026_Web/src/components/common/StatusBadge.vue`、`src/components/site/SiteTable.vue`、`src/components/site/SiteFilters.vue`、`src/components/evidence/EvidenceList.vue`、`src/components/evidence/SourceDrawer.vue`：将可翻译的状态、字段、机构、地区和权利说明改为中文，保留 CRS、BSR、DoD、SHA-256、官方站点名称、来源编号和 URL 等必要英文/原文。
- 修改 `DTC_2026_Web/src/views/SiteDetailView.vue`、`src/views/MapView.vue`、`src/views/SitesView.vue`、`src/views/ReviewView.vue`、`src/views/StatisticsView.vue`、`src/layouts/AppShell.vue`、`src/components/statistics/BsrSummary.vue`：将普通页面标题、计数单位、位置语义、审核标签、统计单位和辅助说明中文化；官方缩写、专有名称和数据原文不改。
- 影响：只改变用户界面的展示文字和筛选选项标签，不改筛选底层值、原始数据、证据链、数据口径或来源文件。

- 补充：将详情页 `Yes/No`、证据字段名和位置说明中的可翻译英文转为中文展示，并保留基地正式名称、官方来源标题、CRS/BSR/DoD、EDCA、SHA-256、来源编号和 URL 等必要原文。

- 补充：将 BSR 图表中的机构分类后缀（现役、预备役、国民警卫队）转为中文展示，底层分类值仍保持原始英文。

- 修正：为机构展示标签函数补充明确的 `string` 返回类型，消除递归映射触发的 TypeScript 隐式 `any` 编译错误。

- 修正：补充 `Air National Guard` 的完整中文映射，避免通用后缀转换生成不完整的“Air 国民警卫队”。

## 2026-10-11（继续一级提交成果，进行中）

- 继续用户已授权的目标：无需用户逐条参与，正式画像与空间资料尚在定稿，不把页面新增入口或类型检查通过称为最终完成。
- 修改 Web/scripts/verify-data.mjs：核对章节与长说明一致、组成地点独立ID/证据、16复合对象空间覆盖、实际模型概念与来源版本，补官方图表计数；沿用既有构建入口，不增加第二套校验系统。
- 修改 Web/src/views/OverviewView.vue、MapView.vue、SiteDetailView.vue：公开图表定位与地名查询分别显示，首页可进入模型页，计数全部来自元数据；官方图表派生不再误标为地名响应。
- 以上 Node 语法与 TypeScript 编译通过。新增来源归档正在进行，镇海官方基地地图继续查读。修改前已说明原因，复用现有合同与页面，保持最简和类型严格。


### 2026-10-11：一级正式画像整理与模型依据补充（进行中）

- 新增 `DTC_2026_Level1_资料包/tools/submission_curated_edits.py`：逐条整理日本、韩国、菲律宾、新加坡和澳大利亚等35条画像的三段正文，依据已归档事实补充身份、历史和一般设施，区分共址、邻接、管理与服务关系。
- 修改 `DTC_2026_Level1_资料包/tools/prepare_submission_research.py`：统一应用66条正文，去重来源并剔除只有检索线索而没有可读事实的引用；补充Beale人物身份、Sasebo住宅地点、Balabac主岛与早期项目的官方证据。
- 删除画像中不属于对应场址的Bancalaan码头、Mount Salakot访问点及无关的学校许可信息；修正Tindal有完整沿革却称无沿革、Eareckson历史文章机构年代、Miramar分期日期及人物名截断。
- 加入开放系统模型的公开依据与六项实际字段映射：关注实体、空间聚合、来源线程、三类视角、更新与审核、一级实现范围。明确其为本项目依据公开概念实现的描述/GIS模型，保留真实数据版本，未宣称实时状态或专有接口认证。
- 原始输入不改；本轮整理脚本先保存旧正式数据，事实摘录与失败HTTP状态分别记录；数据定稿后重新绑定并执行Codex审核。新增Python文件编译检查通过，联合数据构建尚待空间证据定稿。

### 2026-10-11：多设施关系与空间输入定稿（进行中）

- 新增 `tools/prepare_submission_spatial.py` 和 `sources/public_enrichment/spatial_evidence.json`，显式选择经过身份、国家、类别及关系核对的源记录，为16个复合对象提供独立成员定位，保留未取得地理要素的成员关系与原因。
- 新增 `component_gis_derivation.json`：Kitsap和Ventura运行设施使用官方DISDI原始几何及经实际面内检查的展示点，取代查询中自然海角、城市、直升机场等不相符候选。
- 大邱拆分Walker、George、Henry、Carroll；Yongsan-Casey拆分Casey/Hovey等具名地点；佐世保区分主基地、住宅与Hario社区电影院参考；Point Loma增加Miramar分离管理物业。组织租户、服务地点、邻接社区和安装点组成明确区分。
- 车力采用已视觉核对的官方区域图配准，Balabac改为主岛要素，Singapore改为Sembawang码头要素；Chinhae依据当前官方地址使用同名街区参考并保留官方示意地图，无依据的门岗/中心坐标不补造。
- 修改 `tools/reviewed_inputs.py`：GIS定位直接从源稳定ID提取原始面，检查实际点面包含及几何一致性，不能仅信任派生文件里的inside标记。
- 新增 `data/submission_chinhae_address_plan.json` 与其原始Nominatim响应：街区位置为地址级参考，页面明确不表示精确基地范围。Basa设施词改为航空器停放；Lumbia沿革改为有出处的2013年商业航班转移及2026年工程用途，不扩写未公开的常设任务。
- 所有相关Python文件编译通过；联合生成、审核指纹与浏览器验证在下一步执行。

### 2026-10-11：定稿审核、专项回归与离线提交程序

- 修正 `tools/build_profile_artifacts.py` 的空间证据CSV：保存源对象、坐标、定位记录和几何SHA-256，完整顶点仅保存在画像JSON，消除字段超过131072字符的构建错误。38项资料包合同与收据检查通过。
- 新增 `tools/record_submission_review.py`：只允许本次Codex已逐条复核的五项固定输入版本，记录66条AI审核、实际时间、范围及内容指纹；新输入不能用这次录入脚本直接批准。
- 新增 `tools/check_submission_reviews.py`：实际调用原生产校验器和空间验证器，在内存或临时副本中验证27项规则；不变重建保留审核，正文/章节/关系/坐标/来源变动失效，孤立出处、伪造真人、未整改批准、篡改档案及虚假面内标记被拒绝。专项27项通过，正式档案未被测试修改。
- 修改 `DTC_2026_Web/src/services/dataLoader.ts`：读取HTML内嵌的同一套审核数据，缺文件立即报错；网页部署仍沿用相对基路径加载，无旧结构兼容。新增 `scripts/build-portable.mjs` 将现有Vue程序、样式和9个数据文件内嵌为单文件HTML，并记录全部输入和输出指纹。
- 当前66画像全部APPROVED，正文214章节/862结构化描述，115条具名关系、51处独立成员定位、16个复合对象均分地点表达；保留街区、天然岛屿、公共港区及局部社区设施的真实精度和范围，不冒充地籍或实时状态。
- 发现原世界参考层缺少特定下载记录；新增 `tools/prepare_world_reference.py` 归档Natural Earth官方项目固定提交9380cca83db5f9aef52d5e762765100745f84b27的原始GeoJSON，以177个原几何生成背景并保留来源、许可、时间及哈希。旧文件保存到本轮备份。
- 修改 `SpatialDetailMap.vue`、`MapView.vue` 增加Natural Earth、OpenStreetMap贡献者与ODbL可点击署名；此次只补地理背景出处，66条定位及画像审核输入不变。TypeScript编译通过。
- 单文件HTML生成成功；浏览器工具禁止file协议，故双击打开未能直接验收。正在使用本机临时HTTP检查同一离线文件及普通静态构建；临时4180/4181服务由本任务创建，验收结束后停止，不启动npm开发服务。

### 2026-10-11：一级提交成果打包与最终验收完成

- 新增 `DTC_2026_Level1_资料包/tools/package_level1_submission.py`：沿用正式画像、元数据、统一合同与现有Vue工程，验证66条当前审核、16个复合对象、38项发布校验、27项专项、浏览器与手册验收记录，然后仅打包显式列出的交付文件。保存逐文件字节数和SHA-256，复读ZIP检查CRC、内容及指纹，不引入第二套业务数据或旧结构兼容。
- 修正打包脚本的读取方式：按Node构建相同的UTF-8/BOM处理核对内嵌文件，保留原始CRLF；Natural Earth文件实际字节未变化，Python文本读取的换行转换不再误报数据改变。许可索引使用集合去重；Python编译检查通过。
- 生成 `DTC_2026_一级提交成果/软件/DTC2026_一级GIS.html` 与构建记录：同一Vue程序及9份正式运行数据内嵌，文件17,471,961字节。单文件通过本机HTTP验收，刷新后的Resource Timing无额外资源请求；普通静态生产构建根路径与子目录均通过。浏览器工具禁止file协议，双击打开未直接验收，该边界已写入使用说明。
- 生成 `材料/一级要求逐项审核.md`、`材料/开放系统模型理解与运用.md`、`材料/作品介绍.md` 和66条详细画像的HTML/Markdown两版；所有画像正文及出处来自本轮正式审核数据。手册66篇、66个目录链接、66个GIS入口及Holt实际跳转通过；桌面和390像素请求视口无横向溢出，移动端实际可用宽度375像素。
- 生成 `来源与许可/OSM空间派生数据库.geojson`、Natural Earth固定提交来源记录、来源许可说明及39份去重依赖许可文件；原始受版权PDF/HTML全件、失败采集、缓存和node_modules未收录。台账对原始文献的外发标记保留，派生成果逐文件范围核查另存，不将AI审核冒充真人或组委会许可。
- 更新根目录 `DTC_2026_参赛符合性审核_2026-10-10.md`、资料包 `README.md`、`frontend_build_checklist.md`、`evidence/readiness_matrix.md` 与 `DTC_2026_Web/README.md`：统一到2026-10-11定稿口径。66条画像214章节、862项结构化描述，115条关系中51处独立定位，16个复合对象全部分别表达成员；原4条地区定位的来源与尺度逐项列出，镇海仍明确为街区参考。
- 在 `DTC_2026_Web/review-captures/` 保存正式软件66条逐页记录、16组成员地图检查、9类响应式页面检查、模型JSON和出处抽屉核对、手册检查、总览/地球/模型/手册截图及生产构建日志。38项资料包校验、27项专项、TypeScript与生产构建、软件和手册浏览器验收通过；正常页面运行错误为0。保留Three.js构建超过500kB的体积提示，不描述为运行故障。
- 生成 `DTC_2026_一级提交成果.zip`（149个文件，9,854,313字节）、`提交文件清单.json` 和外部 `.zip.sha256`；独立复核所有ZIP成员、磁盘内容、指纹、相对链接、9份内嵌输入和39份许可文件通过。ZIP SHA-256：`d822c36067bb413544fc3bfe7376b0c7911ff36cf0cba901fe76059e4eee14cc`。
- 已终止本次创建的4180/4181两个临时Python验收服务，确认端口无监听，关闭本次浏览器标签并恢复视口。没有启动npm开发服务，没有执行外部投稿或部署。交付包已完成；最终专家评分和赛事接收由组委会进行。

### 2026-10-11：移除提交软件内部候选工作页（进行中）

- 修改 DTC_2026_Web/src/router/index.ts、layouts/AppShell.vue 与 views/OverviewView.vue：删除/review导航和路由，首页改为正式站点审核结果入口；不存在的路径统一返回概览，无专属旧路由兼容。
- 修改 stores/data.ts、services/dataLoader.ts、types/data.ts：移除候选加载、状态和专属类型；删除 ReviewView.vue、CandidateTable.vue、CandidateScene.vue 及 main.css 中候选工作页的专属样式，复用现有正式页面。两次TypeScript编译检查通过。
- 修改 scripts/sync-data.mjs、verify-data.mjs、build-portable.mjs：正式前端只同步6份业务文件，内嵌6份业务数据加Natural Earth背景共7份；前端不再读取或要求旧候选队列。正式资料包校验器和发布收据中的候选原件哈希保持。
- 在 DTC_2026_Level1_资料包/evidence/historical_candidates 归档74条匹配记录、21个候选范围、匹配审核表、17个GNIS历史点候选及SHA-256清单；74条中36条实际候选、38条无候选。旧public/data两文件已移至该档案并核查目标在工作区内。原生成状态按历史保留，不把全部候选批准为正式边界。
- 66条正式画像、坐标、关系、来源版本和AI审核未修改。下一步完成提交包结构同步、生产构建和浏览器验收，按用户本轮明确要求启动项目。

### 2026-10-11：候选档案与新版提交包定稿完成

- 修改 `DTC_2026_Level1_资料包/tools/package_level1_submission.py`：要求浏览器验收绑定本次离线HTML哈希，确认候选入口已移除，运行数据恰为7份且无候选文件；从源码运行目录排除candidates.csv、candidates.geojson和point_candidates.csv，将4份历史候选原表、档案清单和说明放入提交包的 `查证档案/历史候选/`。Python编译检查通过。
- 打包前按上次文件清单收回不再发布的旧数据和候选Vue组件，可恢复地移动至资料包 `evidence/retired_submission_files/`；每个解析后的源路径、目标路径及根目录均核查在明确的工作区范围内，仅处理本脚本既有清单中的产物。
- 已重跑npm生产构建，6份业务数据同步及现有数据校验、TypeScript编译、Vite构建全部通过；单文件重建为7,717,022字节、7份内嵌文件，89个Vue/依赖模块，无ReviewView构建产物。保留Three.js超过500kB的体积提示。
- 重新通过浏览器核对66条正式画像、16个复合对象51处成员定位、9类390像素请求视口页面、模型JSON与来源抽屉、Holt Area B选择及不存在站点提示；正常页面运行错误为0。侧栏仅保留5个正式入口，首页查看审核结果进入正式站点目录，失效/review地址返回概览。内嵌HTML刷新后的Resource Timing资源列表为空。
- 更新主浏览器验收JSON、总览/模型/地图截图和构建日志；旧浏览器验收JSON保存至 `evidence/historical_browser_checks/`。逐项审核说明、源码说明及使用说明由同一打包入口同步至7份正式运行数据与历史档案口径，未改66条实际审核记录或五项来源版本。
- 新 `DTC_2026_一级提交成果.zip` 共145个文件、5,780,327字节。独立复核ZIP CRC、逐文件磁盘内容及SHA-256、候选页面/组件和运行文件的移除、6份查证档案、7份正式内嵌输入，以及原有38项资料校验均通过。ZIP SHA-256：`e1e2936792c8f1e8856fdcdd58a2054ed873349a731b4a043ce3327d86076d5e`。
- 按用户本轮明确要求，已用受控终端启动Vite生产预览，`http://127.0.0.1:4180/` 返回HTTP 200并通过实际浏览器查看，进程11360、受控会话12266。运行信息存于 `DTC_2026_Web/review-captures/project-preview.json`；项目预览保留运行，符合本轮启动要求。后台进程方式曾被工具策略拦截，已改用受控终端；日志追加也改用本地文件编辑工具完成，没有进行权限提升。
- 收尾确认：临时4181验收服务已停止且无监听；4180项目预览仍由进程11360运行。临时验收标签已关闭，浏览器视口已恢复，正式项目标签保留供用户访问。

### 2026-10-11：三维地图视觉与缩放重构（进行中）

- 新增 `DTC_2026_Web/src/services/mapMarkers.ts`：集中按现有机构字段分类，保留位置语义形状；屏幕聚合、密集点展开、窄屏大组网格、标签矩形避让及球面可见性均为独立的显示计算，不修改站点坐标、几何、身份或审核记录。初次TypeScript编译通过。
- 新增 `src/services/globeVisuals.ts`：从同一177个Natural Earth原几何绘制4096上限的离线Canvas纹理，保留内环并按SphereGeometry UV校准经度；以球体材质、侧上方照明、大气边缘及稀疏星空替代旧球面三角填充。添加由几何模型构造的机身、机翼、尾翼、发动机，以及太阳能板和天线卫星；飞行器与轨道明确为演示动画，近景隐藏，并随视距补偿尺寸。TypeScript编译通过。
- 重写 `src/components/map/GlobeScene.vue`：点位变为固定屏幕尺寸、可键盘选择的HTML标记，背面点不穿透地球；聚合圈提供成员计数与颜色，展开显示避让连线和成员列表；补充区域快捷定位、站点定位、近景缩放、自动旋转及演示开关。相机可接近球面，球面定位采用四元数插值；ResizeObserver同步容器变化，卸载释放控件、动画、几何、材质和纹理，异步加载完成后检查组件是否已卸载。
- 重写 `MapLegend.vue` 和 `src/views/MapView.vue`：颜色图例兼作机构筛选，形状图例单独解释，地图使用整行空间，已审核站点卡片显示定位与成员证据；加入可退出的大屏演示，保留Natural Earth/OSM/ODbL署名，去掉旧图例与地图说明互相覆盖的绝对定位。旧候选入口不恢复，七份数据与66条审核指纹不变。
- 本条记录实施阶段；碰撞专项检查、生产构建、真实浏览器视觉/交互验收及提交包更新将在下一步完成，尚不以代码写入称为最终验收。

### 2026-10-11：三维布局专项与近景地理参考补充（进行中）

- 新增 `DTC_2026_Web/scripts/check-globe-layout.mjs`，直接调用生产布局函数，验证66条分类、独立点、重合点不丢失、合并中心不碰撞、展开保留原投影、66点窄屏展开、标签不遮挡及背面点遮挡；确认正式数据对象没有被布局修改。9项通过。修正标签候选位置与标记安全间距相撞、导致名称全部被避让掉的问题，TypeScript与首次生产构建通过。
- 实际浏览器首轮总览显示分类标记、聚合圈、飞机和两颗卫星；冲绳近景发现原1:110m数据没有该岛的轮廓，不能以材质改动代替地理内容。修改 `DTC_2026_Level1_资料包/tools/prepare_world_reference.py`：同一官方项目固定提交改用1:50m数据，原110m参考层保存在 `evidence/globe_before_50m_2026-10-11/`；新原件、来源链接、固定提交、获取时间和SHA-256归档。
- 当前参考层242个区划几何，2,269,881字节，含冲绳附近岛屿多边形；仅作为地理背景，未替换任何正式基地坐标或边界。输出SHA-256：`628d782fdd5cd89797a30e01ba28ba9c7326d3ba2e4dd95a2609098f4b58d314`。
- 修改 `src/services/globeVisuals.ts`：合并为一个球面线段对象绘制细节轮廓，长边细分避免直弦穿入球体，近景保留清晰海岸；飞行器随视距缩小并在近景停绘。Python与TypeScript编译通过，新的生产构建与浏览器复验进行中。

### 2026-10-11：近景细节、选中状态与窄屏视场完善（进行中）

- 修改 `src/services/globeVisuals.ts`：近景使用同一242个原始几何按当前经纬度绘制2048局部纹理，铺在同一球面并随地区切换复用/释放。调色按绝对纬度保持一致，分块变化后才重建且限频；近景细节无需在线瓦片、额外预存地点或虚构地形。
- 修改 `GlobeScene.vue`：从展开成员选择站点后保留分散显示，定位下拉框同样展开目标所在密集组；最大缩放100下实测冲绳四个站点标记均20像素，选中Kadena卡片的坐标为正式数据26.3486°,127.7744°，原审核状态与数据未变。
- 完成机构筛选与大屏开关初验；窄屏测试实际宽度375像素无横向溢出，发现桌面垂直视场会裁掉地球两侧，已在ResizeObserver更新中保持水平视场。TypeScript编译检查执行，最终浏览器复验与成果打包继续。
- `package.json`增加 `map:check` 调用实际布局检查；9项通过，机器可读记录保存在 `review-captures/globe-layout-checks-2026-10-11.json`。生产构建与单文件构建均已通过前一轮，仍保留Three.js资源体积提示。

### 2026-10-11：三维地图优化最终验收与提交包更新完成

- 完成机构颜色、位置语义形状、CRS记录号、视图聚合、密集点展开、名称避让、背面遮挡与稳定屏幕尺寸；增加区域/站点定位、机构筛选、键盘操作、缩放控件及大屏演示。所选Kadena保持独立可见，最大缩放100下冲绳四个标记均为20像素，原经纬度没有被视觉展开修改。
- 地球使用归档1:50m参考几何、球面海岸轮廓、全球纹理及离线局部细节，补足冲绳等小岛；展示照明、大气、星空、飞机、两颗太阳能板卫星及轨道均已实际查看。近景隐藏飞行器，界面明确其为演示动画。
- 实际浏览器验收通过机构筛选、大屏进入/退出、站点卡片、密集组四点独立选择、最大缩放与演示开关；手机视口请求390像素，实际375/390像素无横向溢出，四点展开仍为20像素。竖屏保持水平视场，修复地球两侧裁切。未将视口模拟冒称为真实移动设备验收。
- 9项生产布局专项、TypeScript编译、6份数据同步及生产数据校验、94模块生产构建与单文件构建通过。Three.js既有超过500kB的提示保留；页面运行错误为0。单文件9,787,607字节，仍内嵌7份文件，刷新后的Resource Timing无额外资源请求；file双击限制沿用既有验收说明。
- 新版单文件再次核对全部66条画像及16组成员地图，共51处成员定位，9类响应式页面、模型JSON及候选入口移除检查通过。正式画像、身份、坐标、关系、AI审核及五项源输入版本未变；世界参考层作为独立地理背景保存其新来源与指纹。
- 修改 `DTC_2026_Level1_资料包/tools/package_level1_submission.py`：新增地图布局与交互验收阻断，绑定当前单文件SHA-256；打包总览、展开、最大缩放、手机截图与机器可读记录，生成 `材料/三维地图答辩演示.md`，同步使用说明及逐项审核。Python编译与打包复读通过。
- 最终 `DTC_2026_一级提交成果.zip` 共155个文件、8,153,880字节，独立复核CRC、所有文件的磁盘一致性及SHA-256、7份运行数据、242个参考几何、66条已审核画像及新材料通过。ZIP SHA-256：`5eb72790affc6e7d17752cf09c6a3f0c44443ce8c689b883e11599d93b524cc3`。
- 临时4181验收服务已停止且无监听；用户此前明确启动的4180项目预览仍由进程11360运行。临时提交文件标签已关闭，视口恢复，保留新版地图标签。没有启动npm开发服务，没有使用网页端GPT评审或执行外部投稿。

### 2026-10-12：其他正式页面只读审查

- 根据用户“按这次修改标准看看其他页面”的要求，审查概览、参考站点、详情、开放系统模型、BSR统计，以及设施地图、字段证据、来源抽屉和共用外框；本轮应用代码、正式数据、审核记录和提交包未修改。
- 项目约定的GPT6 LUNA完整读取页面及直接相关组件、服务、类型、路由和样式，提供事实与代码行号；主代理结合真实页面确定问题和优先级。使用web-design-guidelines界面审查规范辅助检查，没有使用网页端GPT评审。
- 新增 `DTC_2026_页面优化审查_2026-10-12.md`：逐项记录问题、实际影响、代码位置、最简修改范围和顺序。确认字段证据固定截取前12条，Kitsap显示55条但仅呈现12条；目录行没有键盘详情链接，筛选缺太空军，无结果无专门提示，进入详情再返回会清空搜索。
- 确认Kitsap小地图总览Bangor与成员Bangor标记重叠；桌面中心距约5.4px，手机中心距约1.75px，手机成员标记直径约5.23px、总览约6.73px。记录详情地图与模型实例位于长页面后部、来源抽屉Escape不关闭及原始枚举露出等展示问题，提出复用现有结构和真实数据的优化方案。
- 新增 `DTC_2026_Web/review-captures/pages-audit-2026-10-12/`：14张实际截图及 `observations.json`，涵盖首页、目录、详情、小地图、模型、统计和来源抽屉。桌面1280×720与390×844请求视口检查；手机为浏览器模拟，实际内容宽375/390px。运行error/warn记录为空，目录仍存在内部横向滚动。未将控件定位过程中的自动化匹配错误作为应用错误。
- 操作环境：原4180/4181端口无监听，临时启动已有生产dist的Vite预览进行审查，受控会话4996、进程41688；审查完成后终止本轮会话，关闭本轮浏览器标签并恢复视口。未启动npm开发服务；未改源码，因此本轮未重复执行编译、构建或打包。
- 收尾复查：4180/4181均无监听；审查文档31个本地链接全部存在，14张截图已落盘，观察JSON可正常解析，审查日志已记录。页面问题仍待下一轮修改，本轮不将审查记录称为已修复。

### 2026-10-12：全页面优化（进行中）

- 用户已明确授权全部优化。按证据/目录、详情与空间地图、模型/统计/首页、浏览器验收和提交包更新五阶段执行；使用已有Vue、数据合同和地图分类，不新增后台，不更改已审核资料。
- 在 `DTC_2026_Level1_资料包/evidence/pages_before_2026-10-12/` 保存20份待修改源文件，并记录当前7份运行数据及正式画像、字段证据的SHA-256基线，用于后续核对数据未被界面改动影响。
- 本阶段完整读取原页面及直接关联文件；GPT6 LUNA只读盘点接口、真实数据样本与发布校验链，主代理负责修改和结论。没有使用网页端GPT评审。

### 2026-10-12：全页面优化源码实现与首轮构建

- 重写EvidenceList.vue与SourceDrawer.vue：字段值/来源标题/原始记录定位可查看，支持搜索、分页和显示全部；原生dialog处理焦点与Escape，日期和当前归档枚举转换为中文，完整指纹与原文外发权利记录按需展开。
- 新增ServiceBadge.vue，修改mapMarkers.ts、labels.ts：共用7类机构色彩，统计后缀沿用同一分类，日期只格式化完整ISO记录；原始机构、权利和未知日期保留。
- 重写SitesView.vue、SiteFilters.vue、SiteTable.vue：机构/地区/位置类型筛选、名称/中文地区/记录号搜索、URL保留条件、语义链接与实际审核状态；无结果有恢复入口，手机完整显示关键字段。
- 修改AppShell.vue、router/index.ts及main.css：手机5个页面入口同屏，增加键盘跳到正文；同页筛选保留滚动、章节使用路由hash，合并旧重复配色和布局规则，地球专属样式继续由地图组件管理。
- 新增spatialMap.ts，重写SpatialDetailMap.vue：纯函数处理真实投影和像素避让，引线指回原投影；成员标记20px、选择区域44px，支持平移/缩放/复位/聚焦与键盘操作，选中范围高亮。路径按尺寸缓存，缩放和平移使用SVG变换，源几何和经纬度只读。
- 重写SiteDetailView.vue：审核摘要和设施地图前置，完整画像、关联设施和字段证据带章节链接，具名地点联动地图；原始目录、定位、源文档、审核员与指纹保留在展开说明。
- 新增entityModel.ts与EntityModelDiagram.vue，重写ModelView.vue：真实实体在前，以属性/空间/关系/证据四视角连接同一对象；具名关系联动地图，URL保留实体/视角，完整JSON可下载，预览限制12000字符并说明完整长度。概念解释与版本技术记录按需展开。
- 修改StatisticsView.vue、SimpleBarChart.vue、BsrSummary.vue与FrontendMeta.bsr类型：完整11类机构、机构颜色、完整长名称和数值、2023-09-30截至日期、原表来源入口及英亩/百万美元单位，独立统计口径不变。
- 修改OverviewView.vue：前部突出66已审核画像、16多设施、51成员定位，实际章节/字段证据/关系计数，并加入地图、Kitsap画像、模型及证据四步演示入口。
- 新增check-spatial-layout.mjs与pages:check；真实66对象的792个视图组合、重合点、原投影回指、冻结输入、完整模型、来源状态和日期共8项通过。各批次TypeScript检查通过，原地球9项布局检查仍通过；6份数据同步/正式数据验证和113模块生产构建通过。保留Three.js超过500kB的提示。本条为首轮实现与构建记录，浏览器和提交包验收继续。
- 首轮实际页面已确认55条证据完整展开、太空军与16多设施筛选、返回搜索保留、Esc关闭及焦点恢复、模型关系定位、12000字符预览和615772字符完整JSON下载。手机检查发现地图底部两段文字互相覆盖，已仅在窄屏移除重复的右侧注释，原坐标不变说明继续保留在地图操作说明中；补充总部勤务机构可读分类，保留完整英文原名。后续重新构建并核对最终文件。

### 2026-10-12：最终软件验收与提交打包准备

- 普通生产构建及最终单文件均逐页核对66条画像；214章节、115条关系、16组地图和51成员完整，9类手机视口无页面级横向溢出。Kitsap手机成员标记20px；模型实例区从约3024px提前至约637px。地球冲绳4个展开点在最大缩放100仍均20px，原有筛选、站点卡片和大屏正常。
- 最终单文件的完整证据、原生来源抽屉和Esc/焦点返回实际验收。模型JSON预览12000字符、完整下载615772字符，下载内容已解析核对。界面异步更新以明确完成状态为验收依据，浏览器标签关闭后重新打开；自动化环境问题未作为应用错误。
- 修改index.html与scripts/build-portable.mjs：内嵌项目SVG图标，消除浏览器默认favicon.ico请求，统一明亮页面主题色；生产与单文件重新构建通过。最终文件9827693字节，内嵌7份数据，刷新后Resource Timing额外资源列表为空，正常运行error/warn为0。浏览器工具禁止file协议，未冒称已实际双击验收或真实手机测试。
- 新增pages-data-integrity-2026-10-12.json：10份原资料指纹基线完全一致，画像、坐标、成员关系、来源审核时间及五项输入版本没有被界面更新改变。
- 新增level1-browser-checks-2026-10-12.json、globe-browser-checks-2026-10-12.json及pages-optimized-2026-10-12/内实际截图和完整交互记录；验收绑定单文件SHA-256 ef50071fc2f2ea92791f4f58c391c7f2a3a923716bdb42b1a7258f213857f5f6。旧检查保留为历史记录。
- 新增DTC_2026_页面优化完成_2026-10-12.md，并在原审查文档连接完成记录。修改package_level1_submission.py：读取新日期验收，要求66/16/9页面记录、9项地球布局、8项设施布局/792视图和原数据指纹验证；收录新的截图、完成说明及完整来源资料范围，不重写原画像审核日期。Python源编译通过，提交包生成及CRC/逐文件指纹复查继续。

### 2026-10-12：全页面优化及新版提交包完成

- 新版软件、结构化数据、源码、演示说明及验收文件已由既有打包脚本同步；使用说明、逐项审核、模型说明、作品材料、前端README和资料包状态记录更新。66条原画像正文、成员位置、关系、实际审核时间和指纹保持不变。
- 新DTC_2026_一级提交成果.zip包含172个文件，8142477字节，SHA-256为9ef4aca9171298b01931ff34ab44e090147ba2ec211fce55b0e2b4c54d1ded16。独立复核ZIP CRC、精确文件清单、所有成员与磁盘的字节一致性及SHA-256、7份内嵌文件、66/16/9验收数量、候选工作页未发布和10份基线不变全部通过。
- 最终单文件DTC2026_一级GIS.html为9827693字节，SHA-256为ef50071fc2f2ea92791f4f58c391c7f2a3a923716bdb42b1a7258f213857f5f6；当前浏览器和地球检查均绑定该指纹。资料元数据保留实际历史年代，图标和界面更新不构成新的来源审核。
- 本轮生产预览会话90638、单文件HTTP验收会话23423均已终止；4180/4181端口复查无监听，验收标签已关闭，浏览器视口恢复。未启动npm开发服务，未使用网页端GPT评审，未执行外部投稿或部署。

### 2026-10-12：一级质量报告一致性与源码打包修复

- 用户授权修复一级核查发现的问题。已复现5项报告摘要为false而发布收据为true；坐标非臆测字段另被生成器硬编码为false。原因是基础构建的临时标记未在最终校验后完整回填，不是基地目录、坐标或画像内容缺失。
- 修改 `DTC_2026_Level1_资料包/tools/check_submission_reviews.py`：在既有专项中通过正式校验入口、内存报告副本测试6项摘要与实际结果的矛盾；不改正式输入和来源档案。先验证该回归能暴露原问题，再修改回填及校验逻辑。
- 修改范围限质量摘要生成、发布门禁、源码打包完整性及相关记录；镇海街区、Balabac主岛和Singapore港区等定位范围保留，不补造坐标、不重写66条画像的实际审核时间。
- 以下按修复过程记录；最终校验、重新打包和指纹结果见本节末尾。未启动服务或使用网页端GPT评审。
- 回归在修改前实际失败：正式校验器接受了 `catalog.row_count_ok=false` 的矛盾内存报告，确认原发布门禁不能阻止默认标记泄漏；不是单纯的文件哈希不匹配。
- 修改 `validate_level1_package.py`、`build_profile_artifacts.py`：共用6项摘要字段与正式检查的对应关系，校验后完整回填，再生成收据指纹；校验器拒绝摘要与当前计算结果不一致的报告。新增坐标归档一致性检查，只在66条来源/推导与展示点全部一致后通过，版本为 `level1-validator-2026-10-12.1`。
- 修改 `build_level1_package.py`：坐标非臆测字段改为等待正式校验结果回填；修改质量Markdown生成说明，明确该字段仅表示来源可追溯，不等于实测或人工确认。
- 修改 `package_level1_submission.py`：打包前重新验证当前报告、数据和收据指纹；明确收录 `env.d.ts` 与 `public/data/.checksums.json`，便于源码复建及直接校验；专项计数由实际结果生成，定位范围说明继续保留。
- Python 5份相关脚本语法检查、Vue应用与Vite配置类型检查通过；现有66条数据完成39项正式检查后，仅刷新质量报告与收据，未运行画像、坐标或前端数据重建。
- 报告专项复用该轮已核实且未改动的画像结果，逐项经正式校验入口检查内存报告矛盾；正式文件、来源和数据哈希仍按实际内容核对，减少重复读取相同归档。
- 正式质量摘要6项均已与实际检查一致，39项发布检查、34项专项回归及前端数据校验通过。专项新增1项正确摘要接受检查与6项矛盾拒绝检查；既有27项审核/来源防篡改检查仍通过。
- 独立复核正式画像、目录CSV/GeoJSON、字段证据、66条来源审核档案与最终HTML共6份基线指纹均未变化。将使用修正后的既有打包入口更新派生成果目录、材料计数、源码副本、清单、ZIP与SHA-256；现有软件及其绑定的浏览器验收继续适用。
- 最终已更新 `quality/level1_data_quality.json`、`quality/level1_data_quality.md`、`quality/validation_receipt.json` 与 `quality/level1_review_checks.json`，并同步提交包验收副本。6项摘要值均为实际通过结果；人工确认计数仍为0、正式空间层仍为false，明确保留项目内部状态与公开参考GIS成果的区别。
- 既有打包脚本已同步根目录参赛符合性审核、资料包README/前端验收清单/readiness_matrix、前端README，以及提交包使用说明、一级审核材料、源码副本与文件清单。当前正式检查计数39、专项计数34；源码副本新增 `env.d.ts`、`public/data/.checksums.json`，其他已收录源码字节与活动工程一致。
- 新版 `DTC_2026_一级提交成果.zip` 含174个文件（清单173项及清单本身），8143686字节；SHA-256为 `a64a07329e534fcb480b2974ad805f43ce9b9319b7ffa3f229c770afcc7b3e48`，旁边的 `.zip.sha256` 已更新。独立复查ZIP CRC、精确文件集合、全部文件与磁盘字节/大小/SHA-256一致、6项报告/收据状态以及源码6份数据账本指纹全部通过。
- 软件HTML指纹仍为 `ef50071fc2f2ea92791f4f58c391c7f2a3a923716bdb42b1a7258f213857f5f6`；66条画像、正式坐标、字段证据及实际来源审核未变，现有浏览器记录仍绑定同一HTML。本轮没有界面或运行数据修改，未重新生产构建或冒称新一轮浏览器验收。
- 收尾确认4180/4181无监听；本轮未启动服务，无新增服务待终止，未安装依赖、调用网页端GPT、外部投稿或部署。以上已完成授权修复与提交包更新。

### 2026-10-13：按用户要求启动项目查看

- 用户明确要求启动项目。检查5173、4180、4181未发现已有监听后，在 `DTC_2026_Web` 运行 `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort`；服务地址为 `http://127.0.0.1:5173/`，受控会话44081、Vite进程37256。按本次查看要求保持运行，不在本轮结束时停止。
- 既有predev执行6份前端数据同步与校验：66条站点、66条已批准画像、1,626条BSR、3,747条字段证据、16个多设施对象与51处成员定位均通过；没有修改应用代码、基地事实或配置。
- 本机首页HTTP返回200，元数据与画像接口均可读。已在应用内浏览器打开并保留项目概览，实际显示“数据已加载”、66条审核画像、16个多设施对象、51处独立定位及214章节。此为本机启动确认，未执行新的完整回归、跨设备或生产部署验收。

### 2026-10-29：前端样式细化与验证

- 按用户要求保持既有功能和青绿色整体配色，使用现有 Vue 与 CSS 实施小范围调整。
- `DTC_2026_Web/src/styles/tokens.css`：加深共用辅助文字颜色，提高浅色背景上的可读性。
- `DTC_2026_Web/src/styles/main.css`：压缩桌面及移动端顶栏、提示条与页面介绍间距；适当放大品牌、移动状态和面板说明文字；概览指标卡添加同色系细边，强化信息层级。
- `DTC_2026_Web/src/views/MapView.vue`：放大地图介绍、审核说明、地图操作和来源文字，并提高深色背景辅助文字对比度。
- `DTC_2026_Web/src/views/StatisticsView.vue`、`src/views/ModelView.vue`、`src/components/statistics/BsrSummary.vue`：放大统计图例及移动端指标说明文字。
- 本次仅修改样式，未更改路由、业务逻辑、数据或已有提交包。
- 验证：按锁文件安装依赖后，`vue-tsc -b`、Vite 生产构建、`data:verify`、`map:check` 9项和 `pages:check` 8项/792个布局组合均通过。构建输出写入本次临时验证目录，未覆盖原 dist；Vite 仍提示地图 JS 超过 500 kB。
- 浏览器抽样：使用本机 HTTP 构建结果查看概览、目录、详情、地图、模型和统计；检查目录搜索与进入详情、地图区域切换、模型关系视角，以及统计来源抽屉打开和 Esc 关闭。1280×720、390×844 视口留图，320×700 地图/模型/统计的页面宽度未横向溢出；浏览器模拟不等于实体手机验收，本轮没有逐项执行所有功能回归。
- 截图和临时构建位于 `C:/Users/admin/.codex/visualizations/2026/10/29/01a1866e-1e6c-7722-a7ac-12a3f54117b5/`；本轮临时预览服务已终止，浏览器视口已恢复，未启动 npm 开发服务或使用网页端 GPT 评审。

### 2026-10-29：按用户要求启动本地预览

- 使用上轮已完成的临时生产构建作为静态预览，在 `127.0.0.1:4180` 启动 Python HTTP 服务，未运行 npm 开发服务，也未改动源码、数据或原有提交包。
- 页面实际加载成功，首页显示“数据已加载”；按用户查看要求保留预览服务运行。

### 2026-10-29 至 2026-10-30：地球图展示组成地点与公开参考范围

- 按用户确认，在现有三维地球选中站点后展示其已有独立组成地点和公开参考范围，保留原始经纬度、来源说明与站点详情入口；无独立地点或范围时保留原来的选站流程。
- `DTC_2026_Web/src/services/spatialMap.ts`：抽出通用屏幕投影避让函数，二维地图继续使用同一避让规则，真实投影用于指示线。
- `DTC_2026_Web/src/services/globeSpatial.ts`：从原始 Polygon/MultiPolygon 和内环构建球面叠加数据，按锚点及几何计算适合视口的视角，并对背面范围进行遮挡处理。
- `DTC_2026_Web/src/components/map/GlobeScene.vue`：新增设施点、参考范围、地点选择、聚焦和来源入口；选站后定位全部已有设施，调整近景缩放。
- `DTC_2026_Web/src/views/MapView.vue`：向地球提供已选画像与来源抽屉；有设施资料时将站点卡放在地球下方，避免遮挡地图。
- 首次 `vue-tsc -b` 通过；后续验证结果见本节末尾。
- 新增 `DTC_2026_Web/scripts/check-globe-spatial.mjs`：检查66个画像、三种屏幕尺寸共198组视角、范围分片与内环、日期变更线、标记避让和源数据不变；专项通过。
- 浏览器初检发现从设施极近景切到普通单点时视距可能过小；`GlobeScene.vue` 对单点选站及单点聚焦保留最小上下文距离，随后 TypeScript 再次通过。
- 浏览器复测发现设施近景的拖动及方向键步长过大；`GlobeScene.vue` 依据与地表的距离缩小近景移动幅度，远景保持原步长。再次完成 TypeScript 检查。
- 近景浏览器实测40像素拖动仍偏灵敏；`GlobeScene.vue` 将方向键和拖动的近景比例统一校准，远离地表后恢复原速度；TypeScript 检查通过，等待浏览器复测。
- 最终验证：`vue-tsc -b`、Vite 生产构建、`data:verify`、既有 `map:check` 9项、`pages:check` 8项/792组视图以及新增地球设施专项 66个画像/198组视口通过；数据未改动。构建仍有地图脚本超过500 kB的提示。
- 本机浏览器验证：Kitsap显示4处独立成员和4个公开参考范围（7个多边形分片），成员标记与列表联动、聚焦、来源抽屉、普通单点切换、关闭和恢复总览正常；Everett跨区域地点、390×844移动视口及页面宽度也已核对。浏览器错误/警告为空；模拟移动视口不代表真实手机验收。
- 近景速度最终校准后，实际拖动40像素时标记移动约38像素，方向键小步移动后5个标记仍在视图中。桌面、移动端截图保存在 `C:/Users/admin/.codex/visualizations/2026/10/29/01a1866e-1e6c-7722-a7ac-12a3f54117b5/globe-facilities-desktop.jpg` 和 `globe-facilities-mobile.jpg`。
- 临时本地预览服务已关闭，浏览器视口已恢复；构建在临时目录，未更新原 dist、离线 HTML、正式提交包或外部部署。
- `scripts/check-globe-spatial.mjs` 进一步逐顶点检查所有公开范围是否落在自动聚焦视野内；66个画像、198组视口及 TypeScript 复检通过。

### 2026-10-30：地球图缩放、点位和信息交互优化（进行中）

- 用户确认继续使用现有离线底图；保持来源和坐标数据不变。
- `DTC_2026_Web/src/services/mapMarkers.ts`：聚合阈值与44px点击区对齐，手动展开在圆周/网格中保留原投影，空间不足时完整列表仍可选择。
- `DTC_2026_Web/src/services/spatialMap.ts`、`src/components/map/GlobeScene.vue`：站点与设施标记统一做屏幕避让并保留原始指向，手动拖动或缩放不再清除用户展开状态；普通站点点击区域调整为44px。
- `DTC_2026_Web/scripts/check-globe-layout.mjs`：增加缩放聚散、跨图层同坐标独立选择的检查。此阶段 TypeScript、地球11项和原二维空间8项检查通过；实际浏览器验证及信息展示优化继续。
- `DTC_2026_Web/src/services/globeSpatial.ts`、`src/components/map/GlobeScene.vue`：扩展地球近景范围；滚轮围绕指向的球面位置缩放，按钮和滑块围绕已选地点，保留触摸捏合；离线底图语义明确。
- `DTC_2026_Web/scripts/check-globe-spatial.mjs`：增加球面指向点缩放前后屏幕位置及更近相机距离检查；TypeScript 和66画像、198组视口、日期变更线及指向缩放专项通过。浏览器操作验证待完成。
- `DTC_2026_Web/src/components/map/GlobeScene.vue`：选中站点或组成地点时，在地球视窗显示位置、坐标和来源入口，并提供画像跳转；信息框避开可见点位及缩放控件，可关闭且不改变数据。
- `DTC_2026_Web/src/views/MapView.vue`：接通信息框的画像入口，完整审核卡统一移至地图下方，减少对地图点位的遮挡；既有详情和来源入口保留。上述界面改动后 TypeScript 检查通过，浏览器验证待完成。
- 浏览器初检发现信息框可能遮住邻近设施按钮；`GlobeScene.vue` 增加候选位置，按实际遮挡面积优先避开点位及地图控件，并将关闭按钮扩大到44px。修改后 TypeScript 检查通过，等待重建与复测。
- 移动视口复测发现初版避让仍会覆盖 Keyport 按钮；`GlobeScene.vue` 收紧信息框尺寸和空白并保留44px操作区，补充上下方候选位置。长信息可在卡片内滚动；修改后 TypeScript 检查通过，等待重建复测。
- 移动端复测中信息框已避开 Keyport 等5个设施按钮；另发现相机移动移除悬停标记时旧提示可能残留，`GlobeScene.vue` 在标记不再可见时清除对应提示。修改后 TypeScript 检查通过，等待最终重建验证。
- 最终验证完成：`vue-tsc -b` 和临时目录 Vite 构建通过；`data:verify` 通过（66站点、66画像），地球聚合专项11项、二维空间专项8项/792组及地球设施专项66画像/198组通过。Vite 仍提示地图脚本超过500 kB。
- 本机浏览器验证冲绳4点随缩放分离与重新聚合、手动展开后拖动保留、滚轮围绕指向位置缩放、最大缩放、设施与站点同坐标独立选择、来源抽屉和画像跳转；桌面及390×844移动视口截图分别为 `C:/Users/admin/.codex/visualizations/2026/10/29/01a1866e-1e6c-7722-a7ac-12a3f54117b5/globe-interaction-desktop.png`、`globe-interaction-mobile.png`。浏览器控制台无错误或警告；320×700视口无横向溢出，但信息卡在极窄视口仍可能部分遮住邻近点，可关闭信息卡或使用列表选择。
- 移动端为浏览器视口模拟；当前应用内浏览器不支持双指手势模拟，未进行实体触控验收。滚轮、按钮及滑块已验证；原触控控制代码保留。
- 临时HTTP预览已关闭，4181等检查端口无监听，浏览器视口已恢复。未运行 npm 开发服务、未使用网页端GPT；生产构建仅写入临时验证目录，未更新原 dist、离线 HTML、正式提交包或外部部署。

### 2026-10-30：按用户要求启动优化版预览

- 使用上次验证的临时生产构建启动本机静态服务 `http://127.0.0.1:4181/`，进程 PID 51500；页面已打开至代表点地图并显示数据已加载。按用户查看要求保持预览服务运行。
- 本次仅更新本说明并启动本机预览，未修改应用源码、数据、原 dist 或提交包，也未启动 npm 开发服务。

### 2026-10-30：精简页面重复说明

- 按用户要求精简重复的次要标签，保留必要的数据来源与范围说明。
- `DTC_2026_Web/src/layouts/AppShell.vue`：移除重复的品牌副标题及页头重复路径文字，页面标题、导航和数据边界提示保留。
- `DTC_2026_Web/src/views/OverviewView.vue`：移除演示步骤数量标签、重复说明及展开区内重复标题，保留四个入口和来源链。
- `DTC_2026_Web/src/views/SitesView.vue`：移除重复的结果数量提示，将结果总数设为状态提示，保留筛选、结果计数和详情入口。
- 此次仅调整展示文字，不更改业务数据、路由或统计口径；验证结果另行记录。
- 验证：`vue-tsc -b`、Vite 临时生产构建和 `data:verify` 通过；浏览器检查概览与站点目录，搜索 Kitsap 时结果数由 66 更新为 1。Vite 提示地图脚本超过 500 kB；未进行全部页面及移动端完整回归。临时构建未覆盖原 dist、离线 HTML 或提交包。

### 2026-10-30：详情页单点地图区域定位优化（进行中）

- 核对66个画像：47个只有总览点，19个具有独立成员点或参考范围；沿用已有离线地理资料，原始位置和来源不变。
- `DTC_2026_Web/src/services/spatialMap.ts`：新增单点区域视野计算，为地图提供足够大的地理上下文；TypeScript 检查通过，界面接入和浏览器验证继续。
- `DTC_2026_Web/src/components/map/SpatialDetailMap.vue`：单点站点显示区域视野、已记录的地区和参考坐标，说明底图细节与边界限制；日期变更线附近轮廓按视野平移显示，原数据保持不变。新增地球图入口待接通；多点或范围仍使用原有详细视野。
- `DTC_2026_Web/src/views/SiteDetailView.vue`、`src/views/ModelView.vue`：向共用地图传递现有站点信息，保证详情页与模型页使用同一定位展示。新增属性后发现两个调用处的 TypeScript 缺失，已同步修复并通过检查。
- `DTC_2026_Web/src/components/map/GlobeScene.vue`、`src/views/MapView.vue`：详情页跳转至地球时根据站点编号调用已有选站与聚焦流程；不另造坐标或修改地图数据。TypeScript 检查通过，等待交互回归。
- `DTC_2026_Web/scripts/check-spatial-layout.mjs`：新增47个单点站点在三种视口下的区域范围、居中和标记投影检查。首次断言遇到浮点舍入边界，加入极小容差后通过；TypeScript、66站点原有792组视图、单点专项、数据校验及地球聚合检查通过。

### 2026-10-30：整体样式细化

- 按用户要求在现有青绿色风格上优化视觉层级，保留来源、口径和位置边界。
- `DTC_2026_Web/src/styles/main.css`：简化导航编号的边框，修正页头标题对齐，统一面板圆角与按钮交互；首页介绍区缩短正文行宽、调整留白，并将三个指标合为分隔式区域，移动端改为纵向分隔。
- `DTC_2026_Web/src/views/StatisticsView.vue`：移除与分类数量重复的“完整分类”标签，保留分类数量和单位。
- 本轮仅调整展示和交互样式，不修改数据、计算、路由或功能。后续验证结果另行记录。
- 验证：`vue-tsc -b`、Vite 临时生产构建、`data:verify` 通过（66 个站点、66 条画像、1,626 条 BSR 记录）；构建仍提示地图脚本超过 500 kB。
- 浏览器抽查：桌面概览、统计、地图均正常显示；390×844 模拟视口中概览指标纵向排列、统计页显示正常；统计原表来源抽屉可打开。未进行全部交互及实体手机验收。临时构建未覆盖原 dist、离线 HTML 和提交包。

### 2026-10-30：启动优化版供查看

- 按用户要求使用本轮已验证的临时生产构建启动本地静态预览，地址 `http://127.0.0.1:4183/`，进程 PID 43000；浏览器首页显示数据已加载。为供用户查看，预览保持运行。
- 4182 端口已有其他项目预览，本次未改动；未运行 npm 开发服务，未改动源码、数据或正式提交包。
- 浏览器抽查发现威克岛等偏远单点在固定区域尺度仍缺少可辨认背景；`src/services/spatialMap.ts` 根据现有离线轮廓在多个区域尺度间选择，按视口内真实轮廓长度判断，资料不足时使用更宽视野；`SpatialDetailMap.vue` 在地理数据加载后应用该尺度。未添加或伪造地理要素。全47个单点的三种视口和 TypeScript 检查通过，浏览器复测继续。
- 浏览器逐页检查发现第31条 Kwajalein 虽有多个地点，但局部视野没有离线陆地轮廓。`SpatialDetailMap.vue` 在此类无范围且无轮廓的情况默认切到区域视图，同时为多地点记录提供区域/设施视图切换，保留原有设施分布与选择功能；TypeScript 检查通过，等待浏览器复测。
- Kwajalein 区域复测发现零散小岛轮廓累计长度仍可能使海面视图被误判为足够清晰；区域尺度判断改为检查单条连续轮廓，减少零散小岛的误判。TypeScript 和66站点空间专项复检通过。

### 2026-10-30：统一 Lucide 操作图标与机构图标（进行中）

- 按用户要求统一界面图标；`package.json`、`package-lock.json` 引入 `@lucide/vue` 1.64.0。安装时旧包 `lucide-vue-next` 提示弃用，已移除并采用其推荐的新包；Vue 类型检查通过。
- `ServiceBadge.vue`、`mapMarkers.ts`：以分类图标及机构文字取代彩底汉字，保留既有机构分类与地图颜色，图标不代表官方军种徽章；移除不再使用的字形字段。
- `AppShell.vue`、`main.css`：导航改为带名称的 Lucide 图标，保持桌面及移动导航标签和选中状态。
- `SiteFilters.vue`、`SiteTable.vue`、`SitesView.vue`：搜索、重置及审核状态使用图标，保留筛选和状态文字。
- `GlobeScene.vue`、`SpatialDetailMap.vue`、`MapView.vue`、`SourceDrawer.vue`：替换地图缩放、复位、全屏、关闭、审核和来源操作符号；保留可访问名称与表示数据类型的地图几何标记。验证及其余入口后续记录。
- `OverviewView.vue`、`SiteDetailView.vue`、`ModelView.vue`、`StatisticsView.vue`、`EvidenceList.vue`：统一演示流程、状态、返回、跳转与来源入口的箭头和对勾图标，文字和链接目标保留。
- `GlobeScene.vue` 补齐聚合列表关闭及地图依据入口图标；保留地图业务点形状、聚合数字和方向文字。
- `scripts/check-spatial-layout.mjs`：增加偏远海岛自动扩大区域尺度检查，并冻结离线世界地理数据验证不被修改；10项空间检查、792组既有视图及 TypeScript 通过。
- 浏览器初检发现审核文案变长挤压表格，`SiteTable.vue` 恢复原有“来源审核通过”文案并保持表头单行；机构图标与原状态语义保留。
- 最终本地浏览器逐页核对66个站点：各页地图标记数量与独立定位数一致，已保存的范围路径数量与资料一致，离线轮廓均加载；其中47个单点和1个无轮廓多点案例默认显示区域视图。另抽查阿拉斯加、日期变更线、威克岛、Kwajalein、Kitsap，核对区域/设施切换、成员选择、缩放复位、来源抽屉、地球定位跳转及模型页复用。
- 390×844移动视口检查无横向溢出；截图保存为 `C:/Users/admin/.codex/visualizations/2026/10/29/01a1866e-1e6c-7722-a7ac-12a3f54117b5/detail-regional-final.png` 和 `detail-regional-mobile.png`。浏览器模拟不等于实体手机或完整人工视觉验收。
- 最终 `vue-tsc -b`、Vite 临时生产构建、`data:verify`、二维空间10项/792视图、地球聚合11项和地球设施66画像/198视图通过；Vite 仍提示地图脚本超过500 kB。66页检查为浏览器自动读取标记及路径数量，并非逐页人工视觉审查。
- 临时服务4182已关闭，4181及5173无监听，浏览器视口已恢复；未启动 npm 开发服务。构建仅在临时目录，未更新原 dist、离线 HTML、正式提交包或外部部署。
- 验证：`vue-tsc -b`、临时 Vite 生产构建、`data:verify`、地球布局 11 项及空间布局 10 项/792 组通过；Vite 仍有地图资源大于 500 kB 的提示。
- 浏览器验证：桌面和 390×844 模拟视口的目录可见图标与名称；Kitsap 搜索、详情进入、设施地图从 1.0× 放大至 1.4×、来源抽屉打开和关闭、地球图缩放均已实测。模拟视口不代表实体手机测试。
- 预览：将已验证的构建资源和入口同步到用户原本查看的 4183 静态预览，并通过新标签确认图标已更新；保持该预览运行。临时 4184 验证服务已关闭；未更新正式 dist、离线 HTML 或提交包。
- `npm audit` 提示 Vite 与 source-map-js 两项高危依赖问题，本轮未升级它们或运行自动修复；不影响上述构建结果，需单独评估修复。

### 2026-10-30：修复 Vite 与 source-map-js 安全告警（验证完成）

- 按用户要求修复 npm 安全审计中的两项高危依赖问题。
- `DTC_2026_Web/package.json` 将 Vite 最低版本提升至 `^7.3.7`；`package-lock.json` 将 Vite 从 7.3.6 锁定到 7.3.7，并将间接依赖 source-map-js 从 1.2.1 更新到 1.2.2，以覆盖 Vite/PostCSS 与 Vue 编译器共同使用的路径。未使用 `--force`，未添加直接业务依赖。
- 每次依赖更新后 `vue-tsc -b` 均通过；安装后 npm 初步报告 0 个漏洞。独立安全审计、构建和浏览器运行检查继续。
- 验证完成：独立 `npm audit` 为 0 个漏洞；`npm ls vite source-map-js` 确认 Vite 7.3.7、PostCSS 和 Vue 编译器均使用 source-map-js 1.2.2。TypeScript 检查、生产构建、数据校验、地球布局 11 项及空间布局 10 项/792 组通过。
- 浏览器抽查临时生产构建：概览、站点搜索及 Kitsap 详情、设施地图缩放、来源抽屉、三维地球缩放、模型关系切换和统计页正常。Vite 仍提示既有地图资源超过 500 kB。
- 离线构建兼容性：以现有脚本相同逻辑将单文件定向写入临时目录，内嵌 7 份数据，通过本地 HTTP 浏览器检查首页数据与样式；该检查未覆盖正式离线 HTML 或提交包，也未验证 file:// 双击。
- 本轮临时 4185 验证服务已关闭。用户此前要求查看的 4183 静态预览继续保留；其入口与本轮生产构建入口 SHA-256 一致。未启动 npm 开发服务，未重新生成正式 dist、离线 HTML 或提交包。

### 2026-10-30：导航抽屉与地图画幅优化（验证完成）

- 按用户要求将侧栏收起并扩大内容及地图可视范围，沿用现有导航、地球和数据组件。
- `DTC_2026_Web/src/layouts/AppShell.vue`：导航改为默认关闭的原生对话框抽屉，菜单按钮打开、导航选择后关闭，支持关闭按钮、遮罩和 Esc；保留导航名称与焦点恢复。
- `DTC_2026_Web/src/styles/main.css`：主内容使用完整窗口宽度，统一桌面和移动端的抽屉导航；地图页收紧边距以扩大画布。
- `DTC_2026_Web/src/views/MapView.vue`：移除地图前重复介绍区，保留全局数据边界、地图图例、来源和演示模式。
- `DTC_2026_Web/src/components/map/GlobeScene.vue`：根据可用视口高度增大默认地图区域，并保留移动端最小高度与地图既有交互。后续继续编译与浏览器验证。
- 浏览器初检后：`main.css` 固定顶部导航入口，滚动时仍可打开抽屉；`GlobeScene.vue` 按桌面/移动端顶部实际空间调整高度，尽量让完整画布进入首屏。
- `main.css`、`SiteDetailView.vue`：为固定顶部栏调整页面及详情章节锚点的滚动留白，防止跳转后标题被遮挡。
- 浏览器实测发现路由锚点独立使用 24px 偏移，`src/router/index.ts` 将偏移更新为 96px，使固定顶栏不遮住目标标题；保留筛选和返回时的原滚动行为。
- `AppShell.vue`、`main.css`：移除页头重复的“一级”标签，保留数据加载状态，减少 320px 视口下标题换行；抽屉中仍保留数据集说明。
- 验证：每批修改后 `vue-tsc -b` 通过；最终 Vite 临时生产构建通过，数据校验、地球布局 11 项、空间布局 10 项/792 组及地球设施 66 画像/198 组通过。既有地图资源超过 500 kB 的构建提示仍在。
- 浏览器实测：导航抽屉打开、关闭、遮罩、Esc、焦点恢复及跳转后收起正常；地图站点选择、Kitsap 设施、地球图大屏进入/退出正常，字段证据锚点标题高于固定栏底部（121px 对 80px）。
- 在 1280×720 浏览器视口，地图画布约 1231×473px，底部落在首屏；390×844、320×700 模拟视口检查布局，320px 地图和模型页无页面横向溢出。浏览器模拟不等于实体手机触控验收。
- 验证后的资源已同步至用户正在查看的 4183 本地静态预览，已用新标签回读确认；4185 临时验证服务已关闭，4183 按用户之前查看要求保留。未重新生成正式 dist、离线 HTML 或提交包。

### 2026-10-31：地图、目录与 BSR 统计联动（进行中）

- `src/services/siteFilters.ts`、`src/views/SitesView.vue`、`src/views/MapView.vue`、`src/components/site/SiteTable.vue`：提取地图与目录共用的 URL 筛选规则，跨页传递搜索、机构、地区和位置类型；地图显示筛选总数并链接目录，保留详情返回时的筛选上下文。地图机构数量按其余筛选条件计算，视窗数量仍由地图单独显示。待编译和浏览器验证。
- `src/components/statistics/SimpleBarChart.vue`、`src/components/statistics/BsrDetailTable.vue`、`src/views/StatisticsView.vue`：机构柱支持键盘操作及选中状态，按源表原始机构值联动分页明细，展示源表行号、地点和原始数值；提供清除筛选。汇总卡和面积排行保持全量，BSR 与 CRS 不建立未经核验的对应关系。待编译和浏览器验证。
- 交互初检发现明细在长图下方，`StatisticsView.vue` 在选择机构后定位至明细；`BsrDetailTable.vue` 设置锚点顶部留白，避免固定导航遮挡。待重新编译和复测。
- 移动视口初检发现明细列过窄，`BsrDetailTable.vue` 为表格设置最小宽度，保留容器横向滚动，避免站点名逐字换行；窄屏增加滑动提示并允许键盘聚焦滚动区域，待编译及复测。
- 验证：每批修改后 `vue-tsc -b` 均通过；临时目录 Vite 生产构建与数据校验通过（66 条 CRS 站点、1,626 条 BSR 记录）；`git diff --check` 无空白错误。构建仍提示地图资源超过 500 kB。
- 本机浏览器验证：目录的 Kitsap、海军、华盛顿州、多设施四项条件得到 1 条，进入地图后同为 1 条；地图改为陆军时显示 0 条并能带回目录；地图选站、进入详情、返回目录保留条件。BSR 选择海军现役显示 429 条，翻至第 2 页后切换 2 条的总部勤务机构可回到第 1 页，清除恢复 1,626 条；选择机构自动定位明细。
- 390×844 浏览器模拟视口中，明细提示可横向滑动，键盘右方向键可滚动表格；模拟不等于实体手机验收。交互截图保存在 `C:/Users/admin/.codex/visualizations/2026/10/31/01a19213-1afb-76b0-989d-a76548e35d13/`。未更新正式 dist、离线 HTML、提交包或部署。
- 本次临时静态服务 4188 已关闭；复核 4188、4183 和 5173 端口均无监听。未启动 npm 开发服务。

### 2026-10-31：精简首页入口与提示（验证完成）

- `DTC_2026_Web/src/views/OverviewView.vue`：移除首页首屏“浏览参考站点”按钮，保留地图入口及其他站点导航。
- `DTC_2026_Web/src/layouts/AppShell.vue`：首页不再显示指定的公开资料与代表位置提示，其他页面各自的说明保持原样。
- `vue-tsc -b`、临时目录 Vite 生产构建和 `git diff --check` 通过；构建仍提示地图资源超过 500 kB。本机浏览器确认首页两项均已移除，地图入口可打开，地图页自身提示保留；截图为 `C:/Users/admin/.codex/visualizations/2026/10/31/01a19213-1afb-76b0-989d-a76548e35d13/home-clean.png`。
- 临时静态服务 4188 已关闭，4188、4183 和 5173 无监听；未运行 npm 开发服务，未部署线上或更新正式构建及提交包。

### 2026-10-31：发布筛选联动与首页精简

- 基于远端 `mater` 的根目录结构，在隔离工作区迁入两轮修改及相应更新说明，执行 `npm ci`、`npm run build` 和数据校验后提交 `99b3a612472ee19b94765833bb77eaf2ba0f4220` 并推送。
- GitHub Actions 运行 `41206017149` 成功；通过远端分支 API 核对提交。线上浏览器复核首页指定按钮及提示已消失，地图海军筛选带至目录显示 16 条，BSR 海军现役图联动 429 条明细。
- 原工作区仍处于原有提交和未提交状态，未重置或覆盖用户其他文件；线上发布使用隔离工作区。刚发布时旧标签页曾引用已替换的旧资源，刷新后显示新版本。

### 2026-10-31：修复三维地图局部渲染异常

- 在菲律宾区域放大时复现局部矩形及三角碎片。`DTC_2026_Web/src/components/map/GlobeScene.vue` 根据相机与地表距离动态调整近裁剪面，改善球面与局部高清网格之间的深度精度，并为极近距离及地表上方轮廓保留裁剪余量。
- 本次不改变原始地理和站点数据。
- 深度精度调整后，浏览器同视角复测三角碎片消失，但矩形仍存在。进一步核对发现局部纹理逐点归一化经度，会把巴西多边形错误跨接到菲律宾附近。`DTC_2026_Web/src/services/globeVisuals.ts` 改为按完整多边形平移并绘制与局部视野相交的经度副本，同时按视野绘制经线；保留原始坐标及日期变更线附近的显示。
- 验证：两次代码修改后 TypeScript 检查均通过；临时 Vite 生产构建通过，仍有地图资源超过 500 kB 的既有提示。数据校验、地球布局 11 项、空间布局 10 项及 792 组视图通过。
- 本地 Chrome 在菲律宾相同区域复测，矩形和三角碎片未再出现；另抽查日期变更线附近 Eareckson 站点定位、冲绳近景和最大缩放。复测截图：`C:/Users/admin/.codex/visualizations/2026/10/31/01a1920f-6fae-7602-a4d5-6490db32810a/dtc-philippines-fixed.png`。浏览器抽查不代表全部显卡和浏览器均已验收；临时构建未更新正式 dist、离线 HTML 或提交包。

### 2026-10-31：地图修复推送与线上核验

- 地图修复提交 `485639f5696bcdf07ef817cf2142b12ae9c7018b` 已推送至 `WhitePlusMS/geo-atlas` 的 `mater`；远端分支回读一致。本次提交仅包含 `GlobeScene.vue` 与 `globeVisuals.ts`，本地完整更新日志及其他未跟踪资料未上传。
- GitHub Actions `Deploy to GitHub Pages` 对应提交的运行 41205029757 已成功；线上地图脚本与本地验证构建的 SHA-256 一致。Chrome 重新加载后，在菲律宾原异常视角和缩放下未见矩形色块及三角碎片；浏览器首次读取到旧页面，重新加载后显示新版本。
- 推送期间工作区出现其他站点页面改动，未纳入本次提交，保留原状。

## 2026-10-31（一级成果软件隔离构建与评审准备）

- 新增 `DTC_2026_一级成果_20261031.zip` 及 SHA-256 旁注：收录最新单文件应用、与远端提交 `99b3a612` 对应源码、数据、来源许可和单列的 10 月 12 日历史资料；原成果包未覆盖。未撰写设计报告。
- 在隔离副本执行 TypeScript、Vite 构建和数据校验；地图 11 项、页面布局 10 项通过。通过本机 HTTP 抽查最新单文件的目录检索、地图筛选及统计筛选；线上站点确认可访问最新统计明细。旧逐项浏览器验收不能视为新版重验。
- ZIP CRC 与逐文件 SHA-256 回读通过；实际提交、组委会接收和晋级未由本次检查替代。

### 2026-10-31：移除所有页面顶部黄色提示条

- `DTC_2026_Web/src/layouts/AppShell.vue`、`src/components/common/BoundaryBanner.vue`、`src/styles/main.css`：移除各页面顶部共用提示条、相应路由文案及专用样式；页面正文中的来源与数据说明保留。
- 隔离发布工作区 `npm run build` 和数据校验通过；浏览器检查首页、地图、站点目录、详情、模型、统计均无提示条。提交 `ca4c45025c4258f5b5381859c0001ce43495003a` 已推送，GitHub Pages 部署成功，线上各页面已回读确认。
- 将发布工作区中核对过的相同变更同步回原工作区，原工作区 `vue-tsc -b` 通过。临时预览服务已关闭，4188、4183 和 5173 无监听。

## 2026-10-31（一级成果设计报告草稿）

- 新增 `DTC_2026_场景开发一级_设计报告_草稿.md`，依据公开赛题、当前网站、数据合同及本次隔离验收记录，整理赛题理解、数据来源、系统设计、模型运用、智能体使用、验证范围和成果边界，供提交前审阅。公开材料没有确认设计报告是场景开发一级的强制文件或固定格式。
- 报告区分 2026-10-31 新版抽查与 2026-10-12 历史逐页检查；不改动软件、数据、既有成果包或线上部署，不将内部审核表述为组委会通过。
- 复核远端后，报告补充软件包及专项检查对应 `99b3a61`、线上后续样式更新为 `ca4c450`，避免混同两个版本的验收。

## 2026-10-31（一级设计报告 Word 与 PDF）

- 新增 `DTC_2026_设计报告_提交版/DTC_2026_场景开发一级_设计报告.docx`、同名 `.pdf` 和 Markdown 内容副本，依据草稿、当前代码与线上页面完善数据来源清单、目录与地图筛选、BSR 明细及版本边界。
- `DTC_2026_设计报告_提交版/系统截图/` 保存 2026-10-31 线上概览、三维地图、站点目录、站点详情、详细画像、模型和 BSR 七张原始截图，报告中嵌入其中六张；不使用历史截图冒充当前界面。
- Word 文档重开结构检查：85 个段落、2 张表和 6 张内嵌图；通过本机 WPS Word 兼容接口导出 9 页 PDF，再用 Poppler 逐页渲染检查，修正标题默认边框和参考文献分页；PDF 文字和 8 个链接可提取。标准 LibreOffice 渲染器因本机缺少 LibreOffice 无法运行，实际以 WPS 导出的 PDF 验证排版。
- 线上公开仓库版本复核为 `ca4c450`；本地单文件软件包及其专项检查对应 `99b3a61`。本次仅新增报告与截图并更新本日志，没有修改源码、旧成果包或线上部署。

## 2026-10-31（修复三维地图近景底图模糊）

- `DTC_2026_Web/src/services/globeVisuals.ts`：近景局部地理纹理的经纬度范围按相机距离、视口宽高比及纬度分级调整，放大时绘制更小范围，减少固定纹理被过度放大导致的海岸锯齿；保留原始 Natural Earth 地理数据、离线绘制和现有缩放交互。
- 验证：`vue-tsc -b`、临时目录 Vite 生产构建、地图布局 11 项和 `git diff --check` 通过；地图资源仍有既有的 500 kB 提示。
- 本机 Chrome 使用临时构建定位 Naval Base Kitsap，等待纹理刷新后确认海岸线由明显像素块变清晰，设施标记与聚焦可用；抽查最大缩放及切换到冲绳。该底图仍受现有 Natural Earth 数据精度限制，不增加道路或卫星影像；上述检查不代表全部设备或所有区域均已验收。
- 未更新正式构建、离线提交包或线上站点；临时静态服务验证后关闭。

## 2026-10-31（德谬歌矩阵团设计报告更新）

- 新增 `DTC_2026_设计报告_德谬歌矩阵团/` 下的 Word、PDF、Markdown 与七张重新采集的系统截图。报告参赛组更正为德谬歌矩阵团；删除原六、运行验证与成果整章、参考资料列表及正文编号引用，后续章节重新编号。
- 以当时最新本地源码隔离构建，前端 TypeScript/Vite 构建与 66 站点、66 画像、1626 BSR、3747 证据的数据校验通过；在本机 HTTP 重新采集概览、地图、近景、目录、画像、模型及统计截图。截图后复核源码与构建副本一致。
- 当时线上远端为 `ca4c450`，本地尚有未提交地图近景清晰度调整，因此截图标注本地最新构建，报告未将其表述为已上线。未发布、未修改项目源码或旧报告。
- 重开 Word 检查组名、章节删除和 7 张嵌入图；WPS Word 兼容接口导出 8 页 PDF，用 Poppler 逐页渲染检查，并验证 PDF 文字与 Word 对应。LibreOffice 渲染器因本机未安装无法使用。临时 HTTP 预览服务已关闭。
