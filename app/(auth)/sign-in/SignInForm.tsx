"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { ButtonDemo, InputDemo } from "@/components/index"
import { LOCAL_DATA } from "@/constants/index"

import { validateSignIn } from "@/modules/auth/validation"
import { ValidationResult } from "joi"
import type { SignInData } from "@/modules/auth/types"

import { useAuthActions } from "@/modules/auth/hooks/useAuthActions"
const { googleLogoIcon } = LOCAL_DATA.images
import { useSignOutAlerts } from "@/hooks/useSignOutAlert"

const SignInForm = () => {
  const [state, setState] = useState<SignInData>({
    email: "",
    password: "",
  })
  const { handleSignIn, handleSignInWithGoogle } = useAuthActions()
  const [isLoading, setIsLoading] = useState(false)
  const [wasSubmitted, setWasSubmitted] = useState(false)
  const [result, setResult] = useState<ValidationResult>()
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({})

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = validateSignIn(state)
    if (!error) {
      handleSignIn({ email: state.email, password: state.password, setIsLoading })
      console.log("Submit")
    }
    if (!error) return
    setWasSubmitted(true)
  }

  useEffect(() => setResult(validateSignIn(state)), [state])

  useEffect(() => {
    if (!wasSubmitted) return
    const errors: Record<string, string> = {}
    result?.error?.details.forEach((item) => {
      const key = String(item.path[0])
      if (errors[key]) return
      errors[key] = item.message
    })
    setErrorMessages(errors)
  }, [result, wasSubmitted])

  useSignOutAlerts()

  return (
    <div>
      <div className="sign-in-form mx-auto w-full max-w-[384px] rounded-[15px] border bg-white p-6 font-sans shadow-sm">
        <form onSubmit={onSubmit} className={`${wasSubmitted ? "was-submitted" : ""}`}>
          <h2 className="mb-5 text-center text-xl font-semibold!">Sign In</h2>
          <InputDemo
            label="Email"
            placeholder="Email"
            name="email"
            type="text"
            callback={(e) => onChange(e)}
            className="mb-5"
            value={state.email}
            errorMessage={errorMessages.email}
            inputClassName={errorMessages.email ? "is-invalid" : "is-valid"}
          />
          <InputDemo
            label="Password"
            placeholder="Password"
            name="password"
            type="text"
            callback={(e) => onChange(e)}
            className="mb-7"
            value={state.password}
            errorMessage={errorMessages.password}
            inputClassName={errorMessages.password ? "is-invalid" : "is-valid"}
          />

          <Link
            href="/forgot-password"
            className="mb-3 inline-block text-xs text-blue-400 hover:underline"
          >
            Forgot Password
          </Link>

          <ButtonDemo
            text={`${isLoading ? "Signing In..." : "Sign In"}`}
            className={`mb-3 w-full text-sm`}
            disabled={isLoading}
          />
          <p className="mb-5 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline hover:text-black">
              Sign Up
            </Link>
          </p>
        </form>
        <div className="mb-5 flex items-center gap-2">
          <div className="w-full border-t border-input"></div>
          <span className="text-xs font-medium text-gray-500">OR</span>
          <div className="w-full border-t border-input"></div>
        </div>
        <ButtonDemo
          startIcon={<img src={googleLogoIcon} className="h-4" />}
          text={`${isLoading ? "Signing In..." : "Continue with Google"} `}
          className={`w-full text-sm text-gray-700`}
          disabled={isLoading}
          variant="outline"
          onClick={handleSignInWithGoogle}
        />
      </div>
    </div>
  )
}

export default SignInForm
