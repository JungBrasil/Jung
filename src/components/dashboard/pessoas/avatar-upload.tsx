"use client";

import { useState, useTransition } from "react";
import { createSupabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload } from "lucide-react";
import { updateAvatarUrl } from "@/app/dashboard/pessoas/[id]/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AvatarUploadProps {
  personId: string;
  currentAvatarUrl: string | null;
  personName: string;
}

export function AvatarUpload({ personId, currentAvatarUrl, personName }: AvatarUploadProps) {
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Por favor, selecione um arquivo primeiro.");
      return;
    }

    startTransition(async () => {
      const supabase = createSupabaseClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `${personId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        toast.error("Falha no upload da imagem. Verifique o console.");
        console.error(uploadError);
        return;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      const result = await updateAvatarUrl(personId, publicUrl);

      if (result.success) {
        toast.success("Foto de perfil atualizada com sucesso!");
        setFile(null);
      } else {
        toast.error(result.error);
      }
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-32 w-32 border-2 border-primary/20">
        <AvatarImage src={preview || undefined} alt={personName} />
        <AvatarFallback className="text-4xl">
          {getInitials(personName)}
        </AvatarFallback>
      </Avatar>
      <div className="flex w-full max-w-xs items-center space-x-2">
        <Input id="picture" type="file" onChange={handleFileChange} accept="image/*" className="flex-1" />
        <Button onClick={handleUpload} disabled={isPending || !file} size="icon">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}