## 符合说明
pre(A), A 之前的某个元素
preAll(A), A 之前的全部元素
after(A), A 之后的某个元素
afterAll(A), A 之后的全部元素

## Case 1
A 处于 viewport 中, pre(A) 高度变化.
### Expectation
元素 A 相对 viewport 的位置不变.
### Solution
调节滚动条位置.

## Case 2
A 处于 viewport 中, after(A) 高度变化.
### Expectation
元素 A 相对 viewport 的位置不变.
### Solution
Do nothing
