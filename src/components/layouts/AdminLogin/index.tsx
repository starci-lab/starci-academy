"use client"
import React from "react"
import {
    Button,
    Card,
    CardContent,
    FieldError,
    Input,
    Label,
    TextField,
} from "@heroui/react"
import {
    KeyIcon,
    ShieldCheckIcon,
    ArrowRightIcon,
    LockIcon,
} from "@phosphor-icons/react"
import { useAdminApiKeyFormik } from "@/hooks/singleton/formik"

export const AdminLogin = () => {
    const formik = useAdminApiKeyFormik()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/[0.02] blur-3xl" />
            </div>

            <div className="relative w-full max-w-md space-y-6">
                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 mx-auto mb-2">
                        <ShieldCheckIcon className="h-8 w-8 text-indigo-400" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                        Admin Access
                    </h1>
                    <p className="text-sm text-slate-400 max-w-sm mx-auto">
                        Enter your API key to access administration tools
                    </p>
                </div>

                {/* API Key Card */}
                <Card className="bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl shadow-indigo-500/5">
                    <CardContent className="space-y-4 p-6">
                        {/* Section header */}
                        <div className="flex items-center gap-3 pb-1">
                            <div className="rounded-lg bg-amber-500/10 p-2">
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
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                formik.handleSubmit()
                            }}
                            className="space-y-4"
                        >
                            <TextField
                                isInvalid={
                                    formik.touched.apiKey &&
                                    Boolean(formik.errors.apiKey)
                                }
                            >
                                <Label htmlFor="admin-api-key-input" className="text-sm text-slate-300">
                                    API Key
                                </Label>
                                <div className="relative">
                                    <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                    <Input
                                        id="admin-api-key-input"
                                        placeholder="Enter your admin API key"
                                        type="password"
                                        name="apiKey"
                                        className="pl-9 bg-white/5 border-white/10 hover:border-indigo-400/40 text-white placeholder:text-slate-500"
                                        value={formik.values.apiKey}
                                        onChange={(e) => formik.setFieldValue("apiKey", e.target.value)}
                                        onBlur={() => formik.setFieldTouched("apiKey", true)}
                                    />
                                </div>
                                <FieldError>{formik.errors.apiKey}</FieldError>
                            </TextField>

                            <Button
                                id="admin-submit-button"
                                type="submit"
                                variant="primary"
                                size="lg"
                                fullWidth
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:scale-[1.01]"
                                isDisabled={
                                    !formik.values.apiKey || formik.isSubmitting
                                }
                                isPending={formik.isSubmitting}
                            >
                                {({isPending}) => (
                                    <>
                                        Continue to Admin Tools
                                        {!isPending && <ArrowRightIcon className="h-4 w-4" />}
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Footer note */}
                <p className="text-center text-xs text-slate-600">
                    Your key is stored in-memory only for this browser session.
                </p>
            </div>
        </div>
    )
}
