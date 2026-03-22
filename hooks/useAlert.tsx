import React from "react";
import { toast } from "sonner";
import { Check, X , AlertTriangle} from "lucide-react";

const useAlert = () => {
  const formatDate = () => {
    const date = new Date(); // Get the current date and time
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long", // Sunday
      year: "numeric", // 2023
      month: "long", // December
      day: "2-digit", // 03
      hour: "2-digit", // 9:00
      minute: "2-digit", // 00
      hour12: true, // AM/PM
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const alert = (message: string) => {
    toast(message, {
      description: `${formatDate()}`,
      action: {
        label: "Close",
        onClick: () => console.log("Close"),
      },
      className: "sonner-toast",
    });
  };

  const successAlert = (message: string) => {
    toast(message, {
      description: `${formatDate()}`,
      action: {
        label: "Close",
        onClick: () => console.log("Close"),
      },
      duration: 5000,
      position: "bottom-right",
      icon: <Check style={{ width: "16px" }} />,
      style: { borderColor: "rgba(46, 125, 50,.3)", color: "rgb(46, 125, 50)" },
      className: "sonner-toast sonner-toast-success",
    });
  };

  const errorAlert = (message: string) => {
    toast(message, {
      description: "Something went wrong.",
      action: {
        label: "Close",
        onClick: () => console.log("Retrying"),
      },
      duration: 5000,
      position: "bottom-right",
      icon: <X style={{ width: "16px" }} />,
      style: { borderColor: "rgba(211, 47, 47,.3)", color: "rgb(211, 47, 47)" },
      className: "sonner-toast sonner-toast-error",
    });
  };

  const warningAlert = (message: string) => {
    toast(message, {
      description: "Something went wrong.",
      action: {
        label: "Close",
        onClick: () => console.log("Retrying"),
      },
      duration: 5000,
      position: "bottom-right",
      icon: <AlertTriangle style={{ width: "16px" }} />,
      style: { borderColor: "rgb(237, 108, 2,.3)", color: "rgb(237, 108, 2)" },
      className: "sonner-toast sonner-toast-error",
    });
  };
  return { alert, successAlert, errorAlert, warningAlert };
};

export default useAlert;
