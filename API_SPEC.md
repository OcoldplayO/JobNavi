# 职路通（微信小程序）- API 规格说明（API_SPEC）

> 版本：v1.0（初稿）  
> 目标：让前后端在 **字段口径、分页、筛选排序、鉴权、错误码、地图代理、验收数据** 上达成一致，避免联调返工。  
> 约束：微信小程序；**手机号授权登录**；列表使用 **游标分页**；高德能力 **后端代理**；风险评估 **后端计算**。

---

## 0. 环境与域名

> 由后端提供。以下为占位示例。

| 环境 | BaseURL |
| --- | --- |
| dev | `https://api-dev.example.com` |
| stg | `https://api-stg.example.com` |
| prod | `https://api.example.com` |

---

## 1. 通用约定

### 1.1 Header 约定
- **Content-Type**：`application/json; charset=utf-8`
- **Authorization**：`Bearer <token>`（除登录/刷新等公开接口外均需）
- **X-Request-Id**（可选）：客户端生成，用于链路追踪
- **X-Idempotency-Key**（写入类建议必填）：用于幂等（面试新增/编辑、状态流转等）

### 1.2 响应结构（统一包裹）
所有接口返回统一结构：
```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```
- `code=0` 表示成功
- `code!=0` 表示失败，`message` 为可展示的简短错误信息，`data` 可选（用于返回字段级错误/调试信息）

### 1.3 游标分页（Cursor Pagination）
列表接口统一：
- 请求：`cursor`（可空）+ `limit`（默认 20，最大 50）
- 响应：
```json
{
  "list": [],
  "nextCursor": "opaque_cursor",
  "hasMore": true
}
```
说明：
- `cursor` 由服务端生成，客户端不可解析
- `hasMore=false` 时 `nextCursor` 可为空或省略

### 1.4 时间与时区
- 建议接口层统一使用 **ISO 8601**（含时区）：
  - 示例：`2026-01-14T10:00:00+08:00`
- 若前端展示需要 “01/15、周三” 等，建议前端基于 ISO 时间计算（避免后端多口径）

### 1.5 地理坐标系
高德服务默认使用 **GCJ-02**。建议：
- 传入/返回统一使用 `gcj02`（并在字段中标注）
- 返回同时可带 `cityCode` / `adCode`（便于筛选与展示）

---

## 2. 错误码规范（必须纳入）

### 2.1 错误码分段（建议）
| code 段 | 含义 | 示例 |
| --- | --- | --- |
| 0 | 成功 | 0 |
| 1000-1999 | 参数/校验错误 | 1001 参数缺失 |
| 2000-2999 | 鉴权/权限错误 | 2001 未登录/Token 失效 |
| 3000-3999 | 业务规则错误 | 3001 风险服务不可用（业务降级） |
| 4000-4999 | 频控/风控 | 4001 请求过于频繁 |
| 5000-5999 | 系统/依赖错误 | 5001 内部错误 |

### 2.2 通用错误码（建议最小集合）
| code | message（示例） | 说明 | 前端处理建议 |
| --- | --- | --- | --- |
| 1001 | 参数错误 | 缺少必填/格式错误 | toast + 高亮字段（如适用） |
| 1002 | 分页参数错误 | cursor/limit 非法 | 使用默认值重试一次 |
| 2001 | 未登录或登录已过期 | token 失效/不存在 | 触发重新登录（静默优先） |
| 2002 | 无权限 | 资源不属于当前用户 | 返回首页/提示 |
| 4001 | 操作过于频繁 | 频控命中 | toast + 禁用按钮短时间 |
| 5001 | 系统繁忙 | 服务异常 | toast + 支持重试 |
| 5002 | 依赖服务异常 | 如高德/风控/短信服务 | 降级/提示稍后再试 |

### 2.3 字段级错误（可选）
当需要具体指出字段错误时：
```json
{
  "code": 1001,
  "message": "参数错误",
  "data": {
    "fieldErrors": [
      { "field": "startTime", "reason": "must_be_before_endTime" }
    ]
  }
}
```

---

## 3. 鉴权与登录（手机号授权）

### 3.1 登录流程（建议）
1. 小程序端 `wx.login()` 获取 `wxCode`
2. 小程序端触发手机号授权组件，获取 `encryptedData` + `iv`（或新 API 获取 phoneCode，视微信版本/策略）
3. 调用后端登录接口换取 `token`

### 3.2 POST /auth/login
- **用途**：微信登录 + 手机号绑定，签发 token
- **Auth**：否
- **Body**
```json
{
  "wxCode": "string",
  "encryptedPhoneData": "string",
  "iv": "string",
  "clientInfo": {
    "platform": "wechat_mp",
    "appVersion": "1.0.0",
    "device": "iPhone15,3"
  }
}
```
- **Response**
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "token": "jwt_or_opaque",
    "expiresAt": "2026-01-14T12:00:00+08:00",
    "refreshToken": "optional",
    "user": {
      "userId": "u_123",
      "phoneMasked": "138****1234",
      "isPhoneBound": true
    }
  }
}
```

### 3.3 POST /auth/refresh
- **用途**：刷新 token（可选但推荐）
- **Auth**：否（用 refreshToken）或 是（视实现）
- **Body**
```json
{ "refreshToken": "string" }
```
- **Response**：同 login（返回新 token）

### 3.4 POST /auth/logout（可选）
- **用途**：注销 refreshToken/会话
- **Auth**：是

---

## 4. 岗位（Jobs）与风险（Risk）

### 4.1 领域模型：Job（响应字段）
| 字段 | 类型 | 必返 | 说明 |
| --- | --- | --- | --- |
| jobId | string | 是 | 岗位ID |
| companyId | string | 是 | 公司ID |
| companyName | string | 是 | 公司名称 |
| positionName | string | 是 | 岗位名称 |
| salaryText | string | 是 | 薪资展示文本，如 `"8k-15k"` |
| salaryMin | number | 建议 | 薪资下限（元/月） |
| salaryMax | number | 建议 | 薪资上限（元/月） |
| salaryCurrency | string | 建议 | `"CNY"` |
| establishedYear | number | 建议 | 成立年份（便于排序/展示） |
| registeredCapitalText | string | 否 | 如 `"注册资本500万"` |
| companySizeText | string | 否 | 如 `"规模50-100人"` |
| riskLevel | string | 是 | `green|yellow|red`（后端计算） |
| riskReasons | string[] | 是 | 风险原因列表（无则空数组） |

> 说明：当前前端原型展示 `established: "2020年成立" | capital | size`，后端可按更结构化返回，前端再拼装展示文本。

### 4.2 GET /jobs（岗位列表）
- **用途**：岗位搜索/筛选/排序/分页
- **Auth**：是
- **Query**
| 参数 | 类型 | 必填 | 示例 | 说明 |
| --- | --- | --- | --- | --- |
| cursor | string | 否 | `opaque` | 游标 |
| limit | number | 否 | 20 | 1-50 |
| q | string | 否 | 前端 | 搜索：公司/岗位关键字 |
| education | string | 否 | bachelor | 学历筛选（枚举见下） |
| experience | string | 否 | 1_3 | 经验筛选（枚举见下） |
| salaryRange | string | 否 | 5k_10k | 薪资筛选（枚举见下） |
| order | string | 否 | salary_desc | 排序：`salary_desc` / `established_asc` |

- **education 枚举（建议）**
| UI | 值 |
| --- | --- |
| 全部 | `all`（或不传） |
| 大专 | `junior_college` |
| 本科 | `bachelor` |
| 硕士 | `master` |

- **experience 枚举（建议）**
| UI | 值 |
| --- | --- |
| 全部 | `all`（或不传） |
| 应届生 | `fresh_graduate` |
| 1-3年 | `1_3` |
| 3-5年 | `3_5` |

- **salaryRange 枚举（建议）**
| UI | 值 |
| --- | --- |
| 全部 | `all`（或不传） |
| 3k-5k | `3k_5k` |
| 5k-10k | `5k_10k` |
| 10k+ | `10k_plus` |

- **Response（分页）**
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "list": [
      {
        "jobId": "j_1",
        "companyId": "c_1",
        "companyName": "星辰科技有限公司",
        "positionName": "前端开发工程师",
        "salaryText": "8k-15k",
        "salaryMin": 8000,
        "salaryMax": 15000,
        "salaryCurrency": "CNY",
        "establishedYear": 2020,
        "registeredCapitalText": "注册资本500万",
        "companySizeText": "规模50-100人",
        "riskLevel": "green",
        "riskReasons": []
      }
    ],
    "nextCursor": "opaque_next",
    "hasMore": true
  }
}
```

### 4.3 GET /jobs/{jobId}（岗位详情，可选）
- **用途**：如需要岗位详情页/收藏等扩展时启用
- **Auth**：是
- **Response**：返回单个 Job + 可扩展字段（描述、福利、JD 等）

### 4.4 风险接口（两种模式，二选一）
> 你已确认 **后端计算** 风险等级与原因。以下提供两种实现模式：

**模式A（推荐）**：风险随岗位列表/详情一起返回（`riskLevel/riskReasons`），无需额外接口。  
**模式B**：风险原因较多或需单独刷新时使用独立接口：

#### GET /jobs/{jobId}/risk（可选）
- **Auth**：是
- **Response**
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "jobId": "j_2",
    "riskLevel": "red",
    "riskReasons": [
      "注册资本低于100万，存在经营风险",
      "公司成立时间不足1年，稳定性待验证"
    ],
    "evaluatedAt": "2026-01-14T10:00:00+08:00"
  }
}
```

---

## 5. 面试管理（Interviews）

### 5.1 领域模型：Interview（列表项）
| 字段 | 类型 | 必返 | 说明 |
| --- | --- | --- | --- |
| interviewId | string | 是 | 面试ID |
| companyName | string | 是 | 公司 |
| positionName | string | 是 | 岗位 |
| startTime | string | 是 | ISO8601 |
| endTime | string | 是 | ISO8601 |
| address | string | 是 | 面试地址 |
| status | string | 是 | `upcoming|completed|canceled` |

### 5.2 领域模型：InterviewDetail（详情）
在 Interview 基础上增加：
| 字段 | 类型 | 必返 | 说明 |
| --- | --- | --- | --- |
| contactName | string | 否 | 联系人 |
| contactPhoneMasked | string | 否 | 脱敏手机号 |
| notes | string | 否 | 备注 |
| location | object | 否 | `{lat,lng,coordSystem:"gcj02"}` |

### 5.3 GET /interviews（面试列表）
- **Auth**：是
- **Query**
| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| cursor | string | 否 | 游标 |
| limit | number | 否 | 1-50 |
| status | string | 否 | `upcoming|completed|canceled`；不传则全部 |
| startDate | string | 否 | ISO 日期（可选，用于日历范围查询） |
| endDate | string | 否 | ISO 日期 |

- **Response**
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "list": [
      {
        "interviewId": "i_1",
        "companyName": "星辰科技有限公司",
        "positionName": "前端开发工程师",
        "startTime": "2026-01-15T10:00:00+08:00",
        "endTime": "2026-01-15T11:30:00+08:00",
        "address": "北京市海淀区中关村软件园二期B座8层",
        "status": "upcoming"
      }
    ],
    "nextCursor": "opaque_next",
    "hasMore": true
  }
}
```

### 5.4 POST /interviews（新增面试）
- **Auth**：是
- **Header**：建议必带 `X-Idempotency-Key`
- **Body**
```json
{
  "companyName": "星辰科技有限公司",
  "positionName": "前端开发工程师",
  "startTime": "2026-01-15T10:00:00+08:00",
  "endTime": "2026-01-15T11:30:00+08:00",
  "address": "北京市海淀区中关村软件园二期B座8层",
  "location": { "lat": 39.98, "lng": 116.31, "coordSystem": "gcj02" },
  "contactName": "李经理",
  "contactPhone": "13800138000",
  "notes": "请携带简历和作品集，提前15分钟到达"
}
```
- **Response**
```json
{
  "code": 0,
  "message": "ok",
  "data": { "interviewId": "i_new" }
}
```

### 5.5 PATCH /interviews/{interviewId}（编辑面试）
- **Auth**：是
- **Header**：建议必带 `X-Idempotency-Key`
- **Body**：同新增，字段可部分更新

### 5.6 GET /interviews/{interviewId}（面试详情）
- **Auth**：是
- **Response**
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "interviewId": "i_1",
    "companyName": "星辰科技有限公司",
    "positionName": "前端开发工程师",
    "startTime": "2026-01-15T10:00:00+08:00",
    "endTime": "2026-01-15T11:30:00+08:00",
    "address": "北京市海淀区中关村软件园二期B座8层",
    "location": { "lat": 39.98, "lng": 116.31, "coordSystem": "gcj02" },
    "contactName": "李经理",
    "contactPhoneMasked": "138****1234",
    "notes": "请携带简历和作品集，提前15分钟到达",
    "status": "upcoming"
  }
}
```

### 5.7 PATCH /interviews/{interviewId}/status（状态流转）
- **Auth**：是
- **Header**：建议必带 `X-Idempotency-Key`
- **Body**
```json
{ "status": "completed" }
```

---

## 6. 地图/周边（高德代理）

> 你已确认：**后端代理高德 WebService**（隐藏 key，统一限流与缓存策略）。

### 6.1 配置约定
- 后端配置高德 key（不下发到前端）
- 建议后端对高德响应做轻量归一化（字段/坐标/错误码），统一返回本系统错误码

### 6.2 GET /map/poi/nearby（附近 POI）
- **用途**：面试详情页“附近咖啡/休息场所”
- **Auth**：是
- **Query**
| 参数 | 类型 | 必填 | 示例 | 说明 |
| --- | --- | --- | --- | --- |
| lat | number | 是 | 39.98 | GCJ-02 |
| lng | number | 是 | 116.31 | GCJ-02 |
| type | string | 是 | coffee | `coffee|hotel|rest` 等 |
| radius | number | 否 | 1500 | 米，默认 1500 |
| limit | number | 否 | 10 | 默认 10 |

- **Response**
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "list": [
      {
        "poiId": "amap_xxx",
        "name": "某某咖啡",
        "address": "北京市海淀区...",
        "location": { "lat": 39.981, "lng": 116.312, "coordSystem": "gcj02" },
        "distance": 320
      }
    ]
  }
}
```

### 6.3 GET /map/nav/link（导航链接生成）
- **用途**：“导航前往”生成可在小程序中使用的导航参数/链接
- **Auth**：是
- **Query**：`lat,lng,name,address`（目的地）
- **Response**
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "amapUri": "amapuri://route/plan?...",
    "amapWebUrl": "https://uri.amap.com/navigation?...",
    "tips": "前端可优先使用 wx.openLocation 或 WebView 打开 amapWebUrl"
  }
}
```

---

## 7. 运营配置（可配）

### 7.1 GET /config/risk
- **用途**：风险阈值/文案可配置（便于运营调整）
- **Auth**：是（或否，视安全要求）
- **Response（示例）**
```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "labels": {
      "green": "建议投递",
      "yellow": "待核实",
      "red": "高风险"
    },
    "display": {
      "homeBlockedCountText": "已为你屏蔽 200+ 高风险岗位"
    }
  }
}
```

---

## 8. 埋点上报（Analytics）

### 8.1 POST /events（批量上报）
- **用途**：客户端批量上报关键行为事件
- **Auth**：是
- **Body**
```json
{
  "events": [
    {
      "event": "job_list_view",
      "ts": "2026-01-14T10:00:00+08:00",
      "props": { "q": "前端", "education": "bachelor" }
    }
  ],
  "client": {
    "platform": "wechat_mp",
    "sessionId": "s_xxx",
    "appVersion": "1.0.0"
  }
}
```
- **Response**：`code=0`

---

## 9. 联调数据要求（用于验收）
后端至少准备：
- 岗位列表：不少于 10 条，覆盖 `riskLevel=green/yellow/red`，且 yellow/red 至少各 2 条带多条原因
- 面试列表：至少 4 条，覆盖 `upcoming/completed`，且包含带 location 的记录
- 地图代理：返回附近 POI 列表不少于 5 条

---

## 10. 待你确认的点（请逐条确认后再冻结）
1. `order` 的精确定义：`established_asc` 是 “成立时间从久到新（年份小→大）” 吗？
2. `salaryMin/salaryMax` 单位：是否统一 **元/月**？（建议是）
3. 面试 `status` 是否需要 `canceled`？若需要，取消原因是否要字段？
4. 运营配置接口是否需要缓存策略（如 10 分钟）与版本号字段（`etag`/`version`）？

