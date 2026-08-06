"use client"
import { ArrowRightIcon, KeyIcon, LockIcon, ShieldCheckIcon } from "@phosphor-icons/react"
import React from "react"
import {
    Button,
    Card,
    CardContent,
    cn,
    FieldError,
    Input,
    Label,
    TextField,
} from "@heroui/react"

import { Controller } from "react-hook-form"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useAdminApiKeyForm } from "@/hooks/rhf/useAdminApiKeyForm"
import { Box } from "@/components/frames/Box"

/** Props for {@link AdminLoginPage}. */
export type AdminLoginPageProps = WithClassNames<undefined>

/**
 * Admin login page — API key entry form.
 *
 * Container: owns the RHF form and submission logic. `"use client"` for form state.
 * @param props - {@link AdminLoginPageProps}
 */
export const AdminLoginPage = ({ className }: AdminLoginPageProps) => {
    const { control, watch, formState, onSubmit } = useAdminApiKeyForm()

    return (
        <div className={cn("min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4", className)}>
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/[0.02] blur-3xl" />
            </div>

            <Box principle="block-boundary" className="relative flex w-full max-w-md flex-col gap-6"
                explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups.">
                {/* Header */}
                <Box principle="card-caption" className="text-center flex flex-col gap-3"
                    explain="Holds caption text under card media so the caption stays attached to the image above it.">
                    <Box principle="center-measure" className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 mx-auto mb-2"
                        explain="Caps reading width so long copy does not stretch edge-to-edge across the viewport.">
                        <ShieldCheckIcon className="h-8 w-8 text-indigo-400" />
                    </Box>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                        Admin Access
                    </h1>
                    <Box principle="center-measure" className="mx-auto"
                        explain="Caps reading width so long copy does not stretch edge-to-edge across the viewport.">
                        <p className="text-sm text-slate-400 max-w-sm">
                            Enter your API key to access administration tools
                        </p>
                    </Box>
                </Box>

                {/* API Key Card */}
                <Card className="bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl shadow-indigo-500/5">
                    <CardContent>
                        <Box principle="page-pad" className="flex flex-col gap-3 p-6"
                            explain="Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface.">
                            {/* Section header */}
                            <Box principle="identity" className="flex items-center gap-2 pb-1"
                                explain="Keeps avatar and identity text as one peer unit so the person label stays beside the face.">
                                {/* ps-admin-5: p-2 not in named house token set — teacher-hold */}
                                <div data-principle="ps-admin-5" className="rounded-lg bg-amber-500/10 p-2">
                                    <KeyIcon className="h-5 w-5 text-amber-400" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-white">
                                    Authentication
                                    </h2>
                                    <p className="text-xs text-slate-400">
                                    Your API key will be stored for this session
                                    </p>
                                </div>
                            </Box>

                            <form onSubmit={onSubmit}>
                                <Box principle="label-field" className="flex flex-col gap-3"
                                    explain="Form label above its field — not title-subtitle, because the upper line labels an input rather than a heading pair.">
                                    <Controller
                                        control={control}
                                        name="apiKey"
                                        render={({ field, fieldState }) => (
                                            <TextField variant="secondary" isInvalid={fieldState.invalid && fieldState.isTouched}>
                                                <Label htmlFor="admin-api-key-input" className="text-sm text-slate-300">
                                                API Key
                                                </Label>
                                                <div className="relative">
                                                    <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                                                    <Input
                                                        id="admin-api-key-input"
                                                        placeholder="Enter your admin API key"
                                                        type="password"
                                                        name={field.name}
                                                        ref={field.ref}
                                                        className="pl-9 bg-white/5 border-white/10 hover:border-indigo-400/40 text-white placeholder:text-slate-500"
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                        onBlur={field.onBlur}
                                                    />
                                                </div>
                                                <FieldError>{fieldState.error?.message}</FieldError>
                                            </TextField>
                                        )}
                                    />

                                    <Button
                                        id="admin-submit-button"
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        fullWidth
                                        className="bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:scale-[1.01]"
                                        isDisabled={
                                            !watch("apiKey") || formState.isSubmitting
                                        }
                                        isPending={formState.isSubmitting}
                                    >
                                        {({isPending}) => (
                                            <>
                                            Continue to Admin Tools
                                                {!isPending && <ArrowRightIcon className="h-5 w-5" />}
                                            </>
                                        )}
                                    </Button>
                                </Box>
                            </form>
                        </Box>
                    </CardContent>
                </Card>

                {/* Footer note */}
                <p className="text-center text-xs text-slate-600">
                    Your key is stored in-memory only for this browser session.
                </p>
            </Box>
        </div>
    )
}
