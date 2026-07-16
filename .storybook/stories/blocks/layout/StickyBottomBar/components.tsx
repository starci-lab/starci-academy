import type { ReactNode } from "react"
import { Typography } from "@heroui/react"

/**
 * The block ships `fixed inset-x-0 bottom-0` because in the app it pins to the
 * VIEWPORT edge. `fixed` ignores a `relative` ancestor, so inside a preview box it
 * escapes to the bottom of the canvas and leaves the box empty. Re-anchoring it to
 * the box (`absolute`, merged over `fixed` by tailwind-merge) is what makes the demo
 * show the bar where the story claims it is; the chrome it actually owns — top
 * divider, surface fill, safe padding — stays untouched.
 */
export const IN_BOX = "absolute inset-x-0 bottom-0"

/**
 * Phone-screen shell: outer frame is fixed height (not the scroller). Inner
 * pane scrolls; the bar is `absolute` on the OUTER frame so it stays pinned to
 * the bottom of the phone while content scrolls underneath. No outer border —
 * the bar's own `border-t` is the only divider.
 */
export const Screen = ({
    bar,
}: {
    bar: ReactNode
}) => (
    <div className="relative h-[28rem] w-96 overflow-hidden bg-background">
        <div className="h-full overflow-y-auto px-4 pb-24 pt-4">
            <div className="flex flex-col gap-4">
                <Typography type="h3">Fullstack Mastery</Typography>
                <Typography type="body-sm" color="muted">
                    A path from fundamentals to shipping a real product. Scroll down to see the bottom bar stay pinned — the exact behavior on mobile when enrolling / accepting cookies.
                </Typography>
                {Array.from({ length: 8 }, (_, index) => (
                    <div key={index} className="flex flex-col gap-1">
                        <Typography type="body-sm" weight="semibold">
                            {`Module ${index + 1}`}
                        </Typography>
                        <Typography type="body-sm" color="muted">
                            Sample content to give enough scroll height — the StickyBottomBar must stay within reach no matter where you are on the page.
                        </Typography>
                    </div>
                ))}
            </div>
        </div>
        {bar}
    </div>
)
