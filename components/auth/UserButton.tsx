"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ProfileModal } from "./ProfileModal";

export function UserButton() {
  const session = authClient.useSession();
  const [openProfile, setOpenProfile] = useState(false);

  if (!session.data) return null;
  const user = session.data.user;

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-1 rounded-full"
        >
          <Avatar className="w-9 h-9">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-left">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {user.name || "Unknown User"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {user.email || "No email"}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => setOpenProfile(true)}>
          Manage Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>

      <ProfileModal
        open={openProfile}
        onOpenChangeAction={setOpenProfile}
        user={user}
      />
    </DropdownMenu>
  );
}
