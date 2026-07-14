"use client"

import React, { useMemo, useState } from "react"
import { Button } from "@heroui/react"
import type { Key } from "react"
import { useTranslations } from "next-intl"
import { ChatPane } from "./ChatPane"
import { ChatPaneSkeleton } from "./ChatPane/ChatPaneSkeleton"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { PageContainer } from "@/components/blocks/layout/PageContainer"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import { useAuthenticationOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useQueryCommunityChatConversationSwr } from "@/hooks/swr/api/graphql/queries/useQueryCommunityChatConversationSwr"
import { useQueryMyFounderConversationSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyFounderConversationSwr"
import { useAppSelector } from "@/redux/hooks"

/** Which conversation the chat surface is showing. */
type ChatTab = "community" | "founder"

/**
 * Community chat surface: a toggle between the global community room and the
 * private founder DM, with the active conversation's message pane below. Member-
 * only — signed-out users see a prompt; the server enforces the membership gate.
 */
export const CommunityChat = () => {
    const t = useTranslations()
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const authentication = useAuthenticationOverlayState()
    const [tab, setTab] = useState<ChatTab>("community")

    const { data: communityConversation } = useQueryCommunityChatConversationSwr()
    const { data: founderConversation } = useQueryMyFounderConversationSwr()

    // the conversation id for the active tab (undefined until resolved)
    const conversationId = tab === "community"
        ? communityConversation?.id
        : founderConversation?.id

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
                        action={(
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
