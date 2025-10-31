"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpCatchAll() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="w-full max-w-md">
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl border border-gray-200",
            },
          }}
          routing="path"
          path="/auth/signup"
          signInUrl="/auth/login"
          afterSignUpUrl="/dashboard"
        />
      </div>
    </div>
  );
}
