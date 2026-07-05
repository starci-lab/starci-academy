"use client"

import React, { useState } from "react"
import { Button, Spinner } from "@heroui/react"
import { useTranslations } from "next-intl"
import { SparkleIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link AiRewriteButton}. */
export interface AiRewriteButtonProps extends WithClassNames<undefined> {
    /**
     * Fires the rewrite call for THIS item only. Rejecting leaves the item
     * untouched — the button just goes back to idle so the learner can retry
     * in place, never blocking the rest of the form.
     */
    onRewrite: () => Promise<void>
}

/**
 * "✨ AI viết giúp" — a tertiary button with its OWN spinner/retry-in-place
 * state, so one block/item's AI failure never blocks the rest of the form
 * (per `CvBlockEditorProps.onAiRewrite` contract).
 *
 * @param props - {@link AiRewriteButtonProps}
 */
export const AiRewriteButton = ({ className, onRewrite }: AiRewriteButtonProps) => {
    const t = useTranslations()
    const [isRunning, setIsRunning] = useState(false)
    const [hasError, setHasError] = useState(false)

    const onPress = async () => {
        setIsRunning(true)
        setHasError(false)
        try {
            await onRewrite()
        } catch {
            setHasError(true)
        } finally {
            setIsRunning(false)
        }
    }

    return (
        <Button
            variant="tertiary"
            size="sm"
            className={className}
            isDisabled={isRunning}
            onPress={onPress}
        >
            {isRunning ? (
                <Spinner size="sm" />
            ) : (
                <SparkleIcon aria-hidden className="size-4" />
            )}
            {hasError ? t("cv.blocks.common.aiRewriteRetry") : t("cv.blocks.common.aiRewrite")}
        </Button>
    )
}
