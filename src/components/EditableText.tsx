// src/components/EditableText.tsx
import React from "react";
import { TextField, Typography } from "@mui/material";

interface Props {
  value: string;
  onChange: (newValue: string) => void;
  editing?: boolean;
}

export const EditableText: React.FC<Props> = ({ value, onChange, editing = false }) => {

  return editing ? (
    <TextField
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      multiline
      size="small"
    />
  ) : (
    <Typography sx={{ textAlign: "left" }}>
      {value?.trim() ? value : "暂无简介"}
    </Typography>
  );
};
