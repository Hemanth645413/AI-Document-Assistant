import { Box, Card, CardActionArea, Typography } from "@mui/material";

const cards = [
  "📄 Summary",
  "📊 Diagram",
  "🌐 Translate",
  "🖼 Image",
  "🎤 Voice",
  "📑 OCR",
];

export default function SuggestionCards() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2,1fr)",
          md: "repeat(3,1fr)",
        },
        gap: 2,
        mb: 4,
      }}
    >
      {cards.map((card) => (
        <Card
          key={card}
          sx={{
            borderRadius: 3,
            transition: ".3s",
            "&:hover": {
              transform: "translateY(-5px)",
            },
          }}
        >
          <CardActionArea sx={{ p: 3 }}>
            <Typography
              align="center"
              fontWeight={700}
            >
              {card}
            </Typography>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}