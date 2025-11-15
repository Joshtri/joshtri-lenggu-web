"use client";

import { useEffect, useState } from "react";
import { SignUp } from "@clerk/nextjs";

export default function SignUpCatchAll() {
  const [isDark, setIsDark] = useState(()=>{
    if (typeof document !== "undefined"){
      return document.documentElement.classList.contains("dark");
    }    
    return false;
  });

  useEffect(() => {
    // Check if dark mode is enabled
    const htmlElement = document.documentElement;
    // const isDarkMode = htmlElement.classList.contains("dark");
    // setIsDark(isDarkMode);

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const isDarkMode = htmlElement.classList.contains("dark");
      setIsDark(isDarkMode);
    });

    observer.observe(htmlElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark
          ? "bg-linear-to-br from-gray-950 via-gray-900 to-gray-950" : ''
      }`}
    >
      <div className="w-full max-w-md">
        <SignUp
          // appearance={{
          //   elements: {
          //     rootBox: "mx-auto",
          //     card: isDark
          //       ? "shadow-xl border border-gray-700 bg-gray-900"
          //       : "shadow-xl border border-gray-200 bg-white",
          //     headerTitle: isDark ? "text-white" : "text-gray-900",
          //     headerSubtitle: isDark ? "text-gray-400" : "text-gray-600",
          //     formFieldLabel: isDark ? "text-gray-300" : "text-gray-700",
          //     formFieldInput: isDark
          //       ? "bg-gray-800 border-gray-600 text-white"
          //       : "bg-white border-gray-300 text-gray-900",
          //     formFieldInputShowPasswordButton: isDark ? "text-gray-400" : "text-gray-600",
          //     dividerLine: isDark ? "bg-gray-700" : "bg-gray-200",
          //     dividerText: isDark ? "text-gray-400" : "text-gray-600",
          //     footerActionLink: isDark
          //       ? "text-blue-400 hover:text-blue-300"
          //       : "text-blue-600 hover:text-blue-700",
          //     button: isDark
          //       ? "bg-blue-600 hover:bg-blue-700 text-white"
          //       : "bg-blue-600 hover:bg-blue-700 text-white",
          //     identifierMobileicon: isDark ? "text-gray-400" : "text-gray-600",
          //     socialButtonsBlockButton: isDark
          //       ? "border-gray-600 text-gray-300 hover:bg-gray-800"
          //       : "border-gray-300 text-gray-700 hover:bg-gray-50",
          //   },
          // }}
          routing="path"
          path="/auth/signup"
          signInUrl="/auth/login"
          afterSignUpUrl="/dashboard"
        />
      </div>
    </div>
  );
}
