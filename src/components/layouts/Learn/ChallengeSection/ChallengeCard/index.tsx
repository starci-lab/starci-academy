"use client"
import { Button, Chip } from "@heroui/react"
import { useChallengeOverlayState } from "@/hooks/singleton"
import { ChallengeDifficulty, ChallengeEntity } from "@/modules/types"
import { useAppDispatch } from "@/redux"
import { setChallengeId } from "@/redux/slices"
import { ListNumbersIcon, SwordIcon, TrophyIcon } from "@phosphor-icons/react"
import { TagChips } from "@/components/reuseable"
import { useTranslations } from "next-intl"
import React, { useMemo } from "react"
import { difficultyPalette } from "@/components/pallettes"



/** Demo tags until `ChallengeEntity` exposes a `tags` field from the API. */
const CHALLENGE_DEMO_TAGS: Array<string> = [
    "#NodeJS",
    "#React",
    "#NextJS",
    "#TailwindCSS",
    "#TypeScript",
    "#JavaScript",
    "#HTML",
    "#CSS",
    "#Python",
    "#Java",
    "#C++",
    "#C#",
    "#PHP",
    "#Ruby",
    "#Swift",
    "#Kotlin",
    "#Go",
    "#Rust",
    "#Scala",
    "#Haskell",
    "#OCaml",
    "#Erlang",
    "#Elixir",
    "#F#",
    "#Dart",
    "#Flutter",
    "#React Native",
    "#React Native",
]

export interface ChallengeCardProps {
    /** One module challenge block from API. */
    challenge: ChallengeEntity
}

/**
 * Single challenge row in the Learn “Challenges” tab; opens full detail in ChallengeModal.
 */
export const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
    const t = useTranslations()
    const { onOpen } = useChallengeOverlayState()
    const dispatch = useAppDispatch()
    const difficultyName = useMemo(() => {
        switch (challenge.difficulty) {
        case ChallengeDifficulty.Medium:
            return "challenge.difficulty.medium"
        case ChallengeDifficulty.Hard:
            return "challenge.difficulty.hard"
        default:
            return "challenge.difficulty.easy"
        }
    }, [challenge.difficulty])

    return (
        <Button
            className="w-full h-fit p-3 card card--default cursor-pointer flex flex-col items-start text-left"
            variant="tertiary"
            onPress={() => {
                dispatch(setChallengeId(challenge.id))
                onOpen()
            }}
        >
            <div className="flex flex-col gap-3 w-full">
                <div className="font-semibold text-lg overflow-hidden whitespace-normal">
                    {challenge.orderIndex + 1}
                    {". "}
                    {challenge.title}{" "}
                    <span>(20/40)</span>
                </div>
                <div className="flex items-center gap-2">
                    <Chip
                        variant="secondary"
                        size="sm"
                        color="accent"
                    >
                        <TrophyIcon className="size-4" />
                        <Chip.Label>
                            {t("challenge.score", {
                                score: challenge.score,
                            })}
                        </Chip.Label>
                    </Chip>
                    <Chip
                        variant="secondary"
                        color="accent"
                        size="sm"
                    >
                        <ListNumbersIcon className="size-4" />
                        <Chip.Label>
                            {t("challenge.steps.count", {
                                count: challenge.steps?.length ?? 0,
                            })}
                        </Chip.Label>
                    </Chip>
                    <Chip
                        variant="secondary"
                        size="sm"
                        color="accent"
                        className={difficultyPalette[challenge.difficulty].text}
                    >
                        <SwordIcon className="size-4" />
                        <Chip.Label>{t(difficultyName)}</Chip.Label>
                    </Chip>
                </div>
                <div className="line-clamp-3 text-justify text-sm italic text-muted overflow-hidden whitespace-normal">
                    {challenge.description}
                </div>
                <TagChips tags={CHALLENGE_DEMO_TAGS} variant="soft" />
            </div>
        </Button>
    )
}

