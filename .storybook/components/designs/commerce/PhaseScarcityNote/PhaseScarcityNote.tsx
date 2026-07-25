import React from "react"
import { cn } from "@heroui/react"
import { WarningCircleIcon } from "@phosphor-icons/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * DESIGN — `PhaseScarcityNote.Base`: dòng khan-hiếm THẬT của một phase giá.
 *
 * Mang WHY (§14d): "còn N suất giá {phase} · giá tăng lên {X} sau đó" — thúc mua
 * bằng dữ kiện CÓ THẬT từ backend, không phải bằng đồng hồ đếm ngược bịa.
 *
 * Namespace một-component ⇒ `.Base` (thầy chốt 2026-07-25).
 *
 * ⚠️ Bản `_legacy` tự ghi chú "does NOT compose any primitive" — nó hand-roll
 * `<span className="text-sm">` cho cả hai vế chữ. Port này SỬA: chữ đi qua atom
 * `Typography` (§9 — cỡ/đậm là việc của atom, không rải class ở đây).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** The course's pricing phases (inlined from `@/modules/types/enums/pricing-phase`). */
export enum PricingPhase {
    Pioneer = "pioneer",
    EarlyBird = "early_bird",
    Regular = "regular",
}

/** Localised phase display name (inlined from `courseLanding.phase.*`, vi). */
const PHASE_LABEL: Record<PricingPhase, string> = {
    [PricingPhase.Pioneer]: "Tiên phong",
    [PricingPhase.EarlyBird]: "Sớm",
    [PricingPhase.Regular]: "Tiêu chuẩn",
}

/** Props for {@link PhaseScarcityNote.Base}. */
export interface PhaseScarcityNoteBaseProps {
    /** Phase giá hiện tại của khoá (hiện nhãn của nó). */
    currentPhase: PricingPhase
    /** Số suất còn ở giá phase này; `null` = không giới hạn → KHÔNG render gì. */
    seatsRemaining: number | null
    /** Giá VND sau khi phase này bán hết; `null` = không có mức tăng để nói. */
    nextPhasePriceVnd: number | null
    /** Extra classes on the root. */
    className?: string
    /** Storybook-only: emit `data-anat-part` on each anatomy part. */
    showAnatomy?: boolean
}

/**
 * Dòng khan-hiếm trung thực cho paywall. Nằm như EM RUỘT bên dưới `PriceTag`
 * (PriceTag lo giảm giá; khan hiếm là trục thúc khác, trực giao).
 *
 * Chỉ render khi phase hiện tại có **trần ghế thật** (`seatsRemaining != null`) —
 * phase không giới hạn thì không có mốc "tăng-khi" trung thực nào để nói, nên im
 * lặng. MỌI con số đến từ `coursePricePreview` của backend — file này TUYỆT ĐỐI
 * không bịa đếm ngược hay số ghế (khan hiếm giả là dark pattern bị cấm).
 *
 * @param props - {@link PhaseScarcityNoteBaseProps}
 */
const PhaseScarcityNoteBase = ({
    currentPhase,
    seatsRemaining,
    nextPhasePriceVnd,
    className,
    showAnatomy,
}: PhaseScarcityNoteBaseProps) => {
    // không có trần ghế ở phase này → không có cớ khan hiếm trung thực → im lặng
    if (seatsRemaining == null) {
        return null
    }

    return (
        // Màu đặt Ở KHUNG; chữ bên trong KHÔNG khai `color` để thừa hưởng
        // `currentColor` — giữ đúng tone `warning-soft-foreground` của bản gốc.
        <div className={cn("flex flex-wrap items-center gap-2 text-warning-soft-foreground", className)}>
            <WarningCircleIcon
                aria-hidden
                focusable="false"
                className="size-4 shrink-0"
                data-anat-part={showAnatomy ? "WarningCircleIcon" : undefined}
            />
            <Typography.Base
                size="sm"
                weight="medium"
                text={`Còn ${seatsRemaining} suất giá ${PHASE_LABEL[currentPhase]}`}
                anatPart={showAnatomy ? "SeatCountLine" : undefined}
            />
            {nextPhasePriceVnd != null ? (
                <>
                    <Typography.Base
                        size="sm"
                        text="·"
                        anatPart={showAnatomy ? "Separator" : undefined}
                    />
                    <Typography.Base
                        size="sm"
                        text={`giá tăng lên ${nextPhasePriceVnd.toLocaleString("vi-VN")}₫ sau đó`}
                        anatPart={showAnatomy ? "PriceRiseClause" : undefined}
                    />
                </>
            ) : null}
        </div>
    )
}

/** `PhaseScarcityNote.*` — namespace một-component ⇒ chỉ có `.Base`. */
export const PhaseScarcityNote = Object.assign(PhaseScarcityNoteBase, {
    Base: PhaseScarcityNoteBase,
})
