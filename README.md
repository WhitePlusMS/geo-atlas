# Geo Atlas

一个用于浏览基础设施、地理数据和来源证据的交互式地图应用。项目使用静态数据展示参考位置、设施画像、关联地点和来源信息，并提供开放系统模型视图。

> 本项目展示的是有来源记录的参考数据和内部审核结果，并非实时设施状态、精确的正式边界或现场测绘结果。数据审核记录中的 AI 审核不代表人工审核或组织方验收。

## 功能

- **态势总览**：查看数据规模、来源和审核状态。
- **交互地图**：在地球视图中浏览参考地点及不同类型的地图标记。
- **设施目录与详情**：浏览设施画像、位置、组成地点、关联关系及来源依据。
- **开放系统模型**：查看实体属性、空间信息、关系、JSON 结构和来源版本。
- **统计与来源**：浏览 BSR 统计及数据的来源、证据和审核信息。

当前数据快照包含 66 个参考地点和 66 份画像。参考位置的精度和适用范围以各条记录中的说明为准；数据更新后，数量和审核状态可能变化。

## 技术栈

- Vue 3、TypeScript、Vite
- Vue Router、Pinia
- Three.js，用于交互地图；Papa Parse，用于读取 CSV
- GitHub Actions 和 GitHub Pages，用于构建和静态部署

## 目录结构

```text
.
├── .github/workflows/              # GitHub Pages 自动部署
├── DTC_2026_Web/                   # 前端源码、配置与前端脚本
│   ├── public/data/                # 世界地图底图；其余运行数据由同步脚本生成
│   ├── scripts/                    # 数据同步、校验与布局检查
│   └── src/                        # 页面、组件、服务、类型和状态
├── DTC_2026_前端直接使用/          # 六份前端运行数据源文件
└── GITHUB_DEPLOYMENT.md            # 仓库与部署操作说明
```

本仓库包含网站运行所需的源码和数据。报名材料、比赛原始资料、本地研究归档、依赖、构建产物及生成的提交包不包含在本次公开范围内；忽略规则不会删除本机文件。

## 环境要求

- Node.js 22 和 npm；自动部署使用 Node.js 22。
- Git，用于获取代码和提交更新。
- 支持 WebGL 的现代浏览器，用于查看交互地图。

## 本地运行

在仓库根目录执行：

```bash
cd DTC_2026_Web
npm ci
npm run dev
```

按照终端输出的地址打开页面。`predev` 会先从相邻的 `DTC_2026_前端直接使用/` 同步六份数据并执行校验。请保持该目录与 `DTC_2026_Web/` 同级，不能只复制前端目录。

构建生产版本：

```bash
cd DTC_2026_Web
npm ci
npm run build
```

`prebuild` 同样会先同步并校验数据，随后进行 TypeScript 检查和 Vite 构建；构建结果位于 `DTC_2026_Web/dist/`。可使用 `npm run preview` 在本机预览构建结果；它不是生产服务器。

## 数据与校验

`DTC_2026_前端直接使用/` 中的以下六个文件是前端构建输入：

| 文件 | 用途 |
| --- | --- |
| `sites.geojson` | 参考地点及展示几何 |
| `profiles.json` | 设施画像、组成地点和审核信息 |
| `bsr.csv` | BSR 统计数据 |
| `evidence.csv` | 字段与来源证据 |
| `source_registry.json` | 来源登记信息 |
| `frontend_meta.json` | 前端元数据和数据审核统计 |

同步脚本将上述文件复制到 `DTC_2026_Web/public/data/` 并生成校验和；这些副本不需要提交。`public/data/world_reference.geojson` 是独立的世界地图底图，不由同步脚本生成，需要保留在仓库中。

在 `DTC_2026_Web/` 中可以单独执行：

```bash
npm run data:sync    # 同步运行数据并生成校验和
npm run data:verify  # 校验数据、来源和校验和
npm run map:check    # 检查地图标记布局
npm run pages:check  # 检查空间视图和模型
```

`map:check` 和 `pages:check` 读取同步后的本地数据，首次运行前先执行 `npm run data:sync`。前端数据中保留来源和审核记录；修改数据后应重新核对来源及审核状态。

## GitHub Pages 部署

项目的 [部署工作流](.github/workflows/deploy-gh-pages.yml) 在推送到 `mater`、`main` 或 `master` 时执行，也可以从 Actions 页面手动运行。流程安装依赖、同步并校验数据、构建前端，再将 `dist/` 发布到 GitHub Pages。

1. 在 GitHub 创建仓库，并按原有目录结构上传源码和构建所需数据。
2. 打开仓库的 **Settings → Pages**，将 Source 设置为 **GitHub Actions**。
3. 推送到默认分支 `mater`（也支持 `main`、`master`），或在 **Actions → Deploy to GitHub Pages** 中手动运行。
4. 在 Pages 页面或工作流部署记录中查看实际访问地址。

如果仓库为 `WhitePlusMS/geo-atlas`，且没有配置自定义域名，预计地址为 `https://whiteplusms.github.io/geo-atlas/`。实际地址及首次部署状态以 GitHub 页面为准。详细步骤见 [GitHub 部署说明](GITHUB_DEPLOYMENT.md)。

## 数据和发布边界

- 参考地点和相关几何以来源记录的范围、用途和精度为准，不能直接当作精确设施中心或正式地籍边界。
- 项目展示静态数据快照，不提供实时设施状态或后端服务。
- `APPROVED` 等状态来自项目内记录的审核流程；AI 审核结果不能等同于人工或组织方验收。
- 公开仓库和网站之前，应核对源数据、研究资料、原始文件及构建产物的授权和个人信息。忽略规则不能代替发布前审查；已被 Git 跟踪的文件也不会因新增 `.gitignore` 自动移出跟踪。
- 项目尚未在仓库中声明统一开源许可证。第三方数据、地图及资料应分别遵循其来源和使用许可，不能因为出现在仓库中就视为可自由再发布。
