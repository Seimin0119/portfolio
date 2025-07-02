import React, { useState, useEffect } from "react";
import { TextField, Typography } from "@mui/material";

interface Props {
    value: string;
    onChange: (newText: string) => void;
    editing?: boolean;
}

export const EditableUsername: React.FC<Props> = ({ value, onChange, editing = false }) => {
    const [text, setText] = useState(value);

    useEffect(() => {
        setText(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
        onChange(e.target.value); // 输入即保存（交由外部控制何时统一保存）
    };

    return editing ? (
        <TextField
            variant="standard"
            value={text}
            onChange={handleChange}
            fullWidth
            inputProps={{
                style: {
                    fontSize: "1.5rem", // 👈 编辑状态字体加大
                    fontWeight: 600,
                },
            }}
        />
    ) : (
        <Typography
            variant="h5" // 👈 非编辑状态字体大
            sx={{ fontWeight: 600 }}
        >
            {value || "未命名用户"}
        </Typography>
    );
};
