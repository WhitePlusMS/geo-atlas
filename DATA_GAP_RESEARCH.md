# DTC 2026 数据缺口调查与当前验收状态

当前状态：2026-10-10完成一级补齐与Codex来源审核。66条画像均APPROVED；定位为18个GIS面内派生点+48个真实查询选点，4个地区锚点与16个多设施对象均已明确说明。字段证据2,005条，一级内部验收通过，用户无需逐条审核。

完整当前依据见[DTC 2026参赛符合性审核](DTC_2026_参赛符合性审核_2026-10-10.md)。21个DISDI候选面、45个无该候选面记录仍是候选覆盖指标，不表示缺少总体定位依据；精确设施边界与组委会专家批准不是本轮完成声明。

## 历史调查记录（2026-09-15及10月10日首轮修复前快照）

以下内容保留旧时点的调查和待办，所有“当前”“草稿”“待补证”“人工复核”均属于该历史时点，不作为本次一级验收的未完成项。现况以以上最新审核为准。

## 1. 结论先行

当前前端资料包可以作为 **Level 1 参考目录和复核界面** 的输入，但不能作为“DTC 2026 组委会正式站点主数据”对外表述。

| 调查项 | 当前结论 | 证据状态 |
|---|---|---|
| DTC 2026 是否公开了站点主表、竞赛站点 ID、坐标和正式字段字典 | 未在公开赛事页面找到可下载的主表、ID、坐标或字段字典。公开说明只确认“组委会提供美军在太平洋战区的军事基地数据”，并未公开数据文件或字段合同 | `UNKNOWN`，需组委会直接确认 |
| 当前 66 条站点是否都有正式竞赛坐标 | 没有正式竞赛坐标。当前 66 条记录已有公开来源代理核验代表点，主 GeoJSON 为 66 个 Point，人工确认几何仍为 0 | 本地数据核验；代表点不能改称正式坐标 |
| 当前 66 条站点是否已有稳定的比赛 `site_id` | 没有。`crs-r47589-001` 至 `crs-r47589-066` 是基于 CRS 顺序派生的内部键，不是组委会 `contest_record_id` | 已由 schema、CSV 和边界说明确认 |
| DISDI/NTAD 能否补齐 66 条官方比赛映射 | 不能。当前 FY2024 公开快照只形成 22 条精确名称候选，其中 1 条组件冲突；最终进入独立复核面层的为 21 条，45 条没有候选面 | 机器候选，未人工确认 |
| BSR 是否提供 CRS 66 条记录的官方关联键 | 没有。当前 BSR staging 只有站点名、组件、国家/州、最近城市和不动产统计等字段，没有 DTC ID、坐标或 CRS 记录号 | 已由本地字段字典和行级结构确认 |
| DISDI/NTAD 是否有自己的站点/安装标识 | 官方数据字典定义了 `installationid`、`sdsid` 等字段；但当前本地 GeoJSON 快照实际没有 `installationid`，有 `sdsId`。这些是 DISDI/DoD 数据体系的标识，不能直接当作 DTC 比赛 ID | 官方字典 + 本地快照字段对照 |
| DISDI/NTAD 的授权与更新时间 | Data.gov 页面显示数据以 FY2024 为基础、数据集更新时间为 2025-11-11；页面同时显示 CC0 链接、`accessLevel=non-public`、`rights=otherRestrictions`。因此不能只看 CC0 就认定可以无条件再分发 | 官方元数据，权利仍需按页面和赛事条款共同审查 |

## 2. 当前本地资料包的实际状态

### 2.1 前端直接使用目录

来源：`DTC_2026_前端直接使用/frontend_meta.json`、`sites.geojson`、`source_registry.json`。

- `site_count = 66`。
- `formal_spatial_layer_ready = false`。
- `display_geometry_count = 66`，`human_confirmed_geometry_count = 0`。
- `unconfirmed_coordinate_count = 66`。
- `exact_name_match_count = 22`，`exact_match_component_conflict_count = 1`。
- `candidate_polygon_count = 21`，`geometry_no_candidate_count = 45`。
- `contest_record_id` 在主目录中保持为空。
- 主显示图层包含 66 个 `AGENT_VERIFIED_REPRESENTATIVE` Point；公开候选面在独立复核图层中，未混入主显示图层。
- `profiles.json` 有 66 条画像，均能按唯一 `site_id` 关联站点，审核状态全部为 `AGENT_DRAFT`，批准数为 0。
- 字段证据为 1,524 行，其中来源事实 450 行、派生信息 1,040 行、候选信息 22 行、未知项 12 行。
- `DTC_2026_Web/` 已实现 Vue 前端。同步脚本将 8 个业务文件复制到 `public/data/` 并校验哈希；画像详情和来源抽屉消费已有说明与来源引用。

当前前端入口的定位是 **CRS 参考站点目录、公开来源代表点、画像草稿及独立复核候选**。正式空间层和人工审核状态仍按各自字段显示。

### 2.2 Level 1 资料包

来源：`DTC_2026_Level1_资料包/README.md`、`quality/level1_data_quality.json`、`quality/validation_receipt.json`、`data/reference_site_catalog.csv`、`data/site_match_review.csv`、`data/site_match_candidates.csv`。

- 参考目录 66 行，`site_id` 唯一，`source_record_no` 为 1—66。
- 参考字段来自 CRS Table A-1：名称、位置标签、军种/组件、是否美国领土、是否 DoD-operated 等。
- 当前候选复核队列 66 行：21 条 `EXACT_NAME_CANDIDATE`、1 条 `EXACT_NAME_COMPONENT_CONFLICT`、44 条 `UNMATCHED`。
- 候选扩展表 74 行，所有 `auto_merge=false`，包括 21 条精确归一化名称候选、14 条模糊建议和 38 条无候选生成记录。
- BSR `Federal DoD Main Report` staging 1,626 行，保留 `source_sheet` 和原始 `source_row`。
- 当前落盘校验状态为 `PUBLISHED_AFTER_VALIDATION`，但这只证明资料包内部合同和权限门禁通过，不证明组委会正式数据已经收到或已被官方确认。

## 3. DTC 2026 公开赛事来源核验

### 3.1 公开赛题页面

公开页面：[第八届数字孪生体挑战赛（DTC 2026）赛题正式发布](https://www.xingxiancn.com/article/42184)。页面发布时间为 2026-09-05，正文写明：

- 赛事聚焦数字孪生战场开放系统模型；
- 场景开发赛道一级是“太平洋战区军事基地 GIS 应用”；
- “组委会提供美军在太平洋战区的军事基地数据”；
- 参赛团队需要通过 GIS 标识数据，并为每个军事基地建立说明。

页面没有公开：

- 可直接下载的站点主表或附件地址；
- 竞赛专用站点 ID 或记录编号；
- 坐标字段、坐标系、精度说明或 GeoJSON/CSV/GPKG 文件；
- 正式字段字典、BSR 关联键、版本哈希或机器可读数据合同。

### 3.2 组委会微信公众号通知

本地 `DTC_2026_GIS研究资料/09_最新公众号通知核验_报名与数据下发_2026-09-13.md` 记录了 2026-09-10 组委会通知的浏览器核验结果，原文链接为：[关于第八届数字孪生体挑战赛数据资料下发的通知](https://mp.weixin.qq.com/s/-z7MgQ_454CBUx4mdWv6FQ)。该通知说明报名获批后组委会开始向相关团队代表发送美国太平洋战区数据，并要求数据仅限本届比赛参赛团队使用，不得外传或用于其他用途。

该通知能证明 **官方数据存在并按团队发送**，但不能证明公开网络上存在一份可供任何人下载的主表，也不能替代本团队的实际收件记录、附件原件、数据版本、字段字典和使用条款。当前工作区没有归档的组委会邮件/回执原件，因此“已收到的四份文件是完整初赛包”仍按用户上下文和本地文件事实记录，不能升级成可供第三方复核的官方传输凭证。

另有参赛能力说明：[参加第八届数字孪生体挑战赛应掌握的知识与技能](https://mp.weixin.qq.com/s/q7lXRy3Ko-H8R7w8CmHi0Q)。它适合作为赛事能力导向的来源，不提供站点主表或字段合同。

## 4. CRS 66 条参考站点能补齐什么

官方来源：[CRS R47589 PDF](https://www.congress.gov/crs_external_products/R/PDF/R47589/R47589.1.pdf)。报告发布日期为 2023-06-06，Table A-1 位于 PDF 第 44—46 页。

该报告能直接支持：

- 66 条参考站点的来源顺序和名称；
- `Location`、`Service`、`U.S. territory?`、`DOD-operated?` 等参考字段；
- 报告范围内的公开背景和站点功能语义。

该报告不能支持：

- DTC 2026 `contest_record_id`；
- 66 条记录的官方比赛坐标或坐标精度；
- 组委会字段字典、数据版本或发放批次；
- 2026 年实时部署、基地运行状态或竞赛专用对象关系。

因此 `crs-r47589-001` 至 `crs-r47589-066` 可以继续作为当前系统的内部稳定参考键，但必须与未来组委会主表通过显式人工审核映射表连接，不能改名为官方竞赛 ID。

## 5. 66 条坐标和稳定映射的可补齐程度

### 5.1 DISDI/NTAD 当前可提供的内容

官方目录：[Data.gov Military Bases](https://catalog.data.gov/dataset/military-bases-24048)。官方页面显示该数据集：

- 以 FY2024 数据为基础；
- 由 Office of the Assistant Secretary of Defense for Energy, Installations, and Environment 提供，纳入 USDOT/BTS NTAD；
- 数据由四个军种总部来源汇编，并由 DISDI 编制；
- 只考虑 BSR 报告或 FIRRMA 房地产法规地图补充中出现的站点；
- 不一定是全部 DoD 设施的完整清单；
- 面向约 1:50,000 至 1:3,000,000 比例尺，边界不保证与其他联邦来源完全一致；
- 联合基地记录使用 Joint Base 名称，组件归属可能与历史负责组件不同。

本地保存的 `NTAD_Military_Bases_2025-11-11.geojson` 有 824 个要素，实际几何类型为 `Polygon` 和 `MultiPolygon`。本地匹配结果为：

| 结果 | 数量 | 含义 |
|---|---:|---|
| 精确归一化名称候选 | 22 | 机器名称匹配，不等于身份确认 |
| 精确名称但组件冲突 | 1 | 不进入可用候选面 |
| 通过地区/组件准入的候选面 | 21 | 仅供内部复核，仍为 `CANDIDATE` |
| 当前没有候选面 | 45 | 包含 44 条未匹配和 1 条组件冲突 |
| 尚未人工确认正式几何 | 66 | 主显示目录已有代表点，正式几何确认仍未完成 |

DISDI/NTAD 因而可以补齐的是：

- 一部分公开名称、国家/州、组件和公开几何候选；
- DISDI 自身的要素属性和公开标识候选；
- 作为人工复核队列的空间参考。

DISDI/NTAD 不能补齐的是：

- DTC 比赛正式 `contest_record_id`；
- CRS 66 条记录与 DISDI 要素之间的官方交叉表；
- 45 条无候选记录的确定身份；
- 66 条“比赛官方坐标”；
- 对所有站点的完整、同一口径、可外发的竞赛字段合同。

即便从 DISDI 多边形计算质心，也只能标为 `DERIVED`；不能把质心写入当前 `latitude`/`longitude` 并宣称已补齐官方点位。

### 5.2 GNIS 与 GNS 的适用边界

美国及美国属地优先使用 [USGS Geographic Names Information System（GNIS）](https://www.usgs.gov/tools/geographic-names-information-system-gnis)。USGS 将 GNIS 定义为联邦和国家地名标准，提供官方地名、Feature ID、位置坐标、别名/历史拼写和要素分类。它适合做美国记录的地名核验和外部候选来源，但不等于军事身份确认，也不等于 DTC 竞赛 ID 或比赛主表。

外国站点可使用 [NGA Geographic Names Server（GNS）](https://geonames.nga.mil/geonames/GNSHome/) 及其[数据下载页](https://geonames.nga.mil/geonames/GNSData/)。GNS 提供外国地名、变体、行政区和要素分类；官方页面明确说明坐标是近似值、用于查找目的，且 GNS 不包含美国及其属地数据。GNS 可以帮助发现名称和位置候选，不能确认某个军事基地就是组委会记录，也不能提供 DTC 竞赛 ID。

建议把 GNIS/GNS 结果放入新的 `public_enrichment` 复核层，保留来源日期、Feature ID/UFI、坐标精度和人工判定，不覆盖 `official_contest_input`。

## 6. BSR 数据与站点的官方关联字段

### 6.1 当前 BSR staging 的字段事实

本地来源是 `DTC_2026_Level1_资料包/data/bsr_fy2024_federal_staging.csv`，其上游原件为 `初赛官方文件/2 美国国防部基地结构报告-FY2024.xlsx`。当前 staging：

- 来源工作表：`Federal DoD Main Report`；
- 截止日期：2023-09-30；
- 数据行：1,626；
- 源字段：`Country/State`、`Site`、`Component`、`Name Nearest City`、建筑数量/面积、英亩数、`Plant Replacement Value ($M)`；
- 本地派生字段：`source_sheet`、`source_row`、`source_criteria`、`source_formula_cells`。

当前 BSR staging 没有：

- `contest_record_id`；
- CRS `source_record_no`；
- CRS 内部 `site_id`；
- 纬度、经度或 GeoJSON 几何；
- `installationid`、`sdsId` 等 DISDI 标识；
- 一条 BSR 行与 CRS 66 条参考记录之间的官方 crosswalk。

以 `Site` 名称归一化后，本地 BSR 与 CRS 66 条名称只有 9 条直接重合：Fort Wainwright、Fort Greely、Fort Shafter、Wake Island Airfield、Camp Zama、Camp Humphreys、Fleet Activities Chinhae、Royal Australian Air Force Base Darwin、Royal Australian Air Force Base Tindal。剩余记录可能存在联合基地命名、旧名称、军种前缀、站点/安装层级或范围差异，不能用简单模糊匹配自动补齐。

### 6.2 官方 BSR 语义

DoD 房地产/安装设施页面：[RP&ID Library & Archives](https://www.acq.osd.mil/eie/imr/rpid/library.html)。页面对 BSR 的定义强调它是截至每年 9 月 30 日的房地产站点摘要，并说明：

- BSR 按 `site` 报告；一个 site 是一个具体地理位置的房地产资产；
- 一个军事 installation 可以包含多个 site；
- 同一 installation 下的 sites 可能相近，也可能在地理上相距较远。

这个语义直接解释了为什么 BSR 的 `Site` 名称不能自然地充当 DTC 站点主键，也不能仅靠名称把 BSR 统计值挂到 CRS 的 66 行上。BSR 可以作为参考统计和站点画像背景，不能替代竞赛对象关联表。

### 6.3 BSR 可以补齐和不能补齐的内容

BSR 可以补齐：

- 站点名称、所属 Country/State、源表 Component、最近城市；
- 建筑数、建筑面积、英亩数和 PRV 等 FY2024 统计字段；
- 源工作表、源行号和源筛选条件。

BSR 不能补齐：

- DTC 官方站点 ID；
- CRS 66 条记录的唯一关联；
- 坐标和空间几何；
- 2026 年实时状态、库存、作战能力或可用容量。

`Plant Replacement Value ($M)` 必须保留为源定义的 **USD million**，不能直接转换为未经说明的中文金额，更不能从面积或 PRV 推导作战/保障能力。

## 7. DISDI/NTAD 授权、更新时间与字段字典

### 7.1 授权和更新时间

官方元数据入口：

- [Data.gov Military Bases 数据集页](https://catalog.data.gov/dataset/military-bases-24048)
- [Military Bases 数据集 DOI/开放目录](https://doi.org/10.21949/1522149)
- [ArcGIS Feature Server/WFS DOI](https://doi.org/10.21949/1522151)
- [官方数据字典 DOI](https://doi.org/10.21949/1529039)
- [BTS NTAD 元数据 XML](https://transtats.bts.gov/NTADmetadata/USDOT_BTS_NTAD_Military_Bases.xml)

Data.gov 当前公开元数据显示：

- 数据集更新时间：2025-11-11；
- 数据基础：FY2024；
- 页面列出 CC0 1.0 链接：<https://creativecommons.org/publicdomain/zero/1.0/>；
- `accessLevel=non-public`；
- `rights=otherRestrictions`；
- 发布/维护相关机构为 DoD 能源、设施与环境助理部长办公室，并纳入 USDOT/BTS NTAD。

因此本项目应同时保留 `license`、`access_level`、`rights`、`attribution` 和 `redistribution_status`。CC0 链接不应被单独解释成“可以无条件公开转发当前快照”，尤其当前比赛数据还受组委会专用范围约束。

### 7.2 官方数据字典给出的字段

本地保存的官方字典快照是 `DTC_2026_Level1_资料包/sources/official_disdi/Military_Bases_NTAD_Data_Dictionary.xlsx`，包含 `Military_Bases` 和 `README` 两个工作表。字典对主要字段的定义包括：

| 字段 | 官方语义摘要 | 当前本地 GeoJSON 是否存在 |
|---|---|---|
| `OBJECTID` | Esri 自动生成的顺序整数 | 是 |
| `countryname` | 所在国家代码 | 是，快照为 `countryName` |
| `featuredescription` | 要素叙述 | 是，快照为 `featureDescription` |
| `featurename` | 要素常用名 | 是，快照为 `featureName` |
| `installationid` | 军种分配的官方代码，用于识别组成一个 installation 的 site 或 site 组 | 否 |
| `iscui` | 是否包含 CUI 的 Yes/No 指示 | 是，快照为 `isCui` |
| `isfirrmasite` | 是否列入 FIRRMA 站点 | 是，快照为 `isFirrmaSite` |
| `isjointbase` | 是否属于 Joint Base | 是，快照为 `isJointBase` |
| `mediaid` | 关联多媒体记录的链接字段 | 是，快照为 `mediaId` |
| `metadataid` | 要素级元数据链接字段 | 否 |
| `mirtalocationsidpk` | 记录/实体实例的用户定义主键 | 是，快照为 `mirtaLocationsIdpk` |
| `sdsid` | SDSFIE 实体全局唯一标识 | 是，快照为 `sdsId` |
| `sitename` | DoD/军种/WHS 指定的站点正式名称 | 是，快照为 `siteName` |
| `siteoperationalstatus` | 站点当前运行状态代码 | 是，快照为 `siteOperationalStatus` |
| `sitereportingcomponent` | 对站点负有法定报告责任的军种/机构代码 | 是，快照为 `siteReportingComponent` |
| `statenamecode` | 所在州两字母代码 | 是，快照为 `stateNameCode` |
| `SHAPE`、`Shape.STLength()`、`Shape.STArea()` | 几何、长度和面积元数据字段 | 几何在 GeoJSON 中存在；原字典字段名未原样保留 |

关键判断：

1. `installationid` 是最接近“官方安装设施关联”的 DISDI 字段定义，但当前保存的 GeoJSON 快照不含它，不能假设本地数据已经提供该关联。
2. 当前 `sdsId` 可作为 DISDI 快照自身的要素标识候选，但它不是 DTC `contest_record_id`，也不能证明跨数据版本永久稳定。
3. `OBJECTID` 是 Esri 顺序号，不宜作为跨版本稳定键。
4. 当前快照是面要素；从面生成中心点只能作为派生显示位置，不能冒充官方点坐标。

## 8. 字段缺口与处理建议矩阵

| 目标字段/关系 | 当前本地状态 | 官方公开来源可提供的上限 | 应采用的状态 |
|---|---|---|---|
| DTC `contest_record_id` | 空 | 当前公开页面和公开 GIS 数据均未提供 | `UNKNOWN` |
| 内部 `site_id` | 66 个唯一键 | 由 CRS 顺序和本地规则派生 | `DERIVED`，不可改称比赛 ID |
| `latitude` / `longitude` | 66 条代理核验代表位置 | 公开设施/地名资料及适用的 DISDI 代表点 | `AGENT_VERIFIED_REPRESENTATIVE`，人工确认数量 0 |
| 主显示 GeoJSON geometry | 66 个 Point | 代表位置可供参考定位，候选面独立展示 | 正式空间层保持 `false`，候选独立复核 |
| 逐站点画像 | 66 条长短说明及来源引用，前端已接入 | 由已登记来源整理，保留未知项 | `AGENT_DRAFT`，批准数量 0 |
| CRS → DISDI 关联 | 22 条名称候选，1 条组件冲突 | 公开源无 DTC 官方 crosswalk | 人工复核后才可 `HUMAN_CONFIRMED` |
| CRS → BSR 关联 | 仅名称/组件等弱匹配条件 | BSR 语义支持 site 层统计，但不提供竞赛 crosswalk | 候选关系，不自动合并 |
| DISDI installation ID | 字典定义存在，本地快照缺少 `installationid` | 可向官方数据提供方或组委会索取对应版本 | 未取得前保持未知 |
| 正式字段字典 | 当前不存在 | 只能由组委会数据交付或明确答复补齐 | `UNKNOWN` |
| 数据版本、哈希、外发条款 | 公开 DISDI 有版本元数据；竞赛数据无完整交付凭证 | 需保存组委会邮件、附件和使用条款 | 分源记录，不混用 |

## 9. 建议下一步

### 待确认：正式交付和提交要求

当前已收到的 4 份文件继续作为现有输入，不等待假设中的额外主表。以下缺失信息保持未知；取得组委会明确答复时再归档：

1. 66 条记录是否为比赛正式站点清单，正式主键/站点 ID 的字段名和示例；
2. 坐标或几何字段、坐标系/EPSG、精度和点/面语义；
3. 站点名称、国家/地区、组件、安装设施层级是否有正式字典；
4. BSR 是否为比赛配套数据，是否有 `contest_record_id`、`installationid` 或其他 crosswalk；
5. 数据版本、发布日期、文件哈希、更新方式和是否存在后续修订；
6. 可在本地前端、PPT、录屏、答辩和成果展示中使用的范围；
7. 数据是否要求保密、是否禁止公开地图服务、代码仓库或第三方数据转发。

### 后续另发正式数据时：新增而不是覆盖

新增 `official_contest_input` 层和显式映射表，例如：

```text
official_contest_input.contest_record_id
        ↓ 人工审核的 mapping 表
reference_site_catalog.site_id
        ↓ 可追溯来源
public_enrichment / official_reference_context
```

当前 CRS 参考目录、BSR staging 和 DISDI 候选继续保留，不因新文件到达而覆盖历史来源。

### P1：对 45 条无候选记录开展小规模人工核验

- 美国及属地：按 GNIS/USGS 和适用的官方军事站点页面核验；
- 外国站点：按 GNS、主办国政府或军方公开页面核验；
- 记录别名、行政区、坐标精度、来源日期和冲突说明；
- 任何一对多、父子站点、联合基地或名称冲突都进入人工队列；
- 不把 GNIS/GNS 点、DISDI 质心或公开地图位置写成官方比赛坐标。

### P1：建立 BSR 候选关联表

候选键可暂时使用 `Country/State + Site + Component + Name Nearest City` 的组合进行人工筛选，但必须把它标为候选关系，并保留 BSR `source_row`。如果组委会提供正式 crosswalk，应以 crosswalk 替换该候选逻辑。

## 10. 不应在当前版本宣称的内容

- “66 个站点均已获得官方坐标”；
- “`crs-r47589-001` 是组委会站点 ID”；
- “DISDI/NTAD 已确认 CRS 66 条记录与 21 个基地一一对应”；
- “BSR 的 PRV/面积代表基地实时容量、战斗力或保障能力”；
- “公开 DISDI/NTAD 快照是比赛数据的官方公开版”；
- “GNIS/GNS 或 DISDI 质心等同于比赛坐标”；
- “当前公开网页已经包含完整字段字典和 BSR 关联键”。

当前前端继续使用 `LEVEL1_FOUNDATION_READY_WITH_REVIEW_QUEUE` 状态，主显示地图使用 66 个代理核验代表点，画像显示草稿审核状态，候选面保持独立复核入口。只有实际确认记录才能改变人工审核和正式空间层状态。

## 11. 本地核验文件

- `DTC_2026_前端直接使用/frontend_meta.json`
- `DTC_2026_前端直接使用/sites.geojson`
- `DTC_2026_前端直接使用/source_registry.json`
- `DTC_2026_Level1_资料包/README.md`
- `DTC_2026_Level1_资料包/frontend_build_checklist.md`
- `DTC_2026_Level1_资料包/data/reference_site_catalog.csv`
- `DTC_2026_Level1_资料包/data/site_match_review.csv`
- `DTC_2026_Level1_资料包/data/site_match_candidates.csv`
- `DTC_2026_Level1_资料包/data/site_location_review.csv`
- `DTC_2026_Level1_资料包/data/bsr_fy2024_federal_staging.csv`
- `DTC_2026_Level1_资料包/data/bsr_fy2024_metadata.json`
- `DTC_2026_Level1_资料包/contracts/bsr_field_dictionary.csv`
- `DTC_2026_Level1_资料包/evidence/official_sources_research.md`
- `DTC_2026_Level1_资料包/evidence/input_boundary.md`
- `DTC_2026_Level1_资料包/manifest/source_manifest.csv`
- `DTC_2026_Level1_资料包/manifest/source_rights.csv`
- `DTC_2026_Level1_资料包/manifest/frontend_allowlist.csv`
- `DTC_2026_Level1_资料包/quality/level1_data_quality.json`
- `DTC_2026_Level1_资料包/quality/validation_receipt.json`
- `DTC_2026_Level1_资料包/sources/official_disdi/Military_Bases_NTAD_Data_Dictionary.xlsx`
- `DTC_2026_Level1_资料包/sources/official_disdi/NTAD_Military_Bases_2025-11-11.geojson`
