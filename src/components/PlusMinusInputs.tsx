import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Close";
import { useState } from "react";
import type { Hobby } from "../interfaces/Hobby";

type Point = {
    id: number;
    text: string;
};

interface Props {
    plusPoints: Point[];
    minusPoints: Point[];
    pluspointRefs: React.RefObject<(HTMLInputElement | null)[]>;
    minuspointRefs: React.RefObject<(HTMLInputElement | null)[]>;
    onChange: (type: "plus" | "minus", index: number, value: string) => void;
    onAdd: (type: "plus" | "minus") => void;
    onRemove: (type: "plus" | "minus", index: number) => void;
}

export default function PlusMinusInputs({
    plusPoints,
    minusPoints,
    pluspointRefs,
    minuspointRefs,
    onChange,
    onAdd,
    onRemove }: Props) {

    return (
        <Box className="my-4">
            {/* PLUS POINTS */}
            <Typography variant="h6" gutterBottom>
                Plus Points
            </Typography>
            {plusPoints.map((point, idx) => (
                <Box key={point.id} display="flex" alignItems="center" gap={1} mb={1}>
                    <TextField
                        fullWidth
                        value={point.text}
                        className="text-white!"
                        color="primary"
                        inputRef={(el) => (pluspointRefs.current[idx] = el)}
                        variant="standard"
                        sx={{ color: "white" }}
                        onChange={(e) => onChange("plus", idx, e.target.value)}
                        label={`Plus Point ${idx + 1}`}
                    />
                    <IconButton
                        onClick={() => onRemove("plus", idx)}
                        color="error"
                        disabled={plusPoints.length === 1}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ))}
            <Button variant="outlined" onClick={() => onAdd("plus")} sx={{ mt: 1 }}>
                Add Plus Point
            </Button>

            {/* MINUS POINTS */}
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Minus Points
            </Typography>
            {minusPoints.map((point, idx) => (
                <Box key={point.id} display="flex" alignItems="center" gap={1} mb={1}>
                    <TextField
                        className="text-white!"
                        color="primary"
                        inputRef={(el) => (minuspointRefs.current[idx] = el)}
                        fullWidth
                        value={point.text}
                        onChange={(e) => onChange("minus", idx, e.target.value)}
                        variant="standard"
                        sx={{ color: "white" }}
                        label={`Minus Point ${idx + 1}`}
                    />
                    <IconButton
                        onClick={() => onRemove("minus", idx)}
                        color="error"
                        disabled={minusPoints.length === 1}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ))}
            <Button variant="outlined" onClick={() => onAdd("minus")} sx={{ mt: 1 }}>
                Add Minus Point
            </Button>
        </Box>
    );
}
