# responsive — the Switcher, container-driven

> Canon. Layout responsive dựa vào **CONTAINER width** (`@app-*` container query), không
> phải viewport. Một row/grid tự đổi hình khi track của nó hẹp, độc lập với màn hình.

## `at` — row wrap → single-line switch (StackH / ResponsiveRow)

`at` = **breakpoint container mà row chuyển từ wrap sang single-line**.
- `at` bỏ trống (`undefined`) → row **KHÔNG BAO GIỜ wrap** (= `wrap={false}` cũ).
- `at="sm"` → wrap dưới sm, single-line từ sm lên.
- ⚠️ Không có giá trị `at` nào cho "luôn wrap". Row muốn wrap trên mobile rồi single-line
  → chọn breakpoint (`sm`/`md`/`lg`/`xl`). Policy migration: `wrap={true}` cũ → `at="sm"`.

Render (Flex): `at != null && direction==="row"` → thêm `flex-wrap` + `@app-<at>:flex-nowrap`.
Cột (`StackV`) tự grow không bound → `at` vô nghĩa, không có.

## Switcher — row ↔ column theo container

`ResponsiveRow` / `ResponsiveCluster` = frame chuyển row (rộng) thành column full-width
(hẹp) tại một container-width có tên. Token: `stack-below` (patterns.mjs) — assert bằng
responsive-switch sweep, không phải một computed value đơn.

## Grid responsive

`Grid columns={{ base: 1, sm: 2, … }}` — số cột theo container step.

Xem [gap](gap.md), [split](../split.md).
