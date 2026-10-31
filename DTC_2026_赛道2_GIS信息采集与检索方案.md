# DTC 2026 赛道 2 GIS 信息采集与检索方案

调研日期：2026-09-13  
适用目标：以通过场景开发赛道一级任务、进入二级任务为第一阶段目标，并为后续二级演示预留数据和模型接口。  
项目暂定名：**Pacific ACE 分布式基地网络数字孪生与保障推演平台**。

> 状态修订（2026-09-15）：本文件前部保留报名和数据下发前的历史工作流；当前明早开工入口以 [DTC_2026_Level1_资料包](DTC_2026_Level1_资料包/README.md) 为准。当前已落盘参考主表、BSR staging、公开几何候选、证据链和质量门禁；正式竞赛坐标/ID 仍是未知。

## -1. 报名是正式工作流的第一步

当前工作顺序需要明确调整为：

```text
报名 PPT → 发送 innobase@qq.com → 审核/批准 → 组委会发送数据 → 原始数据审计 → 一级 GIS → 二级抽象推演
```

公开赛题说明场景开发一级使用组委会提供的太平洋战区军事基地数据；9 月 10 日组委会通知进一步说明，报名材料经审核批准后，组委会向相关团队代表发送数据。当前本地收到的文件已完成归档和审计，但工作区未归档组委会正式回执，因此公开参考资料仍不能替代正式竞赛输入。报名材料、审核回执、数据下载链接和组委会答复也要纳入项目证据链。报名要求和邮件地址详见 [DTC 2026 报名指南与报名 PPT 清单](DTC_2026_报名指南与报名PPT清单_2026-09-13.md)。

## 0. 先说结论

我们接下来要做的不是“尽可能把网上所有军事资料下载下来”，而是建立一套能服务于比赛交付的**可追溯信息资产体系**：

```text
组委会基地数据
        ↓
基地身份与空间校验
        ↓
公开地理/交通/环境背景图层
        ↓
基地画像与来源卡片
        ↓
ACE 抽象节点—连接—资源—事件模型
        ↓
可回放的方案比较与指标
```

最终系统里应该同时存在四种内容，不能混在一起：

1. **公开事实**：来源可以被打开、复核、引用的内容。
2. **地理派生结果**：由公开数据计算出来的距离、邻接、覆盖范围、网络关系等。
3. **场景假设**：为了让二级推演可运行而设定的抽象容量、延迟、恢复时间、资源需求等。
4. **未知项**：目前没有公开证据或组委会没有提供的数据，明确显示为未知，不能用大模型补成“事实”。

本方案把“广泛搜集”分为**广泛发现、严格筛选、有限接入**三步。搜索可以很广，但进入系统的内容必须有用途、来源、许可证和边界。

## 1. 比赛要求和研究边界

DTC 2026 公开赛题将场景开发赛道一级任务描述为：利用组委会提供的太平洋战区军事基地数据，通过 GIS 进行恰当标识，并利用公开智能体服务为每个基地建立详细说明；二级任务在此基础上采用 ACE 的分布式基地部署思路，分析抽象威胁事件下的基地响应、补给/维修/资源调配和高价值装备机动分布等问题。原文通过[公开转载版赛题](https://www.xingxiancn.com/article/42184)核对，报名材料还需要包含团队、成员、能力、对比赛内容的理解和初步设想。

因此我们的资料采集不能只服务于“做一张地图”，而要为以下三条验收链提供证据：

| 验收链 | 需要搜集的内容 | 系统中的表现 |
| --- | --- | --- |
| 一级地图链 | 基地身份、位置、类型、别名、基础说明、来源 | 点位、筛选、详情卡片、来源卡片 |
| 一级知识链 | 每个基地的公开说明、事实与未知项、人工审核记录 | 基地画像、知识卡片、引用回链 |
| 二级模型链 | ACE 概念、节点角色、资源、网络、状态和抽象事件 | 状态变化、资源调配、事件回放、方案比较 |

研究和系统都要主动避开以下内容：

- 真实基地的脆弱性排名、具体防护缺口和可利用路径；
- 真实武器射程、命中概率、目标优先级和可执行打击方案；
- 现实部队部署、装备数量、敏感设施细节和实时军事活动；
- 把公开地图直接包装成真实作战决策系统；
- 没有可靠来源的“大模型基地介绍”；
- 为了增加图层而接入与比赛目标无关的高分辨率影像或大规模实时数据。

二级只做**非行动化、可复现的抽象推演**：节点可用性下降、通道暂不可用、保障资源延迟、需求增加、恢复完成等事件。所有容量、风险、时间和资源数量优先使用等级、区间或合成参数，并明确写成场景假设。

## 2. 总体信息架构：要搜的 12 类信息

### D0：竞赛规则、数据交付和评审证据

**要回答的问题**

- 组委会基地数据什么时候提供，格式、坐标系、字段说明是什么？
- 一级与二级分别提交什么，还是一次性提交？
- “完成一级”的判定是覆盖率、功能、报告、视频还是专家主观评审？
- 智能体服务是否必须保留检索来源、提示词、人工审核记录？
- 是否允许离线运行、使用开源 GIS 组件、使用自建数据和合成参数？
- 二级是否必须实现高价值装备机动算法，还是可以抽象为资源单元转移算法？

**产出**

- `rules_register` 规则台账；
- 组委会答复原文和确认日期；
- 一级/二级提交物清单；
- 不能自行推断的事项列表。

**优先级：P0，必须先做。**

### D1：基地主数据和身份解析

**每个基地要搜什么**

- 官方名称、英文名、常用别名、历史名称；
- 所属国家、行政区、岛屿或区域；
- 经纬度、几何精度和坐标来源；
- 基地类型：空军、海军、陆军、联合、训练、后勤、机场、港口、通信或其他；
- 公开资料中的功能描述，只记录可被原文支撑的内容；
- 资料来源、发布日期、访问日期、来源类型和可信度；
- 可能冲突的名称、坐标或类型；
- 不能确认的字段和缺失原因。

**不建议搜什么**

- 真实兵力数量、武器库存、维修能力上限、燃料库存、实时驻留装备；
- 通过卫星图像推断未公开设施功能；
- 任何能直接转化为现实目标选择的脆弱性描述。

**产出**

- 基地主数据表；
- 基地 GeoJSON；
- 名称别名表；
- 每基地一张来源卡片；
- 缺失与冲突清单。

**优先级：P0，一级核心。**

### D2：行政、海岸线、岛屿和基础地理

**要搜什么**

- 国家和一级行政区边界；
- 岛屿、海岸线、海域和主要水体；
- 太平洋区域的地图范围、经纬网和日期变更线显示；
- 主要城市、人口中心和区域标签；
- 公开地名、语言和行政名称的标准化映射。

**用途**

- 让基地点位“落在正确的地理语境中”；
- 支持区域筛选、聚合统计和地图定位；
- 作为后续网络图和场景范围的空间背景。

**首选来源**

- [Natural Earth Downloads](https://www.naturalearthdata.com/downloads/)：适合做全球和区域级底图，官方页面说明其提供 1:10m、1:50m、1:110m 的矢量与栅格数据，并有公开使用条款；
- [OpenStreetMap Legal FAQ](https://wiki.openstreetmap.org/wiki/Legal_FAQ)及[下载说明](https://wiki.openstreetmap.org/wiki/Download)：适合补充开放地理对象，但必须保留 ODbL 署名和许可说明；
- 组委会若提供行政区或海岸线，应优先使用组委会版本并记录其坐标系。

**优先级：P0/P1。**

### D3：交通、机场、港口和抽象运输网络

**要搜什么**

- 民用或公开可确认的机场、跑道、机场等级和位置；
- 港口、港口所在区域和公开的基础服务类别；
- 道路、铁路、桥梁、渡运和主要交通连接；
- 海空运输节点之间的抽象连接关系；
- 运输方式、距离、估计时长、容量等级和通道状态字段的可用定义。

**用途**

- 形成基地之间的候选连接边；
- 为补给、维修和资源转移提供地图上的“网络骨架”；
- 支撑二级“通道不可用/运输延迟”的抽象事件。

**首选来源**

- [OpenStreetMap Download](https://wiki.openstreetmap.org/wiki/Download)和[Overpass API 说明](https://wiki.openstreetmap.org/wiki/Overpass_API)：用于小范围按标签提取道路、港口、机场等开放要素；
- [OurAirports Open Data](https://ourairports.com/data/)及[数据字典](https://ourairports.com/help/data-dictionary.html)：可作为全球机场和跑道的补充数据，页面明确标注为公共领域，但也明确不保证准确性，必须与组委会数据和其他来源交叉核验；
- [NGA World Port Index](https://msi.nga.mil/Publications/WPI)：适合作为高层次港口名录与属性参考，使用时只取公开基础属性，不做现实打击或港口脆弱性分析。

**优先级：P0/P1。**

### D4：能源、通信、医疗、维修和民用保障背景

**要搜什么**

- 区域电力、燃料、供水、医疗、维修和仓储等公开基础设施分类；
- 公开可确认的民用机场、港口、道路和服务设施；
- 节点的“保障角色”如何在抽象层面定义；
- 哪些数据可公开使用，哪些只适合写成背景说明。

**用途**

- 丰富基地画像中的“周边保障环境”；
- 把二级资源类型从“凭空设计”变成有公开概念依据的抽象分类；
- 支持基地角色：枢纽、前沿、备用、维修、补给、转运等。

**边界**

不需要建立真实电网、通信站、燃料管线或医疗能力的精确模型。对比赛而言，节点是否具有某类保障能力可以采用 `none / low / medium / high` 等抽象等级，并将其标注为场景假设。

**优先级：P1，一级非必需，二级加分。**

### D5：地形、海洋、气象和自然灾害

**要搜什么**

- 地形高程、坡度、海拔带和岛屿地貌；
- 海洋深度、海岸线和海域范围；
- 温度、降水、风、能见度、台风或季节性天气背景；
- 地震、火山、洪水、野火等自然事件的历史记录或抽象事件；
- 数据时间范围、空间分辨率和是否适合做实时层。

**用途**

- 做环境背景层和“自然条件导致的可用性下降/运输延迟”事件；
- 让数字孪生场景不只依赖“人工攻击事件”；
- 为二级模型提供可解释的外部扰动来源。

**首选来源**

- [USGS National Map GIS Data Download](https://www.usgs.gov/the-national-map-data-delivery/gis-data-download)：提供高程、水系、地名、交通等多类 GIS 数据和 API；
- [NASA Earthdata LP DAAC](https://www.earthdata.nasa.gov/centers/lp-daac)：可核对 SRTM/NASADEM 等全球高程产品；
- [GEBCO Gridded Bathymetry](https://www.gebco.net/data-products/gridded-bathymetry-data)：提供全球海洋和陆地地形模型，支持用户定义区域下载；
- [NOAA NCEI Climate Data Online API](https://www.ncei.noaa.gov/cdo-web/webservices/v2)：提供历史气候、站点和位置数据；
- [Copernicus ERA5](https://cds.climate.copernicus.eu/datasets/reanalysis-era5-complete)：提供全球逐小时的大气、陆地和海洋气候变量；
- [USGS Earthquake Catalog API](https://earthquake.usgs.gov/fdsnws/event/1/1)：可按时间和空间范围查询地震事件；
- [NASA FIRMS Web Services](https://firms.modaps.eosdis.nasa.gov/web-services/)：提供活动火点等公开环境事件接口。

**优先级：P1/P2。**

第一版只选一种环境事件和一种历史/合成时间窗口，不要把所有灾害接口同时接入。

### D6：ACE、分布式节点和保障思想

**要搜什么**

- ACE 的公开定义、目的、节点角色和组织逻辑；
- 分散、聚合、机动、保障、信息和指挥等要素之间的关系；
- 节点可用性、任务生成、保障能力、恢复和韧性的公开术语；
- 如何把概念翻译成数据字段，而不把抽象概念误写成真实军事能力。

**首选来源**

- [Air Force Doctrine Note 1-21: Agile Combat Employment](https://www.doctrine.af.mil/Portals/61/documents/AFDN_1-21/AFDN%201-21%20ACE.pdf)：作为 ACE 概念和术语的主来源；
- [美国空军 ACE 说明](https://www.aetc.af.mil/News/Article-Display/Article/3976323/agile-combat-employment/)：作为面向公众的概念解释；
- [美国空军 Doctrine 官网](https://www.doctrine.af.mil/)：核对 ACE 与保障、规划、天气等相关 doctrine 的关联。

**产出**

- ACE 概念词典；
- “公开概念 → 场景字段 → 页面展示”的映射表；
- 模型假设清单；
- 不允许直接套用的现实参数清单。

**优先级：P0/P1，二级核心。**

### D7：PMTEC 和公开演训信息

**要搜什么**

- PMTEC 公开定位、训练/实验/协作场景和数字化基础设施概念；
- 公开的多域、联合、盟友/伙伴、受限环境和保障演练描述；
- 哪些内容能作为三级方向的背景，哪些不能声称已经复现；
- 可用于场景回放的公开事件类型，而不是现实作战细节。

**首选来源**

- [美国陆军 2026 财年预算说明中的 PMTEC 内容](https://www.asafm.army.mil/Portals/72/Documents/BudgetMaterial/2026/Discretionary%20Budget/rdte/RDTE%20-%20Vol%203%20-%20Budget%20Activity%205A.pdf)；
- [USARPAC Warfighting 页面](https://www.usarpac.army.mil/Our-Approach/Warfighting/)；
- [美国国防部公开新闻稿](https://www.defense.gov/News/Releases/Release/Article/3450698/deputy-secretary-of-defense-visits-us-indo-pacific-command-and-u/)；
- [USARPAC PMTEC 网络演训公开文章](https://www.usarpac.army.mil/Our-Story/Our-News/Article-Display/Article/4497310/defending-the-digital-domain-pmtec-supports-cyber-ops-at-bk26/)。

**优先级：P1/P2。**

对我们的二级目标来说，PMTEC 只需要支撑“训练、实验、数据共享和回放”的背景，不需要复刻真实 PMTEC。

### D8：历年比赛和相近数字孪生项目

**要搜什么**

- 往届项目是报告、原型、仿真器还是可运行平台；
- 项目是否使用成熟开源工具和已有引擎；
- 评审展示的是静态结果、实时交互、过程回放还是指标对比；
- 项目怎样处理数据来源、模型假设、未知项和复现说明；
- 哪些项目只在宣传材料中出现，哪些有足够一手证据。

**首选来源**

- [数字孪生体联盟：数字孪生战场实验室介绍](https://www.twinconsortium.org/newsinfo/848422.html)；
- [第二届数字孪生体挑战赛特别奖项目](https://cloud.tencent.com/developer/news/750869)；
- [第五届数字孪生体挑战赛总结](https://cloud.tencent.com/developer/news/1283447)；
- [DTC 2021 OpenPose 培训材料](https://www.twinconsortium.org/newsinfo/590262.html)；
- [DTC 2024 数字孪生地质创新中心说明](https://www.twinconsortium.org/newsinfo/943262.html)；
- 主办方站点的[DTC 2025 赛题通知](http://www.innovation4.cn/toutiao/077125-3931792049)和[第一阶段晋级公告](http://www.innovation4.cn/toutiao/103325-2027162206)。

**产出**

- 案例卡片：项目、任务、技术、交付物、展示方式、证据强度；
- “可借鉴”与“不能照搬”清单；
- 5 分钟演示结构参考。

**优先级：P1，主要用于产品形态和答辩准备。**

### D9：GIS、数据格式和系统实现资料

**要搜什么**

- GeoJSON、GeoPackage、坐标系、几何有效性和数据字典规范；
- 地图引擎对 GeoJSON、矢量图层、离线数据和事件更新的支持；
- 图层筛选、聚合、点击详情、时间线、回放和指标联动的最小实现方式；
- 离线演示和外部底图不可用时的降级方案。

**首选来源**

- [IETF RFC 7946 GeoJSON 规范](https://datatracker.ietf.org/doc/html/rfc7946)；
- [MapLibre GL JS 官方文档](https://maplibre.org/maplibre-gl-js/docs/)和[GeoJSONSource API](https://maplibre.org/maplibre-gl-js/docs/API/classes/GeoJSONSource/)；
- [Cesium GeoJsonDataSource 官方文档](https://cesium.com/learn/cesiumjs/ref-doc/GeoJsonDataSource.html)；
- [QGIS 支持的数据格式说明](https://doc.qgis.org/3.44/en/docs/user_manual/managing_data_source/supported_data.html)。

**优先级：P0/P1。**

技术资料只用于确定实现方式，不要为了使用某个引擎而反过来扩大业务范围。

### D10：许可证、来源和数据治理

**要搜什么**

- 数据是否允许比赛展示、内部使用、公开发布和二次加工；
- 是否要求署名、共享衍生数据库、保留版权声明或限制 API 请求频率；
- 数据版本、访问日期、更新时间、空间分辨率和质量声明；
- 不同来源拼接后是否会出现许可证冲突；
- 大模型生成内容如何标注“自动生成/人工审核/未确认”。

**产出**

- `source_register` 来源台账；
- `license_register` 许可证台账；
- 页面上的地图署名和数据声明；
- 对外提交包中的第三方组件清单。

**优先级：P0，不能等最后一天补。**

### D11：演示证据、质量检查和可复现性

**要搜什么**

- 评审能否通过录屏和数据包复核每一项功能；
- 每个指标能否追溯到输入、参数和状态迁移；
- 是否可以固定随机种子、固定场景版本并重复运行；
- 无网络、底图服务失效或部分数据缺失时是否还能演示；
- 如何展示“我们不知道什么”。

**产出**

- 运行日志；
- 数据质量报告；
- 5 分钟演示脚本；
- 截图、录屏、版本号、提交包和备份包；
- 一页模型假设和边界声明。

**优先级：P0/P1。**

## 3. 数据源分层和接入优先级

### P0：不拿到就不能开工的资料

1. 组委会基地数据、字段说明、坐标系和提交要求；
2. DTC 2026 公开赛题与组委会答复；
3. 基地主数据的名称、坐标、类型、来源和缺失项；
4. 区域级行政区、海岸线、岛屿和基础底图；
5. GeoJSON/坐标系/许可说明；
6. 每个基地的详情说明模板和来源回链。

### P1：能显著提升一级完整度，并直接支撑二级

1. 机场、港口、道路和其他公开交通连接；
2. ACE 公开概念、节点角色和保障术语；
3. 资源、事件、状态、恢复和指标的抽象字段定义；
4. 历史比赛项目的展示和交付形式；
5. 一种环境扰动数据或合成事件；
6. 离线底图和可复现演示方案。

### P2：有时间再加的丰富内容

1. 地形、海洋深度、气象和自然灾害；
2. 历史基地沿革和区域历史背景；
3. 公开的设施类别和民用保障背景；
4. 三维地球、地形遮罩、时间序列和更多图表；
5. 智能体辅助问答、自然语言查询和知识图谱；
6. 额外的实时 API 和高分辨率影像。

判断原则：如果 P2 内容会推迟 P0/P1 的地图、来源卡片、状态变化或回放，就不接入。

## 4. 建议的查询词库

搜索时不要只搜“太平洋军事基地 GIS”，而要按“任务 + 数据类型 + 地区 + 来源类型”组合。每次检索都保留查询词、时间、结果 URL 和是否采用。

### 4.1 规则和竞赛

```text
DTC 2026 场景开发 GIS 太平洋战区 基地
DTC 2026 赛题 二级 资源调配 ACE
第八届数字孪生体挑战赛 参赛 PPT 提交
site:innovation4.cn 数字孪生体挑战赛 2025 晋级
site:twinconsortium.org 数字孪生体挑战赛 获奖 项目
Digital Twin Challenge 2025 first stage advancement
Digital Twin Challenge battlefield GIS scenario development
```

### 4.2 基地身份和公开说明

```text
{基地名称} official site history location
{基地英文名} factsheet official
{基地别名} coordinates source
{国家/地区} military installation public factsheet
{机场/港口名称} official history facilities
{基地名称} site:gov factsheet
```

说明：检索结果只用于确认公开身份和一般功能，不用于推导当前设施能力、兵力、装备或脆弱性。

### 4.3 地理和交通

```text
Pacific islands coastline administrative boundaries open data
Natural Earth Pacific islands download
OpenStreetMap Overpass airport port road Pacific
OurAirports Pacific airports runways CSV
NGA World Port Index Pacific CSV official
open geospatial transportation data Pacific region
```

### 4.4 地形、海洋、气象和灾害

```text
USGS National Map elevation hydrography transportation API
NASA SRTM Pacific DEM Earthdata
GEBCO Pacific bathymetry download
NOAA NCEI historical climate API Pacific
Copernicus ERA5 Pacific weather reanalysis
USGS earthquake catalog Pacific GeoJSON
NASA FIRMS Pacific historical fire data
```

### 4.5 ACE、保障和系统建模

```text
site:doctrine.af.mil AFDN 1-21 ACE PDF
Agile Combat Employment distributed operations logistics doctrine
ACE node role command control mobility sustainment abstract model
PMTEC official training experimentation data sharing
contested logistics abstract simulation metrics resilience
distributed network availability recovery time scenario modeling
```

### 4.6 技术、规范和许可证

```text
RFC 7946 GeoJSON coordinate reference system
MapLibre GeoJSON source offline map official
Cesium GeoJsonDataSource official documentation
QGIS GeoPackage GeoJSON validation official
OpenStreetMap ODbL produced work derivative database
Natural Earth terms of use public domain
```

## 5. 推荐的数据模型

### 5.1 基地主数据 `base`

| 字段 | 含义 | 是否事实 | 备注 |
| --- | --- | --- | --- |
| `base_id` | 组委会或内部稳定 ID | 是 | 不用名称代替主键 |
| `name_original` | 原始名称 | 是 | 保留输入原文 |
| `name_zh` / `name_en` | 中英文显示名 | 可能 | 记录翻译来源 |
| `aliases` | 别名/历史名称 | 可能 | 每个别名附来源 |
| `country` / `region` | 国家和区域 | 是 | 由边界空间连接或来源确认 |
| `longitude` / `latitude` | 点位 | 是/待确认 | 记录精度和坐标系 |
| `geometry_precision` | 点、区域或模糊范围 | 是 | 不把模糊数据伪装成精确点 |
| `base_type` | 类型 | 可能 | 组委会字段优先 |
| `public_description` | 公开说明 | 可能 | 原文摘要，不写推测 |
| `source_ids` | 来源列表 | 是 | 关联 `source_register` |
| `fact_level` | 事实等级 | 是 | `SOURCE_FACT/DERIVED/CANDIDATE/UNKNOWN`；场景假设另记 `scenario_fact_level=ASSUMPTION` |
| `review_status` | 审核状态 | 是 | `UNREVIEWED/REVIEWED/REJECTED` |
| `notes` | 冲突和不确定性 | 否 | 清楚写原因 |

### 5.2 图层目录 `geo_layer`

| 字段 | 含义 |
| --- | --- |
| `layer_id` | 图层 ID |
| `theme` | 行政、地形、交通、环境、事件等 |
| `provider` | 数据拥有方 |
| `url` | 原始页面或下载地址 |
| `format` | GeoJSON、GeoPackage、CSV、GeoTIFF、WMS 等 |
| `coverage` | 空间覆盖范围 |
| `time_extent` | 数据时间范围 |
| `resolution` | 空间/时间分辨率 |
| `version` | 版本或快照日期 |
| `license` | 许可证和署名要求 |
| `quality_note` | 数据拥有方质量说明 |
| `ingest_status` | 发现、待审、已接入、弃用 |

### 5.3 二级节点 `scenario_node`

不直接使用真实能力数值，优先使用抽象等级：

| 字段 | 例子 | 来源性质 |
| --- | --- | --- |
| `node_id` | 关联基地 ID | 由基地数据派生 |
| `role` | hub、forward、reserve、support | 场景假设 |
| `availability` | available、degraded、unavailable、recovering | 事件状态 |
| `service_levels` | command、maintenance、supply、medical 等等级 | 场景假设 |
| `capacity_level` | 0—3 或 low/medium/high | 场景假设 |
| `recovery_time_band` | short/medium/long | 场景假设 |
| `evidence_ref` | 公开来源或假设说明 | 追溯字段 |

### 5.4 连接边 `scenario_edge`

| 字段 | 含义 |
| --- | --- |
| `from_node` / `to_node` | 起点和终点 |
| `mode` | land、sea、air 或 abstract |
| `distance_band` | 距离等级，不必公开精确军事航线 |
| `travel_time_band` | 转运时间等级或合成区间 |
| `throughput_level` | 通道容量等级 |
| `availability` | 可用、延迟、关闭 |
| `disruption_reason` | 天气、拥堵、事件、演示扰动 |
| `source_or_assumption` | 来源或场景假设 |

### 5.5 资源、事件和运行记录

资源建议只使用抽象类别：`maintenance_unit`、`supply_unit`、`personnel_unit`、`equipment_unit`、`task_unit`。不填入真实装备数量、具体型号、武器库存或现实作战编制。

事件建议至少支持：

- `NODE_DEGRADED`：节点服务等级下降；
- `EDGE_DELAYED`：连接运输时间增加；
- `EDGE_UNAVAILABLE`：连接暂不可用；
- `RESOURCE_DELAYED`：资源到达延迟；
- `DEMAND_INCREASED`：抽象任务需求增加；
- `NODE_RECOVERED`：节点恢复到某个等级。

每次运行保存：

- 场景 ID、版本、随机种子；
- 基线方案/ACE 方案；
- 输入节点、边、资源和事件快照；
- 每一步状态变化；
- 算法版本和权重；
- 指标结果；
- 演示截图或录屏编号。

## 6. 信息进入系统前的处理流程

```text
发现来源
  ↓
记录原始 URL、标题、发布方、日期、访问日期
  ↓
判断来源等级和许可证
  ↓
摘取能直接证明结论的原文/字段
  ↓
标注 SOURCE_FACT / DERIVED / CANDIDATE / UNKNOWN；场景假设另记 `scenario_fact_level=ASSUMPTION`
  ↓
人工复核名称、坐标、时间和含义
  ↓
标准化字段和坐标
  ↓
几何/字段/来源完整性检查
  ↓
进入 GeoJSON、图层目录或场景参数
  ↓
页面展示来源与不确定性
```

### 6.1 来源等级

| 等级 | 来源 | 用法 |
| --- | --- | --- |
| A | 组委会数据、政府/军方/国际组织官方资料、标准原文 | 可作为核心事实或规则依据 |
| B | 数据拥有方的一手下载页、API 文档、官方项目页 | 可作为数据层依据，需记录版本和许可 |
| C | 学术论文、正式技术报告、公开项目文档 | 用于概念和方法，需核对原始数据 |
| D | 行业媒体、转载、博客、百科 | 只用于发现线索，不直接支撑敏感字段 |
| E | 搜索摘要、论坛、无来源社交内容 | 不进入最终事实库 |

### 6.2 大模型和智能体使用规则

大模型只做四件事：检索候选来源、提取结构化字段、生成带来源的说明初稿、发现冲突。它不能做四件事：凭空补充基地能力、判断真实脆弱性、替代算法计算、把不确定信息改写成肯定句。

基地说明建议保存以下链路：

```text
来源 URL → 原文片段 → 结构化字段 → 说明草稿 → 人工审核结论 → 页面展示
```

## 7. 多智能体/多人并行搜集方案

第一轮先分成四条线，避免每个人都重复搜索“军事基地资料”：

| 角色 | 负责范围 | 交付物 |
| --- | --- | --- |
| A 竞赛研究员 | DTC 2026、往届赛题、晋级/获奖公开资料、评审证据 | 竞赛事实表、历届案例卡片、待确认问题 |
| B 地理数据研究员 | 行政、海岸线、岛屿、机场、港口、道路、地形、环境数据 | 数据源目录、字段、格式、许可、覆盖范围 |
| C ACE/PMTEC 研究员 | 公开 doctrine、分布式节点、保障、韧性、实验/训练概念 | 概念词典、字段映射、可抽象事件和指标 |
| D GIS 工程研究员 | GeoJSON、MapLibre/Cesium/QGIS、离线演示、历史展示案例 | 技术选型、最小页面、验证清单 |

第二轮再派发两个审计角色：

| 角色 | 负责范围 | 交付物 |
| --- | --- | --- |
| E 来源与许可证审计 | URL 可访问性、版本、许可证、署名、衍生数据风险 | 来源/许可证台账、弃用清单 |
| F 基地画像审校 | 基地名称、别名、类型、坐标和说明逐条复核 | 基地主数据审核结果、冲突表 |

每个检索角色必须按同一模板交付，不接受只有一串网址：

```text
主题：
来源名称：
原始 URL：
发布方：
发布日期/版本：
能证明的事实：
拟提取字段：
进入系统的用途：
格式/API：
许可证/署名：
时效性：
风险和不确定性：
建议优先级：P0/P1/P2/不采用
是否需要人工复核：
```

合并时采用“同一事实只留一个主来源，其他来源做交叉验证”的原则，不把不同来源的同名字段直接拼成一条貌似精确的数据。

## 8. 具体检索顺序

### 第 1 轮：先把能开工的资料拿齐

目标不是丰富，而是确定边界：

1. 读取组委会数据或向组委会索取数据；
2. 固定字段合同、坐标系、来源台账和许可证台账；
3. 准备区域级底图、海岸线、行政区和基础地名；
4. 选 5—10 个样例基地完成完整画像；
5. 做地图点位、筛选、详情和来源回链；
6. 用样例验证“字段设计能否覆盖全部基地”。

**通过条件**：样例基地能从原始数据到地图详情闭环，且未知项能显示，不依赖模型猜测。

### 第 2 轮：补齐一级内容

1. 批量生成基地画像初稿；
2. 人工审核名称、坐标、类型和主要说明；
3. 补充机场、港口、道路等公开交通背景；
4. 生成数据覆盖率、缺失率、冲突数和来源覆盖率；
5. 完成 5 分钟一级演示录像。

**通过条件**：每个基地都有详情或“暂无可靠公开说明”的明确提示，地图和数据行数可相互校验。

### 第 3 轮：为二级准备模型，不扩大现实军事资料

1. 从 ACE 文档提取概念，不抄写现实作战方案；
2. 把基地分为枢纽、前沿、备用、维修/补给等抽象角色；
3. 把连接转化为抽象距离、时间、容量和可用性；
4. 设计集中式基线与分布式方案；
5. 设计节点降级、通道延迟、资源延迟、需求增加和恢复事件；
6. 固定权重、随机种子和指标计算公式；
7. 用一组小规模数据先完成可回放闭环。

**通过条件**：一次运行可以解释“事件发生前—事件发生后—方案调整—指标变化”。

### 第 4 轮：有余力再做丰富化

只选择能直接支持展示的 1—2 个方向：

- 环境事件：天气或自然灾害；
- 地形/海洋背景：用于区域认知，不做高精度通行判断；
- 历史时间线：作为基地或区域背景；
- 智能体问答：回答“这条信息来自哪里”，不回答“现实中应该打哪里”。

## 9. 最终系统建议接入的图层组合

### 一级必须有

1. 组委会基地点位层；
2. 国家/行政区/岛屿/海岸线层；
3. 基地类型和状态样式层；
4. 基地详情和来源卡片；
5. 搜索、筛选、统计和异常提示。

### 二级建议有

1. 机场/港口/道路等抽象交通层；
2. 基地网络连接边；
3. 枢纽、前沿、备用、保障节点角色层；
4. 资源流动或转移动画；
5. 事件注入、状态回放和时间线；
6. 集中式与 ACE 分布式方案对比；
7. 任务满足率、资源缺口、延迟、恢复时间、单点依赖和额外成本等指标。

### P2 可选丰富层

1. 地形/海洋背景；
2. 天气/灾害事件；
3. 历史基地沿革；
4. 公开交通或民用保障背景；
5. 自然语言检索、知识卡片和问答；
6. 三维视图，但前提是二维和二级回放已经稳定。

## 10. 二级算法所需的最小资料，不需要搜真实军事参数

二级的关键是“可解释”，不是“高保真”。建议使用以下最小模型：

```text
节点：角色、状态、服务等级、容量等级、恢复时间等级
连接：方式、距离等级、运输时间等级、吞吐等级、可用状态
资源：维修单元、补给单元、人员/设备单元、任务单元
事件：节点降级、连接延迟、连接关闭、资源延迟、需求增加、节点恢复
算法：路径筛选 + 资源缺口判断 + 规则/最小费用/贪心方案选择
结果：状态时间线 + 资源流 + 指标对比 + 回放
```

可以采用一个透明的成本函数：

```text
方案代价 = 运输时间权重
         + 抽象风险权重
         + 资源缺口惩罚
         + 状态恢复代价
         + 方案切换成本
```

所有权重都显示在配置或报告中，并注明是场景假设。不要因为“高价值装备转移”这个词，就去搜真实装备性能和现实转场路线；可以将其建模为不带型号的 `equipment_unit`，展示“资源单元如何在抽象网络中重新分配”。

## 11. 质量、许可证和安全检查清单

### 数据质量

- [ ] GeoJSON 坐标使用经纬度并记录坐标系；
- [ ] 坐标缺失、经纬度越界、重复 ID 已检查；
- [ ] 点位和国家/区域空间关系合理；
- [ ] 名称、别名和类型冲突有记录；
- [ ] 每条公开说明至少关联一个来源；
- [ ] 每个场景参数都标记事实、派生、假设或未知；
- [ ] 图层版本、下载日期和时间范围完整。

### 许可证

- [ ] OSM 数据展示有 `© OpenStreetMap contributors` 和 ODbL 说明；
- [ ] Natural Earth、OurAirports、NGA、USGS、NASA、NOAA、Copernicus 等数据的具体条款已记录；
- [ ] 不把来源不明的网络地图截图作为数据源；
- [ ] 不把不同许可证的数据未经审查合并后公开分发；
- [ ] 第三方库、底图、字体、图标和截图来源已登记。

### 安全边界

- [ ] 不生成真实打击目标推荐；
- [ ] 不展示现实基地脆弱性或可利用缺口；
- [ ] 不使用敏感实时军事活动数据；
- [ ] 不把合成容量、风险和恢复时间写成真实指标；
- [ ] 页面和提交材料有“公开资料 + 抽象假设 + 非行动化演示”声明；
- [ ] 任何高风险内容一律降级为区域、等级或合成场景。

## 12. 报名获批并收到数据后的相对研究与开发节奏

| 相对时间 | 资料工作 | 系统/交付工作 | 退出条件 |
| --- | --- | --- | --- |
| D0—D1 | 保存审核回执、数据包、许可、字段和坐标系 | 原始数据只读归档，建立数据字典和来源台账 | 数据版本、权限和输入边界明确 |
| D2—D4 | 基地身份、行政、海岸线和公开背景校验 | 地图、点位、筛选、详情 | 一级地图可运行 |
| D5—D7 | 基地画像和来源复核 | 批量说明、来源卡片、质量报告 | 一级闭环可录屏 |
| D8—D10 | ACE 概念、节点角色、资源和事件 | 节点/边/资源/事件模型 | 能跑第一组抽象场景 |
| D11—D13 | 交通、保障和一个环境事件 | 集中式基线、抽象分布式方案、指标和回放 | 能比较两套方案 |
| D14—D16 | 来源、许可、事实边界审计 | 清理提交包、离线备份、复现 | 一台干净环境可复现 |
| D17 | 以组委会确认的节点提交和留证 | 提交、保存文件哈希和接收证据 | 不在最后一天加新大功能 |

如果报名获批后仍未收到组委会基地数据：先联系组委会确认审核、发送状态、联系人和使用限制；只做可替换的数据适配器、字段合同和小规模公开/合成样例，并向组委会确认能否使用样例演示；不能自行把网上资料冒充组委会正式输入。

## 13. 向组委会一次性确认的问题

建议报名后发送一封短邮件或微信，集中确认：

1. 基地数据的文件格式、坐标系、字段说明和发放时间；
2. 一级和二级的提交时间、晋级方式和反馈周期；
3. 一级的“详细说明”是否必须逐条引用来源；
4. 是否允许使用公开地图、开源 GIS 库、离线底图和合成场景参数；
5. 二级的“高价值装备”是否允许抽象为不带型号的装备资源单元；
6. 资源调配和攻防分析的允许抽象层级；
7. 是否要求源码、数据包、视频、报告、PPT 或可访问网址；
8. 是否有统一的演示电脑、网络、浏览器、操作系统或运行环境要求；
9. 是否有禁止采集或禁止展示的数据类型；
10. 是否有正式的评审指标、评分表或二级名额限制。

## 14. 我们什么时候算“搜够了”

不是把搜索结果做满，而是满足以下停止条件：

- 组委会提供的每一个基地都有主记录、空间位置、说明状态和来源状态；
- P0 图层都有合法来源、版本和可复现下载/处理说明；
- 一级地图的主要操作都有录屏和质量报告；
- 二级所需的 ACE 概念已经映射到节点、边、资源、事件和指标；
- 每个二级参数都能回答“来自公开事实、空间派生还是场景假设”；
- 只有两套方案、三到六种事件和一条五分钟演示链，也能完整说明系统价值；
- 新增资料只增加背景，不再改变核心模型、字段和演示路径。

达到停止条件后，继续搜集的边际收益会低于做数据校验、回放稳定性和答辩表达的收益。

## 15. 第一轮已确认的公开入口

以下入口已经作为第一轮检索的起点，后续会在来源台账中进一步记录版本、许可和是否实际接入：

- DTC 2026：[公开转载版赛题](https://www.xingxiancn.com/article/42184)；
- ACE：[Air Force Doctrine Note 1-21](https://www.doctrine.af.mil/Portals/61/documents/AFDN_1-21/AFDN%201-21%20ACE.pdf)；
- PMTEC：[美国陆军预算说明](https://www.asafm.army.mil/Portals/72/Documents/BudgetMaterial/2026/Discretionary%20Budget/rdte/RDTE%20-%20Vol%203%20-%20Budget%20Activity%205A.pdf)；
- 全球底图：[Natural Earth](https://www.naturalearthdata.com/downloads/)；
- 开放地图：[OpenStreetMap 法律说明](https://wiki.openstreetmap.org/wiki/Legal_FAQ)；
- 机场：[OurAirports 数据下载](https://ourairports.com/data/)；
- 港口：[NGA World Port Index](https://msi.nga.mil/Publications/WPI)；
- 高程和基础 GIS：[USGS National Map](https://www.usgs.gov/the-national-map-data-delivery/gis-data-download)；
- 高程：[NASA Earthdata LP DAAC](https://www.earthdata.nasa.gov/centers/lp-daac)；
- 海洋地形：[GEBCO](https://www.gebco.net/data-products/gridded-bathymetry-data)；
- 气象：[NOAA NCEI CDO API](https://www.ncei.noaa.gov/cdo-web/webservices/v2)和[Copernicus ERA5](https://cds.climate.copernicus.eu/datasets/reanalysis-era5-complete)；
- 灾害：[USGS Earthquake Catalog](https://earthquake.usgs.gov/fdsnws/event/1/1)和[NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/web-services/)；
- 数据格式：[IETF GeoJSON RFC 7946](https://datatracker.ietf.org/doc/html/rfc7946)；
- 地图实现：[MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/)和[Cesium GeoJSON DataSource](https://cesium.com/learn/cesiumjs/ref-doc/GeoJsonDataSource.html)。

## 16. 一轮深挖后的关键模型补充

### 16.1 ACE 不能只画成“中心点加几个分散点”

从 [Air Force Doctrine Note 1-21](https://www.doctrine.af.mil/Portals/61/documents/AFDN_1-21/AFDN%201-21%20ACE.pdf)提取到的公开概念至少包括：基地集群、中心—辐射关系、集中指挥/分布式执行、预置资源、机动、保护、保障和信息等。对我们系统的直接启发是：

- 节点要有角色，不只是名称和坐标；
- 连接要区分机动、信息和保障关系，不只画一条线；
- 节点分散后仍要体现资源、维修、通信和恢复关系；
- “方案有效”必须通过状态、资源和恢复指标表达，而不是只看地图布局。

### 16.2 后勤资料要转成抽象的保障能力

美国空军 [AFDP 4-0 Sustainment](https://www.doctrine.af.mil/Portals/61/documents/AFDP_4-0/AFDP%204-0-Sustainment.pdf)公开列出部署与分配、供应、维修、工程、物流服务、合同保障和医疗服务等保障功能。我们可以把它们压缩为系统中的抽象能力字段：

```text
deployment_distribution
supply
maintenance
engineering
logistics_service
medical
communication
```

每个节点只保留等级、是否可用、服务时间窗和恢复状态，不填写真实库存、真实编制或真实装备能力。这样既能让二级的“资源调配”有明确结构，也能保持场景非行动化。

### 16.3 PMTEC 更适合建模为数据连接与复盘层

美国印太司令部公开页面将 PMTEC 描述为连接印太地区地理分散训练场和训练区域的能力；其公开报道还提到 Live、Virtual、Constructive（LVC）训练、公共数据模型、记录、裁决和分布式复盘。可参考 [US PACOM PMTEC 页面](https://www.pacom.mil/About-US-PACOM/PMTEC/)和[PMTEC 公开报道](https://www.pacom.mil/Media/News/News-Articles/Article/3857411/us-indo-pacific-commands-pmtec-is-changing-how-the-joint-and-coalition-force-co/)。

因此在本项目中，PMTEC 不应被写成“我们已经实现了 PMTEC”，而应映射为：

```text
多源节点状态 → 统一场景时间 → 事件记录 → 过程回放 → 评估与复盘
```

这正好支持比赛演示中的案例总览、时间轴、事件日志、基线/方案对比和结果复盘。

### 16.4 二级可以采用多层时变网络

研究线建议把二级网络拆成三层：

1. **机动层**：抽象运输、转运、距离、时间和容量；
2. **信息层**：抽象连接、延迟、可用性和状态同步；
3. **保障层**：抽象补给、维修、库存和需求满足。

系统不需要一开始实现复杂的多商品流。第一版使用确定性路径筛选、资源缺口判断和可解释的贪心/最小费用规则即可。后续若有时间，再加入多方案批量实验和敏感性分析。

建议优先保留以下指标原始值：

- 节点可用率；
- 资源需求满足率；
- 补给延迟 P50/P95；
- 路径冗余；
- 资源安全时间；
- 事件后的恢复时间；
- 可服务需求覆盖度；
- 网络仍可工作的节点/需求点比例；
- 总有效交付量和额外切换成本。

指标先记录原始值，权重后配置。不要预先把某一个指标包装成“真实战场效果”。

### 16.5 页面形态可以先确定，不必等全部资料搜完

借鉴数字孪生和地理仿真公开案例，一级/二级原型建议先固定四个页面：

1. **案例总览**：案例说明、数据版本、来源、假设、复现按钮；
2. **时空地图**：图层开关、筛选、图例、时间轴、对象选中和方案切换；
3. **对象/事件详情**：基地或节点属性、状态时间线、事件日志和来源；
4. **评估与回放**：基线/方案指标、空间差异、数据质量、回放日志。

如果没有现成三维资产，优先 2D/2.5D；如果已有稳定的 Cesium 场景和资产，再考虑三维。地图渲染器只选一个主线，QGIS 用于数据整理与校验，GeoJSON 用于交换，避免在比赛窗口内同时维护两套前端地图引擎。

建议继续查看但不必全部接入的公开案例：

- [DTC Two Years of Twins 报告](https://media.digitaltwinconsortium.org/wp-content/uploads/2022/06/DTC-Year-2-Report.pdf)：参考“历史数据 + 当前状态 + 未来模拟”的信息结构；
- [DTC TRANSFORM 2D-to-4D Testbed](https://www.digitaltwinconsortium.org/initiatives/digital-twin-testbeds/transform/)：参考 schema、数据完整性和动态地理数据；
- [Cesium Stories 时间动态数据](https://cesium.com/learn/ion/stories-time-dynamic/)：参考固定镜头、时间播放和可复现演示；
- [美国陆军 One World Terrain](https://cpest3.army.mil/Project-Offices/PM-SIM/-PdM-CSE/OWT/)：只借鉴共同地形和多仿真环境思想，不复制真实作战内容；
- [Fraunhofer Digital Map Table](https://www.iosb.fraunhofer.de/en/projects-and-products/digitaler-lagetisch.html)：参考图层、筛选、标注、时间轴和态势图组合；
- [QGIS 时间控制器](https://docs.qgis.org/3.44/en/docs/user_manual/map_views/map_view.html)：用于数据准备、时间回放校验和截图导出。

## 17. 扩展数据源目录：广泛发现，不等于全部接入

下面是第二轮摸底后整理的更宽数据源池。它的作用是防止后续不知道去哪里找资料；最终仍按 P0/P1/P2 和许可证审计筛选。P0 表示可能直接服务一级/二级，P1 表示补充价值较高，P2 表示有余力再做，P3 表示当前不建议接入。

### 基础地理、行政和海洋

| 来源 | 可搜内容 | 格式/接口 | 建议 |
| --- | --- | --- | --- |
| [Natural Earth](https://www.naturalearthdata.com/downloads/) | 国家、行政区、海岸线、岛屿、城市、海洋 | SHP、GeoPackage、栅格 | P0 |
| [OpenStreetMap / Geofabrik](https://download.geofabrik.de/index.html) | 道路、铁路、机场、港口、设施 | PBF、GeoPackage、SHP | P0 |
| [OCHA HDX/COD](https://data.humdata.org/) | 行政区、P-code、人道区划 | GeoJSON、SHP、KML | P1 |
| [FAO GAUL](https://www.fao.org/agroinformatics/training-and-resources/data-sets/data-set-detail/global-gaul-new-2024-release/en) | 全球一级、二级行政区 | 矢量数据 | P1 |
| [NOAA GSHHG](https://www.ngdc.noaa.gov/mgg/shorelines/shorelines.html) | 高精度海岸线、湖泊和岛屿 | SHP | P1 |
| [Marine Regions/VLIZ](https://www.marineregions.org/downloads.php) | 海域分区、EEZ、领海等公开背景 | GeoPackage、SHP、KML | P1，按许可使用 |
| [GEBCO](https://www.gebco.net/data-products/gridded-bathymetry-data) | 海底地形和陆地高程 | NetCDF、GeoTIFF | P1 |
| [NOAA ETOPO](https://www.ncei.noaa.gov/products/etopo-global-relief-model) | 全球陆地与海底地形 | NetCDF、GeoTIFF | P1 |

### 机场、港口、道路和运输

| 来源 | 可搜内容 | 格式/接口 | 建议 |
| --- | --- | --- | --- |
| [OurAirports](https://ourairports.com/data/) | 全球机场、跑道、直升机场、水上机场 | CSV、KML | P0，需交叉核验 |
| [FAA NASR](https://www.faa.gov/air_traffic/flight_info/aeronav/Aero_Data/NASR_Subscription/2026-09-03/) | 美国及相关太平洋区域机场、航路、导航设施和空域 | CSV、AIXM、SHP | P1 |
| [NGA World Port Index](https://msi.nga.mil/Publications/WPI) | 全球港口位置和公开基础属性 | CSV、在线查询 | P0/P1，只做高层次背景 |
| [美国交通统计局 NTAD](https://www.bts.gov/ntad) | 道路、铁路、机场、港口和联运设施 | GIS 图层 | P1，主要用于美国范围 |
| [U.S. Census TIGER/Line](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.2024.html) | 美国道路、铁路和行政区 | SHP | P1，主要用于美国范围 |
| [ICAO API Data Service](https://www.icao.int/api-data-service) | 机场、航空公司和航空代码校验 | JSON/CSV API | P2 |
| [OpenSky API](https://openskynetwork.github.io/opensky-api/rest.html) | 公开航空器状态数据 | JSON | P3，不使用实时军用轨迹 |

航线原型建议由机场/港口节点生成大圆线或合成运输走廊，不使用实时军机、军舰、AIS 或 ADS-B 轨迹。

### 气象、海洋、地形和土地覆盖

| 来源 | 可搜内容 | 格式/接口 | 建议 |
| --- | --- | --- | --- |
| [NOAA GFS](https://www.ncei.noaa.gov/products/weather-climate-models/global-forecast) | 风、温度、降水、气压 | GRIB2、OPeNDAP | P1 |
| [NOAA ISD](https://www.ncei.noaa.gov/products/land-based-station/integrated-surface-database) | 全球地面气象站小时观测 | CSV、ASCII | P1 |
| [Copernicus ERA5](https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels?tab=overview) | 1940 年至今逐小时再分析 | NetCDF、GRIB、API | P1 |
| [ECMWF Open Data](https://www.ecmwf.int/en/forecasts/datasets/open-data) | 全球预报数据 | GRIB2 | P2 |
| [NOAA OISST](https://www.ncei.noaa.gov/products/optimum-interpolation-sst) | 全球日海温 | NetCDF | P2 |
| [NOAA World Ocean Atlas](https://www.ncei.noaa.gov/access/world-ocean-atlas-2023/) | 海温、盐度、氧等气候场 | NetCDF、CSV | P2 |
| [Copernicus Marine](https://www.copernicus.eu/en/copernicus-services/marine) | 海流、海温、海浪、海冰 | NetCDF、Zarr、API | P2 |
| [USGS SRTM](https://www.usgs.gov/faqs/where-can-i-get-global-elevation-data) | 全球高程 | GeoTIFF、DTED | P0/P1 |
| [Copernicus DEM](https://dataspace.copernicus.eu/explore-data/data-collections/copernicus-contributing-missions/collections-description/COP-DEM) | GLO-30/GLO-90 高程 | GeoTIFF、DTED | P1 |
| [ESA WorldCover](https://esa-worldcover.org/en/data-access) | 全球土地覆盖 | GeoTIFF、COG | P1 |
| [SoilGrids](https://docs.isric.org/globaldata/soilgrids/wcs.html) | 全球土壤属性 | GeoTIFF、WCS/WMS | P2 |
| [JRC Global Surface Water](https://global-surface-water.appspot.com/download) | 历史水体和季节性水体 | 栅格瓦片 | P2 |

### 灾害和环境事件

| 来源 | 可搜内容 | 格式/接口 | 建议 |
| --- | --- | --- | --- |
| [USGS Earthquake Feeds/API](https://earthquake.usgs.gov/earthquakes/feed/) | 全球地震事件 | GeoJSON、KML、CSV | P1 |
| [NOAA IBTrACS](https://www.ncei.noaa.gov/products/international-best-track-archive) | 全球热带气旋历史轨迹和强度 | NetCDF、CSV、SHP | P1 |
| [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/web-services/) | 全球火点和火灾 | CSV、KML、SHP、WMS/WFS | P1 |
| [GDACS](https://www.gdacs.org/) | 地震、气旋、洪水、火山等灾害 | RSS/XML/JSON/GeoJSON | P2 |
| [Copernicus EMS](https://emergency.copernicus.eu/data/) | 历史灾害制图产品 | API、矢量、栅格 | P2 |
| [GloFAS](https://confluence.ecmwf.int/spaces/CEMS/pages/242067380/Auxiliary%2BData) | 全球河流洪水预测 | GRIB2、NetCDF | P2 |
| [GEM Hazard Models](https://www.globalquakemodel.org/products) | 地震危险度和长期风险模型 | 栅格/模型 | P2 |

### 影像、地图瓦片和地名

| 来源 | 可搜内容 | 格式/接口 | 建议 |
| --- | --- | --- | --- |
| [Copernicus Sentinel Data Space](https://dataspace.copernicus.eu/) | Sentinel-1 SAR、Sentinel-2 光学影像 | SAFE、JP2、COG、STAC | P2，一级不必依赖 |
| [Sentinel STAC API](https://documentation.dataspace.copernicus.eu/APIs/STAC.html) | 按时间、区域、云量检索 Sentinel | STAC/API | P2 |
| [USGS Landsat Collection 2](https://www.usgs.gov/landsat-missions/landsat-collection-2) | 历史卫星影像 | COG、STAC、GeoTIFF | P2 |
| [NASA GIBS](https://nasa-gibs.github.io/gibs-api-docs/access-basics/) | 全球卫星、云、海温、火点瓦片 | WMTS、WMS、TMS | P2 |
| [JMA Himawari](https://www.data.jma.go.jp/mscweb/data/himawari/) | 太平洋云系、台风、天气动画 | HSD、HRIT、NetCDF、PNG | P2 |
| [GeoNames](https://www.geonames.org/export/) | 全球地名、别名、行政区和要素分类 | TXT、ZIP、API | P0/P1 |
| [NGA GNS](https://geonames.nga.mil/geonames/GNSHome/index.html) | 全球地名、历史名称和变体 | 文本/API | P1 |
| [USGS GNIS](https://www.usgs.gov/us-board-on-geographic-names/download-gnis-data) | 美国及属地官方地名 | CSV、TXT、GDB、GPKG | P1 |
| [Overture Maps](https://docs.overturemaps.org/) | 地点、设施、建筑、道路和交通分类 | GeoParquet、云端数据 | P1，需核许可 |

### 历史资料

| 来源 | 可搜内容 | 建议 |
| --- | --- | --- |
| [NPS National Register 数据下载](https://home.nps.gov/subjects/nationalregister/data-downloads.htm) | 美国历史机场、堡垒、战场、军营和遗址 | P2，用于历史背景 |
| [NPS Spatial Data](https://www.nps.gov/orgs/1094/nrhp_spatialdata.htm) | 历史遗址空间数据 | P2 |
| [NARA WWII Cartographic Records](https://www.archives.gov/research/cartographic/ww2) | 太平洋战区历史地图、旧基地和战时设施档案 | P2，历史数据优先 |
| [Australian Heritage Database](https://www.dcceew.gov.au/parks-heritage/heritage/publications/australian-heritage-database) | 澳大利亚历史/自然遗产地点 | P2 |

明确暂不纳入：现役军事基地的敏感精确设施细节、当前部署状态、实时军机军舰轨迹、雷达/防空/弹药设施、现实脆弱性和可操作军事能力。竞赛原型优先使用组委会提供数据、历史基地、区域化节点、网格化数据和合成航线。

## 18. 资料边界

本文件是 DTC 2026 赛道 2 的资料搜集、研究和实现规划，不是主办方评分保证，也不是现实军事行动方案。公开来源可能存在时效、准确性、转载和许可证差异；所有进入系统的数据必须再次核验，所有二级能力参数默认是抽象场景假设。后续研究的目标是形成一个可运行、可解释、可复现、公开可审计的比赛原型，而不是复原真实作战系统。

## 19. 2026-09-14 初赛官方文件接收后的状态修订

报名已通过（按用户反馈），当前收到的 4 份文件已保存至 `初赛官方文件`。工作区未归档组委会正式回执，因此“完整资料包”只作为用户上下文记录。本轮已完成 3 份 PDF 和 1 份 XLSX 的逐份阅读、结构核验和项目应用分析；当前机器可读入口是 `DTC_2026_Level1_资料包`，具体历史报告见 `初赛官方文件\分析报告`。

当前判断：

- 1 号基础设施报告是历史公开背景和 66 个重要站点参考，不等于 2026 年当前部署清单；
- 2 号基地结构 Excel 是 FY2024 统计数据，包含站点级和地区级表，但不等于已确认的竞赛基地坐标主表；
- 3 号盟友伙伴报告是 2021—2030 场景假设，不能直接作为当前政治立场、通行状态或现实能力；
- 4 号 INDOPACOM 报告是 2024 年组织与责任区背景，不能推导实时兵力、行动计划或设施脆弱性；
- 官方资料包不包含竞赛专用 GeoJSON/CSV/GPKG、坐标字段、记录编号或正式数据字典；这是已确认的输入限制，不是待继续排查的目录问题。

因此本方案的当前执行点从“等待官方数据”进入 **D1→D2 参考主表与一级数据合同构建**：原始文件和转换稿已冻结，哈希、页数/工作表/字段结构和日期口径已落盘；66 个参考站点目录、BSR staging、公开几何候选、字段证据和质量门禁已生成。公开来源字段标为 `PUBLIC_ENRICHMENT` 或 `DERIVED`，正式 `contest_record_id`、竞赛坐标主表和字段字典仍是 `UNKNOWN`。公开参考资料用于背景、身份交叉核验和抽象场景素材，不能覆盖或伪装成组委会原始字段。
