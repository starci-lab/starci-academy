import React from "react"
import { EnumChip, type EnumChipEntry } from "@sb-components/composites/chips/EnumChip/EnumChip"
import { LinkBack } from "@sb-components/atoms/navigation/Link/Link"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { RichText } from "@sb-components/composites/viewers/RichText/RichText"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ChallengeHeader`: the CHALLENGE IDENTITY block, answering "what is
 * this challenge, and where do I stand on it" at the top of the solve page.
 *
 * SIBLING OF `ContentHeader`, NOT AN EDIT OF IT. Both place identity into the
 * same `PageHeader` frame, but they answer different questions with different
 * domain fields: a lesson header carries read state / reading time / challenge
 * count / outcomes, a challenge header carries score / difficulty / pass-fail
 * status. Same frame, different domain — reaching into `ContentHeader` and
 * bolting on `difficulty` would have blurred two distinct identities into one
 * prop union; a new block is the correct move (task brief, 2026-07-28).
 *
 * TWO CHIPS ON PURPOSE — a deliberate departure from `ContentHeader`'s "one
 * chip per cluster" (`starci-fe/no-adjacent-chip`, ≥2 sibling `<Chip>` in one
 * cluster). That rule exists to stop ONE fact from getting weighed twice next
 * to unrelated quiet facts. Here `difficulty` and `status` are two SEPARATE
 * classifying axes of the same challenge — difficulty is a property of the
 * CHALLENGE itself (fixed, always known), status is a property of the
 * LEARNER's attempt (may not exist yet) — neither is a duplicate of the
 * other, so both earn a chip. The lint rule itself only matches literal
 * `<Chip>` siblings; composing through two `<EnumChip>` elements does not
 * trip it, and the judgement call above is the actual reason it is safe to.
 * `scoreValue` stays quiet muted text (§14d.1: the block adds "điểm" itself)
 * because a raw number is not a classifying fact.
 *
 * BACK LINK, NOT BREADCRUMBS. `ContentHeader` shows a full trail because a
 * lesson is always reached through its course's outline. A challenge is
 * reached from exactly one place — the lesson that owns it — so a single
 * `LinkBack` ("← Back to {lesson}") is the correct affordance, not a chain
 * component built for N-deep navigation.
 *
 * SKELETON MIRROR FOR `LinkBack` — `LinkBack` (unlike `Breadcrumbs`) has no
 * `isSkeleton` of its own (§12g: it has no data-shaped prop that would need
 * one). Same move `ContentHeader` uses for its title: this block calls
 * `Typography` directly, sized to approximate the real link's box, and feeds
 * the shimmer into `PageHeader`'s `breadcrumb` slot — the flag still reaches
 * a real atom, just from a different caller.
 *
 * DIFFICULTY SIMPLIFIED TO THREE TIERS (`easy`/`medium`/`hard`). The source
 * app's `ChallengeDifficulty` enum also carries `insane`/`expert` for a small
 * minority of challenges with a bespoke palette (cyan/yellow/red/purple/
 * fuchsia) outside `EnumChip`'s five-tone vocabulary. This compose-only spec
 * keeps the three tiers `EnumChip` can express cleanly; extend the map the
 * day a screen actually needs the top two tiers.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** How hard the challenge is — a property of the CHALLENGE, always known. */
export type ChallengeDifficulty = "easy" | "medium" | "hard"

/** Where the learner's own attempt stands — a property of the ATTEMPT, may not exist yet. */
export type ChallengeStatus = "completed" | "failed" | "inProgress"

/** Difficulty → chip presentation. The block owns this table (§14d.1: no caller-supplied color). */
const DIFFICULTY_MAP: Record<ChallengeDifficulty, EnumChipEntry> = {
    easy: { color: "success", label: "Dễ" },
    medium: { color: "warning", label: "Trung bình" },
    hard: { color: "danger", label: "Khó" },
}

/**
 * Attempt status → chip presentation.
 *
 * ⭐ AUDIT 2026-07-30 (feedback ChallengePage/Graded round-2): `failed` gets a
 * leading icon — a failed/not-passed verdict is a "quốc dân" symbol (cross),
 * not decoration. `completed`/`inProgress` stay text-only; extend the day a
 * screen actually asks for their icon too, not preemptively.
 */
const STATUS_MAP: Record<ChallengeStatus, EnumChipEntry> = {
    completed: { color: "success", label: "Đạt" },
    failed: { color: "danger", label: "Trượt", icon: "cross" },
    inProgress: { color: "warning", label: "Đang làm" },
}

/** Props for {@link ChallengeHeader}. */
export interface ChallengeHeaderProps {
    /** Fired when the back link is pressed — the block never owns routing, only the affordance. */
    onBackPress: () => void
    /** Full back-link label override; omit to fall back to `LinkBack`'s generic "Back". */
    backLabel?: string
    /** Challenge title. */
    title: string
    /** One-sentence summary of the challenge. */
    description?: string
    /**
     * Points this challenge is worth, in RAW NUMBER — the block adds the unit
     * itself ("{n} điểm", §14d.1). Omit when no score is defined yet.
     */
    scoreValue?: number
    /**
     * How hard the challenge is. Always required — every challenge has a fixed
     * difficulty tier independent of whether the learner has attempted it yet.
     */
    difficulty: ChallengeDifficulty
    /**
     * The learner's own attempt outcome. Omit when the learner has not
     * attempted this challenge — the status chip is not drawn at all rather
     * than showing a "not started" chip nobody asked for.
     */
    status?: ChallengeStatus
    /**
     * `true` → every composed atom switches to its own shimmer. The flag FLOWS
     * DOWN into the real atoms rather than building a parallel skeleton tree
     * (§12c).
     */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * The challenge identity cluster at the top of the solve page. See the file
 * header for why it is a sibling of `ContentHeader` rather than an edit of it.
 *
 * @param props - {@link ChallengeHeaderProps}
 */
const ChallengeHeader = ({
    onBackPress,
    backLabel,
    title,
    description,
    scoreValue,
    difficulty,
    status,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: ChallengeHeaderProps) => {
    return (
        <div data-anat-part={anatPart}>
            <PageHeader
                anatPart={showAnatomy ? "PageHeader" : undefined}
                breadcrumb={
                    isSkeleton ? (
                        <Typography size="sm" isSkeleton classNames={["w-1/4"]} anatPart={showAnatomy ? "LinkBack" : undefined} />
                    ) : (
                        <LinkBack
                            label={backLabel}
                            onPress={onBackPress}
                            anatPart={showAnatomy ? "LinkBack" : undefined}
                        />
                    )
                }
                title={
                    isSkeleton ? (
                        // `PageHeader` has no `isSkeleton` of its own, so the block calls the
                        // atom directly with the EXACT size/weight the frame uses for a title
                        // and feeds the result into the slot.
                        <Typography size="h3" weight="bold" isSkeleton anatPart={showAnatomy ? "Typography" : undefined} />
                    ) : (
                        <span data-anat-part={showAnatomy ? "Typography" : undefined}>{title}</span>
                    )
                }
                description={
                    // AUDIT 2026-07-30 (feedback ChallengePage/Graded, round-1): field
                    // "one-sentence summary" là tầng "richtext nhỏ" — bọc RichText tại ĐÂY
                    // (call-site của block), không sửa `Page.tsx` dùng chung, vì
                    // `PageHeader.description` nhận `ReactNode` (nhiều consumer khác có thể
                    // truyền JSX thật, không phải string). Một quyết định duy nhất ở đây là
                    // "có hiện slot này không" (isSkeleton hoặc có description thật);
                    // `isSkeleton` sau đó CHẢY THẲNG xuống làm prop của RichText (§12c),
                    // không branching hai component khác nhau cho hai trạng thái.
                    isSkeleton || description != null ? (
                        <RichText
                            isSkeleton={isSkeleton}
                            text={description ?? ""}
                            color="muted"
                            anatPart={showAnatomy ? "RichText" : undefined}
                        />
                    ) : undefined
                }
                // AUDIT 2026-07-30 (feedback ChallengePage/Graded round-7, thầy chốt trả lời
                // điểm-1-còn-treo round-3: "đỏ dời qua bên trái, vàng dời qua sát đó, rồi gap
                // đều 3 cái này" — rồi sửa lại thứ tự: "chip nằm bên trái, plain text bên
                // phải"): bỏ `justify="between"` + StackH lồng hai tầng (từng đẩy score sang
                // mép trái, status/difficulty sang mép phải) — gộp thành MỘT hàng, cùng
                // `gap="related"`, đứng sát nhau bên trái, CHIP TRƯỚC (status, difficulty) rồi
                // mới tới score dạng chữ thường. Vẫn gỡ `prefixIcon={TrophyIcon}` (round-2) và
                // giữ thứ tự status trước difficulty (round-2).
                meta={
                    <StackH gap="related" align="center" anatPart={showAnatomy ? "StackH" : undefined}>
                        {isSkeleton ? (
                            <EnumChip
                                value="inProgress"
                                map={STATUS_MAP}
                                isSkeleton
                                anatPart={showAnatomy ? "EnumChip" : undefined}
                            />
                        ) : status != null ? (
                            <EnumChip
                                value={status}
                                map={STATUS_MAP}
                                anatPart={showAnatomy ? "EnumChip" : undefined}
                            />
                        ) : null}
                        {isSkeleton ? (
                            <EnumChip
                                value="easy"
                                map={DIFFICULTY_MAP}
                                isSkeleton
                                anatPart={showAnatomy ? "EnumChip" : undefined}
                            />
                        ) : (
                            <EnumChip
                                value={difficulty}
                                map={DIFFICULTY_MAP}
                                anatPart={showAnatomy ? "EnumChip" : undefined}
                            />
                        )}
                        {isSkeleton ? (
                            <Typography size="xs" color="muted" isSkeleton classNames={["w-1/4"]} anatPart={showAnatomy ? "Typography" : undefined} />
                        ) : scoreValue != null ? (
                            <Typography
                                size="xs"
                                color="muted"
                                text={`${scoreValue} điểm`}
                                anatPart={showAnatomy ? "Typography" : undefined}
                            />
                        ) : null}
                    </StackH>
                }
            />
        </div>
    )
}

export { ChallengeHeader }
