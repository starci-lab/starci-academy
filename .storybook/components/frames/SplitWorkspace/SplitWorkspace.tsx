import type { ReactNode } from "react"
import { cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * FRAME (khung) — `SplitWorkspace`: the READ-COLUMN + STICKY-ASIDE workspace
 * shape — a brief/content column that grows, beside a fixed-width action column
 * that pins to the viewport once there's room for both side by side.
 *
 * ⭐ AUDIT 2026-07-30 (feedback ChallengePage/Graded, round-1): đổi nhãn tầng
 * "LAYOUT" → "FRAME" — file này nằm ở thư mục `frames/`, và `principles/
 * naming` §6 đã CHỐT (2026-07-29, đĩa làm trọng tài): `frame` = `frames/`,
 * `layout` = `<app>/layouts/`, hai tầng khác nhau. Cũng gỡ khai báo namespace
 * `.Base` giả bên dưới — file này export BARE thật (xác nhận qua mọi
 * call-site), không phải namespace.
 *
 * ⭐ WHY THIS KHUNG EXISTS (thầy 2026-07-29, "desktop là phải render flex chứ
 * nhỉ?"). Real `src` has this EXACT shape TWICE, byte-for-byte identical CSS —
 * `ChallengeView/index.tsx:195` and `PersonalProjectWorkspace/index.tsx:61` —
 * and BOTH corresponding Storybook screens (`ChallengePage`, `PersonalProjectTaskPage`)
 * worked around its absence with `StackH gap="section" align="start" wrap`
 * holding two `StackV` children, each self-flagging the exact same comment:
 * *"the BEST-AVAILABLE substitute... this design system has no dedicated
 * 'reading column + fixed aside' frame yet"*. `StackH` is a FIXED horizontal
 * axis (§13, by design — two `Stack.*` members = two axes, chosen by the
 * caller, never switching on their own) — with `wrap` and the main column's
 * `min-w-0 flex-1` (free to shrink without limit), the row almost never
 * actually wraps, so the split was rendering side-by-side at EVERY width,
 * mobile included, instead of stacking cleanly below desktop like `src` does.
 *
 * `flex-col` (mobile/tablet) → `@app-xl:flex-row` (desktop, `src`'s own
 * breakpoint) is not a generic "responsive Stack" ask — it is THIS one named
 * shape, so it gets its own khung instead of a new prop bolted onto `Stack.*`
 * that would blur what "two axes" means there.
 *
 * ⭐ SIZING IS HARD-OWNED, NOT A PROP (§6c: a layout khung owns its internal
 * sizing). Every number below (`gap-6`/`gap-8`, `w-[360px]`, `top-24`,
 * `max-h-[calc(100dvh-7rem)]`) is the SAME in both real `src` sources — there
 * is no second shape to generalize for yet. Add a prop only when a THIRD real
 * consumer actually disagrees with one of these numbers.
 *
 * KHUNG API LAW (§13b): two DISTINCT roles ⇒ two NAMED slots (`main`/`aside`),
 * not a single `children` — a workspace has no "one obvious slot" the way
 * `Container`/`Stack` do.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link SplitWorkspace}. */
export interface SplitWorkspaceProps {
    /** The reading column — grows, shrinks without limit (`min-w-0 flex-1`). */
    main: ReactNode
    /**
     * The action column — full width and stacked below `main` under `@app-xl`;
     * pins to a `360px` sticky rail beside it from `@app-xl` up.
     */
    aside: ReactNode
    /** Extra classes on the workspace root. */
    className?: string
    /** Anatomy tag: names this khung so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * The read-column + sticky-aside split. See the file header for why this is
 * its own khung and why every size is hard-owned rather than a prop.
 *
 * @param props - {@link SplitWorkspaceProps}
 */
const SplitWorkspace = ({
    main,
    aside,
    className,
    anatPart,
}: SplitWorkspaceProps) => (
    <div
        data-anat-part={anatPart}
        className={cn("flex flex-col gap-6 @app-xl:flex-row @app-xl:items-start @app-xl:gap-8", className)}
    >
        {/* `main`/`aside` are CALLER SLOTS — the node inside belongs to whoever passed it, not
            to this frame, so neither gets a badge of its own (same as `Container.body`'s bare
            render — a badge here would be "declare it or stop badging it" with nothing to
            declare, since there is no `SplitWorkspace`-owned content at either position). */}
        <div className="min-w-0 flex-1">
            {main}
        </div>
        <aside className="w-full shrink-0 @app-xl:sticky @app-xl:top-24 @app-xl:max-h-[calc(100dvh-7rem)] @app-xl:w-[360px] @app-xl:self-start @app-xl:overflow-y-auto">
            {aside}
        </aside>
    </div>
)

export { SplitWorkspace }
