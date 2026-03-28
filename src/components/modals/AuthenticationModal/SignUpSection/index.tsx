"use client"
import React, { useState } from "react"
import {
    StarCiModalBody,
    StarCiInput,
    StarCiDivider,
    StarCiButton,
    StarCiLink,
    StarCiCheckbox,
} from "../../../atomic"
import { Spacer } from "@heroui/react"
import { GoogleIcon } from "../../../svg"
import { useAppDispatch } from "@/redux"
import {
    AuthenticationModalTab,
    setAuthenticationModalTab,
} from "@/redux/slices"
import { EyeIcon, EyeClosedIcon } from "@phosphor-icons/react"
import { useSignUpFormik } from "@/hooks/singleton"

export const SignUpSection = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const dispatch = useAppDispatch()
    const {
        values,
        errors,
        touched,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        isSubmitting,
    } = useSignUpFormik()

    return (
        <StarCiModalBody>
            <form className="flex flex-col" onSubmit={handleSubmit} noValidate>
                <StarCiButton
                    type="button"
                    variant="bordered"
                    className="w-full text-sm"
                    startContent={<GoogleIcon className="w-5 h-5" />}
                >
                    Sign Up With Google
                </StarCiButton>
                <Spacer y={3} />
                <StarCiDivider />
                <Spacer y={3} />
                <StarCiInput
                    isRequired
                    type="email"
                    label="Email"
                    placeholder="Enter your email"
                    name="email"
                    value={values.email}
                    onValueChange={(email) => setFieldValue("email", email)}
                    onBlur={() => setFieldTouched("email", true)}
                    isInvalid={!!(touched.email && errors.email)}
                    errorMessage={touched.email ? errors.email : undefined}
                />
                <Spacer y={3} />
                <StarCiInput
                    isRequired
                    label="Password"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={values.password}
                    onValueChange={(password) => setFieldValue("password", password)}
                    onBlur={() => setFieldTouched("password", true)}
                    isInvalid={!!(touched.password && errors.password)}
                    errorMessage={touched.password ? errors.password : undefined}
                    endContent={
                        <button
                            type="button"
                            className="mr-1 flex items-center justify-center rounded-md p-1 text-foreground-500 outline-none transition-opacity hover:opacity-80"
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                            onClick={() => setShowPassword((s) => !s)}
                        >
                            {showPassword ? (
                                <EyeIcon className="h-4 w-4" />
                            ) : (
                                <EyeClosedIcon className="h-4 w-4" />
                            )}
                        </button>
                    }
                />
                <Spacer y={3} />
                <StarCiInput
                    isRequired
                    type={showConfirmPassword ? "text" : "password"}
                    label="Confirm password"
                    placeholder="Confirm your password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onValueChange={(v) => setFieldValue("confirmPassword", v)}
                    onBlur={() => setFieldTouched("confirmPassword", true)}
                    isInvalid={
                        !!(touched.confirmPassword && errors.confirmPassword)
                    }
                    errorMessage={
                        touched.confirmPassword
                            ? errors.confirmPassword
                            : undefined
                    }
                    endContent={
                        <button
                            type="button"
                            className="mr-1 flex items-center justify-center rounded-md p-1 text-foreground-500 outline-none transition-opacity hover:opacity-80"
                            aria-label={
                                showConfirmPassword
                                    ? "Hide confirm password"
                                    : "Show confirm password"
                            }
                            onClick={() => setShowConfirmPassword((s) => !s)}
                        >
                            {showConfirmPassword ? (
                                <EyeIcon className="h-4 w-4" />
                            ) : (
                                <EyeClosedIcon className="h-4 w-4" />
                            )}
                        </button>
                    }
                />
                <Spacer y={3} />
                <div className="flex flex-col gap-1">
                    <div className="flex items-start gap-1.5">
                        <StarCiCheckbox
                            size="sm"
                            className="mt-0.5"
                            aria-label="I agree to the terms and conditions"
                            isSelected={values.agreeToTerms}
                            isInvalid={
                                !!(touched.agreeToTerms && errors.agreeToTerms)
                            }
                            onValueChange={(v) => {
                                setFieldValue("agreeToTerms", v)
                                setFieldTouched("agreeToTerms", true)
                            }}
                        />
                        <div className="text-xs text-foreground-500">
                            I have read and agree to the{" "}
                            <StarCiLink className="text-xs">
                                Terms of Service
                            </StarCiLink>{" "}
                            and{" "}
                            <StarCiLink className="text-xs">
                                Privacy Policy
                            </StarCiLink>
                        </div>
                    </div>
                    {touched.agreeToTerms && errors.agreeToTerms ? (
                        <p className="pl-6 text-xs text-danger">
                            {errors.agreeToTerms}
                        </p>
                    ) : null}
                </div>
                <Spacer y={3} />
                <StarCiButton
                    type="submit"
                    color="primary"
                    fullWidth
                    isLoading={isSubmitting}
                >
                    Sign Up
                </StarCiButton>
                <Spacer y={3} />
                <div className="flex justify-center items-center gap-1">
                    <div className="text-xs text-foreground-500">
                        Already have an account?
                    </div>
                    <StarCiLink
                        className="text-xs"
                        onPress={() =>
                            dispatch(
                                setAuthenticationModalTab(
                                    AuthenticationModalTab.SignIn
                                )
                            )
                        }
                    >
                        Sign In
                    </StarCiLink>
                </div>
            </form>
        </StarCiModalBody>
    )
}
