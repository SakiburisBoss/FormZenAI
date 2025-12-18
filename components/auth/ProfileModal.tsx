"use client";

import { updateProfileAction } from "@/actions/update-profile";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

type ProfileModalProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  user?: User;
};
export function ProfileModal({
  open,
  onOpenChangeAction,
  user,
}: ProfileModalProps) {
  const [avatar, setAvatar] = useState(user?.image);
  const [uploading, setUploading] = useState(false);

  const [profileState, updateAction, isPending] = useActionState(
    updateProfileAction,
    null,
  );

  useEffect(() => {
    if (profileState?.success) {
      toast.success(profileState.message);
      onOpenChangeAction(false);
    }
    if (profileState?.error) {
      toast.error(profileState.error);
    }
  }, [profileState]);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const upload = await uploadToCloudinary(file);
      setAvatar(upload.secure_url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form action={updateAction} className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="w-20 h-20">
              <AvatarImage src={avatar || ""} />
            </Avatar>

            <Input type="file" accept="image/*" onChange={handleAvatarChange} />
            {uploading && (
              <p className="text-sm text-muted-foreground">Uploading…</p>
            )}
          </div>

          <input type="hidden" name="image" value={avatar || ""} />

          <div className="flex flex-col gap-1">
            <Label>Name</Label>
            <Input name="name" defaultValue={user?.name ?? ""} required />
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
