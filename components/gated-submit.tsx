"use client";

import * as React from "react";
import { useSession, signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const LABELS: Record<string, string> = {
  en: "Sign in with Google to continue",
  si: "ඉදිරියට යාමට Google වෙතින් පිවිසෙන්න",
};

export function GatedSubmit({
  loading,
  disabled,
  lang = "en",
  children,
}: {
  loading?: boolean;
  disabled?: boolean;
  lang?: string;
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();

  if (!isPending && !session) {
    return (
      <Button
        type="button"
        className="w-full"
        onClick={() =>
          signIn.social({
            provider: "google",
            callbackURL: typeof window !== "undefined" ? window.location.pathname : "/",
          })
        }
      >
        {LABELS[lang] || LABELS.en}
      </Button>
    );
  }

  return (
    <Button type="submit" className="w-full" disabled={loading || isPending || disabled}>
      {children}
    </Button>
  );
}
