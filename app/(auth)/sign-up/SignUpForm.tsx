"use client";

import React, { useEffect, useState } from "react";
import { ButtonDemo, InputDemo } from "@/components/index";
import Link from "next/link";
import { LOCAL_DATA } from "@/constants/index";

import { validateSignUp } from "@/modules/auth/validation"
import { ValidationResult } from "joi"
import type { SignUpData } from "@/modules/auth/types"

import { useAuthActions } from "@/modules/auth/hooks/useAuthActions";

const { googleLogoIcon } = LOCAL_DATA.images;

const SignUpForm = () => {
  const [state, setState] = useState<SignUpData>({ name: "", email: "", password: "", repeatPassword: "" });
  const [isLoading, setIsLoading] = useState(false);
  const {handleSignInWithGoogle, handleSignUp} = useAuthActions()

  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [result, setResult] = useState<ValidationResult>();
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = validateSignUp(state);
    if (!error) {
      handleSignUp({ name: state.name, email: state.email, password: state.password, setIsLoading });
      console.log("Submit");
    }
    if (!error) return;
    setWasSubmitted(true);
  };

  useEffect(() => setResult(validateSignUp(state)), [state]);

  useEffect(() => {
    if (!wasSubmitted) return;
    const errors: Record<string, string> = {};
    result?.error?.details.forEach((item) => {
      if (errors[item.path[0]]) return;
      errors[item.path[0]] = item.message;
    });
    setErrorMessages(errors);
  }, [result, wasSubmitted]);

  return (
    <div>
      <div className="sign-up-form font-sans bg-white w-full max-w-[384px] mx-auto shadow-sm border p-6 rounded-[15px]">
        <form onSubmit={onSubmit} className={`${wasSubmitted ? "was-submitted" : ""}`}>
          <h2 className="text-xl font-semibold! text-center mb-5">Sign Up</h2>

          <InputDemo
            label="Name"
            placeholder="Name"
            name="name"
            type="text"
            callback={(e) => onChange(e)}
            className="mb-5"
            value={state.name}
            errorMessage={errorMessages.name}
            inputClassName={errorMessages.name ? "is-invalid" : "is-valid"}
          />
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
            className="mb-5"
            value={state.password}
            errorMessage={errorMessages.password}
            inputClassName={errorMessages.password ? "is-invalid" : "is-valid"}
          />
          <InputDemo
            label="Repeat Password"
            placeholder="Repeat Password"
            name="repeatPassword"
            type="text"
            callback={(e) => onChange(e)}
            className="mb-7"
            value={state.repeatPassword}
            errorMessage={errorMessages.repeatPassword}
            inputClassName={errorMessages.repeatPassword ? "is-invalid" : "is-valid"}
          />

          <ButtonDemo
            text={`${isLoading ? "Signing Up..." : "Sign Up"}`}
            className={`w-full mb-3 text-sm`}
            // disabled={isLoading || error}
          />
          <p className="text-sm text-gray-500 text-center mb-5">
            Already have an account?{" "}
            <Link href="/sign-in" className="underline hover:text-black">
              Sign In
            </Link>
          </p>
        </form>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-full border-t border-input"></div>
          <span className="text-gray-500 text-xs font-medium">OR</span>
          <div className="w-full border-t border-input"></div>
        </div>
        <ButtonDemo
          startIcon={<img src={googleLogoIcon} className="h-4" />}
          text={`${isLoading ? "Signing In..." : "Continue with Google"} `}
          className={`w-full text-sm text-gray-700 `}
          disabled={isLoading}
          variant="outline"
          onClick={() => handleSignInWithGoogle()}
        />
      </div>
      <p className="text-sm text-gray-500 font-sans text-center mt-5 px-6">
        By clicking continue, you agree to our{" "}
        <Link href="/terms-of-service" className=" underline hover:text-black">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy-policy" className=" underline hover:text-black">
          Privacy Policy.
        </Link>
      </p>
    </div>
  );
};

export default SignUpForm;
