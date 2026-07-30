import type { ReactNode } from "react"
import { cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * FRAME (khung) — `RailShell`: a LEADING rail that introduces the page, beside a
 * body column that grows. The rail comes FIRST in reading order and never
 * shrinks; the body follows and absorbs every remaining pixel.
 *
 * ⭐ WHY THIS IS NOT `SplitWorkspace`. That khung is the mirror image and a
 * different job: its `main` reading column comes first and the `aside` is a
 * 360px action rail that pins beside it. Here the rail LEADS — it is who you
 * are, or where you are, and the body is what you came to read. Same two boxes,
 * opposite reading order, opposite shrink strategy. Folding both into one khung
 * would need a `railFirst` flag, and a flag that reverses reading order is not
 * a variant of one shape, it is two shapes sharing a file.
 *
 * ⭐ WHY IT EXISTS AT ALL (audit 2026-07-30, dashboard overview). Real `src` has
 * this exact shape TWICE and both wrote it by hand:
 *   • `features/dashboard/index.tsx:61-67` — identity rail, then the open tab
 *   • `features/profile/Settings/SettingsLayout/index.tsx:62-96` — settings nav
 *     rail, then the settings panel
 * Both hand-rolled `@app-md:flex-row` on the wrapper, `shrink-0` on the aside
 * and `min-w-0 flex-1` on the main — the 44th and 45th call sites of the
 * shrink-strategy pattern `Split` was built to own in ONE place. Two independent
 * cases stating the same lack is the bar for a new khung (`frame` decision
 * sheet), and it is met.
 *
 * ⭐ THE RAIL IS `shrink-0`, THE BODY IS `min-w-0`. This is the whole contract,
 * and it is why the sides are NAMED. A caller who writes the two columns by
 * hand has to remember both classes at every call site; naming them puts the
 * rule in one file. Without `min-w-0` the body refuses to shrink below its
 * content and pushes the rail off-screen — a failure that only shows up once
 * real long content arrives.
 *
 * ⭐ `@app-md` IS HARD-OWNED, `isRailSticky` IS A PROP. Both real sources agree
 * on the breakpoint and on the 288px rail, so those are not props (§6c: a khung
 * owns its own sizing). They DISAGREE on sticky — dashboard scrolls its rail
 * with the page, settings pins its rail to the viewport — so that one, and only
 * that one, is a prop. A number becomes a prop when a real consumer disagrees,
 * not before.
 *
 * ⭐ NO `wrap`. The breakpoint is declared, not hoped for. `wrap` carries no
 * threshold: the body shrinks without limit so the row almost never wraps, which
 * is exactly how two screens shipped with their columns glued together at every
 * width including mobile (`responsive` decision sheet).
 *
 * KHUNG API LAW (§13b): two DISTINCT roles ⇒ two NAMED slots (`rail`/`body`),
 * never a single `children`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link RailShell}. */
export interface RailShellProps {
    /**
     * The LEADING column — identity, navigation, standing. Full width and stacked
     * above `body` under `@app-md`; a fixed `288px` column beside it from `@app-md` up.
     * Never shrinks.
     */
    rail: ReactNode
    /**
     * The FOLLOWING column — the content the reader came for. Grows into whatever
     * the rail leaves, and shrinks without limit (`min-w-0`) so long content
     * truncates inside it rather than pushing the rail away.
     */
    body: ReactNode
    /**
     * Pin the rail to the viewport once the two sit side by side. Off by default:
     * the rail scrolls with the page. Turn it on only when the rail is navigation
     * the reader returns to while the body scrolls past it.
     */
    isRailSticky?: boolean
    /** Extra classes on the shell root. */
    className?: string
    /** Anatomy tag: names this khung so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * The leading-rail shell. See the file header for why this is its own khung and
 * why only `isRailSticky` is a prop.
 *
 * @param props - {@link RailShellProps}
 */
const RailShell = ({
    rail,
    body,
    isRailSticky = false,
    className,
    anatPart,
}: RailShellProps) => (
    <div
        data-anat-part={anatPart}
        className={cn("flex flex-col gap-6 @app-md:flex-row @app-md:items-start @app-md:gap-8", className)}
    >
        {/* `rail`/`body` are CALLER SLOTS — whatever sits inside belongs to whoever passed
            it, so neither gets an anatomy badge of its own (same restraint as
            `SplitWorkspace`'s two slots). */}
        <aside
            className={cn(
                "flex w-full shrink-0 flex-col @app-md:w-72",
                isRailSticky && "@app-md:sticky @app-md:top-24 @app-md:max-h-[calc(100dvh-7rem)] @app-md:self-start @app-md:overflow-y-auto",
            )}
        >
            {rail}
        </aside>
        <main className="flex min-w-0 flex-1 flex-col">
            {body}
        </main>
    </div>
)

export { RailShell }
