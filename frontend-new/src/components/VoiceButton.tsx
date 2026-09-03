import IconButton from "@mui/material/IconButton";
import MicRoundedIcon from "@mui/icons-material/MicRounded";

interface Props {
    onClick?: () => void;
}

export default function VoiceButton({
    onClick,
}: Props) {
    return (
        <IconButton
            onClick={onClick}
            color="default"
        >
            <MicRoundedIcon />
        </IconButton>
    );
}