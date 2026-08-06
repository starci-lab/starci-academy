"use client"

import React, { useCallback, useMemo } from "react"
import { Button } from "@heroui/react"
import { useTranslations } from "next-intl"
import { ArrowsClockwiseIcon } from "@phosphor-icons/react"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { Container } from "@/components/frames/Container"
import { Grid, type GridItem } from "@/components/frames/Grid"
import { StackV } from "@/components/frames/Stack"
import { OverallBanner } from "./OverallBanner"
import { ComponentCard } from "./ComponentCard"
import { AiKeyGroup } from "./AiKeyGroup"
import { SystemStatusSkeleton } from "./SystemStatusSkeleton"
import { useQuerySystemHealthStatusSwr } from "@/hooks/swr/api/graphql/queries/useQuerySystemHealthStatusSwr"
import { useQueryAiKeyHealthSwr } from "@/hooks/swr/api/graphql/queries/useQueryAiKeyHealthSwr"
import { ComponentStatus } from "@/modules/api/graphql/queries/enums"

/**
 * Public "build in public" system status page (`/status`) — no auth, no admin
 * key. Polls two public GraphQL queries every ~10s:
 *
 *   - `systemHealthStatus` → a traffic-light card per infrastructure component.
 *   - `aiKeyHealth` → masked AI key chips grouped per model.
 *
 * An overall banner ("N/M components healthy", green/red) sits on top.
 */
export const SystemStatusPage = () => {
    const t = useTranslations("status")

    const {
        data: healthData,
        error: healthError,
        isValidating: healthValidating,
        mutate: mutateHealth,
    } = useQuerySystemHealthStatusSwr()
    const {
        data: keyData,
        error: keyError,
        isValidating: keyValidating,
        mutate: mutateKeys,
    } = useQueryAiKeyHealthSwr()

    const components = useMemo(
        () => healthData?.components ?? [],
        [healthData?.components],
    )
    const groups = useMemo(() => keyData?.groups ?? [], [keyData?.groups])

    const upCount = useMemo(
        () => components.filter((component) => component.status === ComponentStatus.Up).length,
        [components],
    )
    const allUp = components.length > 0 && upCount === components.length

    const isValidating = healthValidating || keyValidating

    const onRefresh = useCallback(() => {
        void mutateHealth()
        void mutateKeys()
    }, [mutateHealth, mutateKeys])

    const componentGridItems: Array<GridItem> = components.map((component) => ({
        key: component.name,
        content: () => <ComponentCard component={component} />,
    }))

    return (
        <Container
            size="lg"
            padding={6}
            principle="page-pad"
            explain="Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface."
            identity={{ tier: "block", component: "SystemStatusPage" }}
            body={() => (
                <StackV
                    gap={7}
                    principle="layout-split"
                    explain="Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks."
                    items={[
                        () => (
                            <PageHeader
                                title={t("title")}
                                description={t("subtitle")}
                                actions={
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onPress={onRefresh}
                                        isPending={isValidating}
                                    >
                                        <ArrowsClockwiseIcon aria-hidden focusable="false" className="size-4" />
                                        {t("refresh")}
                                    </Button>
                                }
                            />
                        ),
                        () => (
                            <StackV
                                gap={6}
                                principle="block-boundary"
                                explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                                items={[
                                    () => (
                                        <AsyncContent
                                            isLoading={!healthData && !healthError}
                                            skeleton={<SystemStatusSkeleton />}
                                            error={!healthData ? healthError : undefined}
                                            errorContent={{
                                                title: t("error.title"),
                                                description: t("error.description"),
                                                onRetry: () => {
                                                    void mutateHealth()
                                                },
                                                retryLabel: t("error.retry"),
                                            }}
                                            isEmpty={components.length === 0}
                                            emptyContent={{
                                                title: t("empty.infraTitle"),
                                                description: t("empty.infraDescription"),
                                            }}
                                        >
                                            <StackV
                                                gap={6}
                                                principle="block-boundary"
                                                explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                                                items={[
                                                    () => (
                                                        <OverallBanner
                                                            allUp={allUp}
                                                            label={t("overall", {
                                                                up: upCount,
                                                                total: components.length,
                                                            })}
                                                        />
                                                    ),
                                                    () => (
                                                        <StackV
                                                            as="section"
                                                            gap={4}
                                                            principle="label-field"
                                                            explain="Form label above its field — not title-subtitle, because the upper line labels an input rather than a heading pair."
                                                            items={[
                                                                () => (
                                                                    <h2 className="text-sm font-medium text-muted">
                                                                        {t("infraHeading")}
                                                                    </h2>
                                                                ),
                                                                () => (
                                                                    <Grid
                                                                        columns={{ base: 1, sm: 2, lg: 3 }}
                                                                        principle="content-row"
                                                                        explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                                        items={componentGridItems}
                                                                    />
                                                                ),
                                                            ]}
                                                        />
                                                    ),
                                                ]}
                                            />
                                        </AsyncContent>
                                    ),
                                    () => (
                                        <StackV
                                            as="section"
                                            gap={4}
                                            principle="label-field"
                                            explain="Form label above its field — not title-subtitle, because the upper line labels an input rather than a heading pair."
                                            items={[
                                                () => (
                                                    <h2 className="text-sm font-medium text-muted">
                                                        {t("aiKeysHeading")}
                                                    </h2>
                                                ),
                                                () => (
                                                    <AsyncContent
                                                        isLoading={!keyData && !keyError}
                                                        skeleton={<SystemStatusSkeleton aiOnly />}
                                                        error={!keyData ? keyError : undefined}
                                                        errorContent={{
                                                            title: t("error.title"),
                                                            description: t("error.description"),
                                                            onRetry: () => {
                                                                void mutateKeys()
                                                            },
                                                            retryLabel: t("error.retry"),
                                                        }}
                                                        isEmpty={groups.length === 0}
                                                        emptyContent={{
                                                            title: t("empty.aiTitle"),
                                                            description: t("empty.aiDescription"),
                                                        }}
                                                    >
                                                        <StackV
                                                            gap={4}
                                                            principle="content-row"
                                                            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                                                            items={groups.map((group, index) => () => (
                                                                <AiKeyGroup
                                                                    key={`${group.provider}-${index}`}
                                                                    group={group}
                                                                />
                                                            ))}
                                                        />
                                                    </AsyncContent>
                                                ),
                                            ]}
                                        />
                                    ),
                                ]}
                            />
                        ),
                    ]}
                />
            )}
        />
    )
}
