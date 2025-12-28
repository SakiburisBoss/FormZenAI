"use client";

import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { signOut } from "@/actions/auth-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/auth";
import { LogOut, Settings } from "lucide-react";
import { ProfileModal } from "./ProfileModal";

export function UserButton({
  callbackURL,
  user,
}: {
  callbackURL?: string;
  user?: User;
}) {
  const [openProfile, setOpenProfile] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackURL: callbackURL ?? "/" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-1 rounded-full"
        >
          <Avatar className="w-9 h-9">
            <AvatarImage src={user?.image ?? ""} />
            <AvatarFallback>{user?.name?.charAt(0) ?? "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-left">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {user?.name ?? "Unknown User"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {user?.email ?? "No email"}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => setOpenProfile(true)}>
          <Settings className="w-4 h-4 mr-4" />
          Manage Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
          <LogOut className="w-4 h-4 mr-4" />
          Sign Out
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
