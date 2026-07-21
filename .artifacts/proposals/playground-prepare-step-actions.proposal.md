# Proposal — PlaygroundPrepare: hàng hành động của step card + 8 state

> **Trạng thái:** ⏳ PENDING (thầy chốt 2026-07-20, phương án **A**)
> **Prototype:** `.artifacts/prototypes/playground-prepare-states/index.html` (host :8081)
> **Bàn giao cho:** `starci-fe-build`

---

## 1. Phạm vi

**CHỈ** card step trong `PlaygroundPrepare` — trọng tâm là step `pair` ("1. Cấu hình StarCi Agent"),
nơi có 2 nút. Các khối khác của trang Setup (card "Tiếp tục", ribbon "Máy của bạn", callout GPU,
"Trạng thái máy") **không đụng tới** trong lượt này.

Surface: `/[locale]/courses/[courseId]/learn/playground/[slug]` (Setup).
Shell **giữ nguyên**: cột đọc xếp chồng (`flex flex-col gap-6`) — Setup là đọc-và-chuẩn-bị,
không phải 2-pane full-bleed của Lab. Không đổi route, không đổi thứ tự khối.

## 2. Vấn đề (đã chẩn đoán từ source)

Card step hiện xếp **7 tầng dọc**, 2 nút bị dòng hint chen giữa. Đây là **lỗi cấu trúc**, không phải style:

| Nút | Sinh ở đâu | Hệ quả |
|---|---|---|
| `Lấy mã mới` | trong `step.body` → `renderPairBody()` ([index.tsx:350](../../src/components/features/learn/Playground/PlaygroundPrepare/index.tsx#L350)) | `self-start`, 1 dòng riêng |
| `Kiểm tra lại` | trong footer dùng chung mọi step ([index.tsx:595](../../src/components/features/learn/Playground/PlaygroundPrepare/index.tsx#L595)) | `self-start`, 1 dòng riêng |

Không chỗ nào trong cây render "biết" step này có 2 nút → không thể gom thành hàng bằng CSS.

**Nguồn drift:** prototype `playground-pairing-code-states` (cùng ngày) vẽ mỗi state chỉ 1 nút.
Canon sau đó đổi luật *"Lấy mã mới available at ALL times, not only after expiry"*
([features/playground.md](../../../starci-academy-backend/.claude/fe/features/playground.md)),
code thêm nút vào mọi state, nhưng không ai vẽ lại → đúng bẫy [[three-layer-sync-truth-story-ui]].

## 3. Phương án CHỐT — A: hàng hành động cuối card

Card step thành **4 vùng cố định** cho MỌI step:

```
explain + StatusChip        ← hàng ngang, giữ nguyên
step.body                   ← code block / tabs OS / bảng tier
meta                        ← countdown + hint GỘP 1 dòng
actions                     ← hàng nút, KHÔNG wrap        ★ mới
[kết quả]                   ← checkNoAgent | envReport.detail (dưới actions)
```

### Thay đổi cấu trúc
1. Thêm field `actions?: React.ReactNode` vào type `setupSteps` (cạnh `hideCheck`).
   `renderRefreshCodeButton()` **rời khỏi** `renderPairBody()`, gắn vào `pairStep.actions`.
2. Footer render **1 hàng duy nhất**: `<div className="flex items-center gap-2">` chứa
   nút check (nếu `!hideCheck`) rồi `step.actions`. **KHÔNG `flex-wrap`** (`button.md §6`).
   Mobile: mỗi nút `flex-1 min-w-0`, nhãn `truncate`.
3. Gộp countdown + hint thành 1 dòng meta. Vế countdown giữ khả năng đổi tông danger khi ≤60s
   (`PAIR_CODE_URGENT_SECONDS`), vế hint luôn muted.
4. Bỏ `className="self-start"` khỏi cả 2 nút (hàng flex đã lo).

### Vai nút (sửa lệch canon)
- `Kiểm tra lại`: `secondary` → **`tertiary`**. Theo `button.md §1`: nút phụ **đứng một mình,
  không có primary trong cụm** = tertiary. Primary duy nhất của màn là "Bắt đầu playground"
  ở card "Tiếp tục" trên cùng — không nằm cùng cụm nên không được mượn sức.
- `Lấy mã mới`: giữ **`danger-soft`** (phá mã đang chạy, nhưng lặp lại được — `button.md §4`).
- Thứ tự trong hàng: `[Kiểm tra lại] [Lấy mã mới]` — hành động mong đợi trước, đường cứu sau.
  State ④ (hết hạn) chỉ còn `[Lấy mã mới]`, vẫn cùng khuôn.

### Sửa kèm — `button.md §6c`
Cả 2 nút đang tự chế `isDisabled={...}` + ternary spinner. Đổi sang prop **`isPending`** của HeroUI
+ spinner qua **render-prop children** (`{({ isPending }) => …}`), `<Spinner size="sm" color="current" />`.
HeroUI KHÔNG tự render spinner — vẫn phải đặt tay (ref: [[feedback-heroui-ispending-needs-manual-spinner]]).

### Bỏ dòng cảnh báo thường trực (state ⑤)
`playground.prepare.pairCodeRefreshWhileConnected` hiện render **thường trực** khi `agentConnected`.
→ Chuyển thành **ConfirmDialog lúc bấm** "Lấy mã mới", **tone `default`** (không `danger` — luật đã chốt:
danger chỉ cho delete/undo). Lý do: state ⑤ là state học viên ở lại lâu nhất, mà cảnh báo chỉ có nghĩa
**tại khoảnh khắc bấm**; để thường trực = trả phí thị giác mọi lúc cho hệ quả hiếm.
Key i18n tái dùng làm body dialog.

## 4. State matrix — 8 state của card

| # | State | Điều kiện | Render |
|---|---|---|---|
| ① | Đang tạo mã | `isRefreshingPairingCode && !pairCommand` | **skeleton** khối lệnh; 2 nút disabled, refresh có spinner |
| ② | Mã còn hạn | `secondsLeft > 60 && !expired && !connected` | lệnh + meta (countdown muted) + 2 nút |
| ③ | Sắp hết hạn | `secondsLeft ≤ 60` | như ② nhưng vế countdown tone danger |
| ④ | Hết hạn | `pairingCodeExpired` | **bỏ** khối lệnh, **bỏ** nút check (`hideCheck`), **bỏ** hint; chỉ dòng lỗi + `[Lấy mã mới]` |
| ⑤ | Đã pair | `readyById.get("agent")` | chip success; countdown biến mất; meta chỉ còn hint; 2 nút; **confirm khi bấm refresh** |
| ⑥ | Đang kiểm tra | `checking === step.id` | nút check `isPending` + spinner + nhãn "Đang kiểm tra…" |
| ⑦ | Bấm check khi chưa pair | `checkError === step.id && !agentConnected` | dòng `checkNoAgent` tone danger **DƯỚI** hàng nút |
| ⑧ | Đang lấy mã mới | `isRefreshingPairingCode` | skeleton lệnh; 2 nút disabled, refresh có spinner |

**Tổ hợp KHÔNG THỂ xảy ra** (khỏi vẽ): *hết hạn + đã pair*. Công thức
`pairingCodeExpired = pairingExpiresAtMs && !connected && now >= expires` có sẵn `!connected`,
nên pair xong là hạn tự sập về `false` và countdown về `null`.

**State ① hiện CHƯA có** — code render `pairCommand` ngay cả khi chưa có mã → học viên có thể copy
lệnh cụt. Đây là state mới, không phải relayout.

### Conversion lens
- **CTA**: card này **không** mang CTA chính (primary = "Bắt đầu playground" ở card trên). Đúng
  `button.md §1` "tối đa 1 primary/surface" — không được nâng nút nào ở đây lên primary.
- **Không ngõ cụt**: state ④ (hết hạn) là ca dễ thành ngõ cụt nhất → giữ đúng 1 hành động cứu được
  (`Lấy mã mới`), bỏ mọi affordance chắc chắn thất bại.
- **Honest**: state ⑦ phải nói rõ "chưa nối được agent" thay vì im lặng như "đã kiểm, chưa sẵn sàng"
  — hai ca cần hành động ngược nhau.

## 5. Block briefs (element-aware)

| Khối | Block THẬT | Ghi chú |
|---|---|---|
| Khung step | `blocks/cards/LabeledCard` | `label={`${i+1}. ${title}`}` — giữ nguyên |
| Chip trạng thái | `blocks/chips/StatusChip` | `tone` success/neutral — giữ nguyên |
| Khối lệnh | `blocks/rendering/MarkdownContent` | fence bash; **KHÔNG** `codeElevated` (nằm trong `bg-surface` → surface-in-surface) |
| Skeleton lệnh ① | `blocks/…/Skeleton` | **cần xác nhận block tên gì** khi build; mirror radius khối code |
| Nút | HeroUI `Button` | `tertiary` + `danger-soft` |
| Confirm ⑤ | `ConfirmDialog` | tone `default` |
| Tabs OS (step install) | `blocks/navigation/ExtendedTabs` | không đụng |

## 6. Files to touch

- `src/components/features/learn/Playground/PlaygroundPrepare/index.tsx` — toàn bộ mục 3.
- `src/messages/{vi,en}.json` — gộp countdown+hint có thể cần 1 key mới (hoặc ghép tại render bằng `·`);
  key `pairCodeRefreshWhileConnected` đổi vai thành body của ConfirmDialog (giữ nguyên chữ).
- `.storybook/stories/features/learn/Playground/PlaygroundPrepare/PlaygroundPrepare.stories.tsx` — bảng §7.

## 7. Bảng component → Storybook

| Component | Story | Mới / Sửa | State demo |
|---|---|---|---|
| `PlaygroundPrepare` | `PlaygroundPrepare.stories` | **sửa** `Pending` | hàng nút 1 dòng (state ②) |
| `PlaygroundPrepare` | `PlaygroundPrepare.stories` | **sửa** `PairCodeExpiring` | state ③ — meta gộp, vế countdown danger |
| `PlaygroundPrepare` | `PlaygroundPrepare.stories` | **sửa** `PairCodeExpired` | state ④ — hàng nút còn 1 nút |
| `PlaygroundPrepare` | `PlaygroundPrepare.stories` | **sửa** `AllReady` | state ⑤ — bỏ dòng cảnh báo thường trực |
| `PlaygroundPrepare` | `PlaygroundPrepare.stories` | **mới** `PairCodeMinting` | state ① — skeleton lệnh |
| `PlaygroundPrepare` | `PlaygroundPrepare.stories` | **mới** `CheckingStep` | state ⑥ — `isPending` + spinner |
| `PlaygroundPrepare` | `PlaygroundPrepare.stories` | **mới** `CheckRefusedNoAgent` | state ⑦ — `checkNoAgent` dưới hàng nút |
| `PlaygroundPrepare` | `PlaygroundPrepare.stories` | **mới** `RefreshingPairCode` | state ⑧ |

Story mới đẩy `tags: ['news']` + caption "Chờ duyệt".
Story hiện có không đụng: `HighVram`, `AwaitingProbe`, `NoGpu`, `Infra`, `InfraKubernetes`, `EnglishGuide`.

## 8. Verify plan

1. `tsc --noEmit` sạch trên file đã sửa (repo có nền lỗi sẵn ở `apps/` — lọc theo file).
2. `eslint` sạch trên file đã sửa.
3. Storybook: 8 story render đúng 8 state; soi mắt hàng nút **1 dòng** ở mọi state, mobile viewport
   không wrap.
4. Runtime thật `/vi/courses/devops-mastery/learn/playground/docker`:
   - state ② ngay khi vào trang;
   - bấm "Kiểm tra lại" khi chưa chạy npx → phải ra dòng `checkNoAgent` (state ⑦), **không** spinner;
   - chạy `npx` → state ⑤, countdown biến mất, bấm "Lấy mã mới" → **hiện confirm**, huỷ thì không mint.
5. Đợi mã quá 15 phút (hoặc chỉnh TTL local) → state ④: mất khối lệnh + mất nút check.

## 9. Nguồn tham khảo

- Source: `PlaygroundPrepare/index.tsx` (đọc full 647 dòng) · `PlaygroundSessionProvider/index.tsx` ·
  `usePlaygroundByomSocketIo.ts` · `[slug]/page.tsx` (call site).
- Canon (read-only): `.claude/fe/components/button.md` §1/§4/§6/§6c ·
  `.claude/fe/features/playground.md` · `.claude/fe/principles/design-restraint.md` ·
  `.claude/fe/principles/instructions-anchor-on-command-checkable-signals.md` ·
  `.claude/fe/layouts/centered-form-setup.md`.
- Prototype cũ kế thừa: `.artifacts/prototypes/playground-pairing-code-states/`.
- i18n: `src/messages/{vi,en}.json` namespace `playground.prepare.*`.
- **KHÔNG** dùng web.

## 10. Ghi chú cho người build

⚠️ Trong `usePlaygroundByomSocketIo`, khi mất kết nối thì `connected`/`latencyMs` bị xoá nhưng
`deviceInfo`/`envReport` **giữ giá trị cũ** (không handler nào clear). Đây là cơ chế cho phép resume —
**đừng "sửa" thành clear**. Nó sinh ra state "xanh cũ" ở khối "Trạng thái máy"
(agent đỏ nhưng engine/device vẫn xanh theo báo cáo cuối). **Ngoài phạm vi lượt này**, đã báo thầy,
chưa chốt hướng xử lý.
