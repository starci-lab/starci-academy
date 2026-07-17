# Proposal — code-problems (render code UI mới)

> Redesign màn GIẢI BÀI của hệ **coding-practice** (System A: `coding_problems`, `/practice/[slug]`,
> Monaco + Judge0). Danh sách `/practice` GIỮ shell cũ. Prototype: `.artifacts/prototypes/code-problems/` (:8087).
> Thầy duyệt 2026-07-18 ("ok xử hết đi").

## Phạm vi (xác nhận)
- **HỆ A** (`/practice`, `coding_problems`, chấm test case tự động) — KHÔNG phải hệ B (`challenges` nộp GitHub URL).
- Trọng tâm = **màn solve** (`PracticeProblem`). List (`Practice`/`ProblemCatalog`/`ProblemRow`) giữ nguyên.

## Flow + shell per surface
| Surface | Route | JOB | Shell |
|---|---|---|---|
| List | `/[locale]/practice` | duyệt/lọc/chọn bài | rail + content (GIỮ) |
| **Solve** | `/[locale]/practice/[slug]` | đọc đề + viết code + chấm | **full-bleed 2-pane IDE resizable** (LEAF page → BackLink) |

## Zones — màn Solve (mới)
- **LEFT pane** (`flex 0 0 ~46%`, `border-r`, resizable): tab **Mô tả | Lời giải | Nộp trước** (`ExtendedTabs`).
  - Mô tả: header (BackLink · title · `StatusChip` difficulty+level · meta: điểm/limits/tags) → statement (`MarkdownContent`+`CodeToHtml`) → **IO example cards** → gợi ý (collapsible).
  - Lời giải: reveal-gated (`mutateRevealCodingSolution`) → code per-language (Shiki). TÁCH khỏi Mô tả.
  - Nộp trước: `SurfaceListCard` các lần nộp (thời gian · lang · verdict chip).
- **RIGHT pane** (`flex 1`): dọc = editor trên + console dưới.
  - Toolbar: language `SegmentedControl` + Reset-về-starter.
  - Editor: **Monaco** (GIỮ; telemetry anti-cheat GIỮ nguyên).
  - **Console** (`border-t`, ~38% cao): tab **Test case | Kết quả** + action bar.
    - Test case: sample IO (isSample), chọn case.
    - Kết quả: verdict chip lớn + **grid case ✓/✕** (render `perCaseResults`) + `StatGridCard` (passed·runtime·memory); case sai mở input·expected·got.
    - Action bar: **Chạy thử** (sample) · **Nộp bài** (primary, full hidden testcases).

## State-matrix + conversion lens (Solve)
| State | Console | CTA/psych |
|---|---|---|
| initial (chưa nộp) | tab Test case, sample hiện | primary "Nộp bài"; goal-gradient = progress ở list header |
| judging | `AIProcessingText` (realtime socket) | disable nút, spinner |
| accepted | grid all-✓, stats xanh | honest số thật; link "bài kế tiếp" (onward, không ngõ cụt) |
| wrong/CE | case sai đỏ + diff input/expected/got | không dark-pattern; chỉ rõ sai ở đâu để HỌC |
| history rỗng | `EmptyState` "chưa nộp lần nào" | mời nộp thử |

## Block briefs (element-aware)
| Block | Trạng thái | Ghi chú |
|---|---|---|
| `IOExampleCard` | **CẦN TẠO** (`blocks/…`) | card input/output mono, nhãn, copy — thay `<pre bg-default-100>` thô. Props: `{ label?, input, output }` hoặc slot rows. |
| `CodeConsole` | **CẦN TẠO** | khung tab Test case/Kết quả + action bar, ráp dưới editor. Presentational; feature feed data + handlers. |
| `TestCaseResultGrid` | **CẦN TẠO** | pill case ✓/✕ (pass/fail palette) + panel case chọn (input·expected·got). Render `perCaseResults` (parse JSON). |
| `PracticeProblem` | **SỬA** (rewrite shell) | 2-pane mới + BackLink + `ExtendedTabs` trái; giữ toàn bộ logic SWR/mutation/socket/telemetry đang có. |
| `StatGridCard` | tái dùng | passed·runtime·memory (item lẻ 3 → ô cuối span 2 nếu cần). |
| `ExtendedTabs` | tái dùng | tab trái (Mô tả/Lời giải/Nộp trước) + tab console. |
| `SurfaceListCard`/`Row`, `StatusChip`, `AIProcessingText`, `MarkdownContent`/`CodeToHtml`, `BackLink`, `EmptyState`, Monaco | tái dùng | giữ. |

## Data-ceiling map
| Field (BE, persisted) | Nay render? | Build matrix |
|---|---|---|
| `perCaseResults` (per-case status/time/mem, JSON) | ❌ **vứt đi** | **render-là-xong** (đã trả về `myCodingSubmissions`? — verify query select; nếu chưa expose → thêm field) |
| `runtimeMs` / `memoryKb` / `passedCount`/`totalCount` | 1 phần (dòng text) | render-là-xong → `StatGridCard` |
| `timeLimitMs` / `memoryLimitKb` | ❌ | render-là-xong (có trong `codingProblem`) |
| `tags` / `domain` | list có, detail ❌ | render-là-xong |
| **Chạy thử trên sample** (Run≠Submit) | ❌ chưa có | **ĐỔI SCHEMA/BE** — cần endpoint judge sample không tính điểm. **HOÃN**: build UI nút "Chạy thử" nhưng nối tạm submit-flow hoặc disable + note; mở BE sau. KHÔNG âm thầm bỏ. |

## Files to touch (dự kiến)
- Mới: `src/components/blocks/…/IOExampleCard/index.tsx`, `…/CodeConsole/index.tsx`, `…/TestCaseResultGrid/index.tsx` (+ stories `news`).
- Sửa: `src/components/features/practice/PracticeProblem/index.tsx` (rewrite shell, giữ logic), `PracticeProblemSkeleton` (mirror shell mới).
- i18n: bổ sung `codingPractice.*` (runVsSubmit, caseResult, expected/got, limits) vi/en.
- Verify query `queryMyCodingSubmissions`/`queryCodingProblem` có select `perCaseResults`/limits chưa; thiếu → thêm field GraphQL (FE query + BE response nếu chưa expose).

## Verify plan
- `npx tsc --noEmit` + eslint sạch (component + story mới).
- Runtime: `/vi/practice/<slug>` — nộp 1 bài, xem console đổi state (judging→accepted/wrong), grid case render đúng `perCaseResults`; resize 2-pane; mobile stacked.
- Story `news` cho 3 block mới (Chờ duyệt) trên Storybook.

## Bàn giao
- Build: `starci-fe-build code-problems`. Chạy-thử-BE = follow-up riêng (flag ở trên).
