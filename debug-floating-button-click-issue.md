# Debug Session: floating-button-click-issue

## Status: [OPEN]

## Problem Description
- **Symptom**: 点击浮窗按钮后不显示底部菜单栏
- **Expected**: 点击绿色"+"按钮后，应该展开底部菜单栏（5列 x 2行网格布局）
- **Actual**: 点击按钮后，菜单栏不显示，按钮可能变为收起状态或无反应

## Hypotheses (To be verified)
1. H1: `isDragging` 状态在点击时意外设置为 `true`，导致点击逻辑被跳过
2. H2: `isCollapsed` 状态错误，导致展开菜单的逻辑被阻断  
3. H3: `clickThreshold` 阈值设置太小（5px），导致鼠标移动超过阈值被判定为拖拽
4. H4: `handleMouseUp` 事件处理器没有正确触发或参数类型错误（MouseEvent vs React.MouseEvent）
5. H5: React 事件系统和 document 事件系统之间存在冲突，导致事件重复触发

## Instrumentation Plan
- Add debug logs to track: isDragging, isCollapsed, distance, clickThreshold, handleMouseUp execution
- Observation points:
  - DP1: handleMouseDown - 记录起始位置和isDragging设置
  - DP2: handleMouseUp - 记录distance计算和点击判定逻辑
  - DP3: setIsMenuOpen调用 - 验证是否真的调用了展开菜单

## Debug Server
- Port: 9030
- URL: http://localhost:9030
- Env file: .dbg/floating-button-click-issue.env

## Timeline
- [2026-06-26] Session started