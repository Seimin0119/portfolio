// src/components/EditableAvatar.tsx
import React, { useRef } from "react";
import { Avatar, IconButton } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

interface Props {
  src: string;
  onChange: (file: File) => void;
  disabled?: boolean; // ✅ 添加 disabled 属性
}

export const EditableAvatar: React.FC<Props> = ({ src, onChange, disabled = false }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{ position: "relative", cursor: disabled ? "default" : "pointer" }}
        disabled={disabled}
      >
        <Avatar
          src={src}
          sx={{ width: 120, height: 120, border: "2px solid #ccc" }}
        />
        {!disabled && (
          <PhotoCameraIcon
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              background: "#fff",
              borderRadius: "50%",
              padding: "3px",
              fontSize: 20,
            }}
          />
        )}
      </IconButton>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        hidden
      />
    </>
  );
};
