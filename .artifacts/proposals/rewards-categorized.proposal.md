# Proposal — Cửa hàng Coin chia hạng mục (rewards-categorized)

> Layout brainstorm 2026-07-17. Route `/vi/rewards` tab "Cửa hàng". Thầy: *"cho trang này chia nhiều hạng mục ra"*.
> Prototype: `.artifacts/prototypes/rewards-categorized/index.html` — host :8086 (8080 bận). Marker verified.

## Flow / surface
Trang Rewards = `RewardsPage` (page-level, route riêng) với **2 tab**: **Cửa hàng** (`RewardCatalog`) · **Ví của tôi** (`MyVouchers`). Feedback CHỈ đụng tab **Cửa hàng** — hiện là 1 **grid phẳng** mọi reward trộn lẫn (streak freeze, AI credit, voucher, sticker, áo thun). Tab "Ví của tôi" giữ nguyên.

## JOB → SHELL
- JOB = **browse + redeem** catalog (duyệt theo nhóm, so giá Coin, đổi). Shell = **page đọc/duyệt** (đã có `PageHeader` + breadcrumb + coin-balance chip + tabs). Không đổi shell — chỉ **cấu trúc lại nội dung catalog thành SECTION theo hạng mục**.

## Trần dữ liệu (data ceiling)
| | |
|---|---|
| **Đang render** | grid phẳng: mọi reward (`key/title/description/cost/kind/voucher?/aiCredit?`) 1 lưới, không nhóm |
| **Persist CHƯA vẽ** ⭐ | field **`kind`** (`digital \| physical \| voucher \| aiCredit`) — ĐÃ fetch trong `QueryRewardData.kind` nhưng KHÔNG dùng để nhóm. Đây là trục hạng mục có sẵn |
| **Compute** | group client-side theo `kind` (0 SQL, 0 schema) |

→ **Build matrix: 🟢 render-là-xong (FE-only).** Không đụng BE.

## Zones (tab Cửa hàng)
1. PageHeader (title "Cửa hàng Coin" + breadcrumb + description) — GIỮ.
2. Coin-balance chip — GIỮ.
3. Tabs (Cửa hàng / Ví của tôi) — GIỮ.
4. **[MỚI] Catalog = N SECTION theo hạng mục** — mỗi section:
   - **Header** = icon-tile (theo hạng mục) + tiêu đề + subtitle 1 dòng.
   - **Grid** reward card (2-col desktop → 1-col mobile).

### Hạng mục (map từ `kind`, thứ tự + nhãn curated)
| Section | kind gộp | Items ví dụ | Subtitle |
|---|---|---|---|
| ⚡ **Tăng tốc học tập** | `aiCredit` + `digital` | Nạp hạn mức AI · Đóng băng chuỗi | "Trợ lực học — hạn mức AI & giữ chuỗi." |
| 🎟️ **Ưu đãi khóa học** | `voucher` | Voucher giảm 10% | "Mã giảm giá đăng ký khóa mới." |
| 🎁 **Quà tặng & Merch** | `physical` | Sticker · Áo thun | "Vật phẩm StarCi gửi tận tay." |

*(Điểm chờ thầy chốt: gộp `aiCredit`+`digital` thành 1 section "Tăng tốc" như trên, HAY tách 4 section đúng 4 kind. Prototype đang gộp 3.)*

## State-matrix + conversion lens
- **loading** → skeleton grid mirror (giữ cấu trúc section).
- **N (có data)** → sections. Section RỖNG (course không có kind đó) → ẩn hẳn (no dead header).
- **affordable vs không đủ Coin** → button "Đổi ngay" (primary) vs "Không đủ Coin" (disabled `danger-soft`/muted). **1 primary/card.**
- **CTA/psych HONEST:** coin balance ở đầu = goal-gradient ("còn X Coin nữa"); KHÔNG fake scarcity. Reward vật lý cần địa chỉ → form khi redeem (ModalShell, đã có).
- **empty toàn catalog** (hiếm) → EmptyState "Chưa có phần thưởng" + link về học kiếm Coin.

## Block briefs (element-aware)
- Section = **`LabeledCard`** (label ngoài + `IconTile` header). — canonical.
- Reward card = **`Card`** + `IconTile` + title/desc + cost chip + redeem `Button`. (Giữ card hiện có, chỉ bọc trong section.)
- Icon hạng mục = **`IconTile`** (accent-soft).
- Grid = `grid grid-cols-1 sm:grid-cols-2 gap-*`.

## Files to touch (build)
- `src/components/features/rewards/RewardsPage/RewardCatalog/index.tsx` — group `rewards` theo `kind` → map thành sections `LabeledCard` (thay `.map` phẳng). Thêm bảng `KIND_SECTION` (label + icon + order + kind-gộp).
- i18n vi/en: `rewards.section.*` (label + subtitle mỗi hạng mục).
- KHÔNG đụng BE, KHÔNG đụng tab "Ví của tôi".

## Verify plan
tsc/eslint · runtime: mỗi hạng mục hiện đúng reward theo `kind`; section rỗng ẩn; affordable/không-đủ đúng; mobile 1-col; skeleton mirror.

## Component → Storybook
| Component | Story | Mới/Sửa | State demo |
|---|---|---|---|
| — | — | — | Không block canonical mới (LabeledCard/Card/IconTile đã có story); RewardCatalog là feature-component không story riêng |

## Nguồn tham khảo
- Data ceiling: `src/modules/api/graphql/queries/types/rewards.ts` (field `kind`) · `RewardCatalog/index.tsx` (render phẳng hiện tại).
- Canon: axis-3-layout (JOB→SHELL page duyệt) · axis-2-biz-ui (LabeledCard/Card/IconTile) · card.md (section = LabeledCard label-ngoài).
- KHÔNG có `.artifacts/concepts/rewards` — intent rõ từ feedback + `kind` có sẵn nên không cần hỏi thêm (trừ điểm gộp-section ở trên).
