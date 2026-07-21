# Proposal — Split-shell: cột trái responsive theo CONTAINER, không theo viewport

> Nguồn: thầy 2026-07-20 tại `/learn/content/...` với chat rail mở — *"cái chat bên phải bị lệch"* + *"bên trái là navbar, content; bên phải là ResizableRail; bên trái render kiểu mobile nếu ResizableRail kéo dài ra (hoặc chia đôi màn hình như phantom wallet)"*.
> Rule chi phối: [[expose-the-criterion-not-just-the-verdict]] không liên quan; đây là layout — xem [[fe/layouts]] + `when-rail`.

## 1. Vấn đề

Mở `ContentAiChatRail` rồi kéo rộng → cột trái bị bóp nhưng **vẫn render layout desktop**: navbar chen chúc, search bị cắt, nội dung vỡ nhịp. Thầy gọi là "lệch" — nhưng nguyên nhân không phải sai `top`/`sticky` (đã kiểm: `top-16` + `h-[calc(100dvh-4rem)]` trùng khớp `LearnSidebar` và left rail; container `LearnShell` đã có `items-start` nên không bị stretch).

Nguyên nhân thật đã được chính code tự thú trong `ContentAiChatRail`:

> *"pushing the WHOLE app into a narrow column breaks the app's **viewport-based responsive layout**"*

Rail hiện né vấn đề bằng cách **nằm dưới navbar** và giữ navbar full-width. Thầy muốn ngược lại: chia đôi thật sự (Phantom wallet / split-screen), navbar nằm TRONG nửa trái và nửa trái tự xuống chế độ mobile khi hẹp.

## 2. Vì sao không phải fix nhỏ

**CSS container query một mình KHÔNG đủ.** Đây là điểm dễ bị đánh giá thấp:

`src/hooks/reuseables/useSmViewpoint.ts` là `useMediaQuery` thuần **viewport**:

```ts
const isDesktop = useMediaQuery("(min-width: 1024px)")
```

Nó không quyết định *style*, nó quyết định **component nào được render** — drawer hay rail, mobile bar hay không. Dùng ở `learn/layout.tsx` + **10 drawer** (`ContentAiChatDrawer`, `MindMapNodeDrawer`, `MiniCartDrawer`, …).

Hệ quả: nếu chỉ đổi CSS sang `@container`, ta được trạng thái lai tệ hơn hiện tại — CSS bảo "hẹp, xếp kiểu mobile" trong khi JS vẫn bảo "desktop, render rail". Phải đổi **cả hai lớp cùng lúc**, nếu không sẽ vỡ.

## 3. Hướng đề xuất

Tailwind **v4** → `@container` có sẵn, không cần plugin. Codebase **đã có tiền lệ**: `GroupPressableCard` dùng `@container` + `@lg:` kèm comment *"Placement classes must use the container variant (`@lg:`), NOT the viewport"*. Bám chuẩn đó.

**Pha 1 — dời rail lên tầng shell.**
`ContentAiChatRail` đang là `rightRail` của `LearnShell` (dưới navbar). Nâng lên `InnerLayout` thành sibling của cả cột app:
```
InnerLayout
  flex row
    div.@container.flex-1   ← Navbar + children  (nửa TRÁI)
    ContentAiChatRail        ← full height, top-0 (nửa PHẢI)
```
Rail đổi `lg:top-16 h-[calc(100dvh-4rem)]` → `top-0 h-dvh`.

**Pha 2 — hook đo CONTAINER thay viewport.**
Thêm `useContainerBreakpoint` (ResizeObserver trên phần tử `@container`) + context, trả cùng shape `{ isMobile, isTablet, isDesktop }` để thay thế tại chỗ. Giữ `useSmViewpoint` cho surface ngoài shell (landing, auth) — **không xoá**, tránh đụng 10 drawer cùng lúc.

**Pha 3 — chuyển `lg:` → `@lg:` trong vùng trái.**
Quy mô đã đo: `LearnShell` 16 chỗ · `ContentAiChat` 4 chỗ · `Navbar` **0** (navbar không dùng breakpoint nào — nó co bằng flex, nên phần lớn sẽ tự co; rủi ro chính là cụm icon bên phải tràn).

**Pha 4 — nới `maxWidth`.**
`ResizableRail` hiện `maxWidth={640}`. Chia đôi thật thì cho tới `50dvw`.

## 4. Blast radius

| Vùng | Rủi ro |
|---|---|
| `InnerLayout` | 🔴 CAO — mọi route đi qua đây, không riêng learn |
| `useSmViewpoint` → container hook | 🔴 CAO — 10 drawer + learn layout; sai là drawer bung sai chỗ |
| `LearnShell` (16 `lg:`) | 🟠 vừa |
| `Navbar` | 🟠 vừa — 0 breakpoint nhưng cụm icon phải có thể tràn khi hẹp |
| `ContentAiChatRail` | 🟢 thấp — đổi vị trí mount + class |

## 5. Rủi ro cần chốt trước khi build

1. **Rail full-height che navbar** — khi rail lên `top-0`, logo/tài khoản chỉ còn ở nửa trái. Đúng ý Phantom, nhưng cần thầy xác nhận đây là chủ ý chứ không phải "mất navbar".
2. **Sticky trong container** — `position: sticky` neo theo scroll container gần nhất. Dời cây DOM có thể làm `LearnSidebar` + left rail mất sticky. Phải kiểm lại cả 3 rail.
3. **SSR** — container width chỉ biết sau khi mount ⇒ nhấp nháy layout lần đầu. Cần default hợp lý + `useLayoutEffect`.
4. **Chỉ learn hay toàn app?** — rail chat giờ app-wide (proposal `content-ai-chat-app-wide` đã DONE), nên split-shell có lẽ phải áp mọi route, không chỉ `/learn`.

## 6. Verify plan

- Kéo rail từ min → 50dvw: cột trái phải **chuyển sang layout mobile** (bottom bar, nav gộp) chứ không co dúm.
- 3 rail (`LearnSidebar`, left content-map, chat) vẫn sticky đúng khi cuộn.
- Thu viewport thật xuống mobile khi rail ĐÓNG: hành vi cũ không đổi (hồi quy).
- 10 drawer vẫn mở đúng chế độ.
- `tsc` + eslint sạch; story `ResizableRail` thêm state "kéo tới nửa màn".

## 7. Chờ thầy chốt

- [ ] Rail có được che navbar không (§5.1)?
- [ ] Áp toàn app hay chỉ `/learn` (§5.4)?
- [ ] Có giữ `useSmViewpoint` song song cho surface ngoài shell không, hay migrate hết một lượt?
