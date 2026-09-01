#!/usr/bin/env node
/** Quick mechanical Stack swaps for ProfileActivity remaining raw seams. */
import fs from "node:fs"

function ensureImport(src, importLine) {
    if (src.includes(importLine.split(" from ")[1].replace(/"/g, ""))) {
        // crude: already has frames/Stack
        if (src.includes("frames/Stack")) return src
    }
    const marker = "from \"@/modules/utils/language\""
    // insert before last import block end — fallback: after "use client"
    if (src.includes("from \"@/components/frames/Stack\"")) return src
    return src.replace(
        /^("use client"\r?\n\r?\n)/m,
        `$1${importLine}\n`,
    )
}

// ProfileActivity
{
    const file = "src/components/pages/ProfileActivityPage/ProfileActivity/index.tsx"
    let src = fs.readFileSync(file, "utf8")
    if (!src.includes("frames/Stack")) {
        src = src.replace(
            "import { AsyncContent } from \"@/components/blocks/async/AsyncContent\"",
            "import { AsyncContent } from \"@/components/blocks/async/AsyncContent\"\nimport { StackH, StackV } from \"@/components/frames/Stack\"",
        )
    }
    src = src.replace(
        `<div className="flex flex-col gap-6">
                        {[0, 1].map((group) => (
                            // mirrors LabeledCard frameless (date label, gap-3) → SurfaceListCard bordered
                            <div key={group} className="flex flex-col gap-3">
                                {/* date label (subtleLabel eyebrow = text-xs muted) */}
                                <Skeleton.Typography type="body-xs" width="1/4" />
                                <SurfaceListCard bordered>
                                    {[0, 1, 2].map((row) => (
                                        <SurfaceListCardItem key={row}>
                                            <div className="flex items-start gap-2">
                                                {/* actor avatar + type badge */}
                                                <Skeleton className="size-9 shrink-0 rounded-full" />
                                                <div className="flex flex-1 flex-col gap-0">
                                                    <Skeleton.Typography type="body-sm" width="3/4" />
                                                    <Skeleton.Typography type="body-xs" width="1/4" />
                                                </div>
                                            </div>
                                        </SurfaceListCardItem>
                                    ))}
                                </SurfaceListCard>
                            </div>
                        ))}
                    </div>`,
        `<StackV gap={6} principle="block-boundary" items={
                        [0, 1].map((group) => () => (
                            <StackV key={group} gap={4} items={[
                                () => <Skeleton.Typography type="body-xs" width="1/4" />,
                                () => (
                                    <SurfaceListCard bordered>
                                        {[0, 1, 2].map((row) => (
                                            <SurfaceListCardItem key={row}>
                                                <StackH gap={3} principle="identity" align="start" items={[
                                                    () => <Skeleton className="size-9 shrink-0 rounded-full" />,
                                                    () => (
                                                        <StackV gap={1} classNames={["flex-1"]} items={[
                                                            () => <Skeleton.Typography type="body-sm" width="3/4" />,
                                                            () => <Skeleton.Typography type="body-xs" width="1/4" />,
                                                        ]} />
                                                    ),
                                                ]} />
                                            </SurfaceListCardItem>
                                        ))}
                                    </SurfaceListCard>
                                ),
                            ]} />
                        ))
                    } />`,
    )
    src = src.replace(
        `<div className="flex flex-col gap-6">
                    <ActivityFeed
                        items={items}
                        onResolve={onResolve}
                        onReact={authenticated ? onReact : undefined}
                        bordered
                    />
                    {hasMore ? (
                        <div className="flex justify-center">
                            <Button
                                variant="secondary"
                                size="sm"
                                isPending={isLoadingMore}
                                onPress={() => setSize(size + 1)}
                            >
                                {t("publicProfile.loadMore")}
                            </Button>
                        </div>
                    ) : null}
                </div>`,
        `<StackV gap={6} principle="block-boundary" items={[
                    () => (
                        <ActivityFeed
                            items={items}
                            onResolve={onResolve}
                            onReact={authenticated ? onReact : undefined}
                            bordered
                        />
                    ),
                    ...(hasMore
                        ? [() => (
                            <div className="flex justify-center">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    isPending={isLoadingMore}
                                    onPress={() => setSize(size + 1)}
                                >
                                    {t("publicProfile.loadMore")}
                                </Button>
                            </div>
                        )]
                        : []),
                ]} />`,
    )
    fs.writeFileSync(file, src)
    console.log("ProfileActivity patched", !src.includes("gap-6\">"))
}
