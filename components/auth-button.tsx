"use client";

import { LogOut } from "lucide-react";
import { useSession, signIn, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export function AuthButton({ label = "Sign in" }: { label?: string }) {
  const { data: session, isPending } = useSession() as { data: any; isPending: boolean };

  if (isPending) return null;

  if (!session) {
    return (
      <Button size="sm" variant="outline" onClick={() => signIn.social({ provider: "google", callbackURL: "/" })}>
        {label}
      </Button>
    );
  }

  const u = session.user;
  const initial = (u.name || u.email || "?").charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-gold/60">
          <Avatar>
            {u.image ? <AvatarImage src={u.image} alt={u.name || ""} /> : null}
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{u.name || u.email}</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
