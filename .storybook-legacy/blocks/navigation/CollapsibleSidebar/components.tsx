import { PlayIcon } from "@phosphor-icons/react"
import { cn } from "@heroui/react"
import { useSidebarCollapsed } from "@/components/blocks/navigation/CollapsibleSidebar/context"

/**
 * The pinned topSlot block must ADAPT to collapse (reads `useSidebarCollapsed`): expanded = pill icon +
 * TRUNCATED text (no broken wrapping), collapsed = an icon-only cell, always rounded. Use a SOLID accent (not accent-soft)
 * for the "Continue" pill so it reads as a SINGLE shortcut CTA, clearly distinct from the selected item (accent-soft) — this
 * avoids two identical red blocks stacked on top of each other.
 */
export const ContinueTopSlot = () => {
    const collapsed = useSidebarCollapsed()
    return (
        <div
            className={cn(
                "mb-4 flex items-center rounded-xl bg-accent text-accent-foreground",
                collapsed ? "mx-auto size-10 justify-center" : "gap-2 px-3 py-2",
            )}
        >
            <PlayIcon className="size-5 shrink-0" aria-hidden focusable="false" />
            {!collapsed ? (
                <span className="min-w-0 flex-1 truncate text-sm font-medium">Continue: Module 3</span>
            ) : null}
        </div>
    )
}
