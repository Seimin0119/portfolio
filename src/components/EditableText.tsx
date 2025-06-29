// src/components/EditableText.tsx
import React, { useState, useEffect } from "react";
import { TextField, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

interface Props {
  value: string;
  onSave: (newText: string) => void;
}

export const EditableText: React.FC<Props> = ({ value, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);

  // 监听父组件 value 变化，同步更新内部 text
  useEffect(() => {
    setText(value);
  }, [value]);

  const handleSave = () => {
    setEditing(false);
    onSave(text);
  };

  return editing ? (
    <>
      <TextField
        fullWidth
        value={text}
        onChange={(e) => setText(e.target.value)}
        multiline
      />
      <IconButton onClick={handleSave}>
        <SaveIcon />
      </IconButton>
    </>
  ) : (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Typography>{!value ? "暂无简介" : value}</Typography>
      <IconButton onClick={() => setEditing(true)}>
        <EditIcon />
      </IconButton>
    </div>
  );
};
