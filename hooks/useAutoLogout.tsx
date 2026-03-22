"use client";

import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config/firebaseClient";
import useAlert from "./useAlert";

const useAutoLogout = (autoLogoutTime = 24 * 7 * 60 * 60 * 1000) => {
  const { successAlert, warningAlert } = useAlert()
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
       successAlert("Your session is expired, please sign in again!");
    } catch (err) {
      console.error("Error auto logout:", err);
    }
  };

  useEffect(() => {
    const checkSession = () => {
      const lastActivity = localStorage.getItem("lastActivity");
      const currentTime = Date.now();

      if (lastActivity && currentTime - Number(lastActivity) > autoLogoutTime) {
        handleSignOut();
        localStorage.removeItem("lastActivity");
      }
    };

    const updateLastActivity = () => {
      localStorage.setItem("lastActivity", Date.now().toString());
    };

    // Check session on page load
    checkSession();

    window.addEventListener("click", updateLastActivity);
    window.addEventListener("keydown", updateLastActivity);

    return () => {
      window.removeEventListener("click", updateLastActivity);
      window.removeEventListener("keydown", updateLastActivity);
    };
  }, [autoLogoutTime]);
};

export default useAutoLogout;
