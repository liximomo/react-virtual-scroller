---
id: VirtualScroller
title: VirtualScroller
---

|Name|Type|Default|Description|
|:---|:---|:---|:---|
|items|any[]||Data list.|
|renderItem|function||`(item, index) => element`. Responsible for rendering a item. |
|viewport|object||A instance of [Viewport](Viewport.html).|
|identityFunction|function| a => a|`item => number or string`. return a unique identity for item.|
|offscreenToViewportRatio|number|1.8|Ratio to determine how height to render above/below the visible bounds of the list. |
|assumedItemHeight|number|400|Estimated average height of items.|
