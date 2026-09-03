import Chip from "@mui/material/Chip";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

interface Props {
    fileName: string;
    onRemove: () => void;
}

export default function FileChip({
    fileName,
    onRemove,
}: Props) {
    return (
        <Chip
            icon={
                <DescriptionRoundedIcon
                    sx={{
                        color: "#60A5FA !important",
                    }}
                />
            }
            label={fileName}
            onDelete={onRemove}
            variant="outlined"
            sx={{
                ml: 3,
                mt: 2,
                mb: 1,

                maxWidth: {
                    xs: "90%",
                    md: 360,
                },

                height: 42,

                borderRadius: "14px",

                backgroundColor: "#0A0A0A",

                border:
                    "1px solid #27272A",

                color: "#F4F4F5",

                fontWeight: 500,

                boxShadow:
                    "0 6px 20px rgba(0,0,0,0.35)",

                "& .MuiChip-label": {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    px: 1,
                },

                "& .MuiChip-deleteIcon": {
                    color: "#71717A",

                    "&:hover": {
                        color: "#EF4444",
                    },
                },

                "&:hover": {
                    backgroundColor: "#111111",
                    borderColor: "#3F3F46",
                },
            }}
        />
    );
}