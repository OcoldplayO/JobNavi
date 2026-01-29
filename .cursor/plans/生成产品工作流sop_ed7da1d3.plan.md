---
name: 生成产品工作流SOP
overview: 整理产品工作流SOP文档，包含从需求洞察到上线验收的全流程图与分阶段检查清单
todos:
  - id: generate-workflow-sop
    content: 生成 PRODUCT_WORKFLOW_SOP.md，包含 Mermaid 流程图和分阶段 Checklist
    status: completed
---

# 生成产品工作流 SOP 文档

## 1. 目标

整理一份标准化的产品经理工作流文档 (`PRODUCT_WORKFLOW_SOP.md`)，帮助你在新项目中按部就班推进，明确每个阶段的产出物、协作方和检查点。

## 2. 文档结构规划

### 2.1 流程图 (Mermaid)

- **阶段划分**：

1. 需求洞察与原型 (Insight & Prototype)
2. 需求评审与基线 (Requirement Review)
3. 技术评审与规格冻结 (Tech Review & Spec Freeze)
4. 开发与走查 (Development & Spot Check)
5. 测试验收与上线 (QA & Launch)

- **关键节点**：明确每个阶段的“里程碑”和“交付物”。

### 2.2 分阶段待办清单 (Checklist)

针对每个阶段，列出：

- **核心产出**：不仅是文档，更是决策（如“业务范围确定”）。
- **沟通对象**：该拉谁开会，该找谁确认。
- **自检问题**：避免返工的关键思考题。

## 3. 具体内容映射

- **P0 (启动)**：竞品/用户调研 → 原型草稿 (V0/AI) → PRD 初稿
- **P1 (需求)**：范围锁定 → 状态机/边界梳理 → 需求评审会
- **P2 (技术)**：API/数据字典/埋点方案 → 技术评审会 → 规格冻结
- **P3 (研发)**：Jira 拆解 → 开发规范对齐 → 中途 UI 走查
- **P4 (验收)**：验收用例执行 → Bug 修复验证 → 合规检查 → 上线

## 4. 输出文件

- `PRODUCT_WORKFLOW_SOP.md`

## 5. 执行步骤

- 直接生成包含上述内容的 Markdown 文件。