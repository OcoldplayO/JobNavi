# 职路通（微信小程序）- 数据字典（DATA_DICTIONARY）

> 版本：v1.0（初稿，可冻结）  
> 目标：统一前后端对 **字段含义、类型、单位、枚举值、展示规则、脱敏/隐私** 的理解，作为联调与验收依据。  
> 约束：薪资单位统一 **元/月**；风险等级 **后端计算**；时间字段建议 ISO8601；地图坐标使用 **GCJ-02**。

---

## 1. 通用字段与约定

### 1.1 标识符
- **ID 字段统一为 string**
  - `jobId`, `companyId`, `interviewId`, `userId`, `poiId`
  - 建议格式：`j_`/`c_`/`i_`/`u_`/`poi_` 前缀 + 唯一串（不强制）

### 1.2 时间字段
- 统一使用 **ISO 8601（含时区）**
  - 示例：`2026-01-15T10:00:00+08:00`

### 1.3 金额/薪资单位
- `salaryMin` / `salaryMax`：**number，单位=元/月**
- 展示文本 `salaryText`：如 `"8k-15k"`，仅展示用（不作为计算唯一来源）

### 1.4 坐标字段
- `location.lat` / `location.lng`：number
- `coordSystem`：固定 `"gcj02"`

---

## 2. 枚举值（统一口径）

### 2.1 风险等级 `riskLevel`
| 值 | 展示文案（默认） | 颜色含义 |
| --- | --- | --- |
| green | 建议投递 | 低风险 |
| yellow | 待核实 | 中风险 |
| red | 高风险 | 高风险 |

### 2.2 面试状态 `interviewStatus`
| 值 | 含义 | 列表展示建议 |
| --- | --- | --- |
| upcoming | 即将进行 | 正常高亮 |
| completed | 已完成 | 弱化显示 |
| canceled | 已取消 | 弱化显示 + 可展示取消原因 |

### 2.3 岗位筛选：学历 `education`
| UI | 值 | 说明 |
| --- | --- | --- |
| 全部 | all（或不传） | 不限制 |
| 大专 | junior_college | 专科/大专 |
| 本科 | bachelor | 本科 |
| 硕士 | master | 硕士及以上（若要细分博士另加） |

### 2.4 岗位筛选：经验 `experience`
| UI | 值 | 说明 |
| --- | --- | --- |
| 全部 | all（或不传） | 不限制 |
| 应届生 | fresh_graduate | 0 年或毕业两年内（需业务定义） |
| 1-3年 | 1_3 | 含边界（建议含 1 与 3） |
| 3-5年 | 3_5 | 含边界（建议含 3 与 5） |

### 2.5 岗位筛选：薪资区间 `salaryRange`
| UI | 值 | 说明 |
| --- | --- | --- |
| 全部 | all（或不传） | 不限制 |
| 3k-5k | 3k_5k | 展示区间 |
| 5k-10k | 5k_10k | 展示区间 |
| 10k+ | 10k_plus | 下限 10k，上限无穷（后端定义） |

### 2.6 岗位排序 `jobOrder`
| 值 | 含义 | 口径（冻结） |
| --- | --- | --- |
| salary_desc | 薪资从高到低 | 以 `salaryMax` 为主排序（无则降级） |
| established_asc | 成立时间从久到新 | 以 `establishedYear` 从小到大 |

### 2.7 周边 POI 类型 `poiType`
| 值 | 含义 |
| --- | --- |
| coffee | 附近咖啡 |
| hotel | 休息场所 |
| rest | 其他休息/便利（可选） |

---

## 3. 核心对象数据结构

## 3.1 Job（岗位）

### 3.1.1 字段表
| 字段 | 类型 | 必返 | 示例 | 说明/口径 |
| --- | --- | --- | --- | --- |
| jobId | string | 是 | j_1 | 岗位ID |
| companyId | string | 是 | c_1 | 公司ID |
| companyName | string | 是 | 星辰科技有限公司 | 公司名称 |
| positionName | string | 是 | 前端开发工程师 | 岗位名称 |
| salaryText | string | 是 | 8k-15k | 展示文本 |
| salaryMin | number | 建议 | 8000 | 元/月 |
| salaryMax | number | 建议 | 15000 | 元/月 |
| salaryCurrency | string | 建议 | CNY | 币种 |
| establishedYear | number | 建议 | 2020 | 成立年份（用于排序/展示） |
| registeredCapitalText | string | 否 | 注册资本500万 | 展示文本（可结构化） |
| companySizeText | string | 否 | 规模50-100人 | 展示文本（可结构化） |
| education | string | 否 | bachelor | 参考枚举 |
| experience | string | 否 | 1_3 | 参考枚举 |
| riskLevel | string | 是 | yellow | 后端计算 |
| riskReasons | string[] | 是 | ["..."] | 无则空数组 |

### 3.1.2 展示规则
- 风险标签文案默认与 `riskLevel` 映射（可被运营配置覆盖）
- `salaryText` 优先展示；若缺失可由 `salaryMin/salaryMax` 拼接（前端兜底）

---

## 3.2 Company（公司，若独立建模）
> 当前前端原型将公司信息嵌入 Job；如后端有公司主表，建议如下字段。

| 字段 | 类型 | 必返 | 示例 | 说明 |
| --- | --- | --- | --- | --- |
| companyId | string | 是 | c_1 | 公司ID |
| companyName | string | 是 | 星辰科技有限公司 | 名称 |
| establishedYear | number | 否 | 2020 | 成立年份 |
| registeredCapital | number | 否 | 5000000 | 注册资本（元） |
| registeredCapitalText | string | 否 | 注册资本500万 | 展示文本 |
| companySize | string | 否 | 50-100 | 规模区间（可枚举） |
| companySizeText | string | 否 | 规模50-100人 | 展示文本 |

---

## 3.3 Risk（风险评估）
> 风险由后端计算并解释；可以挂在 Job 上，也可以独立对象。

| 字段 | 类型 | 必返 | 示例 | 说明 |
| --- | --- | --- | --- | --- |
| riskLevel | string | 是 | red | green/yellow/red |
| riskReasons | string[] | 是 | ["注册资本低于100万..."] | 按重要性排序 |
| evaluatedAt | string | 否 | 2026-01-14T10:00:00+08:00 | 评估时间 |

### 风险原因规则（写入验收口径）
- `riskReasons` 允许 0-N 条；为 0 时表示“无可展示风险原因”
- 前端展示应支持多条、自动换行

---

## 3.4 Interview（面试列表项）

| 字段 | 类型 | 必返 | 示例 | 说明 |
| --- | --- | --- | --- | --- |
| interviewId | string | 是 | i_1 | 面试ID |
| companyName | string | 是 | 星辰科技有限公司 | 公司 |
| positionName | string | 是 | 前端开发工程师 | 岗位 |
| startTime | string | 是 | 2026-01-15T10:00:00+08:00 | 开始时间 |
| endTime | string | 是 | 2026-01-15T11:30:00+08:00 | 结束时间 |
| address | string | 是 | 北京市海淀区... | 地址文本 |
| location | object | 否 | {lat,lng,coordSystem} | 坐标（GCJ-02） |
| status | string | 是 | upcoming | upcoming/completed/canceled |
| cancelReason | string | 否 | 时间冲突 | 仅 canceled 时返回 |

### 展示规则（与原型一致）
- 列表左侧 “日期/星期” 由 `startTime` 计算得到（前端计算）
- `completed/canceled` 列表项弱化显示

---

## 3.5 InterviewDetail（面试详情）

| 字段 | 类型 | 必返 | 示例 | 说明 |
| --- | --- | --- | --- | --- |
| interviewId | string | 是 | i_1 | 面试ID |
| companyName | string | 是 | 星辰科技有限公司 | 公司 |
| positionName | string | 是 | 前端开发工程师 | 岗位 |
| startTime | string | 是 | 2026-01-15T10:00:00+08:00 | 开始 |
| endTime | string | 是 | 2026-01-15T11:30:00+08:00 | 结束 |
| address | string | 是 | 北京市海淀区... | 地址 |
| location | object | 否 | {lat,lng,coordSystem} | 坐标 |
| contactName | string | 否 | 李经理 | 联系人 |
| contactPhoneMasked | string | 否 | 138****1234 | 脱敏手机号（仅展示） |
| notes | string | 否 | 请携带简历... | 备注 |
| status | string | 是 | upcoming | 状态 |
| cancelReason | string | 否 | 个人原因 | canceled 时必返（建议） |

### 隐私要求
- `contactPhoneMasked` 仅用于展示；若需要拨号能力，建议另提供受控接口/按钮（后续定义）

---

## 3.6 User（用户）

| 字段 | 类型 | 必返 | 示例 | 说明 |
| --- | --- | --- | --- | --- |
| userId | string | 是 | u_123 | 用户ID |
| phoneMasked | string | 是 | 138****1234 | 脱敏展示 |
| isPhoneBound | boolean | 是 | true | 是否已绑定手机号 |

---

## 3.7 Config（运营配置）

### 3.7.1 风险配置（/config/risk）
| 字段 | 类型 | 必返 | 示例 | 说明 |
| --- | --- | --- | --- | --- |
| version | string | 是 | 2026-01-14_001 | 版本号（用于缓存） |
| labels.green | string | 否 | 建议投递 | 风险文案可配 |
| labels.yellow | string | 否 | 待核实 | 风险文案可配 |
| labels.red | string | 否 | 高风险 | 风险文案可配 |
| display.homeBlockedCountText | string | 否 | 已为你屏蔽... | 首页展示文案 |

### 3.7.2 缓存策略（冻结口径）
- 推荐使用 `ETag` + `If-None-Match`
- 服务端可返回 `304 Not Modified`
- 客户端缓存键：`configRisk:version` 或 `ETag`

---

## 3.8 POI（周边点位）

| 字段 | 类型 | 必返 | 示例 | 说明 |
| --- | --- | --- | --- | --- |
| poiId | string | 是 | amap_xxx | 高德POI ID（或映射） |
| name | string | 是 | 某某咖啡 | 名称 |
| address | string | 否 | 北京市... | 地址 |
| location | object | 是 | {lat,lng,coordSystem} | 坐标 |
| distance | number | 否 | 320 | 米 |

---

## 3.9 Event（埋点事件）

| 字段 | 类型 | 必返 | 示例 | 说明 |
| --- | --- | --- | --- | --- |
| event | string | 是 | job_list_view | 事件名 |
| ts | string | 是 | 2026-01-14T10:00:00+08:00 | 发生时间 |
| props | object | 否 | {q,education} | 事件属性 |
| client.platform | string | 是 | wechat_mp | 端标识 |
| client.sessionId | string | 否 | s_xxx | 会话ID |
| client.appVersion | string | 否 | 1.0.0 | 版本 |

---

## 4. 脱敏与合规（最低要求）

### 4.1 手机号
- 展示字段：`phoneMasked` / `contactPhoneMasked`（脱敏格式：`138****1234`）
- 原始手机号如需存储：仅后端存储，传输需 HTTPS，前端不落本地持久化（除非有明确合规需求）

### 4.2 位置信息
- 若请求定位权限：需在后续合规文档中明确用途（用于附近POI/导航）
- 若用户拒绝定位：前端可仅用地址文本展示，不调用 POI 接口（降级）

---

## 5. 待你确认（冻结前最后确认）
1. `salaryMin/salaryMax` 是否允许为 null（未知）？若允许，排序降级策略是否：无 salaryMax 的放到末尾？
2. `contactPhoneMasked` 是否允许为空（无联系人）？前端 UI 是否需要空态文案？
3. `registeredCapital` 是否需要结构化返回（元）？还是仅文本即可？

