"use client";

import React, { useEffect, useState } from "react";
import { ButtonDemo, InputDemo, BreadcrumbDemo, DialogDemo, TooltipDemo, CropAvatarDialog } from "@/components/index";
import useJoiValidation from "@/hooks/useJoiValidation";
import { useAuthActions } from "@/modules/auth/hooks/useAuthActions";

// UPDATE EMAIL
type ValidationResult = {
  error?: {
    details: {
      path: string[];
      message: string;
    }[];
  };
};

const UpdateEmailDialog = () => {
  return (
    <DialogDemo contentClassName={`pt-4 pb-6`} trigger={<ButtonDemo text="Update Email" size="xs" variant="ghost" />}>
      {(closeDialog) => <UpdateEmailContent closeDialog={closeDialog} />}
    </DialogDemo>
  );
};

const UpdateEmailContent = ({ closeDialog = () => {} }) => {
  const [state, setState] = useState({ email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const {handleUpdateEmail} = useAuthActions()

  const { validateUpdateEmail } = useJoiValidation();
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [result, setResult] = useState<ValidationResult>({});
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = validateUpdateEmail(state);
    if (!error) {
      handleUpdateEmail({
        email: state.email,
        setIsLoading,
        successCB: () => {
          closeDialog();
        },
      });

      console.log("Submit");
    }
    if (!error) return;
    setWasSubmitted(true);
  };

  useEffect(() => setResult(validateUpdateEmail(state)), [state]);

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
    <form onSubmit={onSubmit} className={`${wasSubmitted ? "was-submitted" : ""} max-w-[360px] mx-auto text-xs`}>
      <h2 className="text-xs font-semibold! mb-5">Update Email</h2>
      <p className=" text-gray-500 mb-6 leading-[1.6]">
        Enter your new email address below. We’ll send a verification link to confirm the change.
      </p>
      <InputDemo
        label={<span className="text-xs font-semibold">Email</span>}
        placeholder="email"
        name="email"
        type="text"
        callback={(e) => onChange(e)}
        className="mb-5"
        value={state.email}
        errorMessage={errorMessages.email}
        inputClassName={`${errorMessages.email ? "is-invalid" : "is-valid"} !text-xs `}
      />

      <div className="button-group flex gap-2 justify-end">
        <ButtonDemo
          size="xs"
          text={`${isLoading ? "Loading..." : "Update Email"}`}
          disabled={isLoading}
        />
      </div>
    </form>
  );
};

export default UpdateEmailDialog;
