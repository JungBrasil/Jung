"use client";

import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";

interface AvatarUploadProps {
  personId: string;
  currentAvatarUrl: string | null;
  personName: string;
}

export function AvatarUpload({ personId, currentAvatarUrl, personName }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const supabase = createSupabaseClient();

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  };

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${personId}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from("pessoas")
        .update({ avatar_url: filePath })
        .eq("id", personId);
      
      if (updateError) throw updateError;

      toast.success("Avatar atualizado! A página será recarregada.");
      // Forcing a reload to get the new public URL from storage
      window.location.reload();

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-32 w-32">
        <AvatarImage src={currentAvatarUrl || undefined} alt={personName} />
        <AvatarFallback className="text-4xl">
          {currentAvatarUrl ? <User /> : getInitials(personName)}
        </AvatarFallback>
      </Avatar>
      <div>
        <Button asChild variant="outline">
          <label htmlFor="single">
            {uploading ? "Enviando..." : "Trocar Foto"}
          </label>
        </Button>
        <Input
          style={{ visibility: "hidden", position: "absolute" }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}