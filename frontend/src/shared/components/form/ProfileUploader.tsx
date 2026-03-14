"use client";

import { useRef, useState, ChangeEvent } from "react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { X } from "lucide-react";

interface ProfileUploadProps {
  value?: File | null;
  onChange?: (file: File | null) => void;
  shape?: "circle" | "square";
  fallback?: string;
}

export default function ProfileUploader({
  value,
  onChange,
  shape = "circle",
  fallback = "Upload",
}: ProfileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    onChange?.(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange?.(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const sizeStyle = "w-32 h-32";

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`relative cursor-pointer ${sizeStyle}`}
        onClick={() => fileRef.current?.click()}
      >
        <Avatar
          className={`${sizeStyle} ${
            shape === "square" ? "rounded-lg!" : "rounded-full!"
          }`}
        >
          <AvatarImage
            src={preview || undefined}
            className="object-cover w-full h-full"
          />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>

        {preview && (
          <Button
            size="icon"
            variant="destructive"
            className="absolute -top-2 -right-2 rounded-full w-7 h-7"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
          >
            <X size={14} />
          </Button>
        )}
      </div>

      <input
        type="file"
        ref={fileRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}
