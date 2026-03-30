"use client";

import React, { useState, useEffect } from "react";
import { useAuthActions } from "@/modules/auth/hooks/useAuthActions";
import { ButtonDemo, InputDemo } from "@/components/index";
import Link from "next/link";

import { validateResetPassword } from '@/modules/auth/validation'
import { ValidationResult } from "joi";
import type { ResetPasswordData } from "@/modules/auth/types";



const Login = () => {
  const { handleResetPassword } = useAuthActions();
  const [state, setState] = useState<ResetPasswordData>({ email: "" });
  const [isLoading, setIsLoading] = useState(false);

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
    const { error } = validateResetPassword(state);
    if (!error) {
      handleResetPassword({ email: state.email, setIsLoading });
      console.log("Submit");
    }
    if (!error) return;
    setWasSubmitted(true);
  };

  useEffect(() => setResult(validateResetPassword(state)), [state]);

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
      <div className="forgot-password-form font-sans bg-white w-full max-w-[384px] mx-auto shadow-sm border p-6 rounded-[15px]">
        <form onSubmit={onSubmit} className={`m-5 max-w-90 mx-auto ${wasSubmitted ? "was-submitted" : ""}`}>
          <h2 className="text-2xl text-center mb-5">Reset Password</h2>
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

          <ButtonDemo
            text={`${isLoading ? "Loading..." : "Reset Password"}`}
            className={`w-full mb-5 text-sm`}
            disabled={isLoading}
          />

          <p className="text-sm text-gray-500 text-center mb-5">
            Back to{" "}
            <Link href="/sign-in" className=" underline hover:text-black">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
