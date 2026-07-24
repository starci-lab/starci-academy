import type { Meta, StoryObj } from "@storybook/nextjs"
import { PhaseScarcityNote, PricingPhase } from "./PhaseScarcityNote"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — the honest pricing-phase scarcity line under `PriceTag`: a warning icon +
 * "Còn N suất giá {phase}" + an optional "· giá tăng lên X₫ sau đó" clause. It composes
 * NO design-system primitive — just atom-level pieces (a phosphor icon + text) — and is
 * flagged "should be Primitive". Its leaves differ by SHAPE, not data: full (with the
 * price-rise clause) · seats-only (no next phase → clause absent) · unlimited (no seat
 * cap → renders nothing).
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN BlockAnatomy
 * axis (Sơ đồ + Cây) reflecting the pieces THAT leaf composes — there is no separate
 * consolidated "Anatomy" story.
 */
const meta: Meta<typeof PhaseScarcityNote> = {
    title: "Design/Commerce/PhaseScarcityNote",
    component: PhaseScarcityNote,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof PhaseScarcityNote>

/** Plain canvas wrapping each leaf's anatomy panel. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

// FULL shape — the root flex `div` (= the anatomy root node) holds these FLAT children in
// DOM order: icon + seat-count span, then a `·` separator span + the price-rise span (both
// gated by `nextPhasePriceVnd != null`, wrapped in a transparent fragment → NO real nesting).
const FULL_PARTS: Array<AnatomyNode> = [
    { name: "WarningCircleIcon", tier: "primitive", role: "icon cảnh báo khan hiếm suất", state: "warning" },
    { name: "Dòng số suất", tier: "primitive", role: "span \"Còn N suất giá {phase}\"" },
    { name: "Dấu ngăn cách", tier: "primitive", role: "span \"·\" ngăn cách (aria-hidden, trang trí) — chỉ hiện khi có giá kế tiếp" },
    { name: "Mệnh đề tăng giá", tier: "primitive", role: "span \"giá tăng lên {X}₫ sau đó\" — chỉ hiện khi có giá kế tiếp" },
]

// SEATS-ONLY shape: nextPhasePriceVnd null → the price-rise clause is ABSENT.
const SEATS_ONLY_PARTS: Array<AnatomyNode> = [
    { name: "WarningCircleIcon", tier: "primitive", role: "icon cảnh báo khan hiếm suất", state: "warning" },
    { name: "Dòng số suất", tier: "primitive", role: "câu \"Còn N suất giá {phase}\"" },
]

// UNLIMITED shape: seatsRemaining null → no honest scarcity trigger → renders nothing.
const UNLIMITED_PARTS: Array<AnatomyNode> = []

/** Plain baseline: a limited-seat phase with a real next-phase price rise. */
export const Default: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="PhaseScarcityNote"
                tier="design"
                leaf="Có tăng giá"
                parts={FULL_PARTS}
                reason="Dòng cảnh báo khan-hiếm-suất chỉ gồm một icon cảnh báo + một câu chữ — KHÔNG cấu thành từ primitive nào. Thực chất là một atom trình bày, nên bị đánh dấu &quot;đáng lẽ là Primitive&quot;. Vẫn port ở tier Block để giữ đủ bộ commerce; số suất + giá đều đến từ backend, block không tự bịa scarcity."
            >
                <PhaseScarcityNote
                    currentPhase={PricingPhase.Regular}
                    seatsRemaining={20}
                    nextPhasePriceVnd={3490000}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** Many seats left — same shape as Default, only the numbers change. */
export const ManySeats: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="PhaseScarcityNote"
                tier="design"
                leaf="Nhiều suất"
                parts={FULL_PARTS}
                note="Còn nhiều suất (42) — CÙNG composition với leaf 'Có tăng giá', chỉ khác con số."
            >
                <PhaseScarcityNote
                    currentPhase={PricingPhase.Pioneer}
                    seatsRemaining={42}
                    nextPhasePriceVnd={2490000}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** Few seats left — same shape, higher urgency by number alone. */
export const FewSeats: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="PhaseScarcityNote"
                tier="design"
                leaf="Ít suất"
                parts={FULL_PARTS}
                note="Ít suất (3) — sức ép khan hiếm cao hơn nhưng CÙNG composition (icon + suất + tăng giá)."
            >
                <PhaseScarcityNote
                    currentPhase={PricingPhase.EarlyBird}
                    seatsRemaining={3}
                    nextPhasePriceVnd={2990000}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** One seat left — the sharpest number, still the full shape. */
export const OneSeatLeft: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="PhaseScarcityNote"
                tier="design"
                leaf="Còn 1 suất"
                parts={FULL_PARTS}
                note="Suất cuối (1) — vẫn CÙNG composition, con số ở ngưỡng gấp nhất."
            >
                <PhaseScarcityNote
                    currentPhase={PricingPhase.EarlyBird}
                    seatsRemaining={1}
                    nextPhasePriceVnd={2990000}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** No next phase — the "giá tăng lên…" clause is absent (a part removed). */
export const NoNextPhase: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="PhaseScarcityNote"
                tier="design"
                leaf="Không có giá kế tiếp"
                parts={SEATS_ONLY_PARTS}
                note="nextPhasePriceVnd = null → mệnh đề 'giá tăng lên…' VẮNG, chỉ còn icon + dòng số suất."
            >
                <PhaseScarcityNote
                    currentPhase={PricingPhase.Regular}
                    seatsRemaining={15}
                    nextPhasePriceVnd={null}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** Unlimited — no seat cap → no honest scarcity trigger → renders nothing. */
export const Unlimited: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="PhaseScarcityNote"
                tier="design"
                leaf="Không giới hạn"
                parts={UNLIMITED_PARTS}
                note="seatsRemaining = null → không có trigger khan hiếm trung thực → block render RỖNG (null)."
            >
                <PhaseScarcityNote
                    currentPhase={PricingPhase.Regular}
                    seatsRemaining={null}
                    nextPhasePriceVnd={null}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}
