"use client"

import React, { useMemo, useState } from "react"
import { Button } from "@heroui/react"
import { UsersThreeIcon } from "@phosphor-icons/react"
import type { Key } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { ChatPane } from "./ChatPane"
import { ChatPaneSkeleton } from "./ChatPane/ChatPaneSkeleton"
import { EmptyState } from "@/components/composites/feedback/EmptyState"
import { PageContainer } from "@/components/blocks/layout/PageContainer"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { useAuthenticationOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useQueryCommunityChatConversationSwr } from "@/hooks/swr/api/graphql/queries/useQueryCommunityChatConversationSwr"
import { useQueryMyFounderConversationSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyFounderConversationSwr"
import { useAppSelector } from "@/redux/hooks"
import { pathConfig } from "@/resources/path"

/** Which conversation the chat surface is showing. */
type ChatTab = "community" | "founder"

/**
 * Community chat surface: a toggle between the global community room and the
 * private founder DM, with the active conversation's message pane below. Member-
 * only — signed-out users see a prompt; the server enforces the membership gate.
 */
export const CommunityChatPage = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const authentication = useAuthenticationOverlayState()
    const [tab, setTab] = useState<ChatTab>("community")

    const communityConversationSwr = useQueryCommunityChatConversationSwr()
    const founderConversationSwr = useQueryMyFounderConversationSwr()

    // the SWR handle for the active tab — chat reads are member-only, so a
    // signed-in non-member either errors (membership gate) or resolves to null.
    const activeConversationSwr = tab === "community"
        ? communityConversationSwr
        : founderConversationSwr

    // the conversation id for the active tab (undefined until resolved)
    const conversationId = activeConversationSwr.data?.id
    // still resolving: only the initial load, before either an id or a terminal
    // (error / null) is known — this is what the skeleton is allowed to cover.
    const isResolving = activeConversationSwr.isLoading && !activeConversationSwr.data
    // the query settled but yielded no conversation for the active tab: the
    // membership gate rejected a signed-in non-member (or the read failed).
    const membersOnly = !isResolving && !conversationId

    const tabs = useMemo(
        () => [
            { key: "community", label: t("community.chat.communityRoom") },
            { key: "founder", label: t("community.chat.founderDm") },
        ],
        [t],
    )

    return (
        <PageContainer>
            <div className="flex flex-col gap-6">
                <PageHeader
                    title={t("community.chat.title")}
                    description={t("community.chat.description")}
                />

                {authenticated ? (
                    <div className="flex flex-col gap-3">
                        <TabsCard
                            leftTabs={{
                                items: tabs,
                                selectedKey: tab,
                                ariaLabel: t("community.chat.tabsAria"),
                                onSelectionChange: (key: Key) => setTab(String(key) as ChatTab),
                            }}
                        />
                        {conversationId ? (
                            <ChatPane key={conversationId} conversationId={conversationId} />
                        ) : membersOnly ? (
                            // Signed-in but the membership gate rejected this read (or it
                            // failed): a non-member must not sit on a perpetual skeleton —
                            // surface a members-only terminal with an upsell to membership.
                            <EmptyState
                                icon={UsersThreeIcon}
                                title={t("community.chat.membersOnly")}
                                description={t("community.chat.membersOnlyDescription")}
                                action={() => (
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onPress={() => router.push(
                                            pathConfig().locale(locale).profile().membership().build(),
                                        )}
                                    >
                                        {t("community.chat.viewMembership")}
                                    </Button>
                                )}
                            />
                        ) : (
                            // 2026-07-12: was a bare "loading…" caption while the active
                            // conversation id resolves — mirror the real pane's shape
                            // (message list + composer) so the tab switch/first load
                            // doesn't jump into a differently-shaped panel afterward.
                            <ChatPaneSkeleton withComposer />
                        )}
                    </div>
                ) : (
                    <EmptyState
                        title={t("community.chat.signInRequired")}
                        action={() => (
                            <Button
                                variant="primary"
                                size="sm"
                                onPress={() => authentication.open()}
                            >
                                {t("nav.signIn")}
                            </Button>
                        )}
                    />
                )}
            </div>
        </PageContainer>
    )
}
