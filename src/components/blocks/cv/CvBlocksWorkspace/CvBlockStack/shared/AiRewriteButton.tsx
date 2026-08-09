"use client"

import React, { useState } from "react"
import { Button, cn, Spinner } from "@heroui/react"
import { useTranslations } from "next-intl"
import { SparkleIcon } from "@phosphor-icons/react"
/** Props for {@link AiRewriteButton}. */
export interface AiRewriteButtonProps {
    /**
     * Fires the rewrite call for THIS item only. Rejecting leaves the item
     * untouched — the button just goes back to idle so the learner can retry
     * in place, never blocking the rest of the form.
     */
    onRewrite: () => Promise<void>
}

/**
 * "AI rewrite" — a tertiary button with its own spinner/retry-in-place
 * state, so one block/item's AI failure never blocks the rest of the form
 * (per `CvBlockEditorProps.onAiRewrite` contract).
 *
 * @param props - {@link AiRewriteButtonProps}
 */
export const AiRewriteButton = ({ onRewrite }: AiRewriteButtonProps) => {
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
            className={cn("w-fit", "self-start")}
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
