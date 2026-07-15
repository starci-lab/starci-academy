"use client"

import React from "react"
import {
    Chip,
    Typography,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    LockSimpleIcon,
} from "@phosphor-icons/react"
import {
    useRouter,
} from "next/navigation"
import {
    useSidebarNavItems,
} from "../hooks/useSidebarNavItems"
import type {
    LearnNavBadge,
    LearnNavGroup,
} from "../types"
import { ResumeRail } from "../ResumeRail"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { CollapsibleSidebar } from "@/components/blocks/navigation/CollapsibleSidebar"
import { SidebarNavGroup } from "@/components/blocks/navigation/SidebarNavGroup"
import { SidebarNavItem } from "@/components/blocks/navigation/SidebarNavItem"
import { SidebarNavAccordionGroup } from "@/components/blocks/navigation/SidebarNavAccordionGroup"

/** localStorage key persisting the learn course-nav collapsed flag. */
const SIDEBAR_STORAGE_KEY = "starci.learn.sidebar.collapsed"

/**
 * Order the labelled nav clusters render in: the mandatory spine (path), then the
 * aids (practice), then the meta surfaces (track). The first group has no divider;
 * every later group gets a full-width {@link SidebarNavGroup} divider on top.
 */
const GROUP_ORDER: ReadonlyArray<LearnNavGroup> = ["path", "practice", "track"]

/**
 * Render a row's trailing status badge: a warning-tinted due-card count, or the
 * viewer's rank as accent text. Kept small so it doesn't crowd the label.
 *
 * @param badge - The {@link LearnNavBadge} to render.
 * @returns The badge node.
 */
const renderBadge = (badge: LearnNavBadge): React.ReactNode => {
    if (badge.tone === "rank") {
        return (
            <Typography type="body-xs" className="text-accent-soft-foreground">
                {`#${badge.value}`}
            </Typography>
        )
    }
    return (
        <Chip size="sm" className="bg-warning-soft text-warning-soft-foreground">
            <Chip.Label>{badge.value}</Chip.Label>
        </Chip>
    )
}

/** Props for {@link LearnSidebar}. */
export type LearnSidebarProps = WithClassNames<undefined>

/**
 * Course-learn left navigation rail (desktop).
 *
 * Container: pulls the shared nav entries from {@link useSidebarNavItems} and
 * composes the {@link CollapsibleSidebar} block — which owns the collapse-in-place
 * animation, the toggle, the divider, and persisting the collapsed flag. Rows are
 * split into separator-divided clusters by their `group` (study / practice);
 * each row is a {@link SidebarNavItem} that self-dispatches its tab + navigation
 * through the shared select handler. Hidden below `lg` (mobile uses the drawer in
 * {@link import("../LearnMobileBar").LearnMobileBar}). `"use client"` for the hooks.
 *
 * @param props - {@link LearnSidebarProps}
 */
export const LearnSidebar = ({ className }: LearnSidebarProps) => {
    const t = useTranslations()
    const router = useRouter()
    // shared entries + active tab (also used by the mobile drawer)
    const { items, selectedTab, onSelect } = useSidebarNavItems()
    // role-group captions (sentence case — no uppercase)
    const groupLabels: Record<LearnNavGroup, string> = {
        path: t("nav.groupPath"),
        practice: t("nav.groupPractice"),
        track: t("nav.groupTrack"),
    }
    return (
        <CollapsibleSidebar
            title={t("nav.courseMenu")}
            collapseLabel={t("nav.collapseLeftRail")}
            expandLabel={t("nav.expandLeftRail")}
            storageKey={SIDEBAR_STORAGE_KEY}
            topSlot={<ResumeRail />}
            className={className}
        >
            {GROUP_ORDER.map((group, index) => {
                // rows belonging to this cluster, in their declared order
                const groupItems = items.filter((item) => item.group === group)
                if (groupItems.length === 0) {
                    return null
                }
                return (
                    // first cluster has no divider; later clusters get the full-width separator
                    <SidebarNavGroup key={group} divider={index > 0} label={groupLabels[group]}>
                        {groupItems.map((item) => (
                            item.children ? (
                                <SidebarNavAccordionGroup
                                    key={item.value}
                                    icon={item.icon}
                                    label={item.label}
                                    items={item.children.map((child) => ({
                                        value: child.value,
                                        label: child.label,
                                        isActive: child.isActive,
                                        onPress: () => router.push(child.url),
                                    }))}
                                />
                            ) : (
                                <SidebarNavItem
                                    key={item.value}
                                    icon={<item.icon className="size-5 shrink-0" />}
                                    label={item.label}
                                    isActive={selectedTab === item.tab}
                                    endContent={item.locked ? (
                                        <LockSimpleIcon
                                            aria-label={t("enrollGate.locked")}
                                            focusable="false"
                                            className="size-4 text-muted"
                                        />
                                    ) : item.badge ? renderBadge(item.badge) : undefined}
                                    onPress={() => onSelect(item)}
                                />
                            )
                        ))}
                    </SidebarNavGroup>
                )
            })}
        </CollapsibleSidebar>
    )
}
