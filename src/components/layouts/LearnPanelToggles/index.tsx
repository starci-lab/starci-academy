"use client"

import React from "react"
import {
    CaretDoubleLeftIcon,
    CaretDoubleRightIcon,
} from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import { useAppDispatch, useAppSelector } from "@/redux"
import { toggleLeftCollapsed, toggleRightCollapsed } from "@/redux/slices"

/**
 * Desktop collapse handles styled as short accent bars on the content borders.
 *
 * Container: reads/dispatches the rail-collapse flags on the `sidebar` slice. The
 * left handle (left border) toggles the course-nav rail to icon-only; the right
 * handle (right border) shrinks/expands the module-outline rail. Each handle is a
 * slim vertical bar that reveals a direction caret on hover, kept centered in the
 * viewport via a sticky wrapper. Hidden below `lg` (mobile uses drawers). Must be
 * rendered inside a `relative` content column. `"use client"` for redux + presses.
 */
export const LearnPanelToggles = () => {
    const t = useTranslations()
    const dispatch = useAppDispatch()
    // current collapse state drives both the caret direction and the aria label
    const leftCollapsed = useAppSelector((state) => state.sidebar.leftCollapsed)
    const rightCollapsed = useAppSelector((state) => state.sidebar.rightCollapsed)

    // short vertical bar that grows a touch on hover
    const barClass = "block h-16 w-1.5 rounded-full bg-accent/60 transition-all duration-200 group-hover:h-24 group-hover:bg-accent"
    // hover caret chip centered on the bar
    const caretClass = "absolute left-1/2 top-1/2 flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-white opacity-0 shadow transition-opacity duration-200 group-hover:opacity-100"

    return (
        // full-height, click-through overlay spanning the content column; desktop only.
        // absolute so it adds no layout, z-20 to float above the article text.
        <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
            {/* zero-height bar that sticks at viewport mid-line, so handles stay centered while scrolling */}
            <div className="sticky top-1/2">
                {/* left handle: sits on the divider between the nav rail and content */}
                <button
                    type="button"
                    aria-label={leftCollapsed ? t("nav.expandLeftRail") : t("nav.collapseLeftRail")}
                    title={leftCollapsed ? t("nav.expandLeftRail") : t("nav.collapseLeftRail")}
                    onClick={() => dispatch(toggleLeftCollapsed())}
                    className="group pointer-events-auto absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                >
                    <span className={barClass} />
                    {/* caret points the way the rail will move: in to collapse, out to expand */}
                    <span className={caretClass}>
                        {leftCollapsed ? (
                            <CaretDoubleRightIcon className="size-3" />
                        ) : (
                            <CaretDoubleLeftIcon className="size-3" />
                        )}
                    </span>
                </button>

                {/* right handle: sits on the divider between content and the outline rail */}
                <button
                    type="button"
                    aria-label={rightCollapsed ? t("nav.expandRightRail") : t("nav.collapseRightRail")}
                    title={rightCollapsed ? t("nav.expandRightRail") : t("nav.collapseRightRail")}
                    onClick={() => dispatch(toggleRightCollapsed())}
                    className="group pointer-events-auto absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 cursor-pointer"
                >
                    <span className={barClass} />
                    {/* caret points outward (collapse) when expanded, inward (expand) when collapsed */}
                    <span className={caretClass}>
                        {rightCollapsed ? (
                            <CaretDoubleLeftIcon className="size-3" />
                        ) : (
                            <CaretDoubleRightIcon className="size-3" />
                        )}
                    </span>
                </button>
            </div>
        </div>
    )
}
