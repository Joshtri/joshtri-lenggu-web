"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInCatchAll() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl border border-gray-200",
            },
          }}
          routing="path"
          path="/auth/login"
          signUpUrl="/auth/signup"
          afterSignInUrl="/dashboard"
        />
      </div>
    </div>
  );
}
