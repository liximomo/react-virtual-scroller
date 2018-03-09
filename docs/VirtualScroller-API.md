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
|nearStartProximityRatio|1.75|400|distance between start and nearStart / `viewport` height.|
|nearEndProximityRatio|0.25|400|distance between nearEnd and end / `viewport` height.|
|onAtStart|function|| `info => void` called when scroll to list start.|
|onNearStart|function||called when scroll to list near start.|
|onNearEnd|function||called when scroll to list near end.|
|onAtEnd|function||called when scroll to list end.|
