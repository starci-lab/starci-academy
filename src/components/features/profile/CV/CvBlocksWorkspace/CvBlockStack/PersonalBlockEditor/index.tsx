"use client"

import React, { useState } from "react"
import {
    Calendar,
    DateField,
    DatePicker,
    FieldError,
    Input,
    Label,
    TextField,
    cn,
} from "@heroui/react"
import { getLocalTimeZone, parseDate, today } from "@internationalized/date"
import type { DateValue } from "@internationalized/date"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import type { CvBlockEditorProps } from "../../../types"
import { isValidOptionalUrl } from "../../../urlValidation"

/** Field keys read/written on the single `personal` item's `fields`. */
const FIELD_KEYS = [
    "name",
    "role",
    "email",
    "phone",
    "location",
    "birthDate",
    "linkedinUrl",
    "githubUsername",
] as const
type PersonalFieldKey = typeof FIELD_KEYS[number]

/** The only field key validated as a URL (blur-triggered, per `isValidOptionalUrl`). */
const URL_FIELD_KEYS: ReadonlySet<PersonalFieldKey> = new Set(["linkedinUrl"])

/** Parses a stored ISO date string (e.g. `"2000-01-01"`) into a `DateValue`, or `null` if empty/unparseable. */
const parseStoredDate = (value: string): DateValue | null => {
    if (!value) {
        return null
    }
    try {
        return parseDate(value)
    } catch {
        return null
    }
}

/** Props for {@link PersonalBlockEditor}. */
export interface PersonalBlockEditorProps extends WithClassNames<undefined>, CvBlockEditorProps {}

/**
 * Header/contact block editor — singleton, non-repeatable, no AI affordance
 * (per `CV_BLOCK_TYPE_REGISTRY[Personal]`). Holds its one fields set on
 * `block.items[0]` (created on first edit if the block starts with 0 items,
 * per the uniform `CvBlock` shape every block type shares).
 *
 * @param props - {@link PersonalBlockEditorProps}
 */
export const PersonalBlockEditor = ({ className, block, onChange }: PersonalBlockEditorProps) => {
    const t = useTranslations()
    const fields = block.items[0]?.fields ?? {}
    const [touchedUrlKeys, setTouchedUrlKeys] = useState<ReadonlySet<PersonalFieldKey>>(new Set())

    const onFieldChange = (key: PersonalFieldKey, value: string) => {
        const item = block.items[0] ?? { id: crypto.randomUUID(), fields: {} }
        const nextItem = { ...item, fields: { ...item.fields, [key]: value } }
        onChange({ ...block, items: [nextItem] })
    }

    const onBlurUrlField = (key: PersonalFieldKey) => {
        setTouchedUrlKeys((prev) => new Set(prev).add(key))
    }

    return (
        <div className={cn("grid grid-cols-1 gap-3 sm:grid-cols-3", className)}>
            {FIELD_KEYS.map((key) => {
                const value = typeof fields[key] === "string" ? (fields[key] as string) : ""

                if (key === "birthDate") {
                    return (
                        <DatePicker
                            key={key}
                            aria-label={t("cv.blocks.personal.fields.birthDate")}
                            maxValue={today(getLocalTimeZone())}
                            value={parseStoredDate(value)}
                            onChange={(date) => onFieldChange(key, date ? date.toString() : "")}
                        >
                            <Label>{t("cv.blocks.personal.fields.birthDate")}</Label>
                            <DateField.Group fullWidth variant="secondary">
                                <DateField.Input>
                                    {(segment) => <DateField.Segment segment={segment} />}
                                </DateField.Input>
                                <DateField.Suffix>
                                    <DatePicker.Trigger>
                                        <DatePicker.TriggerIndicator />
                                    </DatePicker.Trigger>
                                </DateField.Suffix>
                            </DateField.Group>
                            <DatePicker.Popover>
                                <Calendar aria-label={t("cv.blocks.personal.fields.birthDate")}>
                                    <Calendar.Header>
                                        <Calendar.YearPickerTrigger>
                                            <Calendar.YearPickerTriggerHeading />
                                            <Calendar.YearPickerTriggerIndicator />
                                        </Calendar.YearPickerTrigger>
                                        <Calendar.NavButton slot="previous" />
                                        <Calendar.NavButton slot="next" />
                                    </Calendar.Header>
                                    <Calendar.Grid>
                                        <Calendar.GridHeader>
                                            {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                                        </Calendar.GridHeader>
                                        <Calendar.GridBody>
                                            {(date) => <Calendar.Cell date={date} />}
                                        </Calendar.GridBody>
                                    </Calendar.Grid>
                                    <Calendar.YearPickerGrid>
                                        <Calendar.YearPickerGridBody>
                                            {({ year }) => <Calendar.YearPickerCell year={year} />}
                                        </Calendar.YearPickerGridBody>
                                    </Calendar.YearPickerGrid>
                                </Calendar>
                            </DatePicker.Popover>
                        </DatePicker>
                    )
                }

                const isUrlField = URL_FIELD_KEYS.has(key)
                const isInvalid = isUrlField && touchedUrlKeys.has(key) && !isValidOptionalUrl(value)
                return (
                    <TextField key={key} variant="secondary" isInvalid={isInvalid}>
                        <Label htmlFor={`cv-personal-${key}`}>
                            {t(`cv.blocks.personal.fields.${key}`)}
                        </Label>
                        <Input
                            id={`cv-personal-${key}`}
                            placeholder={t(`cv.blocks.personal.placeholders.${key}`)}
                            value={value}
                            onChange={(event) => onFieldChange(key, event.target.value)}
                            onBlur={isUrlField ? () => onBlurUrlField(key) : undefined}
                        />
                        {isUrlField ? (
                            <FieldError>{t("cv.blocks.common.invalidUrl")}</FieldError>
                        ) : null}
                    </TextField>
                )
            })}
        </div>
    )
}
